// Hero Module - Manages hero carousel, animations, and touch interactions
// Author: Zig Zag AI
// Description: Handles hero section background carousel, animations, and user interactions

(function() {
    'use strict';

    window.HeroModule = {
        // Hero background images for carousel
        heroImages: [
            'assets/img/bg/tropical-beach-1.jpg',
            'assets/img/bg/mountain-lake-1.jpg',
            'assets/img/bg/tea-plantation-1.jpg',
            'assets/img/bg/waterfall-1.jpg',
            'assets/img/bg/old-temple-1.jpg',
            'assets/img/bg/city-sunset-1.jpg'
        ],

        currentImageIndex: 0,
        heroSection: null,

        init: function() {
            this.heroSection = document.getElementById('home');
            this.initHeroBackground();
            this.startHeroCarousel();
            this.initHeroIndicators();
            this.initTouchSupport();
            this.preloadImages();
        },

        // Initialize hero background
        initHeroBackground: function() {
            if (this.heroSection) {
                this.heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${this.heroImages[this.currentImageIndex]}')`;
            }
        },

        // Hero image carousel
        startHeroCarousel: function() {
            this.updateHeroBackground();

            setInterval(() => {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
                this.updateHeroBackground();
                this.updateHeroIndicators();
            }, 5000);
        },

        // Update hero background
        updateHeroBackground: function() {
            if (this.heroSection) {
                this.heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${this.heroImages[this.currentImageIndex]}')`;
            }
        },

        // Update hero indicators
        updateHeroIndicators: function() {
            const indicators = document.querySelectorAll('.hero-indicator');
            indicators.forEach((indicator, index) => {
                if (index === this.currentImageIndex) {
                    indicator.classList.add('bg-white', 'scale-125');
                    indicator.classList.remove('bg-white/50');
                } else {
                    indicator.classList.remove('bg-white', 'scale-125');
                    indicator.classList.add('bg-white/50');
                }
            });
        },

        // Initialize hero indicator click handlers
        initHeroIndicators: function() {
            document.querySelectorAll('.hero-indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.currentImageIndex = index;
                    this.updateHeroBackground();
                    this.updateHeroIndicators();
                });
            });
        },

        // Hero animations
        initHeroAnimations: function() {
            const heroContent = document.querySelector('.hero-content');
            const statsCards = document.querySelectorAll('.stats-card');

            if (heroContent) {
                heroContent.classList.remove('opacity-0', 'translate-y-8');
                heroContent.classList.add('opacity-100', 'translate-y-0');
            }

            // Animate stats cards with delay
            statsCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'translate-y-4');
                    card.classList.add('opacity-100', 'translate-y-0');
                }, 500 + (index * 200));
            });
        },

        // Add touch/swipe support for mobile hero carousel
        initTouchSupport: function() {
            if (!this.heroSection) return;

            let touchStartX = 0;
            let touchEndX = 0;

            this.heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            this.heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        },

        handleSwipe: function() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - previous image
                    this.currentImageIndex = (this.currentImageIndex - 1 + this.heroImages.length) % this.heroImages.length;
                } else {
                    // Swipe left - next image
                    this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
                }
                this.updateHeroBackground();
                this.updateHeroIndicators();
            }
        },

        // Performance optimization: Preload images
        preloadImages: function() {
            this.heroImages.forEach(imageSrc => {
                const img = new Image();
                img.src = imageSrc;
            });
        },

        // Keyboard navigation support
        handleKeyboardNavigation: function(e) {
            if (e.key === 'ArrowLeft') {
                this.currentImageIndex = (this.currentImageIndex - 1 + this.heroImages.length) % this.heroImages.length;
                this.updateHeroBackground();
                this.updateHeroIndicators();
            } else if (e.key === 'ArrowRight') {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
                this.updateHeroBackground();
                this.updateHeroIndicators();
            }
        }
    };
})();
