const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const galleryHtml = fs.readFileSync(path.join(root, 'gallery.html'), 'utf8');
const destinationHtml = fs.readFileSync(path.join(root, 'destinations/index.html'), 'utf8');
const toursHtml = fs.readFileSync(path.join(root, 'tours/index.html'), 'utf8');
const collectionTemplate = fs.readFileSync(path.join(root, 'assets/js/tours/tour-collection-template.js'), 'utf8');
const tourTemplate = fs.readFileSync(path.join(root, 'assets/js/tours/tour-content-template.js'), 'utf8');
const siteShell = fs.readFileSync(path.join(root, 'assets/js/shared/site-shell.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/06-component-section-backgrounds.css'), 'utf8');
const secondaryCss = fs.readFileSync(path.join(root, 'assets/css/14-component-secondary-theme.css'), 'utf8');
const collectionCss = fs.readFileSync(path.join(root, 'assets/css/13-component-tour-collections.css'), 'utf8');
const navigationCss = fs.readFileSync(path.join(root, 'assets/css/04-component-navigation.css'), 'utf8');

test('organic boundaries use the receiving section background as one mask', () => {
    assert.doesNotMatch(html, /section-curve-junction/);
    assert.doesNotMatch(html, /section-curve-cap/);
    assert.match(html, /<section id="tours"[^>]*section-curve-receiver/);
    assert.match(html, /<section id="destinations"[^>]*section-curve-receiver/);
    assert.match(html, /<section id="about"[^>]*section-curve-receiver/);
    assert.match(html, /<section id="gallery"[^>]*section-curve-receiver/);
    assert.match(html, /<section id="adventure"[^>]*section-curve-receiver/);
    assert.match(html, /<section id="reviews"[^>]*section-curve-receiver/);
    assert.equal((html.match(/section-curve-receiver/g) || []).length, 6);
});

test('masked curve overlaps cleanly and keeps the original content position', () => {
    assert.match(css, /\.section-curve-receiver\s*\{[^}]*margin-top:\s*calc\(-1 \* var\(--section-curve-height\)\);/s);
    assert.match(css, /padding-top:\s*calc\(var\(--section-curve-base-padding\) \+ var\(--section-curve-height\)\) !important;/);
    assert.match(css, /mask-image:[\s\S]*?section-curve-height/);
    assert.match(css, /calc\(100% - var\(--section-curve-height\) \+ 1px\)/);
});

