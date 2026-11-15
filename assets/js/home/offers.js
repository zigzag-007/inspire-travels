/**
 * Offers Carousel Module
 * Premium Swiper carousel for the "Offers for You" section
 * Features: autoplay, spring-physics easing, touch-swipe, pause-on-hover
 */
(function() {
    'use strict';

    window.OffersModule = {
        swiper: null,

        init: function() {
            if (document.querySelector('.offers-swiper')) {
                this.initSwiper();
            }
        },

        initSwiper: function() {
            if (typeof Swiper === 'undefined') {
                console.error('Swiper not loaded — offers carousel disabled');
                return;
            }

            this.swiper = new Swiper('.offers-swiper', {
                slidesPerView: 1,
                spaceBetween: 16,
                grabCursor: true,
                loop: true,

                // Smooth physics transitions
                speed: 750,
                cssMode: false,

                // Autoplay — shifts every 4 seconds
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },

                // Pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.offers-next',
                    prevEl: '.offers-prev',
                },

                // Responsive dynamic grid extension based on screen space
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 16,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 28,
                    },
                },
            });
            this.bindVisibility();
        },

        // Keep automatic movement quiet when the offer cards cannot be seen.
        bindVisibility: function() {
            const swiper = this.swiper;
            const section = swiper.el;
            const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
            let visible = !window.IntersectionObserver;
            let focused = false;
            let hovered = false;
            let activePage = true;
            const sync = () => {
                if (visible && activePage && !document.hidden && !motion.matches && !focused && !hovered) swiper.autoplay.start();
                else swiper.autoplay.stop();
            };
            if (window.IntersectionObserver) {
                new window.IntersectionObserver(entries => {
                    visible = Boolean(entries[0] && entries[0].isIntersecting);
                    sync();
                }).observe(section);
            }
            section.addEventListener('mouseenter', () => { hovered = true; sync(); });
            section.addEventListener('mouseleave', () => { hovered = false; sync(); });
            section.addEventListener('focusin', () => { focused = true; sync(); });
            section.addEventListener('focusout', event => { focused = section.contains(event.relatedTarget); sync(); });
            document.addEventListener('visibilitychange', sync);
            if (motion.addEventListener) motion.addEventListener('change', sync);
            window.addEventListener('pagehide', () => { activePage = false; sync(); });
            window.addEventListener('pageshow', () => { activePage = true; sync(); });
            sync();
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.OffersModule.init();
        });
    } else {
        window.OffersModule.init();
    }
})();
