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
        mobileSubmenuToggles: null,
        overlayHideTimer: null,

        init: function() {
            this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.mobileMenuClose = document.getElementById('mobile-menu-close');
            this.blurOverlay = document.getElementById('blur-overlay');
            this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            this.mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

            if (this.mobileMenuBtn) this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            if (this.mobileMenu) {
                this.mobileMenu.setAttribute('aria-hidden', 'true');
                this.mobileMenu.inert = true;
            }

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

            if (this.mobileSubmenuToggles) {
                this.mobileSubmenuToggles.forEach(toggle => {
                    toggle.addEventListener('click', () => this.toggleSubmenu(toggle));
                });
            }

            // Keyboard navigation support
            this.initKeyboardSupport();

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
            // A previous close must not hide an overlay that has reopened.
            clearTimeout(this.overlayHideTimer);
            this.overlayHideTimer = null;
            if (this.mobileMenu) {
                this.mobileMenu.inert = false;
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
            document.body.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            if (this.mobileMenuBtn) this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
            if (this.mobileMenu) this.mobileMenu.setAttribute('aria-hidden', 'false');
            if (this.mobileMenuClose) this.mobileMenuClose.focus();
        },

        toggleSubmenu: function(toggle) {
            var panelId = toggle.getAttribute('aria-controls');
            var panel = panelId ? document.getElementById(panelId) : null;
            if (!panel) return;

            var shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';

            this.mobileSubmenuToggles.forEach(function(otherToggle) {
                var otherPanelId = otherToggle.getAttribute('aria-controls');
                var otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
                otherToggle.setAttribute('aria-expanded', 'false');
                if (otherPanel) {
                    otherPanel.classList.add('hidden');
                    otherPanel.setAttribute('aria-hidden', 'true');
                }
            });

            if (shouldOpen) {
                toggle.setAttribute('aria-expanded', 'true');
                panel.classList.remove('hidden');
                panel.setAttribute('aria-hidden', 'false');
            }
        },

        resetSubmenus: function() {
            if (!this.mobileSubmenuToggles) return;

            this.mobileSubmenuToggles.forEach(function(toggle) {
                var panelId = toggle.getAttribute('aria-controls');
                var panel = panelId ? document.getElementById(panelId) : null;
                toggle.setAttribute('aria-expanded', 'false');
                if (panel) {
                    panel.classList.add('hidden');
                    panel.setAttribute('aria-hidden', 'true');
                }
            });
        },

        closeMobileMenu: function() {
            const wasOpen = this.isMenuOpen();
            // Reveal the outside trigger before returning keyboard focus to it.
            document.body.classList.remove('mobile-menu-open');
            // Return focus before hiding the drawer from assistive tools.
            if (wasOpen && this.mobileMenuBtn) this.mobileMenuBtn.focus();
            if (this.mobileMenu) {
                this.mobileMenu.inert = true;
                // Force hardware acceleration with translate3d
                this.mobileMenu.style.transform = 'translate3d(-100%, 0, 0)';
                this.mobileMenu.classList.remove('translate-x-0');
                this.mobileMenu.classList.add('-translate-x-full');
            }
            if (this.blurOverlay) {
                this.blurOverlay.classList.remove('opacity-100');
                this.blurOverlay.classList.add('opacity-0');
                // Keep the element until its fade ends, unless the drawer reopens.
                clearTimeout(this.overlayHideTimer);
                this.overlayHideTimer = setTimeout(() => {
                    this.blurOverlay.classList.add('hidden');
                    this.overlayHideTimer = null;
                }, 600);
            }
            document.body.style.overflow = ''; // Restore scrolling
            if (this.mobileMenuBtn) this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            if (this.mobileMenu) this.mobileMenu.setAttribute('aria-hidden', 'true');
            this.resetSubmenus();
        },

        // Keyboard navigation support
        initKeyboardSupport: function() {
            document.addEventListener('keydown', (e) => {
                if (!this.isMenuOpen()) return;
                // Keep Tab within the open drawer, including expanded submenus.
                if (e.key === 'Tab') {
                    const items = Array.from(this.mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'))
                        .filter(element => element.getClientRects().length > 0);
                    const first = items[0];
                    const last = items[items.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
                // Close mobile menu with Escape key
                if (e.key === 'Escape' && this.mobileMenu && !this.mobileMenu.classList.contains('-translate-x-full')) {
                    e.preventDefault();
                    this.closeMobileMenu();
                }
            });
        },

    };
})();
