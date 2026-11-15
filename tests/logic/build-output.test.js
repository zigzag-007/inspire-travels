'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '../..');
const buildScript = path.join(projectRoot, 'scripts/build.js');
const outputRoot = path.join(projectRoot, '.zigzag-tmp', 'build-output-test');

test('production build contains only deployable site files and compiled Tailwind', function() {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    try {
        const result = spawnSync(process.execPath, [buildScript, path.relative(projectRoot, outputRoot)], {
            cwd: projectRoot,
            encoding: 'utf8'
        });
        assert.equal(result.status, 0, result.stderr);

        ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html', '_headers', '_redirects', 'robots.txt', 'sitemap.xml', '4c8bcacc-1d31-4999-8a15-f5dfd0c3963e.html', 'assets/css/generated/tailwind.css'].forEach(function(file) {
            assert.ok(fs.statSync(path.join(outputRoot, file)).size > 0, 'missing build output: ' + file);
        });
        assert.ok(fs.existsSync(path.join(outputRoot, 'tours/collection-family.html')));
        assert.ok(fs.existsSync(path.join(outputRoot, 'destinations/sigiriya.html')));
        assert.equal(fs.existsSync(path.join(outputRoot, 'scripts')), false);
        assert.equal(fs.existsSync(path.join(outputRoot, 'tests')), false);
        assert.equal(fs.existsSync(path.join(outputRoot, 'package.json')), false);

        const html = fs.readFileSync(path.join(outputRoot, 'tours/index.html'), 'utf8');
        assert.match(html, /assets\/css\/generated\/tailwind\.css/);
        assert.doesNotMatch(html, /cdn\.tailwindcss\.com|shared\/tailwind-config\.js/);

        const css = fs.readFileSync(path.join(outputRoot, 'assets/css/generated/tailwind.css'), 'utf8');
        assert.doesNotMatch(css, /url\(['"]?assets\//);
        assert.match(css, /url\(['"]?\/assets\/img\//);
        ['.pt-2', '.pt-4', '.md\\:pl-6'].forEach(function(selector) {
            assert.ok(css.includes(selector), 'missing generated utility: ' + selector);
        });
    } finally {
        fs.rmSync(outputRoot, { recursive: true, force: true });
    }
});

test('production build refuses to clear the project root', function() {
    const result = spawnSync(process.execPath, [buildScript, '.'], {
        cwd: projectRoot,
        encoding: 'utf8'
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must be dist or a child folder/);
});

test('production build refuses to clear source folders', function() {
    const result = spawnSync(process.execPath, [buildScript, 'assets'], {
        cwd: projectRoot,
        encoding: 'utf8'
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must be dist or a child folder/);
});
