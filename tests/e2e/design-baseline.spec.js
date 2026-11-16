const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const routes = [...fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname);
const output = path.join(root, 'tests/local', process.env.DESIGN_CAPTURE_LABEL || 'design-baseline');

// Save the same first screen and useful geometry for every current public route.
for (const width of [390, 768, 1440]) {
    test(`record public route baseline at ${width}px`, async ({ page, baseURL }) => {
        await page.setViewportSize({ width, height: width === 768 ? 1024 : width === 390 ? 844 : 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
        fs.mkdirSync(output, { recursive: true });
        const records = [];
        for (const route of routes) {
            const response = await page.goto(baseURL + route, { waitUntil: 'load' });
            expect(response.status(), route).toBe(200);
            await expect(page.locator('h1').first()).toBeVisible();
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(300);
            const geometry = await page.evaluate(() => ({
                viewport: { width: innerWidth, height: innerHeight },
                documentWidth: document.documentElement.scrollWidth,
                heading: document.querySelector('h1').textContent.trim(),
                title: document.title,
                canonical: document.querySelector('link[rel="canonical"]')?.href,
                mainTop: document.querySelector('main')?.getBoundingClientRect().top,
                heroBottom: document.querySelector('.secondary-editorial-hero, #home')?.getBoundingClientRect().bottom
            }));
            expect(geometry.documentWidth, route).toBeLessThanOrEqual(width + 1);
            const name = (route === '/' ? 'home' : route.slice(1).replace(/\.html$/, '').replaceAll('/', '-')) + '-' + width;
            await page.screenshot({ path: path.join(output, name + '.jpg'), type: 'jpeg', quality: 80 });
            records.push({ route, ...geometry, screenshot: name + '.jpg' });
        }
        fs.writeFileSync(path.join(output, 'routes-' + width + '.json'), JSON.stringify(records, null, 2));
    });
}
