// AOS Module - Manages Animate On Scroll animations
// Author: Zig Zag AI
// Description: Handles AOS library initialization and configuration

(function() {
    'use strict';

    window.AOSModule = {
        init: function() {
            // Initialize AOS (Animate On Scroll) with modern 2025 configuration
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    // Global settings
                    duration: 1000,                    // Animation duration
                    easing: 'ease-out-cubic',          // Modern easing function
                    once: true,                        // Animate only once on page load
                    mirror: false,                     // Don't animate on scroll up
                    anchorPlacement: 'top-bottom',     // When element comes into view

                    // Performance optimizations
                    startEvent: 'DOMContentLoaded',    // Start after DOM is ready
                    initClassName: 'aos-init',         // Class added after initialization
                    animatedClassName: 'aos-animate',  // Class added on animation
                    useClassNames: false,              // Don't use class names for animations

                    // Responsive settings - disable on mobile for better performance
                    disable: function() {
                        return window.innerWidth < 768;
                    },

                    // Offset and delay settings
                    offset: 120,                       // Offset from original trigger point
                    delay: 0                          // Default delay
                });

                // Refresh AOS to animate elements already in viewport
                setTimeout(() => {
                    AOS.refresh();
                }, 100);

                // Fix hover effects after AOS animations complete
                this.fixHoverEffects();

                console.log('AOS initialized with modern 2025 configuration');
            } else {
                console.warn('AOS library not loaded. Animations will not work.');
            }
        },

        // Fix hover effects that are broken by AOS inline styles
        fixHoverEffects: function() {
            // Wait for all AOS animations to complete
            setTimeout(() => {
                // Find all elements with hover:scale-105 that also have AOS animations
                const elementsWithHover = document.querySelectorAll('[class*="hover:scale-105"]');
                
                elementsWithHover.forEach(element => {
                    // Check if element has AOS animation
                    if (element.hasAttribute('data-aos')) {
                        // Remove AOS inline styles that interfere with hover
                        element.style.removeProperty('transform');
                        element.style.removeProperty('transition');
                        
                        // Add event listeners for hover effects
                        element.addEventListener('mouseenter', function() {
                            this.style.transform = 'scale(1.05)';
                            this.style.transition = 'transform 0.3s ease';
                        });
                        
                        element.addEventListener('mouseleave', function() {
                            this.style.transform = 'scale(1)';
                            this.style.transition = 'transform 0.3s ease';
                        });
                    }
                });

                // Fix hero indicators hover effects
                const heroIndicators = document.querySelectorAll('.hero-indicator');
                heroIndicators.forEach(indicator => {
                    if (indicator.hasAttribute('data-aos')) {
                        // Remove AOS inline styles
                        indicator.style.removeProperty('transform');
                        indicator.style.removeProperty('transition');
                        
                        // Add hover effects
                        indicator.addEventListener('mouseenter', function() {
                            if (!this.classList.contains('scale-125')) {
                                this.style.transform = 'scale(1.1)';
                                this.style.transition = 'all 0.3s ease';
                            }
                        });
                        
                        indicator.addEventListener('mouseleave', function() {
                            if (!this.classList.contains('scale-125')) {
                                this.style.transform = 'scale(1)';
                                this.style.transition = 'all 0.3s ease';
                            }
                        });
                    }
                });

                console.log('Hover effects fixed for AOS animated elements');
            }, 2000); // Wait 2 seconds for all animations to complete
        }
    };
})();
