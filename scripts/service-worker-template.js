/* global self, caches, fetch, URL */
'use strict';

// The build replaces this token on every deploy, so old caches can be retired.
var BUILD_VERSION = '__BUILD_VERSION__';
var CACHE_PREFIX = 'inspire-offline-';
var PAGE_CACHE = CACHE_PREFIX + BUILD_VERSION + '-pages';
var ASSET_CACHE = CACHE_PREFIX + BUILD_VERSION + '-assets';
var MEDIA_CACHE = CACHE_PREFIX + BUILD_VERSION + '-media';
var OFFLINE_PAGE = '/offline.html';
var SIZE_HEADER = 'x-inspire-offline-bytes';
var SAVED_AT_HEADER = 'x-inspire-offline-saved-at';
var MAX_WARM_URLS = 96;

// Limits bound storage per category and prevent a single large response taking over.
var LIMITS = {
    pages: { cache: PAGE_CACHE, count: 30, bytes: 20 * 1024 * 1024, entry: 1536 * 1024 },
    assets: { cache: ASSET_CACHE, count: 256, bytes: 25 * 1024 * 1024, entry: 1024 * 1024 },
    media: { cache: MEDIA_CACHE, count: 24, bytes: 18 * 1024 * 1024, entry: 1536 * 1024 }
};

var pruneQueue = Promise.resolve();

// Accept only same-origin static documents and assets that the page requested.
function categoryFor(request, url) {
    if (request.method !== 'GET' || url.origin !== self.location.origin) return null;
    if (url.pathname === OFFLINE_PAGE || /\/(?:api|analytics|track)(?:\/|$)/i.test(url.pathname)) return null;

    if (request.mode === 'navigate' || /\.html?$/i.test(url.pathname) || url.pathname.endsWith('/')) return 'pages';
    if (/\.(?:css|js|mjs|json|svg|woff2?|ttf|ico|webmanifest)$/i.test(url.pathname)) return 'assets';
    if (/\.(?:avif|gif|jpe?g|png|webp|mp4|webm|ogg|mp3|wav)$/i.test(url.pathname)) return 'media';
    return null;
}

// Read a cached body only when its measured size metadata is missing.
function responseSize(response) {
    if (!response) return Promise.resolve(0);
    var savedHeader = response.headers && response.headers.get(SIZE_HEADER);
    var savedSize = savedHeader === null || savedHeader === '' ? NaN : Number(savedHeader);
    if (Number.isFinite(savedSize) && savedSize >= 0) return Promise.resolve(savedSize);
    return response.clone().arrayBuffer().then(function (body) { return body.byteLength; });
}

// Measure fresh network bodies even if a server sends our private header name.
function measureResponse(response) {
    return response.clone().arrayBuffer().then(function (body) { return body.byteLength; });
}

// Add the measured size once so later pruning does not reread every cached body.
function responseWithMetadata(response, bytes) {
    var copy = response.clone();
    var headers = new Headers(copy.headers);
    headers.set(SIZE_HEADER, String(bytes));
    headers.set(SAVED_AT_HEADER, String(Date.now()));
    return new Response(copy.body, {
        status: copy.status,
        statusText: copy.statusText,
        headers: headers
    });
}

// Remove the oldest entries until the selected category meets both limits.
function prune(name) {
    var rule = LIMITS[name];
    return caches.open(rule.cache).then(function (cache) {
        return cache.keys().then(function (keys) {
            return Promise.all(keys.map(function (request) {
                return cache.match(request).then(function (response) {
                    return responseSize(response).then(function (bytes) {
                        var savedAt = Number(response.headers && response.headers.get(SAVED_AT_HEADER)) || 0;
                        var isFallback = new URL(request.url).pathname === OFFLINE_PAGE;
                        return { request: request, bytes: bytes, savedAt: savedAt, isFallback: isFallback };
                    });
                });
            })).then(function (entries) {
                entries.sort(function (left, right) {
                    if (left.isFallback !== right.isFallback) return left.isFallback ? 1 : -1;
                    return left.savedAt - right.savedAt;
                });
                var total = entries.reduce(function (sum, entry) { return sum + entry.bytes; }, 0);
                var routeCount = entries.filter(function (entry) { return !entry.isFallback; }).length;
                var countToCheck = name === 'pages' ? routeCount : entries.length;
                var removeCount = Math.max(0, countToCheck - rule.count);
                var removals = [];

                // Keep the fallback and recently refreshed page assets available.
                for (var i = 0; i < entries.length && (removeCount > 0 || total > rule.bytes); i += 1) {
                    var entry = entries[i];
                    if (entry.isFallback) continue;
                    removals.push(cache.delete(entry.request));
                    total -= entry.bytes;
                    removeCount -= 1;
                }
                return Promise.all(removals);
            });
        });
    });
}

