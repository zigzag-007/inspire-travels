const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '../..');
const source = fs.readFileSync(
    path.join(projectRoot, 'assets/js/shared/secondary-hero.js'),
    'utf8'
);
const galleryHtml = fs.readFileSync(path.join(projectRoot, 'gallery.html'), 'utf8');
const target = { outerHTML: '', hasAttribute: () => false };
const factsDock = { parentElement: {} };
const hero = {
    nextElementSibling: null,
    querySelector: () => null,
    appendChild: (element) => {
        element.parentElement = hero;
    },
    insertAdjacentElement: () => {}
};
const documentStub = {
    readyState: 'complete',
    querySelector: (selector) => {
        if (selector === '[data-secondary-gallery-hero]') return target;
        if (selector === '.secondary-facts-dock[aria-label="Gallery quick facts"]') return factsDock;
        return null;
    },
    getElementById: (id) => id === 'gallery-hero' ? hero : null
};

vm.runInNewContext(source, {
    window: {},
    document: documentStub
});

assert.equal(
    factsDock.parentElement,
    hero,
    'Gallery facts dock should stay inside the full height hero'
);
assert.ok(
    galleryHtml.includes('secondary-hero.js?v=20261105-note-detail-control'),
    'Gallery should load the restored hero placement without a stale cache'
);

console.log('Gallery facts dock stays inside the full height hero.');
