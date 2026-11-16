const { test, expect } = require('@playwright/test');

// Removing decorative numbers must leave enough room for collection names.
test('collection links keep a readable text column', async ({ page }) => {
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/tours/collection-family.html');
        const sizes = await page.locator('.tour-collection-link').first().evaluate(element => ({
            card: element.getBoundingClientRect().width,
            copy: element.querySelector('.tour-collection-link-copy').getBoundingClientRect().width
        }));
        expect(sizes.copy).toBeGreaterThan(sizes.card * 0.55);
    }
});

// A blocked profile photo must not leave a broken image beside the guest's name.
test('review names remain usable when external avatars fail', async ({ page }) => {
    await page.route('https://lh3.googleusercontent.com/**', route => route.abort());
    await page.goto('/');
    await page.locator('#review-card').scrollIntoViewIfNeeded();
    await expect(page.locator('#review-avatar')).toBeHidden();
    await expect(page.locator('#review-name')).toHaveText('Vivaan Shenoy');
});

// The footer gradient should span the section without repeating in small tiles.
test('dark brand sections use a continuous background', async ({ page }) => {
    await page.goto('/');
    const background = await page.locator('.gowilds-footer').first().evaluate(element => ({
        size: getComputedStyle(element).backgroundSize,
        repeat: getComputedStyle(element).backgroundRepeat
    }));
    expect(background).toEqual({ size: '100% 100%', repeat: 'no-repeat' });
});

// A historic cannon is a museum subject, and its photo must work by keyboard.
test('footer photo labels describe the actual subjects', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Experience thrilling cannon cart rides through scenic landscapes.', { exact: true })).toHaveCount(0);
    const cannon = page.getByRole('button', { name: 'Open photo: Historic cannon', exact: true }).first();
    await cannon.scrollIntoViewIfNeeded();
    await cannon.evaluate(element => element.focus());
    await page.keyboard.press('Enter');
    await expect(page.locator('.pswp')).toBeVisible();
    await expect(page.locator('.pswp h4')).toHaveText('Historic cannon');
});

// Reduced motion removes entry delays as well as movement.
test('reduced motion shows hero copy without animation delays', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCSS('transition-delay', '0s');
    await expect(page.locator('h1')).toHaveCSS('opacity', '1');
});

// Removing decorative numbering must leave the guide's text column full width.
test('destination history keeps a readable column', async ({ page }) => {
    for (const width of [768, 1440]) {
        await page.setViewportSize({ width, height: 1024 });
        await page.goto('/destinations/ella.html');
        const widths = await page.evaluate(() => ({
            history: document.querySelector('#dest-history-text').getBoundingClientRect().width,
            story: document.querySelector('#overview').getBoundingClientRect().width
        }));
        expect(widths.history).toBeGreaterThan(widths.story * 0.6);
    }
});

// A photo that opens with a pointer must also open with Enter.
test('home and archive photos open from the keyboard', async ({ page }) => {
    for (const route of ['/', '/gallery.html']) {
        await page.goto(route);
        const card = page.locator('#gallery .single-blog-post:visible, #dynamic-gallery-grid .single-blog-post:visible').first();
        await card.scrollIntoViewIfNeeded();
        await card.evaluate(element => element.focus());
        expect(await card.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
        await page.keyboard.press('Enter');
        await expect(page.locator('.pswp')).toBeVisible();
        // PhotoSwipe ignores Escape until its opening transition has finished.
        await expect.poll(() => page.evaluate(() => Boolean(window.GalleryModule.pswp && window.GalleryModule.pswp.opener.isOpen))).toBe(true);
        await page.keyboard.press('Escape');
        await expect(page.locator('.pswp')).toHaveCount(0);
    }
});

// A single background photo needs no empty portrait frame over its action.
test('single image heroes keep captions below their actions', async ({ page }) => {
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of ['/tours/highlights-escape.html', '/destinations/ella.html', '/destinations/arugambay.html', '/destinations/colombo.html']) {
            await page.goto(route);
            await expect(page.locator('.secondary-hero-portrait')).toHaveCount(0);
            const action = await page.locator('.secondary-hero-action').boundingBox();
            const note = await page.locator('.secondary-hero-note').boundingBox();
            expect(note.y).toBeGreaterThanOrEqual(action.y + action.height);
            const facts = await page.locator('.secondary-facts-dock').boundingBox();
            expect(note.y + note.height, route + ' note clears quick facts').toBeLessThanOrEqual(facts.y);
        }
    }
});

// The closed drawer stays outside keyboard navigation, and Escape returns focus.
test('mobile navigation contains keyboard focus while open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['/', '/tours/highlights-escape.html', '/destinations/ella.html', '/gallery.html']) {
        await page.goto(route);
        const menu = page.locator('#mobile-menu');
        const opener = page.getByRole('button', { name: 'Open mobile menu', exact: true });
        const closer = page.locator('#mobile-menu-close');
        await closer.evaluate(element => element.focus());
        await expect(closer).not.toBeFocused();
        await opener.click();
        await expect(closer).toBeFocused();
        await page.keyboard.press('Tab');
        await expect.poll(() => menu.evaluate(element => element.contains(document.activeElement))).toBe(true);
        await page.keyboard.press('Escape');
        await expect(opener).toBeFocused();
        await expect(menu).toHaveAttribute('aria-hidden', 'true');
    }
});

// The brand palette must stay readable when a visitor's system uses dark mode.
test('light sections retain their brand palette in dark system mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const light = await page.locator('#offers').evaluate(element => getComputedStyle(element).backgroundColor);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => page.locator('#offers').evaluate(element => getComputedStyle(element).backgroundColor)).toBe(light);
});

// Photos must not promise a stop missing from this five day route.
test('Highlights photos do not add Sigiriya to its itinerary', async ({ page }) => {
    await page.goto('/tours/highlights-escape.html');
    await expect(page.locator('#tour-gallery img[alt*="Sigiriya"]')).toHaveCount(0);
    await expect(page.getByText('Real guest moments and iconic landmarks included in this itinerary', { exact: true })).toHaveCount(0);
});

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
    const image = page.locator('.home-tour-comparison-card').filter({ has: page.getByRole('heading', { name: 'Sri Lanka Highlights Escape', exact: true }) }).getByRole('img');
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
