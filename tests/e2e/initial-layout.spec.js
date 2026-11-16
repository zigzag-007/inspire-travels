const { test, expect } = require('@playwright/test');

// Keep the separate guest portrait from being replaced by the backdrop.
test('collection heroes retain their separate guest portrait', async ({ page }) => {
    await page.goto('/tours/collection-family.html');
    const background = await page.locator('.tour-collection-hero-background img').getAttribute('src');
    const portrait = page.locator('.tour-collection-portrait-frame img');
    await expect(portrait).not.toHaveAttribute('src', background);
    await expect.poll(() => portrait.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
});

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

// The archive must not expand an empty page after its decoration is painted.
test('gallery photos exist before JavaScript and load lazily', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
        await page.goto(baseURL + '/gallery.html');
        const photos = page.locator('#dynamic-gallery-grid .single-blog-post img');
        await expect(photos.first()).toBeAttached();
        expect(await photos.count()).toBeGreaterThan(40);
        expect(await photos.evaluateAll(images => images.every(image => image.loading === 'lazy'))).toBe(true);
    } finally { await context.close(); }
});

// The browser can request the right hero before parsing scripts and body content.
test('secondary pages preload the same responsive hero they display', async ({ page }) => {
    for (const route of ['/gallery.html', '/tours/highlights-escape.html', '/destinations/ella.html', '/tours/collection-family.html']) {
        await page.goto(route);
        const image = page.locator('.secondary-hero-background img, .tour-collection-hero-background img');
        const preload = page.locator('head link[rel="preload"][as="image"]');
        await expect(preload).toHaveCount(1);
        await expect(preload).toHaveAttribute('imagesrcset', await image.getAttribute('srcset'));
        await expect(preload).toHaveAttribute('imagesizes', '100vw');
        await expect(image).toHaveAttribute('sizes', '100vw');
    }
});
