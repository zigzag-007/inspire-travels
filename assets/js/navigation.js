// Navigation Module - Clean and Simple
// Author: Zig Zag AI
// Description: Handles navigation styling changes and active states

(function() {
    'use strict';

    window.NavigationModule = {
        navbar: null,
        navLinks: null,
        mobileNavLinks: null,
        navLogo: null,
        mobileMenuBtn: null,
        scrollAnimationFrame: null,
        restoreScrollBehavior: null,

        init: function() {
            this.navbar = document.getElementById('navbar');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            this.navLogo = document.querySelector('.nav-logo');
            this.mobileMenuBtn = document.getElementById('mobile-menu-btn');

            this.initScrollEffects();
            this.initSmoothScrolling();
            this.initBackToTop();
        },

        // Simple function to set navigation colors
        setNavColors: function(isDarkSection) {
            this.navLinks.forEach(link => {
                // Remove all color classes
                link.classList.remove('text-white', 'text-foreground', 'text-accent', 'text-primary', 'hover:text-accent', 'hover:text-primary');

                if (isDarkSection) {
                    // Dark sections: white text with accent hover
                    link.classList.add('text-white', 'hover:text-accent');
                } else {
                    // Light sections: dark text with primary hover
                    link.classList.add('text-foreground', 'hover:text-primary');
                }
            });

            // Set hamburger menu button color
            if (this.mobileMenuBtn) {
                // Remove all color classes from hamburger menu button
                this.mobileMenuBtn.classList.remove('text-white', 'text-foreground', 'text-slate-600', 'text-slate-800');

                if (isDarkSection) {
                    // Dark sections: white hamburger menu
                    this.mobileMenuBtn.classList.add('text-white');
                } else {
                    // Light sections: dark hamburger menu
                    this.mobileMenuBtn.classList.add('text-foreground');
                }
            }

            // Set logo color
            if (this.navLogo) {
                this.navLogo.classList.remove('light-logo', 'dark-logo');
                if (isDarkSection) {
                    this.navLogo.classList.add('light-logo');
                } else {
                    this.navLogo.classList.add('dark-logo');
                }
            }
        },

        // Set active state for current section
        setActiveState: function(currentSection) {
            const isGalleryPage = window.location.pathname.includes('gallery.html');

            this.navLinks.forEach(link => {
                // Remove active classes
                link.classList.remove('text-accent', 'text-primary');
                
                // Add active class if this is the current section
                const href = link.getAttribute('href');
                const isMatch = href === `#${currentSection}` || 
                                (currentSection === 'gallery' && href === 'gallery.html') ||
                                (href === `index.html#${currentSection}`);

                if (isMatch) {
                    const darkSections = ['home', 'about', 'adventure', 'footer', 'contact'];
                    if (darkSections.includes(currentSection) || (currentSection === 'gallery' && window.scrollY < 180)) {
                        link.classList.add('text-accent');
                    } else {
                        link.classList.add('text-primary');
                    }
                }
            });

            // Update mobile nav links
            this.mobileNavLinks.forEach(link => {
                link.classList.remove('text-primary');
                const href = link.getAttribute('href');
                const isMatch = href === `#${currentSection}` || 
                                (currentSection === 'gallery' && href === 'gallery.html') ||
                                (href === `index.html#${currentSection}`);
                if (isMatch) {
                    link.classList.add('text-primary');
                }
            });
        },

        // Initialize scroll effects
        initScrollEffects: function() {
            const darkSections = ['home', 'about', 'adventure', 'footer', 'contact'];

            const updateNavigation = () => {
                const sections = document.querySelectorAll('section[id]');
                const navbarHeight = this.navbar ? this.navbar.getBoundingClientRect().height : 64;
                const offset = navbarHeight + 20;
                const scrollY = window.scrollY;

                let currentSection = null;
                let isDarkSection = false;
                const isGalleryPage = window.location.pathname.includes('gallery.html');

                if (isGalleryPage) {
                    currentSection = 'gallery';
                    isDarkSection = window.scrollY < 500;
                } else {
                    // Find current section - use original working logic for navbar colors
                    sections.forEach(section => {
                        const rect = section.getBoundingClientRect();
                        const sectionId = section.getAttribute('id');

                        // Primary condition for navbar colors and active section
                        if (rect.top <= offset && rect.bottom > offset) {
                            currentSection = sectionId;
                            isDarkSection = darkSections.includes(sectionId);
                        }
                    });

                    // Fallback: if no section found (between sections), find the closest one
                    if (!currentSection) {
                        let closestSection = null;
                        let minDistance = Infinity;

                        sections.forEach(section => {
                            const rect = section.getBoundingClientRect();
                            const sectionId = section.getAttribute('id');
                            const distance = Math.abs(rect.top - offset);

                            if (distance < minDistance) {
                                minDistance = distance;
                                closestSection = sectionId;
                            }
                        });

                        if (closestSection) {
                            currentSection = closestSection;
                            isDarkSection = darkSections.includes(currentSection);
                        }
                    }

                    // Special handling for home section
                    if (window.scrollY < 100) {
                        currentSection = 'home';
                        isDarkSection = true;
                    }
                }

                // Update navigation colors (original working logic)
                this.setNavColors(isDarkSection);

                // Update active state - use the same section for consistency
                if (currentSection) {
                    this.setActiveState(currentSection);
                }

                // 1. Apple-Style Navbar Translation (Native CSS sticky handles this now)
                // Removed JS transform logic to prevent conflict with AOS and fix initial load overlapping

                // 2. Toggle Frosted Glass Theme Classes (Apple-Style)
                if (this.navbar) {
                    if (isDarkSection) {
                        this.navbar.classList.add('is-dark-nav');
                        this.navbar.classList.remove('is-light-nav');
                    } else {
                        this.navbar.classList.add('is-light-nav');
                        this.navbar.classList.remove('is-dark-nav');
                    }
                }
            };

            // Update on scroll using requestAnimationFrame throttling
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
            
            // Set initial state
            updateNavigation();
            window.addEventListener('load', updateNavigation);
            window.addEventListener('resize', updateNavigation);
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
            // Matches jQuery's default "swing" easing from the old button.
            const easeSwing = (t) => {
                return 0.5 - (Math.cos(t * Math.PI) / 2);
            };
            const easing = easingName === 'swing' ? easeSwing : easeInOutCubic;

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
            const logoLink = document.querySelector('a[href="#home"]');
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    NavigationModule.smoothScrollTo(0, 1200);
                });
            }
        },


        // Initialize back to top functionality
        initBackToTop: function() {
            if (typeof $ !== 'undefined') {
                const $btn = $('.back-to-top');
                if (!$btn.length) return;

                const self = this;
                let isVisible = false;

                const updateBackToTop = () => {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const shouldShow = scrollTop > 600;

                    if (shouldShow && !isVisible) {
                        isVisible = true;
                        $btn.stop(true, true).fadeIn(200);
                    } else if (!shouldShow && isVisible) {
                        isVisible = false;
                        $btn.stop(true, true).fadeOut(200);
                    }

                    const btnNode = $btn[0];
                    if (btnNode && shouldShow) {
                        if (!btnNode.classList.contains('is-over-light') && !btnNode.classList.contains('is-over-dark')) {
                            btnNode.classList.add('is-over-light');
                        }

                        const darkElements = document.querySelectorAll('#home, #about, #adventure, footer, .bg-slate-900, .bg-slate-950, .bg-[#0c3531], .bg-primary');
                        const btnRect = btnNode.getBoundingClientRect();
                        const btnCenterY = btnRect.top + btnRect.height / 2;

                        let isOverDark = false;
                        darkElements.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            if (btnCenterY >= rect.top && btnCenterY <= rect.bottom) {
                                isOverDark = true;
                            }
                        });

                        if (isOverDark) {
                            $btn.removeClass('is-over-light text-primary').addClass('is-over-dark text-white');
                        } else {
                            $btn.removeClass('is-over-dark text-white').addClass('is-over-light text-primary');
                        }
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

                // Run initial state check
                updateBackToTop();

                $btn.off('click.navigationBackToTop').on('click.navigationBackToTop', function(event) {
                    event.preventDefault();
                    self.smoothScrollTo(0, 1500, 'swing');
                });
            } else {
                console.error('jQuery not loaded - back to top functionality disabled');
            }
        }
    };
})();
