/**
 * Offers Carousel Module
 * Premium Swiper carousel for the "Offers for You" section
 * Features: looping offers, touch swipe, keyboard controls and quiet autoplay
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

            // Match the starting card to the loop buffer used at this width.
            const desktopLayout = window.innerWidth >= 1280;
            const initialSlide = desktopLayout ? 2 : 1;
            this.swiper = new Swiper('.offers-swiper', {
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 14,
                grabCursor: true,
                loop: true,
                // Small cards need extra loop buffer to keep both previews filled.
                loopAdditionalSlides: 2,
                initialSlide,

                // Smooth physics transitions
                speed: 1000,
                cssMode: false,

                // Leave time to read each offer before revealing its neighbour.
                autoplay: {
                    enabled: false,
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },

                // Pagination
                pagination: {
                    el: '.offers-pagination',
                    clickable: true,
                    bulletElement: 'button',
                },
                a11y: {
                    paginationBulletMessage: 'Go to offer {{index}}',
                },

                // Responsive dynamic grid extension based on screen space
                breakpoints: {
                    992: {
                        centeredSlides: false,
                        loopAdditionalSlides: 2,
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1280: {
                        loopAdditionalSlides: 0,
                        centeredSlides: true,
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                },
            });
            this.bindVisibility();
        },

        // Keep automatic movement quiet when the offer cards cannot be seen.
        bindVisibility: function() {
            const swiper = this.swiper;
            const section = swiper.el;
            const focusBoundary = section.closest('#offers') || section;
            const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
            let visible = !window.IntersectionObserver;
            let focused = false;
            let hovered = false;
            let activePage = true;
            const sync = () => {
                swiper.params.speed = motion.matches ? 0 : 1000;
                if (visible && activePage && !document.hidden && !motion.matches && !focused && !hovered) swiper.autoplay.start();
                else swiper.autoplay.stop();
            };
            // Arrow keys work only inside this carousel, leaving page keys alone.
            focusBoundary.addEventListener('keydown', event => {
                if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                event.preventDefault();
                if (event.key === 'ArrowRight') swiper.slideNext();
                else swiper.slidePrev();
            });
            if (window.IntersectionObserver) {
                new window.IntersectionObserver(entries => {
                    visible = Boolean(entries[0] && entries[0].isIntersecting);
                    sync();
                }).observe(section);
            }
            section.addEventListener('mouseenter', () => { hovered = true; sync(); });
            section.addEventListener('mouseleave', () => { hovered = false; sync(); });
            focusBoundary.addEventListener('focusin', () => { focused = true; sync(); });
            focusBoundary.addEventListener('focusout', event => { focused = focusBoundary.contains(event.relatedTarget); sync(); });
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
