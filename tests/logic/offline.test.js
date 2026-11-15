const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'scripts/service-worker-template.js'), 'utf8')
    .replace('__BUILD_VERSION__', 'test-build');

test('scripted WhatsApp inquiries require a connection before opening a tab', () => {
    let opened = 0;
    const context = { window: { OfflineModule: { requireConnection: () => false }, open: () => { opened += 1; } } };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/shared/whatsapp.js'), 'utf8'), context);
    context.window.WhatsAppModule.open('A saved tour inquiry');
    assert.equal(opened, 0);
});

// Use request-shaped objects so tests do not depend on browser Request modes.
function makeRequest(url, mode = 'cors') {
    return { url, method: 'GET', mode };
}

// Provide the Request fields used by worker messages in the VM.
class MockRequest {
    constructor(url, options = {}) {
        this.url = String(url);
        this.method = options.method || 'GET';
        this.mode = options.mode || 'cors';
        this.credentials = options.credentials || 'same-origin';
    }
}

// Let the worker add size metadata just as the Cache API does in a browser.
class MockHeaders {
    constructor(source = {}) {
        this.values = new Map();
        if (source instanceof MockHeaders) {
            source.values.forEach((value, key) => this.values.set(key, value));
        } else {
            Object.entries(source).forEach(([key, value]) => this.values.set(key.toLowerCase(), String(value)));
        }
    }

    get(name) { return this.values.get(name.toLowerCase()) || null; }
    set(name, value) { this.values.set(name.toLowerCase(), String(value)); }
}

// Make small Response-shaped objects without relying on browser globals.
class MockResponse {
    constructor(body, options = {}) {
        this.body = body;
        this.status = options.status || 200;
        this.statusText = options.statusText || 'OK';
        this.type = options.type || 'basic';
        this.headers = new MockHeaders(options.headers);
    }

