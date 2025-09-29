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
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', () => this.openMobileMenu());
            }

            if (this.mobileMenuClose) {
                this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
            }

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

        openMobileMenu: function() {
            if (this.mobileMenu) {
                this.mobileMenu.classList.remove('-translate-x-full');
                this.mobileMenu.classList.add('translate-x-0');
            }
            if (this.blurOverlay) {
                this.blurOverlay.classList.remove('hidden', 'opacity-0');
                this.blurOverlay.classList.add('opacity-100');
            }
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        },

        closeMobileMenu: function() {
            if (this.mobileMenu) {
                this.mobileMenu.classList.remove('translate-x-0');
                this.mobileMenu.classList.add('-translate-x-full');
            }
            if (this.blurOverlay) {
                this.blurOverlay.classList.remove('opacity-100');
                this.blurOverlay.classList.add('opacity-0');
                // Delay hiding to allow fade out animation
                setTimeout(() => {
                    this.blurOverlay.classList.add('hidden');
                }, 300);
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

        // Active section highlighting
        initActiveSectionHighlighting: function() {
            const sections = ['home', 'tours', 'about', 'gallery', 'adventure', 'reviews', 'footer'];
            const navLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link[data-section]');

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
            };

            // Add scroll event listener
            window.addEventListener('scroll', highlightActiveSection);

            // Initial highlight on page load
            highlightActiveSection();
        }
    };
})();
