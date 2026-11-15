const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

test('public pages use local runtime libraries and fonts', () => {
    for (const file of ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html']) {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        assert.doesNotMatch(html, /https:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)/);
        for (const match of html.matchAll(/(?:src|href)="([^"]*assets\/vendor\/[^"?]+)[^"]*"/g)) {
            const asset = path.resolve(root, path.dirname(file), match[1]);
            assert.ok(fs.statSync(asset).size > 0, asset);
        }
    }
});

test('local font and icon styles resolve their font files', () => {
    for (const file of ['fonts/fonts.css', 'phosphor/regular/style.css', 'phosphor/fill/style.css']) {
        const cssPath = path.join(root, 'assets/vendor', file);
        const css = fs.readFileSync(cssPath, 'utf8');
        for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
            const asset = path.resolve(path.dirname(cssPath), match[1].split('#')[0]);
            assert.ok(fs.statSync(asset).size > 0, asset);
        }
    }
    const licenses = fs.readdirSync(path.join(root, 'assets/vendor/licenses'));
    for (const name of ['aos', 'photoswipe', 'swiper', 'phosphor', 'geist', 'newsreader']) {
        assert.ok(licenses.some(file => file.includes(name)), name + ' license');
    }
});