    clone() { return new MockResponse(this.body, this); }
    text() { return Promise.resolve(this.body); }
    arrayBuffer() {
        const bytes = Buffer.from(this.body);
        return Promise.resolve(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    }
}

MockResponse.error = () => new MockResponse('', { status: 0, type: 'error' });

// Make small responses and count body reads to verify metadata-based pruning.
function createResponse(body, options = {}, metrics = { bodyReads: 0 }) {
    const bytes = Buffer.from(body);
    options.headers = Object.assign({ 'content-length': bytes.length }, options.headers);
    const response = new MockResponse(body, options);
    const arrayBuffer = response.arrayBuffer.bind(response);
    response.arrayBuffer = () => {
        metrics.bodyReads += 1;
        return arrayBuffer();
    };
    response.clone = () => createResponse(body, options, metrics);
    return response;
}

// Run the worker with an in-memory Cache API and a replaceable network function.
function createWorker(fetchImpl) {
    const listeners = {};
    const stores = new Map();
    const cacheKey = request => new URL(typeof request === 'string' ? request : request.url, 'https://site.test').href;
    const workerFetch = input => fetchImpl(typeof input === 'string'
        ? makeRequest(new URL(input, 'https://site.test').href)
        : input);
    const cacheApi = {
        open(name) {
            if (!stores.has(name)) stores.set(name, new Map());
            const entries = stores.get(name);
            return Promise.resolve({
                add: url => Promise.resolve(workerFetch(url)).then(response => entries.set(cacheKey(url), response)),
                put: (request, response) => Promise.resolve(entries.set(cacheKey(request), response)),
                match: request => Promise.resolve(entries.get(cacheKey(request))),
                keys: () => Promise.resolve([...entries.keys()].map(url => makeRequest(url))),
                delete: request => Promise.resolve(entries.delete(cacheKey(request)))
            });
        },
        keys: () => Promise.resolve([...stores.keys()]),
        delete: name => Promise.resolve(stores.delete(name))
    };
    const self = {
        location: { origin: 'https://site.test' },
        clients: { claim: () => Promise.resolve() },
        skipWaiting: () => Promise.resolve(),
        addEventListener(name, listener) { listeners[name] = listener; }
    };
    const context = vm.createContext({
        self,
        caches: cacheApi,
        fetch: workerFetch,
        URL,
        Request: MockRequest,
        Headers: MockHeaders,
        Response: MockResponse,
        Promise,
        Number,
        Math,
        RegExp
    });
    vm.runInContext(source, context);
    return { listeners, stores, cacheApi };
}

// Dispatch one fetch event and expose its response and lifetime promises.
function dispatch(worker, request) {
    let responsePromise;
    let waitPromise = Promise.resolve();
    worker.listeners.fetch({
        request,
        respondWith(promise) { responsePromise = promise; },
        waitUntil(promise) { waitPromise = Promise.resolve(promise); }
    });
    return { response: responsePromise, wait: waitPromise };
}

// Dispatch the bounded warm message and wait for all requested cache writes.
function dispatchMessage(worker, data) {
    let waitPromise = Promise.resolve();
    worker.listeners.message({ data, waitUntil(promise) { waitPromise = Promise.resolve(promise); } });
    return waitPromise;
}

test('cache writes own a response before the browser locks its network body', async () => {
    let locked = false;
    const response = createResponse('Saved independently');
    const clone = response.clone;
    response.clone = () => {
        if (locked) throw new TypeError('Response body is locked');
        return clone();
    };
    const worker = createWorker(() => Promise.resolve(response));
    const url = 'https://site.test/gallery.html';
    const result = dispatch(worker, makeRequest(url, 'navigate'));
    await result.response;
    locked = true;
    await result.wait;
    assert.ok(worker.stores.get('inspire-offline-test-build-pages')?.has(url));
});

test('install caches only the offline fallback and activation removes older owned caches', async () => {
    const worker = createWorker(() => Promise.resolve(createResponse('fallback')));
    worker.stores.set('inspire-offline-old-pages', new Map());
    worker.stores.set('unrelated-cache', new Map());
    let installWait;
    worker.listeners.install({ waitUntil(promise) { installWait = promise; } });
    await installWait;
    assert.ok(worker.stores.get('inspire-offline-test-build-pages').has('https://site.test/offline.html'));

    let activateWait;
    worker.listeners.activate({ waitUntil(promise) { activateWait = promise; } });
    await activateWait;
    assert.equal(worker.stores.has('inspire-offline-old-pages'), false);
    assert.equal(worker.stores.has('unrelated-cache'), true);
});

test('a visited route is saved and served when the network later fails', async () => {
    let online = true;
    const worker = createWorker(() => online
        ? Promise.resolve(createResponse('route body'))
        : Promise.reject(new Error('offline')));
    const request = makeRequest('https://site.test/tours/example/', 'navigate');
    const first = dispatch(worker, request);
    assert.equal(await (await first.response).text(), 'route body');
    await first.wait;

    online = false;
    const second = dispatch(worker, request);
    assert.equal(await (await second.response).text(), 'route body');
});

test('warm message saves the current page and only requested same-origin assets', async () => {
    const seen = [];
    const worker = createWorker(request => {
        seen.push(request.url);
        return Promise.resolve(createResponse(request.url));
    });

    await dispatchMessage(worker, {
        type: 'warm-current-page',
        pageUrl: 'https://site.test/tours/visited',
        assetUrls: [
            'https://site.test/assets/css/site.css',
            'https://site.test/assets/img/hero.webp',
            'https://cdn.example/library.js',
            'https://site.test/api/book',
            'https://site.test/file.zip'
        ]
    });

    assert.deepEqual(seen, [
        'https://site.test/tours/visited',
        'https://site.test/assets/css/site.css',
        'https://site.test/assets/img/hero.webp'
    ]);
    assert.equal(worker.stores.get('inspire-offline-test-build-pages').has('https://site.test/tours/visited'), true);
    assert.equal(worker.stores.get('inspire-offline-test-build-assets').has('https://site.test/assets/css/site.css'), true);
    assert.equal(worker.stores.get('inspire-offline-test-build-media').has('https://site.test/assets/img/hero.webp'), true);
});

test('uncached routes use the useful offline fallback', async () => {
    const worker = createWorker(request => request.url.endsWith('/offline.html')
        ? Promise.resolve(createResponse('uncached route help'))
        : Promise.reject(new Error('offline')));
    const install = {};
    worker.listeners.install({ waitUntil(promise) { install.promise = promise; } });
    await install.promise;

    const result = dispatch(worker, makeRequest('https://site.test/not-saved/', 'navigate'));
    assert.equal(await (await result.response).text(), 'uncached route help');
});

test('page pruning always preserves the install-time offline fallback', async () => {
    let online = true;
    const worker = createWorker(request => request.url.endsWith('/offline.html') || online
        ? Promise.resolve(createResponse(request.url.endsWith('/offline.html') ? 'fallback body' : request.url))
        : Promise.reject(new Error('offline')));
    let installWait;
    worker.listeners.install({ waitUntil(promise) { installWait = promise; } });
    await installWait;

    for (let index = 0; index < 35; index += 1) {
        const request = makeRequest('https://site.test/visited-' + index + '/', 'navigate');
        const result = dispatch(worker, request);
        await result.response;
        await result.wait;
    }

    const pages = worker.stores.get('inspire-offline-test-build-pages');
    assert.equal(pages.size, 31);
    assert.equal(pages.has('https://site.test/offline.html'), true);
    assert.equal(pages.has('https://site.test/visited-0/'), false);
    assert.equal(pages.has('https://site.test/visited-34/'), true);

    online = false;
    const uncached = dispatch(worker, makeRequest('https://site.test/not-visited/', 'navigate'));
    assert.equal(await (await uncached.response).text(), 'fallback body');
});

test('external requests and unsupported same-origin files are not intercepted', () => {
    const worker = createWorker(() => Promise.reject(new Error('offline')));
    for (const url of ['https://maps.example/route', 'https://site.test/api/book', 'https://site.test/download.zip']) {
        let intercepted = false;
        worker.listeners.fetch({ request: makeRequest(url), respondWith() { intercepted = true; } });
        assert.equal(intercepted, false, url);
    }
});

test('media eviction leaves saved pages and essential static assets intact', async () => {
    const worker = createWorker(() => Promise.resolve(createResponse('small')));
    const pageRequest = makeRequest('https://site.test/visited/', 'navigate');
    const page = dispatch(worker, pageRequest);
    await page.response;
    await page.wait;

    const assetRequest = makeRequest('https://site.test/assets/js/site.js');
    const asset = dispatch(worker, assetRequest);
    await asset.response;
    await asset.wait;

    for (let index = 0; index < 25; index += 1) {
        const mediaRequest = makeRequest('https://site.test/assets/img/trip-' + index + '.jpg');
        const media = dispatch(worker, mediaRequest);
        await media.response;
        await media.wait;
    }

    assert.equal(worker.stores.get('inspire-offline-test-build-pages').has(pageRequest.url), true);
    assert.equal(worker.stores.get('inspire-offline-test-build-assets').has(assetRequest.url), true);
    assert.equal(worker.stores.get('inspire-offline-test-build-media').size, 24);
});

test('oversized per-entry responses are not saved', async () => {
    const worker = createWorker(() => Promise.resolve(createResponse('x'.repeat(1024 * 1024 + 1))));
    const request = makeRequest('https://site.test/assets/js/large.js');
    const result = dispatch(worker, request);
    await result.response;
    await result.wait;
    assert.equal(worker.stores.get('inspire-offline-test-build-assets'), undefined);
});

test('asset total byte limit evicts the oldest entry', async () => {
    const worker = createWorker(request => Promise.resolve(createResponse('x'.repeat(1024 * 1024))));
    const base = 'https://site.test/assets/js/file-';

    for (let index = 0; index < 26; index += 1) {
        const request = makeRequest(base + index + '.js');
        const result = dispatch(worker, request);
        await result.response;
        await result.wait;
    }

    const assets = worker.stores.get('inspire-offline-test-build-assets');
    assert.equal(assets.size, 25);
    assert.equal(assets.has(base + '0.js'), false);
    assert.equal(assets.has(base + '25.js'), true);
});

test('asset count limit evicts oldest entries without rereading cached bodies', async () => {
    const metrics = { bodyReads: 0 };
    const worker = createWorker(() => Promise.resolve(createResponse('small', {}, metrics)));
    const base = 'https://site.test/assets/js/file-';

    for (let index = 0; index < 257; index += 1) {
        const request = makeRequest(base + index + '.js');
        const result = dispatch(worker, request);
        await result.response;
        await result.wait;
    }

    const assets = worker.stores.get('inspire-offline-test-build-assets');
    assert.equal(assets.size, 256);
    assert.equal(assets.has(base + '0.js'), false);
    assert.equal(assets.has(base + '256.js'), true);
    assert.equal(metrics.bodyReads, 257);
});
