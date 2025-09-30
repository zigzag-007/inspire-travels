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
            if (!loading) return;

            const progressInterval = setInterval(() => {
                progress = Math.min(100, progress + Math.random() * 15);
                if (progressBar) progressBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 150);

            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                    // Trigger hero animations after preloader completes
                    if (window.HeroModule) {
                        window.HeroModule.initHeroAnimations();
                    }
                }, 300);
            }, 2500);
        }
    };
})();
