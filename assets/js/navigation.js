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
            this.initActiveNavigation();
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
            this.navLinks.forEach(link => {
                // Remove active classes
                link.classList.remove('text-accent', 'text-primary');
                
                // Add active class if this is the current section
                if (link.getAttribute('href') === `#${currentSection}`) {
                    const darkSections = ['home', 'about', 'adventure', 'footer', 'contact'];
                    if (darkSections.includes(currentSection)) {
                        link.classList.add('text-accent');
                    } else {
                        link.classList.add('text-primary');
                    }
                }
            });

            // Update mobile nav links
            this.mobileNavLinks.forEach(link => {
                link.classList.remove('text-primary');
                if (link.getAttribute('href') === `#${currentSection}`) {
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

                let currentSection = null;
                let isDarkSection = false;

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

                // Update navigation colors (original working logic)
                this.setNavColors(isDarkSection);

                // Update active state - use the same section for consistency
                if (currentSection) {
                    this.setActiveState(currentSection);
                }
            };

            // Update on scroll
            window.addEventListener('scroll', updateNavigation, { passive: true });
            
            // Set initial state
            updateNavigation();
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

            // Explore Tours button functionality
            const exploreToursBtn = document.querySelector('.explore-tours-btn');
            if (exploreToursBtn) {
                exploreToursBtn.addEventListener('click', () => {
                    this.smoothScroll('#tours');
                });
            }

            // Watch Video button functionality
            const watchVideoBtn = document.querySelector('.watch-video-btn');
            if (watchVideoBtn) {
                watchVideoBtn.addEventListener('click', () => {
                    window.open('https://www.youtube.com/shorts/LO7vF7flWGE?feature=share', '_blank');
                });
            }

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

        // Initialize active navigation
        initActiveNavigation: function() {
            // This is now handled in initScrollEffects
        },

        // Initialize back to top functionality
        initBackToTop: function() {
            if (typeof $ !== 'undefined') {
                $(window).on('scroll', function(event) {
                    if ($(this).scrollTop() > 600) {
                        $('.back-to-top').fadeIn(200);
                    } else {
                        $('.back-to-top').fadeOut(200);
                    }
                });
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