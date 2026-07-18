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
                slidesPerView: 'auto',
                spaceBetween: 24,
                grabCursor: true,
                loop: true,

                // Spring-physics smooth transitions
                speed: 900,
                cssMode: false,

                // Autoplay — shifts every 4 seconds
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },

                // Pagination for mobile
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },

                // Navigation arrows for desktop
                navigation: {
                    nextEl: '.offers-next',
                    prevEl: '.offers-prev',
                },

                breakpoints: {
                    320: {
                        spaceBetween: 16,
                    },
                    640: {
                        spaceBetween: 24,
                    },
                    1024: {
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
