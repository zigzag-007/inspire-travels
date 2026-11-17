const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

// The note keeps its own serif heading while Nunito carries the body copy.
test('customizable package typography stays scoped and readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [390, 768, 1920]) {
        await page.setViewportSize({ width, height: 1080 });
        await page.goto('/');
        const heading = page.getByRole('heading', { name: 'Fully Customizable Packages', exact: true });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toHaveCSS('font-family', /Cormorant Garamond/);
        await expect(page.locator('.home-tour-customization p')).toHaveCSS('font-family', /Nunito/);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.fonts.check('600 36px "Cormorant Garamond"') && document.fonts.check('400 20px Nunito'))).toBe(true);
        const note = await page.locator('.home-tour-customization').evaluate(element => ({ width: element.clientWidth, scroll: element.scrollWidth }));
        expect(note.scroll).toBeLessThanOrEqual(note.width);
        await expect(page.locator('#offers-heading')).not.toHaveCSS('font-family', /Cormorant Garamond|Nunito/);
        await expect(page.locator('body')).toHaveCSS('font-family', /Nunito/);
        await page.screenshot({ path: test.info().outputPath('customization-' + width + '.png') });
        await page.locator('#destinations h2').scrollIntoViewIfNeeded();
        // Measure settled content rather than the offscreen entrance offset.
        await expect.poll(() => page.evaluate(() => {
            const text = document.querySelector('.home-tour-customization p').getBoundingClientRect();
            const next = document.querySelector('#destinations h2').getBoundingClientRect();
            return next.top - text.bottom;
        })).toBeLessThanOrEqual(145);
    }
});

// Destination copy needs its own surface rather than competing with photographs.
test('destination tiles keep readable copy and keyboard guide links', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [390, 768, 1920]) {
        await page.setViewportSize({ width, height: 1080 });
        await page.goto('/');
        const cards = page.locator('#destinations .home-destination-card');
        await expect(cards).toHaveCount(7);
        for (const card of await cards.all()) {
            await card.scrollIntoViewIfNeeded();
            const image = await card.locator('img').boundingBox();
            const title = await card.locator('h3').boundingBox();
            expect(title.y >= image.y + image.height - 1 || title.x >= image.x + image.width - 1).toBe(true);
            await expect(card.getByRole('link', { name: /Explore/ })).toHaveAttribute('href', /destinations\/.+\.html$/);
            expect(await card.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        }
        await cards.first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: test.info().outputPath('destinations-' + width + '.png') });
        await cards.first().getByRole('link', { name: /Explore/ }).focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/destinations\/sigiriya.html$/);
        await expect(page.locator('h1')).toContainText('Sigiriya');
    }
});

// A shared line must underline the label and chevron as one aligned control.
test('current dropdown triggers keep one connected active indicator', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/tours/collection-family.html');
    await page.evaluate(() => window.scrollTo(0, 1100));
    const trigger = page.locator('[data-desktop-menu="tours"] > .nav-link');
    await expect(trigger).toHaveAttribute('aria-current', 'page');
    await expect(trigger).toHaveCSS('text-decoration-line', 'none');
    const indicator = await trigger.evaluate(element => {
        const line = getComputedStyle(element, '::after');
        return { content: line.content, height: line.height, width: parseFloat(line.width) };
    });
    expect(indicator.content).toBe('""');
    expect(indicator.height).toBe('1px');
    expect(indicator.width).toBeGreaterThan(45);
    await trigger.hover();
    const panel = page.locator('[data-desktop-menu="tours"] .desktop-nav-dropdown');
    await expect(panel).toBeVisible();
    const header = await page.locator('#navbar').boundingBox();
    const dropdown = await panel.boundingBox();
    expect(dropdown.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
    await trigger.focus();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-current', 'page');
});

