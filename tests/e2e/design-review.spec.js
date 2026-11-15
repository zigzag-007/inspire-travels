const { test, expect } = require('@playwright/test');
const path = require('node:path');

// Keep the isolated proposals usable before asking the owner to approve them.
for (const width of [390, 768, 1440]) {
    for (const name of ['home', 'tour']) {
        test(`${name} design proposal loads and supports keyboard use at ${width}px`, async ({ page, baseURL }) => {
            await page.setViewportSize({ width, height: width === 768 ? 1024 : width === 390 ? 844 : 900 });
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            const response = await page.goto(`${baseURL}/tests/design-review/${name}.html`);
            expect(response.status()).toBe(200);
            await expect(page.locator('h1')).toBeVisible();
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
            await page.evaluate(() => document.fonts.ready);
            for (const image of await page.locator('img').all()) {
                await expect(image).toHaveJSProperty('complete', true);
                expect(await image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
            await page.keyboard.press('Tab');
            await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
            expect(await page.locator(':focus').evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
            await page.keyboard.press('Enter');
            await expect(page.locator('main')).toBeFocused();
            if (name === 'home') {
                await expect(page.locator('.trip-card')).toHaveCount(3);
                const size = await page.locator('.trip-photo img').first().boundingBox();
                expect(size.width / size.height).toBeCloseTo(width < 640 ? 1.6 : 4 / 3, 1);
                for (const link of await page.getByRole('link', { name: 'See itinerary', exact: false }).all()) {
                    expect((await page.request.get(await link.getAttribute('href'))).status()).toBe(200);
                }
            } else {
                await expect(page.locator('.day-list li')).toHaveCount(5);
                await page.getByRole('link', { name: 'See the 5 day itinerary' }).click();
                await expect(page.locator('#itinerary')).toBeInViewport();
            }
            // Show the initial design after the separate keyboard checks above.
            await page.goto(`${baseURL}/tests/design-review/${name}.html`);
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
            await page.screenshot({ path: path.resolve(__dirname, `../design-review/screenshots/${name}-${width}.png`), fullPage: true });
            expect(errors).toEqual([]);
        });
    }
}
