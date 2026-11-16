const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const routes = [...fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname);

// Scroll every public page so lazy photos, footer and hero boundaries are checked.
for (const width of [390, 768, 1440, 1920]) {
    for (let start = 0; start < routes.length; start += 8) {
        test(`public page scroll audit at ${width}px group ${start / 8 + 1}`, async ({ page }) => {
            test.setTimeout(900000);
            await page.setViewportSize({ width, height: width === 768 ? 1024 : width === 390 ? 844 : 900 });
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
            const output = path.join(root, 'tests/local', process.env.DESIGN_CAPTURE_LABEL || 'design-polish');
            fs.mkdirSync(output, { recursive: true });
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            for (const route of routes.slice(start, start + 8)) {
                expect((await page.goto(route, { waitUntil: 'load' })).status(), route).toBe(200);
                await expect(page.locator('h1')).toBeVisible();
                const height = await page.evaluate(() => document.documentElement.scrollHeight);
                for (let top = 0; top < height; top += 650) {
                    await page.evaluate(y => window.scrollTo(0, y), top);
                    // Only visible photos are expected to load. Other carousel slides stay lazy.
                    await expect.poll(() => page.evaluate(() => [...document.images].filter(image => {
                        const box = image.getBoundingClientRect();
                        return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
                    }).filter(image => !image.complete || !image.naturalWidth).map(image => ({ src: image.currentSrc || image.src, parent: image.parentElement.className }))), { message: route + ' visible photos' }).toEqual([]);
                    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(width + 1);
                }
                await page.locator('footer').scrollIntoViewIfNeeded();
                await expect(page.locator('.footer-registration')).toContainText('PV-00379338');
                await page.evaluate(() => window.scrollTo(0, 0));
                const canvas = page.locator('.secondary-ambient-particles');
                if (await canvas.count()) {
                    const bounds = await canvas.evaluate(element => {
                        const hero = element.closest('#home, .secondary-editorial-hero, .tour-collection-hero');
                        return { canvas: element.getBoundingClientRect().bottom, hero: hero?.getBoundingClientRect().bottom };
                    });
                    expect(bounds.hero, route + ' ambient owner').toBeDefined();
                    expect(bounds.canvas, route + ' ambient boundary').toBeLessThanOrEqual(bounds.hero + 1);
                }
                const name = (route === '/' ? 'home' : route.slice(1).replace(/\.html$/, '').replaceAll('/', '-')) + '-' + width;
                await page.screenshot({ path: path.join(output, name + '-full.jpg'), fullPage: true, type: 'jpeg', quality: 65 });
            }
            expect(errors).toEqual([]);
        });
    }
}