// The current section must be shared by desktop links and the phone drawer.
test('navigation follows visible sections and preserves secondary page categories', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const section of ['tours', 'about', 'reviews', 'home']) {
        await page.locator('#' + section).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 96, behavior: 'instant' }));
        const link = page.locator('.desktop-primary-nav .nav-link').filter({ hasText: new RegExp('^\\s*' + section + '\\s*$', 'i') });
        await expect(link).toHaveAttribute('aria-current', 'location');
        await expect(page.locator('.desktop-primary-nav [aria-current]')).toHaveCount(1);
    }
    await page.getByRole('link', { name: 'About', exact: true }).first().click();
    await expect(page.locator('.desktop-primary-nav a[href="#about"]')).toHaveAttribute('aria-current', 'location');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#about').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 96, behavior: 'instant' }));
    await page.getByRole('button', { name: 'Open mobile menu', exact: true }).click();
    await expect(page.locator('#mobile-menu [data-section="about"]')).toHaveAttribute('aria-current', 'location');
    await page.keyboard.press('Escape');
    for (const [route, category] of [['/tours/highlights-escape.html', 'tours'], ['/destinations/ella.html', 'destinations'], ['/gallery.html', 'gallery']]) {
        await page.goto(route);
        await expect(page.locator(`[data-desktop-menu="${category}"] > a`)).toHaveAttribute('aria-current', 'page');
    }
});

// Wide offers show their neighbours, while tour packages keep the existing grid.
test('offer carousel uses full width previews and tour cards keep Explore links', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [width, fullCards] of [[390, 1], [768, 1], [1024, 2], [1920, 3]]) {
        await page.setViewportSize({ width, height: 1080 });
        await page.goto('/');
        await page.locator('#offers').scrollIntoViewIfNeeded();
        const geometry = await page.locator('.offers-swiper').evaluate(element => {
            const box = element.getBoundingClientRect();
            const cards = [...element.querySelectorAll('.swiper-slide')].map(card => card.getBoundingClientRect());
            return { width: box.width, viewport: document.documentElement.clientWidth,
                full: cards.filter(card => card.left >= 0 && card.right <= document.documentElement.clientWidth).length,
                visible: cards.filter(card => card.right > 0 && card.left < document.documentElement.clientWidth).length };
        });
        expect(geometry.width / geometry.viewport).toBeCloseTo(width < 640 ? 0.86 : width < 992 ? 0.74 : 0.8, 1);
        expect(geometry.full, `${width}px complete cards`).toBe(fullCards);
        expect(geometry.visible, `${width}px edge previews`).toBe(fullCards + 2);
        // Exercise both loop boundaries, not just the initial arrangement.
        for (let turn = 0; turn < 15; turn += 1) {
            await page.locator('.offers-swiper').evaluate(element => element.swiper.slideNext(0));
            const visible = await page.locator('.offers-swiper').evaluate(element => [...element.querySelectorAll('.swiper-slide')].filter(card => {
                const box = card.getBoundingClientRect();
                return box.right > 0 && box.left < document.documentElement.clientWidth;
            }).length);
            expect(visible, `${width}px loop turn ${turn}`).toBe(fullCards + 2);
        }
        await expect(page.getByRole('button', { name: /Show (previous|next) offer/ })).toHaveCount(0);
        await expect(page.locator('.home-tour-action')).toHaveText(Array(6).fill('Explore'));
        await expect(page.locator('.home-tour-card-image img')).toHaveCount(6);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
});

// Dots share the pause boundary, and both enquiry inputs open one correct draft.
test('offer pagination focus pauses autoplay and card actions open one enquiry', async ({ page, context }) => {
    await context.route('https://api.whatsapp.com/**', route => route.fulfill({ status: 200, body: 'Enquiry draft' }));
    await page.goto('/');
    await page.locator('.offers-swiper').scrollIntoViewIfNeeded();
    await page.mouse.move(10, 20);
    await expect.poll(() => page.locator('.offers-swiper').evaluate(element => element.swiper.autoplay.running)).toBe(true);
    await page.locator('.offers-pagination button').first().focus();
    await expect.poll(() => page.locator('.offers-swiper').evaluate(element => element.swiper.autoplay.running)).toBe(false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.offers-swiper').evaluate(element => element.swiper.slideToLoop(2, 0));
    const card = page.locator('.offers-card').filter({ has: page.getByRole('heading', { name: 'White Water Adventure', exact: true }) });
    const opened = [];
    page.on('popup', popup => opened.push(popup));
    for (const activate of [() => card.locator('.offer-explore').click(), async () => { await card.focus(); await page.keyboard.press('Enter'); }]) {
        const popupPromise = page.waitForEvent('popup');
        await activate();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/api\.whatsapp\.com\/send\?phone=94785959333&text=.*Raft20/);
        await popup.close();
    }
    expect(opened).toHaveLength(2);
});

