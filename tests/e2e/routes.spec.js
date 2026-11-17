const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const routes = [...fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname);

for (const width of [390, 768, 1440, 1920]) {
test(`every sitemap route opens and reloads with assets at ${width}px`, async ({ page, baseURL }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    const failures = [];
    page.on('response', response => {
        if (response.url().startsWith(baseURL) && response.status() >= 400) failures.push(response.url());
    });
    page.on('requestfailed', request => {
        if (request.url().startsWith(baseURL) && request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url());
    });
    for (const route of routes) {
        const response = await page.goto(baseURL + route, { waitUntil: 'load' });
        expect(response.status(), route).toBe(200);
        await expect(page.locator('h1').first()).toBeVisible();
        await expect(page.locator('footer .footer-registration')).toContainText('PV-00379338');
        await expect(page.locator('html'), route).toHaveClass(/lenis/);
        await expect(page.locator('script[src$="vendor/lenis/lenis.min.js"]'), route).toHaveCount(1);
        expect(await page.reload({ waitUntil: 'load' }).then(response => response.status()), route).toBe(200);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
        await page.locator('footer').scrollIntoViewIfNeeded();
        const backToTop = page.getByRole('link', { name: 'Back to top', exact: true });
        await expect(backToTop, route).toHaveClass(/is-visible/);
        await expect(backToTop, route).toHaveCSS('background-color', 'rgb(244, 240, 230)');
        expect(await backToTop.evaluate(element => {
            const box = element.getBoundingClientRect();
            const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
            return element.contains(hit) && box.left >= 0 && box.bottom <= innerHeight;
        }), route).toBe(true);
    }
    expect(failures).toEqual([]);
});
}

test('legacy query URLs still render the requested route', async ({ page, baseURL }) => {
    await page.goto(baseURL + '/destinations/index.html?destination=ella');
    await expect(page.locator('h1')).toContainText('Ella');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/destinations\/ella.html$/);
    await page.goto(baseURL + '/tours/index.html?tour=highlights-escape');
    await expect(page.locator('h1')).toContainText('Highlights');
});
