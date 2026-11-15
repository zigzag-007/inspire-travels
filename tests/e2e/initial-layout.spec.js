const { test, expect } = require('@playwright/test');

// The built document must start with the same hero the browser will render.
test('public secondary routes have their final layout before JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
        for (const [route, selector] of [
            ['/gallery.html', '#gallery-hero.secondary-editorial-hero'],
            ['/tours/collection-family.html', '#tour-collection .tour-collection-hero'],
            ['/tours/highlights-escape.html', '#tour-hero.secondary-editorial-hero'],
            ['/destinations/ella.html', '#dest-hero.secondary-editorial-hero']
        ]) {
            await page.goto(baseURL + route);
            await expect(page.locator(selector), route).toBeVisible();
            await expect(page.locator('h1')).toHaveCount(1);
        }
    } finally { await context.close(); }
});
