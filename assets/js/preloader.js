// Preloader Module - Handles the loading animation with progress bar
// Author: Zig Zag AI
// Description: Manages the loading screen with progress bar animation

(function() {
    'use strict';

    window.PreloaderModule = {
        init: function() {
            const loading = document.getElementById('loading');
            const progressBar = document.getElementById('loading-progress');
            let progress = 0;
            let loaded = false;
            if (!loading) return;

            // Hide scrollbars during page loading wrapper
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Animate progress bar to 90% while waiting for page load
            const progressInterval = setInterval(() => {
                if (!loaded) {
                    if (progress < 90) {
                        // Slower progress as it approaches 90%
                        const remaining = 90 - progress;
                        progress += Math.max(0.5, Math.random() * remaining * 0.15);
                        progress = Math.min(90, progress);
                        if (progressBar) progressBar.style.width = progress + '%';
                    }
                }
            }, 100);

            // Function to handle the actual hide and cleanup
            const hidePreloader = () => {
                loaded = true;
                clearInterval(progressInterval);
                if (progressBar) progressBar.style.width = '100%';

                setTimeout(() => {
                    loading.style.opacity = '0';

                    // Wait for the 700ms transition to complete before setting display to none
                    setTimeout(() => {
                        loading.style.display = 'none';

                        // Restore scrollbars after preloader is completely hidden
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';

                        // Dispatch custom event to initialize and trigger AOS animations
                        document.dispatchEvent(new CustomEvent('app-loaded'));

                        // Fallback call to hero animations if needed
                        if (window.HeroModule && typeof window.HeroModule.initHeroAnimations === 'function') {
                            window.HeroModule.initHeroAnimations();
                        }
                    }, 750);
                }, 2000);
            };

            // Check if page is already loaded (useful for instant cached reloads)
            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }
        }
    };
})();
