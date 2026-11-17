// Navigation Module - Clean, Modern & Universal
// Author: Zig Zag AI
// Description: Handles scroll progress, back to top, and smooth scroll across all pages

(function() {
    'use strict';

    window.NavigationModule = {
        navbar: null,
        scrollProgress: null,
        scrollAnimationFrame: null,
        restoreScrollBehavior: null,
        scrollInputHandlers: null,
        lenis: null,

        init: function() {
            this.navbar = document.getElementById('navbar');
            this.scrollProgress = document.getElementById('scroll-progress');

            this.initLenis();
            this.initActiveNavigation();
            this.initScrollEffects();
            this.initSmoothScrolling();
            this.initBackToTop();
        },

        // One local scroll owner eases wheels while touch stays with the browser.
        initLenis: function() {
            if (!window.Lenis || this.lenis) return;
            this.lenis = new window.Lenis({
                autoRaf: true,
                lerp: 0.065,
                smoothWheel: true,
                syncTouch: false,
                anchors: false,
                respectReducedMotion: true,
                prevent: node => Boolean(node.closest('#mobile-menu, #promoModal, #tourModal, .pswp, [role="dialog"], textarea, select, [data-lenis-prevent]')),
                virtualScroll: ({ event }) => {
                    // Release a page jump before Lenis takes the next wheel gesture.
                    if (this.scrollInputHandlers) this.stopSmoothScroll();
                    return !event.ctrlKey && !event.shiftKey;
                }
            });
            const syncLocks = () => {
                if (this.isScrollLocked()) {
                    this.stopSmoothScroll();
                    this.lenis.stop();
                } else {
                    this.lenis.start();
                }
            };
            // Watch the existing locks, including PhotoSwipe's direct body overlay.
            const locks = new MutationObserver(syncLocks);
            locks.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'], childList: true });
            locks.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
            document.addEventListener('visibilitychange', syncLocks);
            window.addEventListener('keydown', event => this.stopForScrollInput(event), true);
            window.addEventListener('pointerdown', event => this.stopForScrollInput(event), true);
            syncLocks();
        },

        // Read the site's explicit locks, not the overflow class Lenis adds itself.
        isScrollLocked: function() {
            return document.hidden || document.body.classList.contains('mobile-menu-open') ||
                document.body.classList.contains('overflow-hidden') ||
                /hidden|clip/.test(document.body.style.overflow) ||
                /hidden|clip/.test(document.documentElement.style.overflow) ||
                Boolean(document.querySelector('.pswp'));
        },

        // Keyboard movement and pointer input must take control without fighting inertia.
        stopForScrollInput: function(event) {
            const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'];
            if (event.type === 'keydown' && !scrollKeys.includes(event.key)) return;
            if (event.type === 'keydown' && (event.ctrlKey || event.metaKey || event.altKey)) return;
            const target = event.target;
            if (event.type === 'keydown' && target && (
                target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
            )) return;
            this.stopSmoothScroll();
        },

        // Initialize scroll effects (progress meter & scroll threshold toggle)
        initScrollEffects: function() {
            const updateNavigation = () => {
                const scrollY = window.scrollY;
                document.body.classList.toggle('secondary-shell-scrolled', scrollY > 40);

                const isTourCollection = document.body.classList.contains('tour-collection-view');
                document.body.classList.toggle('tour-collection-scrolled', isTourCollection && scrollY > 40);

                this.updateScrollProgress();
                this.updateActiveNavigation();
            };

            let ticking = false;
            const onScrollUpdateNavigation = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateNavigation();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            window.addEventListener('scroll', onScrollUpdateNavigation, { passive: true });
            
            // Initial state
            updateNavigation();
            window.addEventListener('load', updateNavigation);
            window.addEventListener('resize', updateNavigation);
        },

        // Desktop and drawer controls share one section decision.
        initActiveNavigation: function() {
            this.navSections = ['home', 'tours', 'destinations', 'about', 'gallery', 'reviews', 'footer']
                .map(id => document.getElementById(id)).filter(Boolean);
            this.navItems = [...document.querySelectorAll('.desktop-primary-nav .nav-link, #navbar .secondary-contact-action, #mobile-menu [data-section]')]
                .map(element => {
                    const menu = element.closest('[data-desktop-menu]');
                    const href = element.getAttribute('href') || '';
                    const key = element.dataset.section || (menu && menu.dataset.desktopMenu) ||
                        (href.includes('gallery.html') ? 'gallery' : href.split('#')[1]);
                    return { element, key };
                });
        },

        // Use real section positions so tall sections and image loading stay accurate.
        updateActiveNavigation: function() {
            if (!this.navItems) return;
            const fixed = document.body.dataset.currentNav;
            let active = fixed || 'home';
            if (!fixed) {
                const boundary = (this.navbar ? this.navbar.getBoundingClientRect().height : 80) + 24;
                this.navSections.forEach(section => {
                    if (section.getBoundingClientRect().top <= boundary) active = section.id;
                });
            }
            if (this.activeNavSection === active) return;
            this.activeNavSection = active;
            this.navItems.forEach(({ element, key }) => {
                const current = key === active;
                element.classList.remove('text-accent');
                element.classList.toggle('active-mobile-nav', current && element.closest('#mobile-menu') !== null);
                if (current) element.setAttribute('aria-current', fixed ? 'page' : 'location');
                else element.removeAttribute('aria-current');
            });
        },

        updateScrollProgress: function() {
            if (!this.scrollProgress) return;

            const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollLimit > 0 ? Math.min((window.scrollY / scrollLimit) * 100, 100) : 0;
            this.scrollProgress.style.width = scrollPercent + '%';
        },

        // Keep section targets clear of the sticky navigation bar.
        getScrollTargetY: function(targetElement) {
            const navbar = document.getElementById('navbar');
            const headerOffset = navbar ? navbar.getBoundingClientRect().height + 16 : 100;
            return Math.max(0, targetElement.getBoundingClientRect().top + window.scrollY - headerOffset);
        },

        stopSmoothScroll: function() {
            if (this.lenis && !this.lenis.isStopped) {
                // Reset even when input arrives before the first movement frame.
                this.lenis.stop();
                this.lenis.start();
            }
            if (this.scrollAnimationFrame) {
                window.cancelAnimationFrame(this.scrollAnimationFrame);
                this.scrollAnimationFrame = null;
            }

            if (this.scrollInputHandlers) {
                this.scrollInputHandlers.forEach(function(handler) {
                    window.removeEventListener(handler.type, handler.callback, handler.options);
                });
                this.scrollInputHandlers = null;
            }

            if (this.restoreScrollBehavior !== null) {
                document.documentElement.style.scrollBehavior = this.restoreScrollBehavior;
                this.restoreScrollBehavior = null;
            }
        },

        // Smooth scrolling for navigation links
        // Own the animation so global CSS smooth scrolling cannot fight each frame.
        smoothScrollTo: function(targetY, duration = 1000, easingName = 'cubic') {
            this.stopSmoothScroll();

            if (this.lenis && this.isScrollLocked()) return;

            const startY = window.scrollY || window.pageYOffset;
            const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const destinationY = Math.max(0, Math.min(targetY, maxScrollY));
            const distance = destinationY - startY;

            if (Math.abs(distance) < 5) return;

            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                if (this.lenis) this.lenis.scrollTo(destinationY, { immediate: true });
                else window.scrollTo({ top: destinationY, left: 0, behavior: 'auto' });
                return;
            }

            const root = document.documentElement;
            this.restoreScrollBehavior = root.style.scrollBehavior;
            root.style.scrollBehavior = 'auto';

            // Stop automatic movement before the browser handles the visitor's scroll input.
            const stopForScrollKey = event => this.stopForScrollInput(event);
            this.scrollInputHandlers = [
                { type: 'wheel', callback: stopForScrollKey, options: { passive: true } },
                { type: 'touchstart', callback: stopForScrollKey, options: { passive: true } },
                { type: 'pointerdown', callback: stopForScrollKey, options: { passive: true } },
                { type: 'keydown', callback: stopForScrollKey, options: true }
            ];
            this.scrollInputHandlers.forEach((handler) => {
                window.addEventListener(handler.type, handler.callback, handler.options);
            });

            let startTime = null;

            const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            // Starts slow, then builds speed in one continuous motion.
            const easeBackToTopRush = (t) => {
                return Math.pow(t, 2.85);
            };
            const easing = easingName === 'back-to-top-rush' ? easeBackToTopRush : easeInOutCubic;

            // Preserve the approved timing without running a second position animator.
            if (this.lenis) {
                this.lenis.scrollTo(destinationY, {
                    duration: duration / 1000,
                    lerp: 0,
                    easing: easing,
                    onComplete: () => {
                        this.stopSmoothScroll();
                        window.dispatchEvent(new Event('scroll'));
                    }
                });
                return;
            }

            const step = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easing(progress);

                window.scrollTo({
                    top: startY + distance * ease,
                    left: 0,
                    behavior: 'auto'
                });

                if (progress < 1) {
                    this.scrollAnimationFrame = window.requestAnimationFrame(step);
                } else {
                    window.scrollTo({ top: destinationY, left: 0, behavior: 'auto' });
                    this.scrollAnimationFrame = null;
                    this.stopSmoothScroll();
                    window.dispatchEvent(new Event('scroll'));
                }
            };

            this.scrollAnimationFrame = window.requestAnimationFrame(step);
        },

        smoothScroll: function(targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (targetId === '#home') {
                    this.smoothScrollTo(0, 1000);
                    return;
                }

                const offsetTop = this.getScrollTargetY(targetElement);
                this.smoothScrollTo(offsetTop, 1000);
            }
        },

        // Initialize smooth scrolling
        initSmoothScrolling: function() {
            // Browser history takes over without an old animation pulling it away.
            window.addEventListener('popstate', () => this.stopSmoothScroll());
            window.addEventListener('hashchange', () => this.stopSmoothScroll());
            // Handle navigation clicks (ignore '#' and '.back-to-top' so back-to-top works cleanly)
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href === '#' || link.classList.contains('back-to-top') || link.hasAttribute('data-skip-link')) return;

                link.addEventListener('click', (e) => {
                    if (!document.querySelector(href)) return;
                    e.preventDefault();
                    if (window.location.hash !== href) window.history.pushState(null, '', href);
                    this.smoothScroll(href);
                });
            });

            // Add scroll-to-top functionality when clicking logo
            const logoLink = document.querySelector('a[href="#home"], a[href="index.html#home"]');
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                        e.preventDefault();
                        NavigationModule.smoothScrollTo(0, 1200);
                    }
                });
            }
        },

        // Initialize back to top functionality
        initBackToTop: function() {
            const btn = document.querySelector('.back-to-top');
            if (!btn) return;

            const self = this;
            let isVisible = false;

            const setButtonVisibility = (visible) => {
                btn.classList.toggle('is-visible', visible);
                btn.setAttribute('aria-hidden', visible ? 'false' : 'true');
            };

            const updateBackToTop = () => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const shouldShow = scrollTop > 600;

                if (shouldShow && !isVisible) {
                    isVisible = true;
                    setButtonVisibility(true);
                } else if (!shouldShow && isVisible) {
                    isVisible = false;
                    setButtonVisibility(false);
                }
            };

            let ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateBackToTop();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            updateBackToTop();

            btn.addEventListener('click', function(event) {
                event.preventDefault();
                self.smoothScrollTo(0, 3600, 'back-to-top-rush');
            });
        }
    };
})();
