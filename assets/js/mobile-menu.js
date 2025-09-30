// Mobile Menu Module - Handles mobile menu functionality
// Author: Zig Zag AI
// Description: Manages mobile menu open/close functionality and keyboard navigation

(function() {
    'use strict';

    window.MobileMenuModule = {
        mobileMenuBtn: null,
        mobileMenu: null,
        mobileMenuClose: null,
        blurOverlay: null,
        mobileNavLinks: null,

        init: function() {
            this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.mobileMenuClose = document.getElementById('mobile-menu-close');
            this.blurOverlay = document.getElementById('blur-overlay');
            this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

            this.initEventListeners();
        },

        initEventListeners: function() {
            // Toggle menu when clicking hamburger button
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close button functionality
            if (this.mobileMenuClose) {
                this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
            }

            // Click overlay to close
            if (this.blurOverlay) {
                this.blurOverlay.addEventListener('click', () => this.closeMobileMenu());
            }

            // Close mobile menu when clicking on nav links
            if (this.mobileNavLinks) {
                this.mobileNavLinks.forEach(link => {
                    link.addEventListener('click', () => this.closeMobileMenu());
                });
            }

            // Keyboard navigation support
            this.initKeyboardSupport();

            // Active section highlighting
            this.initActiveSectionHighlighting();
        },

        // Check if menu is currently open
        isMenuOpen: function() {
            return this.mobileMenu && this.mobileMenu.classList.contains('translate-x-0');
        },

        // Toggle menu open/close
        toggleMobileMenu: function() {
            if (this.isMenuOpen()) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },

        openMobileMenu: function() {
            if (this.mobileMenu) {
                // Force hardware acceleration with translate3d
                this.mobileMenu.style.transform = 'translate3d(0, 0, 0)';
                this.mobileMenu.classList.remove('-translate-x-full');
                this.mobileMenu.classList.add('translate-x-0');
            }
            if (this.blurOverlay) {
                this.blurOverlay.classList.remove('hidden', 'opacity-0');
                // Trigger reflow for smooth animation
                void this.blurOverlay.offsetWidth;
                this.blurOverlay.classList.add('opacity-100');
            }
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        },

        closeMobileMenu: function() {
            if (this.mobileMenu) {
                // Force hardware acceleration with translate3d
                this.mobileMenu.style.transform = 'translate3d(-100%, 0, 0)';
                this.mobileMenu.classList.remove('translate-x-0');
                this.mobileMenu.classList.add('-translate-x-full');
            }
            if (this.blurOverlay) {
                this.blurOverlay.classList.remove('opacity-100');
                this.blurOverlay.classList.add('opacity-0');
                // Delay hiding to match new 600ms transition duration
                setTimeout(() => {
                    this.blurOverlay.classList.add('hidden');
                }, 600);
            }
            document.body.style.overflow = ''; // Restore scrolling
        },

        // Keyboard navigation support
        initKeyboardSupport: function() {
            document.addEventListener('keydown', (e) => {
                // Close mobile menu with Escape key
                if (e.key === 'Escape' && this.mobileMenu && !this.mobileMenu.classList.contains('-translate-x-full')) {
                    this.closeMobileMenu();
                }
            });
        },

        // Active section highlighting with optimized performance
        initActiveSectionHighlighting: function() {
            const sections = ['home', 'tours', 'about', 'gallery', 'adventure', 'reviews', 'footer'];
            const navLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link[data-section]');
            let ticking = false; // RAF throttle flag

            const highlightActiveSection = () => {
                const scrollPosition = window.scrollY + 200; // Offset for better detection

                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active-mobile-nav', 'bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600', 'text-white');
                    link.classList.add('text-slate-700');
                });

                // Find which section is currently in view
                sections.forEach(section => {
                    const element = document.getElementById(section);
                    if (element) {
                        const elementTop = element.offsetTop;
                        const elementBottom = elementTop + element.offsetHeight;

                        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                            const activeLink = this.mobileMenu.querySelector(`[data-section="${section}"]`);
                            if (activeLink) {
                                activeLink.classList.add('active-mobile-nav', 'bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600', 'text-white');
                                activeLink.classList.remove('text-slate-700');
                            }
                        }
                    }
                });
                ticking = false;
            };

            // Add throttled scroll event listener using requestAnimationFrame
            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(highlightActiveSection);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', onScroll, { passive: true });

            // Initial highlight on page load
            highlightActiveSection();
        }
    };
})();
