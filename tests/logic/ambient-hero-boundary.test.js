const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');

for (const file of ['ambient-particles.js', 'site-shell.js']) {
    const source = fs.readFileSync(path.join(root, 'assets/js/shared', file), 'utf8');
    const start = source.indexOf('    function initAmbientParticles()');
    const end = source.indexOf('\n    function initAmbientMotion()', start);
    const moduleSource = file === 'site-shell.js'
        ? source.slice(start, end) + '\ninitAmbientParticles();'
        : source;
    let hero = null;
    let nextFrame;
    let draws = 0;
    let mutationCallback;
    let resizeCallback;
    let intersectionCallback;
    const context = new Proxy({}, {
        get: (_, key) => key === 'clearRect' ? () => draws++ : () => {},
        set: () => true
    });
    const canvas = { style: {}, parentElement: {}, getContext: () => context };
    class MockMutationObserver {
        constructor(callback) { mutationCallback = callback; }
        observe() {}
        disconnect() {}
    }
    class MockResizeObserver {
        constructor(callback) { resizeCallback = callback; }
        observe() {}
        disconnect() {}
    }
    class MockIntersectionObserver {
        constructor(callback) { intersectionCallback = callback; }
        observe() {}
        disconnect() {}
    }
    const document = {
        readyState: 'complete',
        body: { dataset: { currentNav: 'gallery' } },
        querySelector: selector => selector === '.secondary-ambient-particles' ? canvas : hero,
        getElementById: () => hero,
        addEventListener: () => {}
    };
    vm.runInNewContext(moduleSource, {
        document,
        window: {
            devicePixelRatio: 2,
            MutationObserver: MockMutationObserver,
            ResizeObserver: MockResizeObserver,
            IntersectionObserver: MockIntersectionObserver,
            matchMedia: () => ({ matches: false }),
            requestAnimationFrame: callback => { nextFrame = callback; return 1; },
            cancelAnimationFrame: () => {},
            addEventListener: () => {}
        }
    });
    assert.equal(canvas.hidden, true, file + ': no field without a hero');
    assert.equal(canvas.style.position, 'absolute');
    assert.equal(canvas.style.zIndex, '2');

    function makeHero(width, height) {
        return {
            clientWidth: width,
            clientHeight: height,
            appendChild: child => { child.parentElement = hero; }
        };
    }
    hero = makeHero(1440, 900);
    mutationCallback();
    intersectionCallback([{ isIntersecting: true }]);
    nextFrame(16);
    assert.equal(canvas.parentElement, hero, file + ': late hero owns canvas');
    assert.equal(canvas.hidden, false);
    assert.equal(canvas.width, 2880);
    assert.equal(canvas.height, 1800);
    assert.ok(draws > 1, file + ': animation keeps drawing');

    hero = makeHero(390, 1100);
    mutationCallback();
    intersectionCallback([{ isIntersecting: true }]);
    nextFrame(32);
    assert.equal(canvas.parentElement, hero, file + ': replacement hero owns canvas');
    assert.equal(canvas.style.width, '390px');
    assert.equal(canvas.style.height, '1100px');

    hero.clientHeight = 1250;
    resizeCallback();
    nextFrame(48);
    assert.equal(canvas.height, 2500, file + ': content size changes resize canvas');
    hero.clientWidth = 768;
    resizeCallback();
    assert.equal(canvas.width, 1536, file + ': tablet resize follows hero');

    hero = null;
    mutationCallback();
    assert.equal(canvas.hidden, true, file + ': removed hero hides canvas');
    console.log(file + ': hero ownership, sizing, replacement and missing hero pass.');
}
