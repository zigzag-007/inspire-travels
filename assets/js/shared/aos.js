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
                    startEvent: 'app-loaded', // Start after preloader completes and dispatches 'app-loaded'
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

                console.log('AOS initialized with modern 2025 configuration');
            } else {
                console.warn('AOS library not loaded. Animations will not work.');
            }
        }
    };
})();
