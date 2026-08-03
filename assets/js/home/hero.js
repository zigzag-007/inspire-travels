// Hero Module - Manages hero carousel, animations, and touch interactions
// Author: Zig Zag AI
// Description: Handles hero section background carousel, animations, and user interactions

(function() {
    'use strict';

    window.HeroModule = {
        // Hero background images for carousel
        heroImages: [
            'assets/img/bg/autum-houses.jpg',
            'assets/img/bg/tropical-beach-1.jpg',
            'assets/img/bg/roadside-building.jpg',
            'assets/img/bg/waterfall-1.jpg',
            'assets/img/bg/dry-leaves.jpg',
            'assets/img/bg/summer-road.jpg'
        ],

        currentImageIndex: 0,
        heroSection: null,
        bg1: null,
        bg2: null,
        activeBg: 1,

        init: function() {
            this.heroSection = document.getElementById('home');
            this.bg1 = document.getElementById('hero-bg-1');
            this.bg2 = document.getElementById('hero-bg-2');
            this.initHeroBackground();
            this.startHeroCarousel();
            this.initHeroIndicators();
            this.initTouchSupport();
            this.scheduleNextImagePreload();
            this.optimizeHeroPerformance();
            this.initScrollDepthEffect();
        },

        // Initialize hero background
        initHeroBackground: function() {
            if (this.bg1) {
                this.bg1.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${this.heroImages[this.currentImageIndex]}')`;
            }
        },

        // Optimize hero section for better performance
        optimizeHeroPerformance: function() {
            if (this.bg1 && this.bg2) {
                this.bg1.style.backfaceVisibility = 'hidden';
                this.bg2.style.backfaceVisibility = 'hidden';
            }
        },

        // Hero image carousel
        startHeroCarousel: function() {
            // First background is initialized in HTML/initHeroBackground, so start interval
            setInterval(() => {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
                this.updateHeroBackground();
                this.updateHeroIndicators();
            }, 10000);
        },

        // Update hero background with smooth transition
        updateHeroBackground: function() {
            const nextImage = this.heroImages[this.currentImageIndex];

            if (this.activeBg === 1) {
                if (this.bg2 && this.bg1) {
                    // Set image on the inactive layer
                    this.bg2.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${nextImage}')`;

                    // Perform crossfade and zoom transition
                    this.bg2.classList.remove('hero-bg-inactive');
                    this.bg2.classList.add('hero-bg-active');

                    this.bg1.classList.remove('hero-bg-active');
                    this.bg1.classList.add('hero-bg-inactive');
                }
                this.activeBg = 2;
            } else {
                if (this.bg1 && this.bg2) {
                    // Set image on the inactive layer
                    this.bg1.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${nextImage}')`;

                    // Perform crossfade and zoom transition
                    this.bg1.classList.remove('hero-bg-inactive');
                    this.bg1.classList.add('hero-bg-active');

                    this.bg2.classList.remove('hero-bg-active');
                    this.bg2.classList.add('hero-bg-inactive');
                }
                this.activeBg = 1;
            }

            this.scheduleNextImagePreload();
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

            this.touchStartX = 0;
            this.touchEndX = 0;

            this.heroSection.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            this.heroSection.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        },

        handleSwipe: function() {
            const swipeThreshold = 50;
            const swipeDistance = this.touchEndX - this.touchStartX;

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

        // Load only the next slide while the browser is idle.
        scheduleNextImagePreload: function() {
            const preload = () => {
                const nextIndex = (this.currentImageIndex + 1) % this.heroImages.length;
                this.nextImagePreload = new Image();
                this.nextImagePreload.decoding = 'async';
                this.nextImagePreload.src = this.heroImages[nextIndex];
            };

            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(preload, { timeout: 2500 });
            } else {
                setTimeout(preload, 900);
            }
        },

        // Classic Parallax Scroll Effect & Interactive Mouse Sway & Progress Bar
        initScrollDepthEffect: function() {
            if (!this.heroSection) return;
            const bgWrapper = document.getElementById('hero-bg-wrapper');
            const adventureBg = document.getElementById('adventure-bg-parallax');
            const adventureSection = document.getElementById('adventure');
            const progressBar = document.getElementById('scroll-progress');
            const parallaxSections = document.querySelectorAll('.gowilds-footer, .tour-light-canopy');

            let ticking = false;

            const onScroll = () => {
                const scrollY = window.scrollY;
                const heroHeight = this.heroSection.offsetHeight;

                // 1. Update Scroll Progress Bar
                if (progressBar) {
                    const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = scrollLimit > 0 ? (scrollY / scrollLimit) * 100 : 0;
                    progressBar.style.width = `${scrollPercent}%`;
                }

                // 2. Apply vertical translation to background wrapper only when hero is visible
                if (scrollY <= heroHeight + 100) {
                    if (bgWrapper) {
                        bgWrapper.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
                    }
                }

                // 3. Apply viewport-relative parallax translation to adventure section background
                if (adventureSection && adventureBg) {
                    const rect = adventureSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const translateVal = (rect.top - windowHeight) * 0.12;
                        adventureBg.style.transform = `translate3d(0, ${translateVal}px, 0) scale(1.15)`;
                    }
                }

                // 4. Apply depth parallax to dark and light tropical decorative sections
                const windowHeight = window.innerHeight;

                const updates = [];
                parallaxSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                        const leafY = (progress - 0.5) * 45;
                        const leafX = Math.sin(progress * Math.PI) * 15;
                        const fireflyY = (progress - 0.5) * -70;
                        const fireflyX = Math.sin(progress * Math.PI * 1.5) * 24;

                        updates.push({
                            section: section,
                            leafX: leafX.toFixed(2),
                            leafY: leafY.toFixed(2),
                            fireflyX: fireflyX.toFixed(2),
                            fireflyY: fireflyY.toFixed(2)
                        });
                    }
                });

                updates.forEach(u => {
                    u.section.style.setProperty('--leaf-tx', u.leafX + 'px');
                    u.section.style.setProperty('--leaf-ty', u.leafY + 'px');
                    u.section.style.setProperty('--fly-tx', u.fireflyX + 'px');
                    u.section.style.setProperty('--fly-ty', u.fireflyY + 'px');
                });

                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(onScroll);
                    ticking = true;
                }
            }, { passive: true });

            // 5. Lerped Mousemove Listener for Silk-Smooth Interactive Canopy Sway (with Inertia)
            const allowMouseSway = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!allowMouseSway) return;

            let targetMouseX = 0;
            let targetMouseY = 0;
            let currentMouseX = 0;
            let currentMouseY = 0;
            let rafId = null;
            const self = this;

            document.addEventListener('mousemove', (e) => {
                targetMouseX = (e.clientX / window.innerWidth) - 0.5;
                targetMouseY = (e.clientY / window.innerHeight) - 0.5;

                if (!rafId) {
                    rafId = window.requestAnimationFrame(updateLerpedMouse);
                }
            }, { passive: true });

            function updateLerpedMouse() {
                const dx = targetMouseX - currentMouseX;
                const dy = targetMouseY - currentMouseY;

                if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
                    currentMouseX += dx * 0.08;
                    currentMouseY += dy * 0.08;
                    if (self.heroSection) {
                        self.heroSection.style.setProperty('--mouse-x', currentMouseX.toFixed(4));
                        self.heroSection.style.setProperty('--mouse-y', currentMouseY.toFixed(4));
                    }
                    rafId = window.requestAnimationFrame(updateLerpedMouse);
                } else {
                    rafId = null;
                }
            }
        },

    };
})();
