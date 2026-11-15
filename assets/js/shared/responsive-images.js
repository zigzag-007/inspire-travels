// Add generated image choices to markup inserted by the existing page modules.
(function () {
    'use strict';
    var images = window.ImageAssetsData || {};

    function record(src) {
        try { return images[new URL(src, document.baseURI).pathname]; }
        catch (error) { return null; }
    }

    // Keep the original source as a fallback and reserve its aspect ratio.
    function enhance(image) {
        var asset = record(image.getAttribute('src'));
        if (!asset) return;
        if (image.hasAttribute('srcset') && image.srcset === asset.srcset) return;
        image.sizes = image.getAttribute('sizes') || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
        image.srcset = asset.srcset;
        if (!image.hasAttribute('width') && !image.hasAttribute('height')) {
            image.width = asset.width;
            image.height = asset.height;
        }
        image.addEventListener('error', function () {
            image.removeAttribute('srcset');
        }, { once: true });
    }

    // Observe new images before the next paint, including gallery and modal content.
    function scan(node) {
        if (node.nodeType !== 1) return;
        if (node.matches('img[src]')) enhance(node);
        node.querySelectorAll('img[src]').forEach(enhance);
    }

    new MutationObserver(function (records) {
        records.forEach(function (change) {
            if (change.type === 'attributes') enhance(change.target);
            else change.addedNodes.forEach(scan);
        });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    scan(document.documentElement);

    // Backgrounds and lightboxes deliberately request the full optimized image.
    window.ImageAssetsModule = {
        full: function (src) {
            var asset = record(src);
            return asset ? asset.src : src;
        },
        background: function (src) {
            var asset = record(src);
            if (!asset) return src;
            var target = window.innerWidth <= 640 ? 960 : window.innerWidth <= 1600 ? 1600 : asset.width;
            var candidates = asset.srcset.split(', ').map(function (entry) { return entry.split(' '); });
            var choice = candidates.find(function (entry) { return Number(entry[1].slice(0, -1)) >= target; });
            return choice ? choice[0] : asset.src;
        },
        attributes: function (src, sizes) {
            var asset = record(src);
            return asset ? ' srcset="' + asset.srcset + '" sizes="' + (sizes || '100vw') + '" width="' + asset.width + '" height="' + asset.height + '"' : '';
        }
    };
})();
