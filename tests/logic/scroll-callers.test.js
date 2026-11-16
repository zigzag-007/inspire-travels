const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '../..');

function source(file) {
    return fs.readFileSync(path.join(projectRoot, file), 'utf8');
}

{
    const sourceText = source('assets/js/destinations/destination-contents.js');
    const listeners = {};
    const link = {
        dataset: {},
        classList: { toggle() {} },
        getAttribute: () => 'itinerary',
        setAttribute() {},
        removeAttribute() {},
        addEventListener(type, callback) { listeners[type] = callback; }
    };
    const target = { getBoundingClientRect: () => ({ top: 120 }) };
    let receivedTarget;
    const windowStub = {
        scrollY: 333,
        NavigationModule: {
            getScrollTargetY(element) {
                receivedTarget = element;
                return element.getBoundingClientRect().top + windowStub.scrollY - 88;
            },
            smoothScrollTo(...args) { calls.push(args); }
        },
        IntersectionObserver: class {
            observe() {}
            disconnect() {}
        }
    };
    const calls = [];
    const documentStub = {
        getElementById: (id) => ['overview', 'experiences', 'itinerary', 'cuisine', 'tips', 'inquire'].includes(id) ? target : null,
        querySelectorAll: () => [link]
    };
    vm.runInNewContext(sourceText, { window: windowStub, document: documentStub, IntersectionObserver: windowStub.IntersectionObserver });
    windowStub.DestinationContentsModule.init();
    const event = { preventDefault() {}, stopImmediatePropagation() {} };
    listeners.click(event);

    assert.equal(receivedTarget, target, 'destination contents should ask the shared header helper for the target position');
    assert.deepEqual(calls, [[365, 850]], 'destination contents should use the shared animation owner');
}

{
    const sourceText = source('assets/js/shared/secondary-hero.js');
    let clickHandler;
    let receivedTarget;
    const action = { addEventListener(type, callback) { if (type === 'click') clickHandler = callback; } };
    const hero = { querySelector: () => action };
    const target = { getBoundingClientRect: () => ({ top: 120 }) };
    const calls = [];
    const windowStub = {
        scrollY: 333,
        NavigationModule: {
            getScrollTargetY(element) {
                receivedTarget = element;
                return element.getBoundingClientRect().top + windowStub.scrollY - 88;
            },
            smoothScrollTo(...args) { calls.push(args); }
        }
    };
    const documentStub = {
        readyState: 'complete',
        querySelector: () => null,
        getElementById: (id) => id === 'secondary-hero' ? hero : id === 'itinerary' ? target : null
    };
    vm.runInNewContext(sourceText, { window: windowStub, document: documentStub });
    windowStub.SecondaryHeroModule.renderInto({}, {
        id: 'secondary-hero',
        image: 'image.jpg',
        action: { href: '#itinerary', label: 'View itinerary', toc: 'itinerary' }
    });
    clickHandler({ preventDefault() {}, stopImmediatePropagation() {} });

    assert.equal(receivedTarget, target, 'secondary hero actions should use the shared header helper');
    assert.deepEqual(calls, [[365, 850]], 'secondary hero actions should use the shared animation owner');
}

{
    const sourceText = source('assets/js/destinations/destination-entry.js');
    const timers = [];
    const calls = [];
    let stopCount = 0;
    let switchDestination;
    const article = { style: {} };
    const hero = { getBoundingClientRect: () => ({ top: 120 }) };
    const documentStub = {
        readyState: 'complete',
        getElementById: (id) => id === 'destination-article-main' ? article : id === 'dest-hero' ? hero : null
    };
    const windowStub = {
        scrollY: 333,
        setTimeout(callback, delay) { timers.push({ callback, delay }); },
        addEventListener() {},
        history: { pushState() {} },
        NavigationModule: {
            stopSmoothScroll() { stopCount += 1; },
            getScrollTargetY(element) { return element.getBoundingClientRect().top + windowStub.scrollY - 88; },
            smoothScrollTo(...args) { calls.push(args); }
        },
        DestinationRouteModule: {
            get: () => ({}),
            resolve: () => 'sigiriya',
            updateUrl() {}
        },
        DestinationRendererModule: { render() {} },
        DestinationSwitcherModule: { render(slug, callback) { switchDestination = callback; } },
        DestinationContentsModule: { init() {} }
    };
    vm.runInNewContext(sourceText, { window: windowStub, document: documentStub });
    timers.find((timer) => timer.delay === 0).callback();
    switchDestination('kandy');

    assert.equal(stopCount, 1, 'destination switching should cancel an active shared animation before its render delay');
    timers.find((timer) => timer.delay === 250).callback();

    assert.deepEqual(calls, [[365, 1000]], 'destination switching should use shared header positioning and animation');
}

console.log('Destination and secondary hero scroll callers share the navigation owner.');
