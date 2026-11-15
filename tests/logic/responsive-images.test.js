'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '../..');

function loadImages(initialAttributes) {
    const observers = [];
    const attributes = new Map(Object.entries(initialAttributes || {}));
    const image = {
        nodeType: 1,
        closest: () => null,
        hasAttribute: name => attributes.has(name),
        getAttribute: name => attributes.get(name) || null,
        removeAttribute(name) { attributes.delete(name); },
        addEventListener() {},
        matches: selector => selector === 'img[src]' && attributes.has('src'),
        querySelectorAll: () => [],
        get srcset() { return attributes.get('srcset') || ''; },
        set srcset(value) { attributes.set('srcset', String(value)); },
        get sizes() { return attributes.get('sizes') || ''; },
        set sizes(value) { attributes.set('sizes', String(value)); },
        set width(value) { attributes.set('width', String(value)); },
        set height(value) { attributes.set('height', String(value)); }
    };
    const document = {
        baseURI: 'https://example.test/',
        documentElement: {
            nodeType: 1,
            matches: () => false,
            querySelectorAll: () => [image]
        }
    };
    class MockMutationObserver {
        constructor(callback) { observers.push(callback); }
        observe() {}
    }
    const context = {
        document,
        MutationObserver: MockMutationObserver,
        URL,
        WeakSet,
        window: {
            innerWidth: 1200,
            ImageAssetsData: {
                '/assets/photo.jpg': {
                    src: '/assets/photo.webp',
                    srcset: '/assets/photo-640.webp 640w, /assets/photo-1280.webp 1280w',
                    width: 1600,
                    height: 900
                }
            }
        }
    };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/shared/responsive-images.js'), 'utf8'), context);
    return {
        image,
        changeSource(src) {
            attributes.set('src', src);
            observers[0]([{ type: 'attributes', target: image }]);
        }
    };
}

test('responsive images remove generated srcset after source leaves the manifest', function() {
    const fixture = loadImages({ src: '/assets/photo.jpg' });
    assert.equal(fixture.image.srcset, '/assets/photo-640.webp 640w, /assets/photo-1280.webp 1280w');
    fixture.changeSource('/uploads/user-photo.jpg');
    assert.equal(fixture.image.hasAttribute('srcset'), false);
});

test('responsive images preserve author srcset for an unmanifested source', function() {
    const authored = '/uploads/small.jpg 640w, /uploads/large.jpg 1280w';
    const fixture = loadImages({ src: '/uploads/user-photo.jpg', srcset: authored });
    assert.equal(fixture.image.srcset, authored);
    fixture.changeSource('/uploads/another-photo.jpg');
    assert.equal(fixture.image.srcset, authored);
});
