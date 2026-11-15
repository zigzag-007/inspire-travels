'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '../..');

function loadAmbient(file, reducedMotion) {
    const source = fs.readFileSync(path.join(root, 'assets/js/shared', file), 'utf8');
    const start = source.indexOf('    function initAmbientParticles()');
    const end = source.indexOf('\n    function initAmbientMotion()', start);
    const moduleSource = file === 'site-shell.js'
        ? source.slice(start, end) + '\ninitAmbientParticles();'
        : source;
    let hero = {
        appendChild(canvas) { canvas.parentElement = this; },
        get clientWidth() { return 900; },
        get clientHeight() { return 650; }
    };
    let intersectionObserver;
    let resizeObserver;
    const frames = new Map();
    let nextFrameId = 1;
    let sizeReads = 0;
    const documentListeners = {};
    const context = new Proxy({}, {
        get: (_, key) => key === 'clearRect' ? () => {} : () => {},
        set: () => true
    });
    const canvas = {
        style: {},
        parentElement: {},
        getContext: () => context,
        set width(value) { this._width = value; },
        set height(value) { this._height = value; }
    };
    Object.defineProperties(hero, {
        clientWidth: { get() { sizeReads += 1; return 900; } },
        clientHeight: { get() { sizeReads += 1; return 650; } }
    });
    const document = {
        readyState: 'complete',
        hidden: false,
        body: { dataset: { currentNav: 'gallery' } },
        querySelector: selector => selector === '.secondary-ambient-particles' ? canvas : hero,
        getElementById: () => hero,
        addEventListener(name, callback) { documentListeners[name] = callback; }
    };
    class MockIntersectionObserver {
        constructor(callback) { this.callback = callback; intersectionObserver = this; }
        observe() {}
        disconnect() {}
    }
    class MockResizeObserver {
        constructor(callback) { this.callback = callback; resizeObserver = this; }
        observe() {}
        disconnect() {}
    }
    vm.runInNewContext(moduleSource, {
        document,
        window: {
            devicePixelRatio: 1,
            MutationObserver: class { observe() {} disconnect() {} },
            IntersectionObserver: MockIntersectionObserver,
            ResizeObserver: MockResizeObserver,
            matchMedia: query => ({ matches: query.includes('prefers-reduced-motion') && reducedMotion }),
            requestAnimationFrame(callback) { const id = nextFrameId++; frames.set(id, callback); return id; },
            cancelAnimationFrame(id) { frames.delete(id); },
            addEventListener() {}
        }
    });
    return {
        canvas,
        frames,
        hero,
        get intersectionObserver() { return intersectionObserver; },
        get resizeObserver() { return resizeObserver; },
        get sizeReads() { return sizeReads; },
        setHidden(hidden) {
            document.hidden = hidden;
            documentListeners.visibilitychange();
        },
        flushFrame(time) {
            const entry = frames.entries().next().value;
            if (!entry) return false;
            frames.delete(entry[0]);
            entry[1](time);
            return true;
        }
    };
}

test('ambient canvases only animate while visible and avoid per-frame size reads', function() {
    for (const file of ['ambient-particles.js', 'site-shell.js']) {
        const ambient = loadAmbient(file, false);
        assert.equal(ambient.frames.size, 0, file + ': wait for hero intersection');
        ambient.intersectionObserver.callback([{ isIntersecting: true }]);
        assert.equal(ambient.frames.size, 1, file + ': start after hero enters view');
        ambient.flushFrame(16);
        assert.equal(ambient.sizeReads, 2, file + ': read hero dimensions only during setup');
        assert.equal(ambient.frames.size, 1, file + ': continue only one active frame');
        ambient.setHidden(true);
        assert.equal(ambient.frames.size, 0, file + ': stop when the page is hidden');
        ambient.setHidden(false);
        assert.equal(ambient.frames.size, 1, file + ': resume when the page is visible');
        ambient.intersectionObserver.callback([{ isIntersecting: false }]);
        assert.equal(ambient.frames.size, 0, file + ': stop when hero leaves view');
    }
});

test('reduced motion draws a still canvas without scheduling frames', function() {
    for (const file of ['ambient-particles.js', 'site-shell.js']) {
        const ambient = loadAmbient(file, true);
        assert.equal(ambient.frames.size, 0, file + ': reduced motion stays still');
        ambient.intersectionObserver.callback([{ isIntersecting: true }]);
        assert.equal(ambient.frames.size, 0, file + ': reduced motion never starts a loop');
    }
});