// Real autoplay must keep the preview cards filled when it wraps around.
test('offers autoplay keeps both edges filled through a complete cycle', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.locator('.offers-swiper').scrollIntoViewIfNeeded();
    await page.mouse.move(10, 20);
    for (let turn = 0; turn < 8; turn += 1) {
        const previous = await page.locator('.offers-swiper').evaluate(element => element.swiper.realIndex);
        await expect.poll(() => page.locator('.offers-swiper').evaluate(element => element.swiper.realIndex), { timeout: 8000 }).not.toBe(previous);
        await expect.poll(() => page.locator('.offers-swiper').evaluate(element => {
            const cards = [...element.querySelectorAll('.swiper-slide')].map(card => card.getBoundingClientRect());
            return Math.min(...cards.map(card => card.left)) <= 0 && Math.max(...cards.map(card => card.right)) >= document.documentElement.clientWidth;
        })).toBe(true);
    }
    await expect(page.getByRole('button', { name: /Pause slideshow/ })).toHaveCount(0);
});

// Input can arrive before Lenis has painted its first movement frame.
test('pointer input cancels a page jump before its first frame', async ({ page }) => {
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(false);
    const running = await page.evaluate(() => {
        window.NavigationModule.smoothScrollTo(800);
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        return window.NavigationModule.lenis.animate.isRunning;
    });
    expect(running).toBe(false);
});

// A blocked enhancement must leave ordinary browser navigation working.
test('missing Lenis keeps native scrolling and section navigation usable', async ({ page }) => {
    await page.route('**/assets/vendor/lenis/lenis.min.js', route => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Explore our tour packages', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(600);
    await page.getByRole('link', { name: 'Back to top', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});

// Wheel input should ease toward its target on every shared page template.
test('Lenis smooths wheel input without changing touch or reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const route of ['/', '/gallery.html', '/tours/collection-family.html', '/tours/highlights-escape.html', '/destinations/ella.html']) {
        await page.goto(route);
        await expect(page.locator('html'), route).toHaveClass(/lenis/);
        await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(false);
        await page.mouse.move(300, 400);
        await page.mouse.wheel(0, 900);
        await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isScrolling)).toBe('smooth');
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(20);
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(890);
        expect(await page.evaluate(() => window.NavigationModule.lenis.options.syncTouch)).toBe(false);
        expect(await page.evaluate(() => window.NavigationModule.lenis.options.lerp)).toBe(0.065);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.prefersReducedMotion)).toBe(true);
        await page.getByRole('link', { name: 'Back to top', exact: true }).click();
        await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
});

// A menu or photo viewer must stop the page, then release scrolling when closed.
test('Lenis respects mobile drawer and gallery lightbox scroll locks', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open mobile menu', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis?.isStopped)).toBe(true);
    const menuY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(menuY);
    await page.keyboard.press('Escape');
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(false);
    await page.getByRole('button', { name: /View Promo Codes/ }).click();
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(true);
    await page.getByRole('button', { name: 'Close promo modal', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(false);
    await page.goto('/gallery.html');
    await page.locator('#dynamic-gallery-grid .single-blog-post:visible').first().click();
    await expect(page.locator('.pswp')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.GalleryModule.pswp.opener.isOpen)).toBe(true);
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(true);
    const photoY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(photoY);
    await page.keyboard.press('Escape');
    await expect(page.locator('.pswp')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isStopped)).toBe(false);
});

