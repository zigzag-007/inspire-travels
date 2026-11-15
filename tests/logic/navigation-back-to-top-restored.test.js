const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '../..');
const navigationSource = fs.readFileSync(
    path.join(projectRoot, 'assets/js/shared/navigation.js'),
    'utf8'
);
const pages = [
    'index.html',
    'gallery.html',
    'destinations/index.html',
    'tours/index.html'
];
const restoredVersion = 'v=20260815-restored-scroll-rush';

assert.ok(
    navigationSource.includes("return Math.pow(t, 2.85);"),
    'back to top should keep the proven rising curve'
);
assert.ok(
    navigationSource.includes("self.smoothScrollTo(0, 3600, 'back-to-top-rush');"),
    'back to top should keep the proven 3600 ms motion'
);

pages.forEach((page) => {
    const html = fs.readFileSync(path.join(projectRoot, page), 'utf8');

    assert.ok(
        html.includes(`navigation.js?${restoredVersion}`),
        `${page} should load the restored back to top motion without a stale cache`
    );
});

const frameQueue = [];
const scrollPositions = [];
const windowStub = {
    scrollY: 10000,
    pageYOffset: 10000,
    innerHeight: 1000,
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (callback) => {
        frameQueue.push(callback);
        return frameQueue.length;
    },
    cancelAnimationFrame: () => {},
    scrollTo: ({ top }) => {
        windowStub.scrollY = top;
        scrollPositions.push(top);
    },
    dispatchEvent: () => {}
};
const documentStub = {
    documentElement: {
        scrollHeight: 11000,
        scrollTop: 10000,
        style: { scrollBehavior: '' }
    }
};

vm.runInNewContext(navigationSource, {
    window: windowStub,
    document: documentStub,
    Event: class Event {}
});

windowStub.NavigationModule.smoothScrollTo(0, 3600, 'back-to-top-rush');
[100, 1000, 1900, 2800, 3700].forEach((time) => {
    const frame = frameQueue.shift();
    assert.ok(frame, `a scroll frame should exist at ${time} ms`);
    frame(time);
});

const animatedPositions = scrollPositions.slice(0, 5);
const frameDistances = animatedPositions.slice(1).map((position, index) => {
    return animatedPositions[index] - position;
});

assert.ok(
    animatedPositions.every((position, index) => index === 0 || position < animatedPositions[index - 1]),
    'every animation frame should move upward without a jump in the wrong direction'
);
assert.ok(
    frameDistances.every((distance, index) => index === 0 || distance > frameDistances[index - 1]),
    'the restored motion should build speed on each quarter of the journey'
);
assert.equal(scrollPositions.at(-1), 0, 'the restored motion should finish exactly at the top');

console.log('Every page loads the restored back to top motion.');
