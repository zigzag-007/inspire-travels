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

        init: function() {
            this.navbar = document.getElementById('navbar');
            this.scrollProgress = document.getElementById('scroll-progress');

            this.initScrollEffects();
            this.initSmoothScrolling();
            this.initBackToTop();
        },

        // Initialize scroll effects (progress meter & scroll threshold toggle)
        initScrollEffects: function() {
            const updateNavigation = () => {
                const scrollY = window.scrollY;
                document.body.classList.toggle('secondary-shell-scrolled', scrollY > 40);

                const isTourCollection = document.body.classList.contains('tour-collection-view');
                document.body.classList.toggle('tour-collection-scrolled', isTourCollection && scrollY > 40);

                this.updateScrollProgress();
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

        updateScrollProgress: function() {
            if (!this.scrollProgress) return;

            const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollLimit > 0 ? Math.min((window.scrollY / scrollLimit) * 100, 100) : 0;
            this.scrollProgress.style.width = scrollPercent + '%';
        },

        stopSmoothScroll: function() {
            if (this.scrollAnimationFrame) {
                window.cancelAnimationFrame(this.scrollAnimationFrame);
                this.scrollAnimationFrame = null;
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

            const startY = window.scrollY || window.pageYOffset;
            const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const destinationY = Math.max(0, Math.min(targetY, maxScrollY));
            const distance = destinationY - startY;

            if (Math.abs(distance) < 5) return;

            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                window.scrollTo({ top: destinationY, left: 0, behavior: 'auto' });
                return;
            }

            const root = document.documentElement;
            this.restoreScrollBehavior = root.style.scrollBehavior;
            root.style.scrollBehavior = 'auto';

            let startTime = null;

            const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            // Starts slow, then builds speed in one continuous motion.
            const easeBackToTopRush = (t) => {
                return Math.pow(t, 2.85);
            };
            const easing = easingName === 'back-to-top-rush' ? easeBackToTopRush : easeInOutCubic;

            const step = (currentTime) => {
                if (!startTime) startTime = currentTime;
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
                    root.style.scrollBehavior = this.restoreScrollBehavior;
                    this.restoreScrollBehavior = null;
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

                const sectionHeight = targetElement.offsetHeight;
                const scrollPercentages = {
                    '#home': 0.00,
                    '#tours': 0.06,
                    '#about': 0.08,
                    '#gallery': 0.05,
                    '#adventure': 0.15,
                    '#reviews': 0.06,
                    '#contact': 0.00,
                    '#footer': 0.00
                };

                const scrollPercentage = scrollPercentages[targetId] || 0;
                const offsetTop = Math.max(0, targetElement.offsetTop - 100 + (sectionHeight * scrollPercentage));
                this.smoothScrollTo(offsetTop, 1000);
            }
        },

        // Initialize smooth scrolling
        initSmoothScrolling: function() {
            // Handle navigation clicks (ignore '#' and '.back-to-top' so back-to-top works cleanly)
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href === '#' || link.classList.contains('back-to-top')) return;

                link.addEventListener('click', (e) => {
                    e.preventDefault();
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