test('home receivers use one restrained family with subtle variants', () => {
    assert.match(html, /id="about"[^>]*section-curve-crest/);
    assert.match(html, /id="gallery"[^>]*section-curve-drift/);
    assert.match(html, /id="reviews"[^>]*section-curve-crest/);
    assert.match(css, /\.section-curve-drift\s*\{/);
    assert.match(css, /\.section-curve-crest\s*\{/);
});

test('gallery hero keeps its original clean transition into navigation', () => {
    assert.doesNotMatch(galleryHtml, /gallery-story-nav[^\"]*section-curve-receiver/);
    assert.doesNotMatch(galleryHtml, /gallery-archive[^\"]*section-curve-receiver/);
    assert.doesNotMatch(css, /\.gallery-story-nav\.section-curve-receiver/);
});

test('destination guide keeps its editorial body outside the curve system', () => {
    assert.doesNotMatch(destinationHtml, /destination-editorial-body[^\"]*section-curve-receiver/);
    assert.doesNotMatch(destinationHtml, /id="destination-article-main"[^>]*section-curve-receiver/);
    assert.doesNotMatch(secondaryCss, /\.destination-editorial-body\.section-curve-receiver/);
});

test('tour collection keeps curves only at useful contrasting boundaries', () => {
    assert.match(collectionTemplate, /tour-route-atlas section-curve-receiver section-curve-drift/);
    assert.doesNotMatch(collectionTemplate, /tour-story-section[^\"]*section-curve-receiver/);
    assert.match(collectionTemplate, /tour-collection-switch section-curve-receiver/);
    assert.match(collectionCss, /\.tour-route-atlas\.section-curve-receiver\s*\{[^}]*padding-top:\s*clamp\(7rem, 10vw, 9rem\)\s*!important;/s);
    assert.match(collectionCss, /\.tour-collection-switch\.section-curve-receiver\s*\{[^}]*--section-curve-base-padding:\s*clamp\(6rem, 9vw, 8rem\);/s);
    assert.doesNotMatch(collectionCss, /\.tour-story-section\.section-curve-receiver/);
});

test('individual tour canvas receives the paper curve', () => {
    assert.match(tourTemplate, /tour-detail-canvas section-curve-receiver section-curve-drift/);
    assert.match(secondaryCss, /\.tour-detail-canvas\.section-curve-receiver\s*\{[^}]*--section-curve-base-padding:\s*4rem;/s);
    assert.match(secondaryCss, /@media \(min-width:\s*768px\)\s*\{[^}]*\.tour-detail-canvas\.section-curve-receiver\s*\{[^}]*--section-curve-base-padding:\s*6rem;/s);
});

test('every footer keeps its original straight entrance', () => {
    [html, galleryHtml, destinationHtml, toursHtml].forEach((page) => {
        assert.doesNotMatch(page, /<footer id="footer"[^>]*section-curve-(?:receiver|footer)/);
    });
    assert.doesNotMatch(css, /\.section-curve-footer/);
    assert.doesNotMatch(css, /#footer\.secondary-site-footer\.section-curve-receiver/);
    assert.doesNotMatch(siteShell, /main-footer gowilds-footer secondary-site-footer section-curve/);
});

test('mobile drawer uses a lighter paper and slightly stronger quiet labels', () => {
    assert.match(navigationCss, /linear-gradient\(155deg, rgba\(255, 255, 253, 0\.992\), rgba\(252, 250, 246, 0\.992\)\)/);
    assert.match(navigationCss, /\.mobile-menu \.secondary-mobile-brand img\s*\{[^}]*transform:\s*scale\(1\.58\)\s*!important;/s);
    assert.match(navigationCss, /\.secondary-mobile-brand-copy small\s*\{[^}]*color:\s*rgba\(19, 38, 29, 0\.56\);/s);
    assert.match(navigationCss, /\.mobile-menu \.mobile-nav-link,[\s\S]*?color:\s*rgba\(19, 38, 29, 0\.78\)\s*!important;/);
    assert.match(navigationCss, /\.secondary-mobile-nav-index\s*\{[^}]*color:\s*rgba\(127, 86, 32, 0\.66\);/s);
    assert.match(navigationCss, /\.mobile-menu \.active-mobile-nav\s*\{[^}]*background:\s*linear-gradient\(105deg, rgba\(234, 176, 91, 0\.16\), rgba\(255, 254, 250, 0\.78\)\)\s*!important;/s);
    assert.match(navigationCss, /\.mobile-menu \.mobile-submenu-link small\s*\{[^}]*color:\s*rgba\(19, 38, 29, 0\.5\);/s);
    assert.match(navigationCss, /\.secondary-mobile-socials\s*\{[^}]*color:\s*rgba\(19, 38, 29, 0\.56\);/s);
    assert.match(secondaryCss, /body\.secondary-page-theme \.mobile-menu\s*\{[^}]*linear-gradient\(155deg, rgba\(255, 255, 253, 0\.992\), rgba\(252, 250, 246, 0\.992\)\)/s);
    assert.match(secondaryCss, /body\.secondary-page-theme \.mobile-menu \.secondary-mobile-brand img\s*\{[^}]*transform:\s*scale\(1\.58\)\s*!important;/s);
    assert.match(secondaryCss, /\.secondary-mobile-brand-copy small\s*\{[^}]*color:\s*rgba\(19, 38, 29, 0\.56\);/s);
    assert.match(secondaryCss, /body\.secondary-page-theme \.mobile-menu \.active-mobile-nav\s*\{[^}]*background:\s*linear-gradient\(105deg, rgba\(234, 176, 91, 0\.16\), rgba\(255, 254, 250, 0\.78\)\)\s*!important;/s);
});

test('changed curve and drawer assets use fresh immutable cache versions', () => {
    [html, galleryHtml, destinationHtml, toursHtml].forEach((page) => {
        assert.match(page, /04-component-navigation\.css\?v=20260824-drawer-polish/);
        assert.match(page, /06-component-section-backgrounds\.css\?v=20261105-label-cleanup/);
        assert.match(page, /14-component-secondary-theme\.css\?v=20261105-label-cleanup/);
    });
    [galleryHtml, destinationHtml, toursHtml].forEach((page) => {
        assert.match(page, /shared\/site-shell\.js\?v=20261115-company-registration/);
    });
    assert.match(toursHtml, /13-component-tour-collections\.css\?v=20260824-curve-rollback/);
    assert.match(toursHtml, /tours\/tour-collection-template\.js\?v=20261105-clean-route-prerender/);
});
