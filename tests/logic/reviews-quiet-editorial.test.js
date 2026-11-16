const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const reviewsModulePath = path.join(root, 'assets/js/home/reviews.js');

function createElement() {
    const listeners = {};
    const classes = new Set();
    const attributes = {};

    return {
        addEventListener: (name, listener) => { listeners[name] = listener; },
        dispatch: (name, event) => listeners[name] && listeners[name](event),
        classList: {
            add: name => classes.add(name),
            remove: name => classes.delete(name)
        },
        dataset: {},
        setAttribute: (name, value) => { attributes[name] = value; },
        getAttribute: name => attributes[name],
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
        'review-label',
        'review-stars',
        'review-quote',
        'review-avatar',
        'review-name',
        'review-date',
        'review-source',
        'review-next-preview',
        'review-next-name',
        'review-next-label',
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

test('carousel contains only the three verified Google review excerpts and profiles', () => {
    const source = fs.readFileSync(reviewsModulePath, 'utf8');
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const expectedReviews = [
        {
            name: 'manish kundu',
            profile: 'https://www.google.com/maps/contrib/114010618743342096318/reviews?hl=en-GB',
            excerpt: 'Spent 8 days exploring Sri Lanka with Kalum and couldn\'t have asked for a better experience.'
        },
        {
            name: 'Hemanth D',
            profile: 'https://www.google.com/maps/contrib/106008157020140095115/reviews?hl=en-GB',
            excerpt: 'Our trip changes were handled smoothly, including getting bookings for hotel in middle of the trip and at good rates. He was with us for 7 days and enjoyed the conversation, to learn about the locations, his journey.'
        },
        {
            name: 'Bhagyashree Nichite',
            profile: 'https://www.google.com/maps/contrib/118224888790977037677/reviews?hl=en-GB',
            excerpt: 'Flexible and accommodating: He happily adjusted the plan according to our interests and preferences.\nMemorable experience: His friendly nature and support made the trip truly enjoyable and unforgettable.'
        }
    ];

    assert.match(source, /var reviews = \[/);
    assert.equal((source.match(/["']?rating["']?\s*:\s*5/g) || []).length, 3);
    assert.doesNotMatch(source, /Vivaan Shenoy|Zeeshan Ahmed|Mandars Backup|Sarah & Mike Johnson|Priya & Raj Patel/);
    for (const review of expectedReviews) {
        assert.ok(source.includes(review.name), `missing verified reviewer: ${review.name}`);
        assert.ok(source.includes(review.profile), `missing source profile: ${review.name}`);
        const sourceExcerpt = review.excerpt
            .replace("couldn't", "couldn\\'t")
            .replace(/\n/g, '\\n');
        assert.ok(source.includes(sourceExcerpt), `missing verified excerpt: ${review.name}`);
    }
    assert.match(html, /id="review-name"[^>]*>manish kundu<\/cite>/);
    assert.match(html, /id="review-status" class="sr-only" aria-live="polite">Review 1 of 3<\/span>/);
    assert.match(html, /id="review-source"[^>]*href="https:\/\/www\.google\.com\/maps\/contrib\/114010618743342096318\/reviews\?hl=en-GB"/);
    assert.match(html, /Verified on Google Maps · 16 November 2026/);
});

test('next story button advances and a right swipe returns to the previous review', () => {
    const elements = loadReviewsModule();

    assert.equal(elements['review-name'].textContent, 'manish kundu');

    elements['review-next-preview'].click();
    assert.equal(elements['review-name'].textContent, 'Hemanth D');
    assert.equal(elements['review-source'].href, 'https://www.google.com/maps/contrib/106008157020140095115/reviews?hl=en-GB');

    elements['reviews-carousel'].dispatch('touchstart', { changedTouches: [{ clientX: 100 }] });
    elements['reviews-carousel'].dispatch('touchend', { changedTouches: [{ clientX: 200 }] });
    assert.equal(elements['review-name'].textContent, 'manish kundu');
});

test('reviews carousel has an accessible next story control and live status', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

    assert.match(html, /id="review-next-preview"[^>]*aria-label="Show next traveler review"/);
    assert.match(html, /id="review-status" class="sr-only" aria-live="polite"/);
});
