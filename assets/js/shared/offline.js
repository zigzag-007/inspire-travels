// Shared offline setup for pages that can benefit from saved visits.
(function () {
    'use strict';

    if (window.OfflineModule) return;

    var status;
    var registration;
    var maxWarmUrls = 96;
    var warmedCurrentPage = false;

    // Keep the message available to screen readers without shifting the page.
    function getStatus() {
        if (status) return status;

        status = document.createElement('p');
        status.className = 'offline-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;max-width:calc(100% - 24px);padding:10px 14px;background:#173b32;color:#fff;border-radius:8px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 4px 18px #0003;';
        status.hidden = true;
        (document.body || document.documentElement).appendChild(status);
        return status;
    }

    // Show a short message only when a connection changes or an action needs one.
    function announce(message) {
        var node = getStatus();
        node.textContent = message;
        var dismiss = document.createElement('button');
        dismiss.type = 'button';
        dismiss.textContent = 'Dismiss';
        dismiss.style.cssText = 'margin-left:12px;text-decoration:underline;';
        dismiss.addEventListener('click', function () { node.hidden = true; });
        node.appendChild(dismiss);
        node.hidden = false;
    }

    // External actions keep working online and explain the connection need offline.
    function watchExternalActions() {
        document.addEventListener('click', function (event) {
            var target = event.target.closest && event.target.closest('a[href], [data-whatsapp-message]');
            if (!target || navigator.onLine) return;

            try {
                var href = target.href || '';
                var externalLink = href && new URL(href, window.location.href).origin !== window.location.origin;
                var scriptedWhatsApp = target.hasAttribute('data-whatsapp-message');
                if ((externalLink && /^https?:$/.test(new URL(href, window.location.href).protocol)) || scriptedWhatsApp) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    announce('This action needs an internet connection. Your saved pages remain available.');
                }
            } catch (error) {
                return;
            }
        }, true);

        document.addEventListener('submit', function (event) {
            var form = event.target;
            var action = form && form.action;
            if (!action || navigator.onLine) return;

            try {
                var target = new URL(action, window.location.href);
                if (/^https?:$/.test(target.protocol) && target.origin !== window.location.origin) {
                    event.preventDefault();
                    announce('This action needs an internet connection. Your saved pages remain available.');
                }
            } catch (error) {
                return;
            }
        });
    }

    // Update messages without interrupting a form or forcing a page reload.
    function watchConnection() {
        window.addEventListener('offline', function () {
            announce('You are offline. Saved pages can still open; pages you have not visited may not be available.');
        });

        window.addEventListener('online', function () {
            announce('You are back online.');
        });
    }

    // Send only the current page and completed same-origin resources to its worker.
    function warmCurrentPage() {
        var controller = navigator.serviceWorker.controller;
        if (warmedCurrentPage || !controller || !window.performance || !window.performance.getEntriesByType) return;
        if (document.readyState !== 'complete') return;

        var seen = new Set();
        var resources = [];
        window.performance.getEntriesByType('resource').forEach(function (entry) {
            if (!entry.name || entry.responseEnd <= 0) return;

            try {
                var url = new URL(entry.name, window.location.href);
                if (url.origin !== window.location.origin) return;
                url.hash = '';
                var pathname = url.pathname;
                if (!/\.(?:css|js|mjs|json|svg|woff2?|ttf|ico|webmanifest|avif|gif|jpe?g|png|webp|mp4|webm|ogg|mp3|wav)$/i.test(pathname)) return;
                if (seen.has(url.href)) return;
                seen.add(url.href);
                resources.push(url.href);
            } catch (error) {
                return;
            }
        });

        var pageUrl = new URL(window.location.href);
        pageUrl.hash = '';
        // Save scripts, styles and fonts before optional images fill the warm limit.
        resources.sort(function (left, right) {
            var essential = /\.(?:css|js|mjs|woff2?|ttf)(?:\?|$)/i;
            return Number(essential.test(right)) - Number(essential.test(left));
        });
        controller.postMessage({
            type: 'warm-current-page',
            pageUrl: pageUrl.href,
            assetUrls: resources.slice(0, maxWarmUrls)
        });
        warmedCurrentPage = true;
    }

    // Let an installed update wait until users close their current pages.
    function watchUpdates() {
        if (!registration) return;

        function reportWaitingWorker() {
            if (registration.waiting) {
                announce('An offline update is ready. Close all Inspire Travels tabs, then reopen the site to use it.');
            }
        }

        registration.addEventListener('updatefound', function () {
            var worker = registration.installing;
            if (!worker) return;
            worker.addEventListener('statechange', function () {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                    reportWaitingWorker();
                }
            });
        });
        reportWaitingWorker();
    }

    // Register the root worker so clean routes share its scope.
    function init() {
        if (!('serviceWorker' in navigator)) return;

        watchExternalActions();
        watchConnection();
        navigator.serviceWorker.addEventListener('controllerchange', warmCurrentPage);
        window.addEventListener('load', warmCurrentPage, { once: true });
        if (!navigator.onLine) {
            announce('You are offline. Saved pages can still open; pages you have not visited may not be available.');
        }

        navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
            .then(function (result) {
                registration = result;
                watchUpdates();
                warmCurrentPage();
            })
            .catch(function () {
                // The site continues to work online if offline support is unavailable.
            });
    }

    window.OfflineModule = {
        init: init,
        requireConnection: function () {
            if (navigator.onLine) return true;
            announce('This action needs an internet connection. Your saved pages remain available.');
            return false;
        }
    };
    init();
})();
