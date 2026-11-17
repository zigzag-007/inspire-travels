const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const offlineScript = fs.readFileSync(path.join(root, 'assets/js/shared/offline.js'), 'utf8');

// Wait until the first install claims the page.
async function waitForController(page) {
    await page.waitForFunction(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller));
}

// Confirm the route and every requested same-origin stylesheet and script are cached.
async function waitForPageAndEssentials(page) {
    await expect.poll(() => page.evaluate(async () => {
        const names = await caches.keys();
        const pagesName = names.find(name => name.startsWith('inspire-offline-') && name.endsWith('-pages'));
        const assetsName = names.find(name => name.startsWith('inspire-offline-') && name.endsWith('-assets'));
        if (!pagesName || !assetsName) return false;

        const pageCache = await caches.open(pagesName);
        const assetCache = await caches.open(assetsName);
        const pageSaved = await pageCache.match(location.href);
        const essentials = performance.getEntriesByType('resource')
            .map(entry => new URL(entry.name, location.href))
            .filter(url => url.origin === location.origin && /\.(?:css|js|mjs)$/i.test(url.pathname));
        if (!pageSaved || !essentials.some(url => url.pathname === '/assets/js/shared/offline.js')) return false;
        for (const url of essentials) {
            if (!await assetCache.match(url.href)) return false;
        }
        return true;
    })).toBe(true);

    return page.evaluate(() => performance.getEntriesByType('resource')
        .map(entry => new URL(entry.name, location.href))
        .filter(url => url.origin === location.origin && /\.(?:css|js|mjs)$/i.test(url.pathname))
        .map(url => url.href));
}

// Serve a tiny site whose worker response can change from one version to another.
async function startVersionServer() {
    const state = { version: 'v1', activeVersion: null };
    const server = http.createServer((request, response) => {
        const url = new URL(request.url, 'http://127.0.0.1');
        if (url.pathname === '/') {
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end('<!doctype html><html><head><title>Update test</title><script defer src="/assets/js/shared/offline.js"></script></head><body><h1>Update test</h1></body></html>');
            return;
        }

        if (url.pathname === '/assets/js/shared/offline.js') {
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            response.end(offlineScript);
            return;
        }

        if (url.pathname === '/sw.js') {
            response.setHeader('Cache-Control', 'no-store');
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            response.end([
                'var VERSION = ' + JSON.stringify(state.version) + ';',
                'self.addEventListener("activate", function (event) {',
                '  event.waitUntil(Promise.all([self.clients.claim(), fetch(new URL("/__activated?v=" + VERSION, self.location.origin))]));',
                '});',
                'self.addEventListener("fetch", function (event) {',
                '  if (new URL(event.request.url).pathname === "/__worker-version") {',
                '    event.respondWith(new Response(VERSION, { headers: { "Content-Type": "text/plain" } }));',
                '  }',
                '});'
            ].join('\n'));
            return;
        }

        if (url.pathname === '/__activated') {
            state.activeVersion = url.searchParams.get('v');
            response.statusCode = 204;
            response.end();
            return;
        }

        if (url.pathname === '/__worker-version') {
            response.statusCode = 500;
            response.end('The active service worker should answer this request.');
            return;
        }

        response.statusCode = 404;
        response.end('Not found');
    });

    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    return { server, state, baseURL: 'http://127.0.0.1:' + server.address().port };
}

test('first visits warm their route and requested assets for offline reloads', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    const pages = [];

    try {
        for (const route of ['/', '/gallery.html', '/tours/collection-family.html', '/tours/highlights-escape.html', '/destinations/ella.html']) {
            const page = await context.newPage();
            const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'load' });
            expect(response.status(), route).toBe(200);
            await expect(page.locator('h1').first()).toBeVisible();
            await waitForController(page);
            const essentials = await waitForPageAndEssentials(page);
            pages.push({ page, route, heading: await page.locator('h1').first().innerText(), essentials });
        }

        await context.setOffline(true);
        for (const { page, route, heading, essentials } of pages) {
            const savedRoutes = await page.evaluate(async () => {
                const name = (await caches.keys()).find(name => name.endsWith('-pages'));
                return (await (await caches.open(name)).keys()).map(request => request.url);
            });
            const response = await page.reload({ waitUntil: 'domcontentloaded' });
            expect(response.status(), route).toBe(200);
            await expect(page.locator('h1').first(), route + ': saved ' + savedRoutes.join(', ')).toHaveText(heading);
            const cachedEssentials = await page.evaluate(async urls => {
                const names = await caches.keys();
                const assetsName = names.find(name => name.startsWith('inspire-offline-') && name.endsWith('-assets'));
                if (!assetsName) return [];
                const cache = await caches.open(assetsName);
                const saved = await Promise.all(urls.map(async url => ({ url, saved: Boolean(await cache.match(url)) })));
                return saved.filter(entry => !entry.saved).map(entry => entry.url);
            }, essentials);
            expect(cachedEssentials, route).toEqual([]);
            expect(await page.evaluate(() => document.styleSheets.length), route).toBeGreaterThan(0);
        }
    } finally {
        await context.close();
    }
});

