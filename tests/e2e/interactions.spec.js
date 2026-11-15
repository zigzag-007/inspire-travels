const { test, expect } = require('@playwright/test');

// The video action must open a reel rather than the account profile.
test('the hero video action opens the verified guest reel', async ({ page, context }) => {
    await context.route('https://www.instagram.com/**', route => route.fulfill({ status: 200, body: 'Instagram video destination' }));
    await page.goto('/');
    const opened = page.waitForEvent('popup');
    await page.getByRole('button', { name: /Watch.*video/i }).click();
    const video = await opened;
    await expect(video).toHaveURL('https://www.instagram.com/reel/DZQBrKks1d1/');
    await video.close();
});

// Keep the card and enlarged poster tied to the same safari.
test('safari offers show the poster for their named park', async ({ page }) => {
    await page.goto('/');
    const offers = [
        ['Elephant Gathering Safari', 'Elephant Safari Offer', 4, 3],
        ['Yala Leopard Safari', 'Yala Leopard Safari Offer', 5, 2],
        ['Udawalawe Safari', 'Udawalawe Elephant Safari Offer', 6, 1]
    ];
    for (const [heading, alt, index, flyer] of offers) {
        const card = page.locator('.offers-card').filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
        await expect(card.getByRole('img', { name: alt, exact: true })).toHaveAttribute('src', new RegExp(`promo-flyer-${flyer}\\.png$`));
    }
    await page.getByRole('button', { name: /View Promo Codes/ }).click();
    for (const [heading, alt, index, flyer] of offers) {
        const poster = page.locator(`#promoCardStack [data-index="${index}"] img`);
        await expect.poll(async () => await poster.getAttribute('data-promo-src') || await poster.getAttribute('src')).toMatch(new RegExp(`promo-flyer-${flyer}\\.png$`));
    }
});

test('a failed modern image source falls back to its original format', async ({ page }) => {
    await page.route(/\.webp(?:\?|$)/, route => route.abort());
    await page.goto('/');
    const image = page.getByRole('img', { name: 'Sri Lanka Highlights Escape', exact: true });
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(image).not.toHaveAttribute('srcset');
});

// Exercise the existing controls with network services unavailable.
for (const width of [390, 768, 1440]) {
    test(`public interactions remain usable at ${width}px`, async ({ page, baseURL }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
        const errors = [];
        page.on('pageerror', error => { errors.push(error.message); console.log('Page error:', error.message); });
        await page.goto(baseURL + '/');
        await expect(page.locator('h1')).toBeVisible();
        if (width < 1024) {
            await page.getByRole('button', { name: 'Open mobile menu' }).click();
            await expect(page.locator('body')).toHaveClass(/mobile-menu-open/);
            await page.getByRole('button', { name: 'Close mobile menu' }).click();
            await expect(page.locator('body')).not.toHaveClass(/mobile-menu-open/);
        }
        await expect(page.locator('#promoCardStack img')).toHaveCount(0);
        await page.getByRole('button', { name: /View Promo Codes/ }).click();
        await expect(page.locator('#promoModal')).toBeVisible();
        await expect(page.locator('#promoCardStack img[src]')).toHaveCount(3);
        await expect(page.locator('#promoModalDots [aria-current="true"]')).toHaveCount(1);
        const firstLink = await page.locator('#promoModalWhatsappLink').getAttribute('href');
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#promoModalWhatsappLink')).not.toHaveAttribute('href', firstLink);
        await expect.poll(() => page.evaluate(() => window.PromoModule.swiper.animating)).toBe(false);
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('#promoModalWhatsappLink')).toHaveAttribute('href', firstLink);
        await expect.poll(() => page.evaluate(() => window.PromoModule.swiper.animating)).toBe(false);
        const card = await page.locator('#promoCardStack').boundingBox();
        await page.mouse.move(card.x + card.width * 0.8, card.y + card.height * 0.55);
        await page.mouse.down();
        await page.mouse.move(card.x + card.width * 0.2, card.y + card.height * 0.55, { steps: 15 });
        await page.mouse.up();
        await expect(page.locator('#promoModalWhatsappLink')).not.toHaveAttribute('href', firstLink);
        await expect.poll(() => page.evaluate(() => window.PromoModule.swiper.animating)).toBe(false);
        await page.locator('.swiper-slide-active [data-promo-zoom-index]').click();
        await expect(page.locator('.pswp')).toBeVisible();
        await expect.poll(() => page.evaluate(() => Boolean(window.pswp && window.pswp.opener.isOpen))).toBe(true);
        await page.locator('.pswp__button--close').click();
        await expect(page.locator('.pswp')).toHaveCount(0);
        await page.locator('#closePromoModal').click();
        await expect(page.locator('#promoModal')).toBeHidden();
        await page.locator('#hotel-partners').scrollIntoViewIfNeeded();
        await expect(page.locator('#hotel-partners img')).toHaveCount(8);
        await page.locator('footer').scrollIntoViewIfNeeded();
        await expect(page.locator('footer .footer-registration')).toBeVisible();
        await page.locator('.back-to-top').click();
        await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);

        await page.goto(baseURL + '/gallery.html');
        await page.locator('.gallery-filter-btn[data-category="nature"]').click();
        await expect(page.locator('#dynamic-gallery-grid .single-blog-post:visible').first()).toBeVisible();
        await page.locator('#dynamic-gallery-grid .single-blog-post:visible').first().click();
        await expect(page.locator('.pswp')).toBeVisible();
        await expect(page.locator('.pswp img[srcset]')).toHaveCount(0);
        await expect.poll(() => page.evaluate(() => Boolean(window.GalleryModule.pswp && window.GalleryModule.pswp.opener.isOpen))).toBe(true);
        await page.locator('.pswp__button--close').click();
        await expect(page.locator('.pswp')).toHaveCount(0);
        await page.locator('.gallery-filter-btn[data-category="all"]').click();

        await page.goto(baseURL + '/tours/highlights-escape.html');
        await page.locator('#tab-btn-details').click();
        await expect(page.locator('#tour-tab-panel-details')).toBeVisible();
        await page.locator('#tab-btn-options').click();
        await expect(page.locator('#tour-tab-panel-options')).toBeVisible();
        await page.locator('#tour-booking-form button[type="submit"]').click();
        await expect(page.locator('#form-guest-name')).toHaveAttribute('aria-invalid', 'true');
        await page.locator('#tab-btn-overview').click();
        await expect(page.locator('#tour-tab-panel-overview')).toBeVisible();
        await page.goto(baseURL + '/destinations/ella.html');
        await expect(page.locator('h1')).toContainText('Ella');
        await page.getByRole('link', { name: /Explore the guide/ }).click();
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
        await page.locator('.secondary-hero-breadcrumb a').first().click();
        await page.getByRole('link', { name: 'Explore Sigiriya travel guide and activities' }).click();
        await expect(page.locator('h1')).toContainText('Sigiriya');
        await expect(page).toHaveURL(/\/destinations\/sigiriya.html$/);
        await expect(page.locator('.whatsapp-float')).toBeVisible();
        expect(errors).toEqual([]);
    });
}
