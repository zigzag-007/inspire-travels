// Active Promos Carousel Modal Module - Swipe Card Stack
// Author: Zig Zag AI
// Description: Manages the premium swipe card stack for promotions.
//              Supports touch, pointer, keyboard, and PhotoSwipe interactions.

(function() {
    'use strict';

    window.PromoModule = {
        activeSlideIndex: 0,
        swiper: null,
        slides: [
            {
                src: "assets/img/promos/promo-flyer-5.png",
                title: "Hotel Booking + Full Tour Package Offer",
                whatsappMessage: "Hi! I am interested in booking a hotel together with a full tour package. Please apply the 15% discount code *InspireHotel15* to my inquiry!"
            },
            {
                src: "assets/img/promos/promo-flyer-8.png",
                title: "Mirissa Whale & Dolphin Watching Offer",
                whatsappMessage: "Hi! I am interested in booking the Mirissa Whale & Dolphin Watching excursion. Please apply the 20% discount code *WHALE20* to my inquiry!"
            },
            {
                src: "assets/img/promos/promo-flyer-6.png",
                title: "White Water Adventure in Kitulgala Offer",
                whatsappMessage: "Hi! I am interested in booking the White Water Adventure in Kitulgala. Please apply the 20% discount code *Raft20* to my inquiry!"
            },
            {
                src: "assets/img/promos/promo-flyer-7.png",
                title: "Sri Lanka Group Tours Early Bird Offer",
                whatsappMessage: "Hi! I am interested in joining a Sri Lanka Group Tour. I would like to claim the 20% early bird discount for one of the first 7 seats."
            },
            {
                src: "assets/img/promos/promo-flyer-1.png",
                title: "Minneriya / Kavdulla / Hurulu Elephant Safari Offer",
                whatsappMessage: "Hi! I want to book the Elephant Safari. Please apply the 15% discount code *MinIns15* / *KavIns15* / *HurIns15* to my inquiry!"
            },
            {
                src: "assets/img/promos/promo-flyer-3.png",
                title: "Yala Leopard Safari Excursion Offer",
                whatsappMessage: "Hi! I want to book the Yala Leopard Safari. Please apply the 15% discount code *YalaIns15* to my Yala safari booking!"
            },
            {
                src: "assets/img/promos/promo-flyer-4.png",
                title: "Udawalawa Elephant Safari Excursion Offer",
                whatsappMessage: "Hi! I want to book the Udawalawa Elephant Safari. Please apply the 15% discount code *UdaIns15* to my Udawalawa safari booking!"
            }
        ],

        init: function() {
            const openBtns = document.querySelectorAll('.open-promo-btn');
            const modal = document.getElementById('promoModal');
            const closeBtn = document.getElementById('closePromoModal');

            if (!modal) return;

            // Swiper owns the card movement, momentum, and stack depth.
            const stack = document.getElementById('promoCardStack');
            if (stack) {
                stack.innerHTML = `
                    <div class="swiper-wrapper">
                        ${this.slides.map((slide, idx) => `
                            <div class="swiper-slide promo-card w-full h-full rounded-2xl overflow-hidden bg-[#0c3531] border border-white/10 shadow-lg" data-index="${idx}">
                                <img src="${slide.src}" alt="${slide.title}" class="w-full h-full object-contain pointer-events-none select-none rounded-xl">
                                <button type="button" data-promo-zoom-index="${idx}" class="promo-no-swipe absolute top-3 right-3 bg-black/60 hover:bg-[#F7921E] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md border border-white/10 z-20" title="Zoom image" aria-label="Zoom ${slide.title}">
                                    <i data-lucide="maximize-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;

                stack.addEventListener('click', (e) => {
                    const zoomButton = e.target.closest('[data-promo-zoom-index]');
                    if (!zoomButton) return;

                    window.openPromoPhotoSwipe(Number(zoomButton.dataset.promoZoomIndex));
                });
            }

            this.renderDotsAndLink();

            // Bind open triggers
            openBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            });

            // Bind close trigger
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }

            // Close on clicking backdrop
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('invisible')) {
                    if (e.key === 'Escape') this.close();
                    if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.showNext();
                    }
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.showPrevious();
                    }
                }
            });
        },

        open: function() {
            const modal = document.getElementById('promoModal');
            if (!modal) return;

            this.activeSlideIndex = 0;
            this.renderDotsAndLink();

            modal.classList.remove('invisible', 'opacity-0');
            modal.classList.add('flex', 'opacity-100');
            
            const container = modal.querySelector('.promo-modal-container');
            if (container) {
                container.classList.remove('scale-95', 'translate-y-8', 'opacity-0');
                container.classList.add('scale-100', 'translate-y-0', 'opacity-100');
            }

            if (!this.swiper) {
                this.initSwiper();
            } else {
                this.swiper.slideToLoop(0, 0, false);
                this.swiper.update();
            }

            // Prevent body scroll
            document.body.classList.add('overflow-hidden');
        },

        close: function() {
            const modal = document.getElementById('promoModal');
            if (!modal) return;

            modal.classList.add('opacity-0');
            modal.classList.remove('opacity-100');
            
            const container = modal.querySelector('.promo-modal-container');
            if (container) {
                container.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
                container.classList.add('scale-95', 'translate-y-8', 'opacity-0');
            }

            setTimeout(() => {
                modal.classList.add('invisible');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
            }, 300);
        },

        initSwiper: function() {
            const stack = document.getElementById('promoCardStack');
            if (!stack || typeof window.Swiper !== 'function') {
                console.error('Swiper not loaded — promo card stack disabled');
                return;
            }

            const prefersReducedMotion = window.matchMedia
                && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.swiper = new window.Swiper(stack, {
                effect: 'cards',
                loop: true,
                grabCursor: true,
                simulateTouch: true,
                followFinger: true,
                threshold: 6,
                speed: prefersReducedMotion ? 0 : 380,
                resistance: true,
                resistanceRatio: 0.72,
                longSwipes: true,
                longSwipesMs: 250,
                longSwipesRatio: 0.18,
                shortSwipes: true,
                preventClicks: true,
                preventClicksPropagation: true,
                noSwiping: true,
                noSwipingClass: 'promo-no-swipe',
                observer: true,
                observeParents: true,
                cardsEffect: {
                    rotate: true,
                    perSlideRotate: 2.4,
                    perSlideOffset: 10,
                    slideShadows: true
                },
                on: {
                    init: swiper => this.syncWithSwiper(swiper),
                    slideChange: swiper => this.syncWithSwiper(swiper)
                }
            });

            this.syncWithSwiper(this.swiper);

            if (window.PhosphorBridge) {
                window.PhosphorBridge.reinit();
            }
        },

        showNext: function() {
            if (this.swiper) this.swiper.slideNext();
        },

        showPrevious: function() {
            if (this.swiper) this.swiper.slidePrev();
        },

        syncWithSwiper: function(swiper) {
            if (!swiper) return;

            this.activeSlideIndex = Number.isInteger(swiper.realIndex)
                ? swiper.realIndex
                : 0;
            this.renderDotsAndLink();
        },

        renderDotsAndLink: function() {
            const slide = this.slides[this.activeSlideIndex];
            const whatsappLink = document.getElementById('promoModalWhatsappLink');
            const dotsContainer = document.getElementById('promoModalDots');

            if (whatsappLink) {
                whatsappLink.href = window.WhatsAppModule
                    ? window.WhatsAppModule.createUrl(slide.whatsappMessage)
                    : `https://api.whatsapp.com/send?phone=94785959333&text=${encodeURIComponent(slide.whatsappMessage)}`;
            }

            if (dotsContainer) {
                dotsContainer.innerHTML = this.slides.map((_, idx) => {
                    const isActive = idx === this.activeSlideIndex;
                    return `<span aria-current="${isActive ? 'true' : 'false'}" class="h-2.5 w-2.5 rounded-full transition-all duration-300 transform ${isActive ? 'bg-accent scale-125 shadow-sm' : 'bg-white/30 scale-100'}"></span>`;
                }).join('');
            }
        }
    };

    // Global PhotoSwipe opener for promo modal
    window.openPromoPhotoSwipe = (idx) => {
        if (!window.PhotoSwipeLightbox || !window.PhotoSwipe) {
            console.warn('Photo viewer is not available yet');
            return;
        }

        const slides = window.PromoModule.slides;
        const pswpItems = slides.map(s => ({
            src: s.src,
            width: 1254,
            height: 1254
        }));
        
        const lightbox = new window.PhotoSwipeLightbox({
            dataSource: pswpItems,
            pswpModule: window.PhotoSwipe,
            bgOpacity: 0.9,
            padding: { 
                top: window.innerWidth < 768 ? 40 : 80, 
                bottom: window.innerWidth < 768 ? 40 : 80, 
                left: window.innerWidth < 768 ? 10 : 20, 
                right: window.innerWidth < 768 ? 10 : 20 
            }
        });
        
        lightbox.init();
        lightbox.loadAndOpen(idx);
    };
})();
