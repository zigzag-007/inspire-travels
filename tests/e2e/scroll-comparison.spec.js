const { test, expect } = require('@playwright/test');
const path = require('node:path');

// The optional study must preserve the same controls in either scrolling mode.
for (const mode of ['native', 'lenis']) {
    for (const width of [390, 1440]) {
        test(`isolated ${mode} comparison preserves navigation at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto('/tests/design-review/scroll-comparison.html?mode=' + mode);
            await page.getByRole('link', { name: 'Coast', exact: true }).click();
            await expect(page).toHaveURL(/#coast$/);
            await expect.poll(() => page.locator('#coast').evaluate(element => {
                const gap = element.getBoundingClientRect().top - document.querySelector('.topbar').getBoundingClientRect().height;
                return Math.abs(gap - 16);
            })).toBeLessThan(3);
            await page.getByRole('link', { name: 'Continue to the highlands ↓', exact: true }).click();
            await expect(page).toHaveURL(/#highlands$/);
            await page.goBack();
            await expect(page).toHaveURL(/#coast$/);
            await page.getByRole('button', { name: 'Open planning panel', exact: true }).click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).not.toBeVisible();
            await expect(page.getByRole('button', { name: 'Open planning panel', exact: true })).toBeFocused();
            await page.getByRole('button', { name: 'Open planning panel', exact: true }).press('PageUp');
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.getByRole('link', { name: 'Back to top ↑', exact: true }).click();
            await expect(page).toHaveURL(/#top$/);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await page.screenshot({ path: path.resolve(__dirname, '../../.zigzag-tmp/comparison-' + mode + '-' + width + '.png') });
        });
    }
}
