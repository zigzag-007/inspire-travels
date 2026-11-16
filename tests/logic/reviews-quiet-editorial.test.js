const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const reviewsModulePath = path.join(root, 'assets/js/home/reviews.js');

function createElement() {
    const listeners = {};
    const classes = new Set();

    return {
        addEventListener: (name, listener) => { listeners[name] = listener; },
        dispatch: (name, event) => listeners[name] && listeners[name](event),
        classList: {
            add: name => classes.add(name),
            remove: name => classes.delete(name)
        },
        dataset: {},
        setAttribute: () => {},
        click: () => listeners.click && listeners.click(),
        textContent: '',
        innerHTML: '',
        src: ''
    };
}

function loadReviewsModule() {
    const ids = [
        'reviews-carousel',
        'review-card',
        'review-tour',
        'review-stars',
        'review-quote',
        'review-avatar',
        'review-name',
        'review-country',
        'review-date',
        'review-next-preview',
        'review-next-name',
        'review-next-tour',
        'review-status'
    ];
    const elements = Object.fromEntries(ids.map(id => [id, createElement()]));

    global.window = {
        matchMedia: () => ({ matches: true }),
        requestAnimationFrame: callback => callback()
    };
    global.Image = function () {};
    global.document = {
        hidden: false,
        addEventListener: () => {},
        getElementById: id => elements[id] || null
    };

    delete require.cache[reviewsModulePath];
    require(reviewsModulePath);
    window.ReviewsModule.init();

    return elements;
}

afterEach(() => {
    delete require.cache[reviewsModulePath];
    delete global.Image;
    delete global.document;
    delete global.window;
});

test('reviews section links to the current Google business listing', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const reviewLinks = [...html.matchAll(/<a\b(?=[^>]*href="https:\/\/www\.google\.com\/maps\?cid=7768607141437312317")[^>]*>([\s\S]*?)<\/a>/g)];

    assert.equal(reviewLinks.length, 2);
    assert.match(reviewLinks[0][1], /<span>Review us on Google Maps<\/span>/);
    assert.match(reviewLinks[1][1], /<span>Read reviews on Google Maps<\/span>/);
});

test('next story button advances and a right swipe returns to the previous review', () => {
    const elements = loadReviewsModule();

    assert.equal(elements['review-name'].textContent, 'Vivaan Shenoy');

    elements['review-next-preview'].click();
    assert.equal(elements['review-name'].textContent, 'Zeeshan Ahmed');

    elements['reviews-carousel'].dispatch('touchstart', { changedTouches: [{ clientX: 100 }] });
    elements['reviews-carousel'].dispatch('touchend', { changedTouches: [{ clientX: 200 }] });
    assert.equal(elements['review-name'].textContent, 'Vivaan Shenoy');
});

test('reviews carousel has an accessible next story control and live status', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

    assert.match(html, /id="review-next-preview"[^>]*aria-label="Show next traveler review"/);
    assert.match(html, /id="review-status" class="sr-only" aria-live="polite"/);
});