// Long guest excerpts must fit each layout and keep their original source link.
test('all verified guest excerpts remain readable across screen sizes', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [390, 768, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('/');
        const names = new Set();
        for (let index = 0; index < 27; index += 1) {
            const name = await page.locator('#review-name').textContent();
            expect(names.has(name), `${width}px duplicate ${name}`).toBe(false);
            names.add(name);
            await expect(page.locator('#review-quote')).not.toBeEmpty();
            await expect(page.locator('#review-source')).toHaveAttribute('href', /google\.com\/maps\/contrib\//);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await page.locator('#review-next-preview').click();
        }
        await expect(page.locator('#review-name')).toHaveText('manish kundu');
    }
});

// Each generated tour must wire the shared keyboard controller, not just its markup.
test('every individual tour exposes all tabs through the keyboard', async ({ page }) => {
    const sitemap = fs.readFileSync(path.join(__dirname, '../../public/sitemap.xml'), 'utf8');
    const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname)
        .filter(route => route.startsWith('/tours/') && !route.includes('/collection-'));
    for (const route of routes) {
        await page.goto(route);
        await page.locator('#tab-btn-overview').focus();
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#tab-btn-options'), route).toBeFocused();
        await expect(page.locator('#tour-tab-panel-options'), route).toBeVisible();
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#tab-btn-details'), route).toBeFocused();
        await expect(page.locator('#tour-tab-panel-details'), route).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(page.locator('#tour-tab-panel-details'), route).toBeFocused();
    }
});

