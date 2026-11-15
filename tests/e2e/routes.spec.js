const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const routes = [...fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname);

for (const width of [390, 768, 1440]) {
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
        expect(await page.reload({ waitUntil: 'load' }).then(response => response.status()), route).toBe(200);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
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