test('an uncached route shows the offline page and online routes recover', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    const page = await context.newPage();

    try {
        await page.goto(new URL('/', baseURL).href, { waitUntil: 'load' });
        await waitForController(page);
        await waitForPageAndEssentials(page);
        await context.setOffline(true);

        const fallback = await page.goto(new URL('/not-saved-offline-check/', baseURL).href, { waitUntil: 'domcontentloaded' });
        expect(fallback.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'This page is not saved yet.' })).toBeVisible();
        await page.setViewportSize({ width: 390, height: 844 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

        await context.setOffline(false);
        const online = await page.goto(new URL('/gallery.html', baseURL).href, { waitUntil: 'load' });
        expect(online.status()).toBe(200);
        await expect(page.locator('h1').first()).toBeVisible();
    } finally {
        await context.close();
    }
});

test('external links and WhatsApp controls explain why they cannot open offline', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    const page = await context.newPage();

    try {
        await page.goto(new URL('/', baseURL).href, { waitUntil: 'load' });
        await waitForController(page);
        await page.evaluate(() => {
            const link = document.createElement('a');
            link.id = 'offline-external-action';
            link.href = 'https://maps.example.test/route';
            link.textContent = 'Open external map';
            document.body.appendChild(link);
        });
        await page.waitForFunction(() => document.querySelector('[data-whatsapp-message]')?.dataset.whatsappBound === 'true');
        await page.evaluate(() => {
            window.__whatsappOpened = false;
            window.open = () => { window.__whatsappOpened = true; };
        });
        await context.setOffline(true);
        await page.locator('#offline-external-action').click();
        await expect(page.getByRole('status')).toContainText('This action needs an internet connection.');
        await expect(page).toHaveURL(new URL('/', baseURL).href);
        const whatsappAction = page.locator('.offers-swiper .swiper-slide-active [data-whatsapp-message]');
        await whatsappAction.scrollIntoViewIfNeeded();
        await whatsappAction.click();
        await expect(page.getByRole('status')).toContainText('This action needs an internet connection.');
        expect(await page.evaluate(() => Boolean(window.__whatsappOpened))).toBe(false);
    } finally {
        await context.close();
    }
});

test('a waiting worker stays safe until every old site tab closes', async ({ browser }) => {
    const testServer = await startVersionServer();
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    const page = await context.newPage();

    try {
        await page.goto(testServer.baseURL, { waitUntil: 'load' });
        await waitForController(page);
        expect(await page.evaluate(() => fetch('/__worker-version').then(response => response.text()))).toBe('v1');

        testServer.state.version = 'v2';
        await page.evaluate(async () => {
            const registration = await navigator.serviceWorker.ready;
            await registration.update();
        });
        await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true);
        await expect(page.getByRole('status')).toContainText('Close all Inspire Travels tabs');
        expect(await page.evaluate(() => fetch('/__worker-version').then(response => response.text()))).toBe('v1');
        expect(testServer.state.activeVersion).toBe('v1');

        await page.close();
        await expect.poll(() => testServer.state.activeVersion, { timeout: 15000 }).toBe('v2');

        const reopened = await context.newPage();
        await reopened.goto(testServer.baseURL, { waitUntil: 'load' });
        await waitForController(reopened);
        expect(await reopened.evaluate(() => fetch('/__worker-version').then(response => response.text()))).toBe('v2');
    } finally {
        await context.close();
        await new Promise(resolve => testServer.server.close(resolve));
    }
});