// Section links remain shareable and keep the browser's Back button useful.
test('section navigation records its anchor in browser history', async ({ page }) => {
    await page.goto('/');
    await page.locator('#navbar a[href="#tours"]').click();
    await expect(page).toHaveURL(/#tours$/);
    await page.locator('#navbar a[href="#about"]').click();
    await expect(page).toHaveURL(/#about$/);
    await page.goBack();
    await expect(page).toHaveURL(/#tours$/);
});

// Arrow keys change tabs without moving focus into unrelated enquiry buttons.
test('about and tour tabs support roving keyboard selection', async ({ page }) => {
    await page.goto('/');
    const mission = page.getByRole('tab', { name: 'Our Mission', exact: true });
    await page.getByRole('tab', { name: 'Our Story', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(mission).toBeFocused();
    await expect(mission).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: 'Our Story', exact: true })).toBeFocused();
    await page.goto('/tours/highlights-escape.html');
    await page.locator('#tab-btn-overview').focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#tab-btn-details')).toBeFocused();
    await expect(page.locator('#tour-tab-panel-details')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#tab-btn-overview')).toBeFocused();
    await expect(page.locator('#tour-tab-panel-overview')).toBeVisible();
});

// Wheel input should take control back immediately, on first and repeated returns.
test('back to top preserves its return and stops for user input', async ({ page }) => {
    await page.goto('/');
    for (let attempt = 0; attempt < 2; attempt += 1) {
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.getByRole('link', { name: 'Back to top', exact: true }).click();
        await page.waitForTimeout(400);
        await expect.poll(() => page.evaluate(() => window.NavigationModule.lenis.isScrolling)).toBe('smooth');
        expect(await page.evaluate(() => window.NavigationModule.scrollAnimationFrame)).toBeNull();
        expect(await page.evaluate(() => window.NavigationModule.lenis.animate.duration)).toBe(3.6);
        expect(await page.evaluate(() => window.NavigationModule.lenis.animate.easing(0.5))).toBeCloseTo(Math.pow(0.5, 2.85), 8);
        await page.mouse.wheel(0, 100);
        await expect.poll(() => page.evaluate(() => window.NavigationModule.scrollInputHandlers)).toBeNull();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('link', { name: 'Back to top', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});

// Keyboard visitors can bypass the repeated navigation and reach the page itself.
test('home and gallery offer a working skip link', async ({ page }) => {
    for (const route of ['/', '/gallery.html']) {
        await page.goto(route);
        const skip = page.getByRole('link', { name: 'Skip to main content', exact: true });
        await skip.focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('main')).toBeFocused();
    }
});

// An empty filter combination should explain the result and offer a way back.
test('gallery empty filters offer a clear reset and selected state', async ({ page }) => {
    await page.goto('/gallery.html');
    await page.locator('.gallery-filter-btn[data-category="offers"]').click();
    await page.locator('.gallery-year-btn[data-year="2025"]').click();
    await expect(page.locator('#gallery-filter-status')).toHaveText('No photos match these filters.');
    await expect(page.locator('.gallery-filter-btn[data-category="offers"]')).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Reset photo filters', exact: true }).click();
    await expect(page.locator('#gallery-filter-status')).toContainText(/\d+ photos/);
    await expect(page.locator('.gallery-filter-btn[data-category="all"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.gallery-year-btn[data-year="all"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.gallery-filter-btn[data-category="all"]')).toBeFocused();
});

// A delayed close must not hide a drawer that the visitor has already reopened.
test('rapid drawer reversal keeps its overlay visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open mobile menu', exact: true }).click();
    await page.evaluate(() => {
        window.MobileMenuModule.closeMobileMenu();
        window.MobileMenuModule.openMobileMenu();
    });
    await page.waitForTimeout(700);
    await expect(page.locator('#blur-overlay')).toBeVisible();
    await expect(page.locator('#mobile-menu-close')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu-btn')).toBeFocused();
});

// The arrow needs the same solid contrast over photos, paper and the footer.
test('back to top keeps a solid surface and a visible keyboard focus', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
    const control = page.getByRole('link', { name: 'Back to top', exact: true });
    await expect(control).toHaveClass(/is-visible/);
    await expect(control).toHaveCSS('background-color', 'rgb(244, 240, 230)');
    await expect(control).toHaveCSS('color', 'rgb(23, 62, 50)');
    await control.focus();
    await expect(control).toHaveCSS('outline-style', 'solid');
    expect(await control.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(3);
});

// Logo motion stays continuous under a pointer, while keyboard users can stop it.
test('hotel partners use two continuous rows with visible light logos', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#hotel-partners');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('[data-partner-row]')).toHaveCount(2);
    await expect(section.getByRole('button', { name: /pause/i })).toHaveCount(0);
    await expect(section.getByRole('link')).toHaveCount(8);
    await section.hover();
    await expect(section.locator('.hotel-partner-track').first()).toHaveCSS('animation-play-state', 'running');
    for (const logo of ['cinnamon.svg', 'jetwing.svg']) {
        const image = section.locator('img[src$="' + logo + '"]').first();
        await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
        await expect(image).toHaveCSS('filter', 'brightness(0)');
    }
    await section.getByRole('link').first().focus();
    await expect(section.locator('.hotel-partner-track').first()).toHaveCSS('animation-play-state', 'paused');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(section.locator('.hotel-partner-track').first()).toHaveCSS('animation-name', 'none');
    await expect(section.getByRole('link')).toHaveCount(8);
});

// Planning should help guests start an enquiry without moving decoration.
test('planning section offers useful enquiry paths without decorative motion', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#adventure');
    const photo = section.locator('.planning-photo img');
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(section.locator('h3')).toHaveCount(3);
    await expect(section.getByRole('link', { name: /Plan with us on WhatsApp/ })).toHaveAttribute('href', /phone=94785959333&text=/);
    await expect(section.getByRole('link', { name: /info@inspiretraveltours.com/ })).toHaveAttribute('href', /^mailto:info@inspiretraveltours.com/);
    await expect(section.locator('canvas, .grid-guide-line, #adventure-bg-parallax')).toHaveCount(0);
    for (const pseudo of ['::before', '::after']) {
        expect(await section.evaluate((element, value) => getComputedStyle(element, value).content, pseudo)).toBe('none');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const action = section.getByRole('link', { name: /Plan with us on WhatsApp/ });
    await action.hover();
    await expect(action).toHaveCSS('transform', 'none');
});

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
    await expect(page.locator('#review-name')).toHaveText('manish kundu');
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
        await expect(page.locator('#hotel-partners').getByRole('link')).toHaveCount(8);
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
