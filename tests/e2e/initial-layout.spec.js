const { test, expect } = require('@playwright/test');
const path = require('node:path');

// Breadcrumbs must have their own space above every collection heading.
test('collection hero headings do not overlap their breadcrumbs', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [390, 768, 1366, 1920]) {
        await page.setViewportSize({ width, height: 768 });
        for (const slug of ['family', 'group', 'northern-shores', 'cultural-heritage', 'adventure']) {
            await page.goto('/tours/collection-' + slug + '.html');
            await page.evaluate(() => document.fonts.ready);
            const title = await page.locator('h1').boundingBox();
            const crumbs = await page.locator('.tour-collection-breadcrumb').boundingBox();
            expect(title.y, width + 'px ' + slug).toBeGreaterThanOrEqual(crumbs.y + crumbs.height + 16);
        }
    }
});

// Wide desktop headers should open out after scrolling without losing their links.
test('scrolled desktop header uses the wide boxed navigation layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ['/', '/gallery.html', '/tours/collection-family.html', '/tours/highlights-escape.html', '/destinations/ella.html']) {
        await page.goto(route);
        const before = await page.locator('#navbar .secondary-brand').boundingBox();
        await page.evaluate(() => window.scrollTo(0, 1100));
        await expect(page.locator('body')).toHaveClass(/secondary-shell-scrolled/);
        // The scroll observer and browser layout finish on separate frames.
        await expect.poll(async () => (await page.locator('#navbar .secondary-brand').boundingBox()).x).toBeLessThan(160);
        const after = await page.locator('#navbar .secondary-brand').boundingBox();
        expect(after.x, route).toBeLessThan(160);
        expect(after.x, route).toBeLessThan(before.x);
        await expect(page.locator('#navbar')).toHaveCSS('background-color', 'rgb(255, 253, 247)');
        await expect(page.locator('#navbar .secondary-contact-action')).toHaveCSS('border-radius', '0px');
        await expect(page.locator('#navbar .nav-link').first()).toHaveCSS('text-transform', 'uppercase');
        for (const link of await page.locator('#navbar .nav-link').all()) {
            const current = await link.getAttribute('aria-current');
            await expect(link).toHaveCSS('color', current ? 'rgb(118, 91, 43)' : 'rgb(24, 59, 48)');
            await expect(link).toHaveCSS('text-decoration-line', 'none');
            if (current) expect(await link.evaluate(element => getComputedStyle(element, '::after').height)).toBe('1px');
        }
        await page.locator('#navbar .desktop-nav-trigger').first().focus();
        await expect(page.locator('#navbar .desktop-nav-dropdown').first()).toBeVisible();
        await page.keyboard.press('Escape');
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect(page.locator('body')).not.toHaveClass(/secondary-shell-scrolled/);
    }
});

// Keep the wider layout useful at laptop widths as well as the owner's desktop.
test('desktop content grid and navigation fit their intended widths', async ({ page }) => {
    for (const width of [1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1080 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        await page.locator('#offers').scrollIntoViewIfNeeded();
        const layout = await page.evaluate(() => {
            const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
            return { brand: box('#navbar .secondary-brand'), menu: box('#navbar .desktop-primary-nav'),
                contact: box('#navbar .secondary-contact-action'),
                containers: [...document.querySelectorAll('.site-content-container')].map(e => e.getBoundingClientRect().width),
                width: document.documentElement.scrollWidth };
        });
        expect(layout.brand.right).toBeLessThanOrEqual(layout.menu.left);
        expect(layout.menu.right).toBeLessThanOrEqual(layout.contact.left);
        expect(layout.contact.right).toBeLessThan(width);
        expect(layout.width).toBeLessThanOrEqual(width);
        if (width === 1920) {
            expect(layout.containers).toHaveLength(7);
            for (const size of layout.containers) expect(size).toBe(1480);
            for (const section of ['offers', 'about', 'gallery', 'tours']) {
                await page.locator('#' + section).evaluate(element => window.scrollTo(0, element.offsetTop - 80));
                // Let the scroll observer finish before recording the composed section.
                await page.waitForTimeout(1500);
                await expect.poll(() => page.evaluate(() => [...document.images].filter(image => {
                    const box = image.getBoundingClientRect();
                    return box.width && box.height && box.top < innerHeight && box.bottom > 0 && box.left < innerWidth && box.right > 0;
                }).every(image => image.complete && image.naturalWidth > 0))).toBe(true);
                await page.screenshot({ path: path.join(__dirname, '../../.zigzag-tmp/wide-' + section + '.png') });
            }
        }
    }
});

// Check the restored homepage rhythm with the same phone, tablet and desktop sizes.
test('homepage hero and partner rows stay balanced across widths', async ({ page }) => {
    for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1440, 900]]) {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        const hero = page.locator('#home');
        await expect(page.locator('.home-hero-title')).toBeVisible();
        const geometry = await hero.evaluate(element => ({
            height: element.getBoundingClientRect().height,
            width: document.documentElement.scrollWidth,
            heading: element.querySelector('h1').getBoundingClientRect().toJSON()
        }));
        expect(geometry.height).toBeGreaterThanOrEqual(height);
        expect(geometry.width).toBeLessThanOrEqual(width);
        expect(geometry.heading.left).toBeGreaterThanOrEqual(0);
        expect(geometry.heading.right).toBeLessThanOrEqual(width);
        for (const control of await hero.getByRole('button').all()) {
            const bounds = await control.boundingBox();
            expect(bounds.x).toBeGreaterThanOrEqual(0);
            expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        }
        await page.screenshot({ path: path.join(__dirname, '../../.zigzag-tmp/hero-' + width + '.png') });
        for (const selector of ['#tours', '#adventure', '#hotel-partners']) {
            await page.locator(selector).scrollIntoViewIfNeeded();
            await page.locator(selector).screenshot({ path: path.join(__dirname, '../../.zigzag-tmp/' + selector.slice(1) + '-' + width + '.png') });
        }
        for (const image of await page.locator('#hotel-partners img').all()) {
            await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
            await expect(image).toHaveCSS('filter', /brightness\(0\)|grayscale\(1\) contrast\(4\)/);
        }
        await expect(page.locator('#hotel-partners').getByRole('link')).toHaveCount(8);
    }
});

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
