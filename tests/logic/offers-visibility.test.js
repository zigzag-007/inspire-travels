const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('offers autoplay stops outside its section and while the tab is hidden', () => {
    const listeners = {};
    let intersect;
    let running = true;
    let moves = 0;
    const elementListeners = {};
    const element = { addEventListener(name, callback) { elementListeners[name] = callback; }, contains: () => false, closest: () => null };
    const document = { readyState: 'complete', hidden: false,
        querySelector: selector => selector === '.offers-swiper' ? element : null, addEventListener: (name, callback) => { listeners[name] = callback; } };
    const window = { matchMedia: () => ({ matches: false, addEventListener() {} }),
        IntersectionObserver: class { constructor(callback) { intersect = callback; } observe() {} },
        addEventListener() {} };
    class Swiper {
        constructor() { this.el = element; this.params = {}; this.autoplay = { start() { running = true; }, stop() { running = false; } }; }
        slideNext() { moves += 1; }
        slidePrev() { moves -= 1; }
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
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
        let prevented = false;
        elementListeners.keydown({ key: 'ArrowLeft', [modifier]: true, preventDefault() { prevented = true; } });
        assert.equal(prevented, false, modifier + ' stays with the browser');
    }
    elementListeners.keydown({ key: 'ArrowRight', preventDefault() {} });
    assert.equal(moves, 1, 'plain arrow keys move the focused carousel');
});