// Serialize pruning so concurrent fetches cannot leave over-limit caches behind.
function schedulePrune(name) {
    pruneQueue = pruneQueue.catch(function () {}).then(function () { return prune(name); });
    return pruneQueue;
}

// Store only successful basic responses that fit their explicit per-entry cap.
function save(request, response, name) {
    var rule = LIMITS[name];
    if (!response || response.status !== 200 || response.type !== 'basic') return Promise.resolve();
    var cacheControl = response.headers && response.headers.get('cache-control') || '';
    var vary = response.headers && response.headers.get('vary') || '';
    if (/\b(?:private|no-store)\b/i.test(cacheControl) || vary.trim() === '*') return Promise.resolve();

    // Own the body before respondWith lets the browser consume the network copy.
    response = response.clone();
    return measureResponse(response).then(function (bytes) {
        if (bytes > rule.entry) return;
        return caches.open(rule.cache).then(function (cache) {
            return cache.put(request, responseWithMetadata(response, bytes)).then(function () { return schedulePrune(name); });
        });
    }).catch(function () {
        // A response that cannot be measured or stored must not break the page load.
    });
}

self.addEventListener('install', function (event) {
    // The fallback is the only install-time asset; visited pages and media are lazy cached.
    event.waitUntil(fetch(OFFLINE_PAGE).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
            throw new Error('Offline fallback could not be cached');
        }
        return measureResponse(response).then(function (bytes) {
            return caches.open(PAGE_CACHE).then(function (cache) {
                return cache.put(OFFLINE_PAGE, responseWithMetadata(response, bytes));
            });
        });
    }));
});

// Remove only caches owned by older builds, leaving other site caches alone.
self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return key.indexOf(CACHE_PREFIX) === 0 && key.indexOf(CACHE_PREFIX + BUILD_VERSION + '-') !== 0;
        }).map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); }));
});

// Warm only the page and same-origin URLs the open page already requested.
function warmRequestedPage(data) {
    var urls = [];
    var seen = new Set();
    var pageUrl;

    try {
        pageUrl = new URL(data.pageUrl, self.location.origin);
    } catch (error) {
        return Promise.resolve();
    }
    if (pageUrl.origin !== self.location.origin || pageUrl.pathname === OFFLINE_PAGE) return Promise.resolve();

    var pageRequest = new Request(pageUrl.href, { credentials: 'same-origin' });
    urls.push({ request: pageRequest, category: 'pages' });
    seen.add(pageUrl.href);

    var requested = Array.isArray(data.assetUrls) ? data.assetUrls.slice(0, MAX_WARM_URLS) : [];
    requested.forEach(function (value) {
        if (typeof value !== 'string') return;

        try {
            var url = new URL(value, self.location.origin);
            if (url.origin !== self.location.origin || seen.has(url.href)) return;
            var request = new Request(url.href, { credentials: 'same-origin' });
            var category = categoryFor(request, url);
            if (category !== 'assets' && category !== 'media') return;
            urls.push({ request: request, category: category });
            seen.add(url.href);
        } catch (error) {
            return;
        }
    });

    function warmBatch(start) {
        var batch = urls.slice(start, start + 6);
        return Promise.all(batch.map(function (item) {
            return caches.open(LIMITS[item.category].cache).then(function (cache) {
                return cache.match(item.request).then(function (cached) {
                    if (cached) return;
                    return fetch(item.request).then(function (response) {
                        return save(item.request, response, item.category);
                    });
                });
            }).catch(function () {});
        })).then(function () {
            return start + batch.length < urls.length ? warmBatch(start + batch.length) : undefined;
        });
    }

    return warmBatch(0);
}

self.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== 'warm-current-page') return;
    event.waitUntil(warmRequestedPage(data));
});

self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);
    var name = categoryFor(request, url);
    if (!name) return;

    if (name !== 'pages') {
        var assetResponse = fetch(request);
        event.waitUntil(assetResponse.then(function (response) { return save(request, response, name); }).catch(function () {}));
        event.respondWith(assetResponse.catch(function () {
            return caches.open(LIMITS[name].cache).then(function (cache) { return cache.match(request); })
                .then(function (cached) { return cached || Response.error(); });
        }));
        return;
    }

    // Network-first keeps visited routes fresh and falls back to their saved copy.
    var pageResponse = fetch(request);
    event.waitUntil(pageResponse.then(function (response) { return save(request, response, name); }).catch(function () {}));
    event.respondWith(pageResponse.catch(function () {
        return caches.open(PAGE_CACHE).then(function (cache) {
            return cache.match(request).then(function (cached) {
                if (cached) return cached;
                return cache.match(OFFLINE_PAGE).then(function (fallback) { return fallback || Response.error(); });
            });
        });
    }));
});
