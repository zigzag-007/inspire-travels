const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('Netlify and Vercel use the same static route build and publish root', () => {
    const netlify = read('netlify.toml');
    const vercel = JSON.parse(read('vercel.json'));
    const netlifyCommand = netlify.match(/^\s*command\s*=\s*"([^"]+)"\s*$/m)?.[1];
    const netlifyPublish = netlify.match(/^\s*publish\s*=\s*"([^"]+)"\s*$/m)?.[1];

    assert.equal(netlifyCommand, 'node scripts/generate-search-pages.js');
    assert.equal(vercel.buildCommand, netlifyCommand);
    assert.equal(netlifyPublish, '.');
    assert.equal(vercel.outputDirectory, netlifyPublish);
    assert.equal(vercel.framework, null);
});

test('the shared build creates every tour and destination route in the sitemap', () => {
    const sitemap = read('sitemap.xml');
    const routePaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map(match => new URL(match[1]).pathname.slice(1))
        .filter(route => route.startsWith('tours/') || route.startsWith('destinations/'));
    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'inspire-deployment-build-'));

    try {
        const result = spawnSync(process.execPath, ['scripts/generate-search-pages.js', output], {
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
        }
    } finally {
        fs.rmSync(output, { recursive: true, force: true });
    }
});
