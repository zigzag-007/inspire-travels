const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '../..');
const secondaryCss = fs.readFileSync(
    path.join(projectRoot, 'assets/css/14-component-secondary-theme.css'),
    'utf8'
);
const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const floatingCss = fs.readFileSync(
    path.join(projectRoot, 'assets/css/10-component-buttons-floats.css'),
    'utf8'
);
const sharedLayerRule = floatingCss.match(
    /\.back-to-top\s*\{[^}]*z-index:\s*(\d+)\s*!important;/
);
assert.ok(sharedLayerRule, 'all pages should give back to top its own layer');
assert.ok(Number(sharedLayerRule[1]) > 40, 'home back to top should clear the shared footer');
assert.ok(Number(sharedLayerRule[1]) < 50, 'home back to top should stay below navigation');
const secondaryPages = [
    'gallery.html',
    'destinations/index.html',
    'tours/index.html'
];

const layerRule = secondaryCss.match(
    /body\.secondary-page-theme\s+\.back-to-top\s*\{[^}]*z-index:\s*(\d+)\s*!important;/
);

assert.ok(layerRule, 'secondary pages should give back to top its own layer');
assert.ok(Number(layerRule[1]) > 40, 'back to top should sit above the secondary footer');
assert.ok(Number(layerRule[1]) < 50, 'back to top should stay below the main navigation');
assert.ok(
    !/<body[^>]*class="[^"]*secondary-page-theme/.test(indexHtml),
    'the index page should stay outside the secondary footer layer rule'
);

secondaryPages.forEach((page) => {
    const html = fs.readFileSync(path.join(projectRoot, page), 'utf8');

    assert.ok(
        html.includes('14-component-secondary-theme.css?v=20261105-label-cleanup'),
        `${page} should load the new footer layer rule without a stale cache`
    );
});

['index.html', ...secondaryPages].forEach((page) => {
    const html = fs.readFileSync(path.join(projectRoot, page), 'utf8');
    assert.ok(
        html.includes('10-component-buttons-floats.css?v=20261003-footer-layer-3'),
        `${page} should refresh the cached floating control stylesheet`
    );
});

assert.match(
    floatingCss,
    /@media\s*\(max-width:\s*1023px\)\s*\{[^}]*\.main-footer\.secondary-site-footer\s+\.footer-copyright\s*\{[^}]*padding-inline:\s*4\.5rem\s*!important;/,
    'tablet and mobile copyright text should clear the fixed control despite the footer padding override'
);

console.log('Every page keeps back to top above the shared footer and below navigation.');
