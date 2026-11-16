const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '../..');
const navigationSource = fs.readFileSync(
    path.join(projectRoot, 'assets/js/shared/navigation.js'),
    'utf8'
);
const tourTabsSource = fs.readFileSync(
    path.join(projectRoot, 'assets/js/tours/tour-tabs.js'),
    'utf8'
);

function createNavigationHarness() {
    const frameQueue = new Map();
    const listeners = new Map();
    const scrollCalls = [];
    const canceledFrames = [];
    let nextFrameId = 1;
    let dispatchedScrollEvents = 0;

    const root = {
        scrollHeight: 5000,
        scrollTop: 1000,
        style: { scrollBehavior: 'smooth' }
    };
    const navbar = { getBoundingClientRect: () => ({ height: 72 }) };
    const windowStub = {
        scrollY: 1000,
        pageYOffset: 1000,
        innerHeight: 1000,
        matchMedia: () => ({ matches: false }),
        addEventListener: (name, callback) => {
            if (!listeners.has(name)) listeners.set(name, new Set());
            listeners.get(name).add(callback);
        },
        removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
        requestAnimationFrame: (callback) => {
            const id = nextFrameId++;
            frameQueue.set(id, callback);
            return id;
        },
        cancelAnimationFrame: (id) => {
            canceledFrames.push(id);
            frameQueue.delete(id);
        },
        scrollTo: (options) => {
            scrollCalls.push(options);
            windowStub.scrollY = options.top;
            windowStub.pageYOffset = options.top;
        },
        dispatchEvent: (event) => {
            if (event.type === 'scroll') dispatchedScrollEvents += 1;
        },
        dispatch: (name, event = {}) => {
            for (const callback of listeners.get(name) || []) callback(event);
        },
        takeFrame: (time) => {
            const next = frameQueue.entries().next().value;
            assert.ok(next, 'an animation frame should be queued');
            frameQueue.delete(next[0]);
            next[1](time);
        }
    };
    const documentStub = {
        documentElement: root,
        getElementById: (id) => id === 'navbar' ? navbar : null,
        querySelector: () => null,
        querySelectorAll: () => []
    };

    vm.runInNewContext(navigationSource, {
        window: windowStub,
        document: documentStub,
        Event: class Event { constructor(type) { this.type = type; } }
    });

    return {
        window: windowStub,
        document: documentStub,
        root,
        frameQueue,
        scrollCalls,
        canceledFrames,
        get dispatchedScrollEvents() { return dispatchedScrollEvents; }
    };
}

for (const input of [
    { type: 'wheel' },
    { type: 'touchstart' },
    { type: 'pointerdown' },
    ...['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']
        .map((key) => ({ type: 'keydown', key }))
]) {
    const harness = createNavigationHarness();
    harness.window.NavigationModule.smoothScrollTo(0, 3600, 'back-to-top-rush');
    const queuedFrame = harness.window.NavigationModule.scrollAnimationFrame;

    harness.window.dispatch(input.type, input);

    assert.ok(
        harness.canceledFrames.includes(queuedFrame),
        `${input.type}${input.key ? ` ${input.key}` : ''} should stop the active scroll frame`
    );
    assert.equal(harness.window.NavigationModule.scrollAnimationFrame, null);
    assert.equal(harness.root.style.scrollBehavior, 'smooth');
    assert.equal(harness.scrollCalls.length, 0, 'input cancellation should not move the page again');
}

{
    const harness = createNavigationHarness();
    const target = {
        offsetHeight: 2000,
        offsetTop: 9999,
        getBoundingClientRect: () => ({ top: 600 })
    };
    harness.document.querySelector = () => target;
    harness.window.scrollY = 200;
    harness.window.pageYOffset = 200;
    harness.window.NavigationModule.smoothScroll('#tours');

    assert.equal(
        harness.window.NavigationModule.scrollAnimationFrame !== null,
        true,
        'anchor navigation should use the shared animation owner'
    );
    assert.equal(harness.root.style.scrollBehavior, 'auto');
    harness.window.takeFrame(100);
    harness.window.takeFrame(1100);
    assert.equal(harness.scrollCalls[1].top, 712, 'anchor should use the sticky header height plus a 16px gap');
}

{
    const buttons = ['overview', 'options', 'details'].map((name) => ({
        dataset: { tourTab: name },
        listeners: {},
        addEventListener(type, callback) { this.listeners[type] = callback; },
        focus() { focused = this; }
    }));
    const cta = {
        dataset: { tourTab: 'options', tourScroll: 'true' },
        listeners: {},
        addEventListener(type, callback) { this.listeners[type] = callback; },
        focus() { focused = this; }
    };
    let focused = null;
    const windowStub = {};
    const documentStub = {
        querySelectorAll: (selector) => selector === '[role="tablist"] [role="tab"]' ? buttons : [...buttons, cta],
        getElementById: () => null
    };
    vm.runInNewContext(tourTabsSource, { window: windowStub, document: documentStub, Array });
    windowStub.TourTabsModule.init();
    const event = { key: 'ArrowRight', preventDefault() {} };
    buttons[2].listeners.keydown(event);

    assert.equal(focused, buttons[0], 'arrow navigation should wrap across tabs and skip CTA buttons');
}

{
    const harness = createNavigationHarness();
    harness.window.NavigationModule.smoothScrollTo(0, 3600, 'back-to-top-rush');
    harness.window.takeFrame(0);
    harness.window.takeFrame(900);

    assert.ok(
        Math.abs(harness.scrollCalls[1].top - (1000 * (1 - Math.pow(900 / 3600, 2.85)))) < 0.001,
        'the first frame at timestamp zero should not reset 3600ms t^2.85 timing'
    );

    harness.window.takeFrame(3600);
    assert.equal(harness.scrollCalls.at(-1).top, 0);
    assert.equal(harness.root.style.scrollBehavior, 'smooth', 'completion should restore inline scroll behavior');
    assert.equal(harness.dispatchedScrollEvents, 1, 'completion should dispatch a final scroll event');
}

{
    const panel = {
        attributes: {},
        classList: { toggle() {} },
        setAttribute(name, value) { this.attributes[name] = value; },
        getBoundingClientRect: () => ({ top: 500 })
    };
    const button = {
        attributes: {},
        classList: { toggle() {} },
        setAttribute(name, value) { this.attributes[name] = value; }
    };
    const calls = [];
    const nativeScrollCalls = [];
    const windowStub = {
        pageYOffset: 200,
        NavigationModule: {
            getScrollTargetY: (element) => element.getBoundingClientRect().top + 200 - 88,
            smoothScrollTo: (...args) => calls.push(args)
        },
        scrollTo: (...args) => nativeScrollCalls.push(args)
    };
    const documentStub = {
        getElementById: (id) => id === 'tab-btn-options'
            ? button
            : id === 'tour-tab-panel-options'
                ? panel
                : id === 'quote-form'
                    ? panel
                    : null,
        querySelectorAll: () => []
    };
    vm.runInNewContext(tourTabsSource, { window: windowStub, document: documentStub });
    windowStub.TourTabsModule.switchTab('options', true, 'quote-form');

    assert.deepEqual(calls, [[612, 1000]], 'tour tab scroll should use the shared animator and header offset');
    assert.equal(nativeScrollCalls.length, 0, 'tour tabs should not start a competing native animation');
}

console.log('Shared scrolling cancels on user input and owns anchors and tour tab movement.');
