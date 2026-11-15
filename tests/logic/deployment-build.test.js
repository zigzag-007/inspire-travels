const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('development tools stay inside tests instead of the website root', () => {
    for (const file of ['package.json', 'package-lock.json', 'node_modules', 'scripts', 'dist']) {
        assert.equal(fs.existsSync(path.join(root, file)), false, file + ' clutters the root');
    }
    for (const file of ['tests/package.json', 'tests/package-lock.json', 'tests/build/build.js', 'public/sitemap.xml', 'public/robots.txt']) {
        assert.ok(fs.existsSync(path.join(root, file)), 'missing grouped file: ' + file);
    }
});

test('plain static source previews include every public page and local Tailwind', () => {
    const routes = [...read('public/sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)]
        .map(match => new URL(match[1]).pathname);
    for (const route of routes) {
        const file = route === '/' ? 'index.html' : route.slice(1);
        assert.ok(fs.existsSync(path.join(root, file)), 'missing source preview: ' + route);
        const html = read(file);
        assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, route);
        assert.match(html, /assets\/css\/generated\/tailwind\.css/, route);
    }
    assert.ok(fs.existsSync(path.join(root, 'assets/css/generated/tailwind.css')));
});

test('Netlify and Vercel build the same grouped static output', () => {
    const netlify = read('netlify.toml');
    const vercel = JSON.parse(read('vercel.json'));
    const netlifyCommand = netlify.match(/^\s*command\s*=\s*"([^"]+)"\s*$/m)?.[1];
    const netlifyPublish = netlify.match(/^\s*publish\s*=\s*"([^"]+)"\s*$/m)?.[1];

    assert.equal(netlifyCommand, 'npm --prefix tests ci && npm --prefix tests run build');
    assert.equal(vercel.buildCommand, netlifyCommand);
    assert.equal(netlifyPublish, 'tests/local/dist');
    assert.equal(vercel.outputDirectory, netlifyPublish);
    assert.equal(vercel.framework, null);
    assert.equal(vercel.installCommand, '');
});

test('the shared build creates every tour and destination route in the sitemap', () => {
    const sitemap = read('public/sitemap.xml');
    const routePaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map(match => new URL(match[1]).pathname.slice(1))
        .filter(route => route.startsWith('tours/') || route.startsWith('destinations/'));
    fs.mkdirSync(path.join(root, '.zigzag-tmp'), { recursive: true });
    const output = fs.mkdtempSync(path.join(root, '.zigzag-tmp', 'deployment-build-'));

    try {
        const result = spawnSync(process.execPath, ['tests/build/generate-search-pages.js', output], {
            cwd: root,
            encoding: 'utf8'
        });

        assert.equal(result.status, 0, result.stderr);
        assert.equal(routePaths.length, 29);

        for (const route of routePaths) {
            const file = path.join(output, route);
            assert.ok(fs.existsSync(file), route);

            const html = fs.readFileSync(file, 'utf8');
            assert.match(html, /<title>[^<]+<\/title>/, route);
            assert.match(html, /rel="canonical"/, route);
            assert.doesNotMatch(html, /id="loading"/, route);
            assert.match(html, /Company Registration Number: PV-00379338/, route);
        }
    } finally {
        fs.rmSync(output, { recursive: true, force: true });
    }
});