test('gallery sliders keep autoplay paused while hover or focus remains active', function() {
    for (const file of ['gallery/gallery.js', 'shared/site-shell.js']) {
    const source = fs.readFileSync(path.join(root, 'assets/js', file), 'utf8').replace(/\r\n/g, '\n');
    const start = file === 'gallery/gallery.js'
        ? source.indexOf('initGallerySlider: function() {')
        : source.indexOf('    function initFooterSlider()');
    const end = file === 'gallery/gallery.js'
        ? source.indexOf('\n        }\n    };', start) + '\n        }'.length
        : source.indexOf('\n    function renderFooter()', start);
    const intervals = new Map();
    const handlers = {};
    let nextInterval = 1;
    let intersectionCallback;
    const slider = {
        dataset: {},
        style: {},
        querySelectorAll: () => Array.from({ length: 7 }, () => ({
            dataset: {},
            addEventListener() {}
        }))
    };
    const container = {
        addEventListener(name, callback) { handlers[name] = callback; },
        contains() { return false; }
    };
    const document = {
        hidden: false,
        getElementById: id => id === 'gallery-slider' ? slider : null,
        querySelectorAll: () => slider.querySelectorAll(),
        querySelector: selector => selector === '.gallery-slider-container' ? container : null,
        addEventListener(name, callback) { handlers['document:' + name] = callback; }
    };
    class MockIntersectionObserver {
        constructor(callback) { intersectionCallback = callback; }
        observe() {}
    }
    const window = {
        IntersectionObserver: MockIntersectionObserver,
        matchMedia: () => ({ matches: false }),
        addEventListener(name, callback) { handlers['window:' + name] = callback; }
    };
    const sliderSource = file === 'gallery/gallery.js'
        ? '({' + source.slice(start, end) + '}).initGallerySlider();'
        : source.slice(start, end) + '\ninitFooterSlider();';
    vm.runInNewContext(sliderSource, {
        document,
        window,
        setInterval(callback, delay) {
            const id = nextInterval++;
            intervals.set(id, { callback, delay });
            return id;
        },
        clearInterval(id) { intervals.delete(id); }
    });

    assert.equal(intervals.size, 0, file + ': wait until slider enters the viewport');
    intersectionCallback([{ isIntersecting: true }]);
    assert.equal(intervals.size, 1, file + ': one interval starts in view');
    handlers.mouseenter();
    assert.equal(intervals.size, 0, file + ': hover pauses the interval');
    handlers.focusin();
    handlers.mouseleave();
    assert.equal(intervals.size, 0, file + ': pointer exit does not cancel focus pause');
    handlers.focusout({ relatedTarget: null });
    assert.equal(intervals.size, 1, file + ': timer resumes after focus and hover end');
    handlers.focusin();
    handlers.mouseenter();
    handlers.focusout({ relatedTarget: null });
    assert.equal(intervals.size, 0, file + ': focus exit does not cancel hover pause');
    handlers.mouseleave();
    assert.equal(intervals.size, 1, file + ': timer resumes after hover and focus end');
    handlers.mouseleave();
    assert.equal(intervals.size, 1, file + ': repeated resume keeps one interval');
    document.hidden = true;
    handlers['document:visibilitychange']();
    assert.equal(intervals.size, 0, file + ': hidden tab pauses the interval');
    document.hidden = false;
    handlers['document:visibilitychange']();
    assert.equal(intervals.size, 1, file + ': visible tab resumes one interval');
    intersectionCallback([{ isIntersecting: false }]);
    assert.equal(intervals.size, 0, file + ': offscreen slider pauses the interval');
    }
});

test('home hero carousel waits for visibility and reduced motion settings', function() {
    const source = fs.readFileSync(path.join(root, 'assets/js/home/hero.js'), 'utf8');
    const documentListeners = {};
    const windowListeners = {};
    const intervals = new Map();
    let nextInterval = 1;
    let intersectionCallback;
    let motionCallback;
    const motionPreference = {
        matches: false,
        addEventListener(name, callback) { motionCallback = callback; }
    };
    const document = {
        hidden: false,
        addEventListener(name, callback) { documentListeners[name] = callback; }
    };
    class MockIntersectionObserver {
        constructor(callback) { intersectionCallback = callback; }
        observe() {}
    }
    const window = {
        matchMedia: query => query.includes('prefers-reduced-motion') ? motionPreference : { matches: true },
        IntersectionObserver: MockIntersectionObserver,
        addEventListener(name, callback) { windowListeners[name] = callback; }
    };
    vm.runInNewContext(source, {
        document,
        window,
        setInterval(callback, delay) {
            const id = nextInterval++;
            intervals.set(id, { callback, delay });
            return id;
        },
        clearInterval(id) { intervals.delete(id); }
    });
    const heroModule = window.HeroModule;
    heroModule.heroSection = {};
    heroModule.observeHeroVisibility();
    heroModule.bindVisibilityControl();
    heroModule.startHeroCarousel();
    assert.equal(intervals.size, 0, 'wait until hero intersects');
    intersectionCallback([{ isIntersecting: true }]);
    assert.equal(intervals.size, 1, 'start in view');
    intersectionCallback([{ isIntersecting: false }]);
    assert.equal(intervals.size, 0, 'stop outside the hero');
    intersectionCallback([{ isIntersecting: true }]);
    document.hidden = true;
    documentListeners.visibilitychange();
    assert.equal(intervals.size, 0, 'stay stopped in a hidden tab');
    document.hidden = false;
    documentListeners.visibilitychange();
    assert.equal(intervals.size, 1, 'resume on a visible page');
    motionPreference.matches = true;
    motionCallback({ matches: true });
    assert.equal(intervals.size, 0, 'stop for reduced motion');
    motionPreference.matches = false;
    motionCallback({ matches: false });
    assert.equal(intervals.size, 1, 'resume when reduced motion is disabled');
    windowListeners.pagehide();
    assert.equal(intervals.size, 0, 'pagehide stops the timer even if hidden is still false');
    windowListeners.pageshow();
    assert.equal(intervals.size, 1, 'pageshow resumes the visible hero');
});
