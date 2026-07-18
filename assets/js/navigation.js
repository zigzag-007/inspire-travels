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
                    isDarkSection = window.scrollY < 180;
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

            // Update on scroll with debouncing to prevent conflicts
            let scrollTimeout;
            const debouncedUpdateNavigation = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateNavigation, 16); // ~60fps
            };
            window.addEventListener('scroll', debouncedUpdateNavigation, { passive: true });
            
            // Set initial state
            updateNavigation();
            window.addEventListener('load', updateNavigation);
            window.addEventListener('resize', updateNavigation);
        },

        // Smooth scrolling for navigation links
        smoothScroll: function(targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const sectionHeight = targetElement.offsetHeight;

                // Custom scroll percentages for each section
                const scrollPercentages = {
                    '#home': 0.00,       // 0% for Home (default)
                    '#tours': 0.06,      // 6% for Tours
                    '#about': 0.08,      // 8% for About
                    '#gallery': 0.05,    // 5% for Gallery
                    '#adventure': 0.15,  // 15% for Adventure
                    '#reviews': 0.06,    // 6% for Reviews
                    '#contact': 0.00,    // 0% for Contact section
                    '#footer': 0.00      // 0% for Footer
                };

                // Get the scroll percentage for this section (default to 0 if not specified)
                const scrollPercentage = scrollPercentages[targetId] || 0;

                // Calculate offset based on section-specific percentage
                const offsetTop = targetElement.offsetTop - 120 + (sectionHeight * scrollPercentage);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        },

        // Initialize smooth scrolling
        initSmoothScrolling: function() {
            // Handle navigation clicks
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    this.smoothScroll(targetId);
                });
            });


            // Add scroll-to-top functionality when clicking logo
            const logoLink = document.querySelector('a[href="#home"]');
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        },


        // Initialize back to top functionality - Exact Go-Wilds implementation
        initBackToTop: function() {
            if (typeof $ !== 'undefined') {
                // Show/hide button on scroll and check contrast overlap
                $(window).on('scroll', function(event) {
                    const scrollTop = $(this).scrollTop();
                    const $btn = $('.back-to-top');

                    if (scrollTop > 600) {
                        $btn.fadeIn(200);
                    } else {
                        $btn.fadeOut(200);
                    }

                    if ($btn.length) {
                        const btnNode = $btn[0];
                        // Ensure default state is set
                        if (!btnNode.classList.contains('is-over-light') && !btnNode.classList.contains('is-over-dark')) {
                            btnNode.classList.add('is-over-light');
                        }

                        // Get all dark sections on the page
                        const darkElements = document.querySelectorAll('#home, #about, #adventure, footer');
                        const btnRect = btnNode.getBoundingClientRect();
                        const btnCenterY = btnRect.top + btnRect.height / 2;

                        let isOverDark = false;
                        
                        darkElements.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            // If the button's vertical center falls inside the section's vertical bounds
                            if (btnCenterY >= rect.top && btnCenterY <= rect.bottom) {
                                isOverDark = true;
                            }
                        });

                        if (isOverDark) {
                            $btn.removeClass('is-over-light text-primary').addClass('is-over-dark');
                        } else {
                            $btn.removeClass('is-over-dark text-white').addClass('is-over-light');
                        }
                    }
                });

                // Scroll to top on click
                $('.back-to-top').on('click', function(event) {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: 0,
                    }, 1500);
                });
            } else {
                console.error('jQuery not loaded - back to top functionality disabled');
            }
        }
    };
})();