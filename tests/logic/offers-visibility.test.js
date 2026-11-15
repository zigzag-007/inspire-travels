const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('offers autoplay stops outside its section and while the tab is hidden', () => {
    const listeners = {};
    let intersect;
    let running = true;
    const element = { addEventListener() {}, contains: () => false };
    const document = { readyState: 'complete', hidden: false,
        querySelector: () => element, addEventListener: (name, callback) => { listeners[name] = callback; } };
    const window = { matchMedia: () => ({ matches: false, addEventListener() {} }),
        IntersectionObserver: class { constructor(callback) { intersect = callback; } observe() {} },
        addEventListener() {} };
    class Swiper {
        constructor() { this.el = element; this.autoplay = { start() { running = true; }, stop() { running = false; } }; }
    }
    vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../assets/js/home/offers.js'), 'utf8'), { window, document, Swiper });
    assert.equal(running, false, 'wait for section visibility');
    intersect([{ isIntersecting: true }]);
    assert.equal(running, true);
    document.hidden = true;
    listeners.visibilitychange();
    assert.equal(running, false);
    document.hidden = false;
    listeners.visibilitychange();
    assert.equal(running, true);
    intersect([{ isIntersecting: false }]);
    assert.equal(running, false);
});
