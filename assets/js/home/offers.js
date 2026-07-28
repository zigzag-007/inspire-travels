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
