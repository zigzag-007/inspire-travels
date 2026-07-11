// Active Promos Carousel Modal Module - Tinder Card Stack
// Author: Zig Zag AI
// Description: Manages the premium Tinder-style card stack swiper for promotions.
//              Supports draggable fly-off swipe gestures, keyboard commands, and PhotoSwipe fullscreen integration.

(function() {
    'use strict';

    window.PromoModule = {
        activeSlideIndex: 0,
        slides: [
            {
                src: "assets/img/main-gallery/promo-flyer-5.png",
                title: "Hotel Booking + Full Tour Package Offer",
                whatsappMessage: "Hi! I am interested in booking a hotel together with a full tour package. Please apply the 15% discount code *InspireHotel15* to my inquiry!"
            },
            {
                src: "assets/img/main-gallery/promo-flyer-2.png",
                title: "Trincomalee Whale & Dolphin Watching Offer",
                whatsappMessage: "Hi! I am interested in booking the Trincomalee Whale & Dolphin Watching excursion. Please apply the 15% discount code *WhaleWatch15* to my inquiry!"
            },
            {
                src: "assets/img/main-gallery/promo-flyer-1.png",
                title: "Minneriya / Kavdulla / Hurulu Elephant Safari Offer",
                whatsappMessage: "Hi! I want to book the Elephant Safari. Please apply the 15% discount code *MinIns15* / *KavIns15* / *HurIns15* to my inquiry!"
            },
            {
                src: "assets/img/main-gallery/promo-flyer-3.jpg",
                title: "Yala Leopard Safari Excursion Offer",
                whatsappMessage: "Hi! I want to book the Yala Leopard Safari. Please apply the 15% discount code *YalaIns15* to my Yala safari booking!"
            },
            {
                src: "assets/img/main-gallery/promo-flyer-4.png",
                title: "Udawalawa Elephant Safari Excursion Offer",
                whatsappMessage: "Hi! I want to book the Udawalawa Elephant Safari. Please apply the 15% discount code *UdaIns15* to my Udawalawa safari booking!"
            }
        ],

        init: function() {
            const openBtns = document.querySelectorAll('.open-promo-btn');
            const modal = document.getElementById('promoModal');
            const closeBtn = document.getElementById('closePromoModal');
            const prevBtn = document.getElementById('promoPrevBtn');
            const nextBtn = document.getElementById('promoNextBtn');

            if (!modal) return;

            // Render cards once
            const stack = document.getElementById('promoCardStack');
            if (stack) {
                stack.innerHTML = this.slides.map((slide, idx) => `
                    <div class="promo-card absolute inset-0 w-full h-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing origin-center bg-[#0c3531] border border-white/10 shadow-lg transition-transform duration-300" data-index="${idx}">
                        <img src="${slide.src}" alt="${slide.title}" class="max-w-full max-h-full object-contain pointer-events-none select-none rounded-xl">
                        <!-- Overlay Zoom Button -->
                        <button onclick="event.stopPropagation(); window.openPromoPhotoSwipe(${idx});" class="absolute top-3 right-3 bg-black/60 hover:bg-[#F7921E] text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md border border-white/10 z-20" title="Zoom image">
                            <i data-lucide="maximize-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                `).join('');

                // Bind Tinder Swipe Drags
                this.bindSwipeEvents();
            }

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

            // Navigation buttons - Tinder style: rewind vs discard
            if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide('right'));

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('invisible')) {
                    if (e.key === 'Escape') this.close();
                    if (e.key === 'ArrowRight') this.nextSlide('right');
                    if (e.key === 'ArrowLeft') this.prev();
                }
            });
        },

        bindSwipeEvents: function() {
            const stack = document.getElementById('promoCardStack');
            if (!stack) return;

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let activeCard = null;

            const onStart = (clientX, clientY, targetCard) => {
                isDragging = true;
                activeCard = targetCard;
                startX = clientX;
                startY = clientY;
                activeCard.style.transition = 'none';
                activeCard.style.cursor = 'grabbing';
            };

            const onMove = (clientX, clientY) => {
                if (!isDragging || !activeCard) return;
                currentX = clientX - startX;
                currentY = clientY - startY;

                // Rotate card based on horizontal drag
                const rotation = currentX * 0.08; // degree per pixel
                activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
            };

            const onEnd = () => {
                if (!isDragging || !activeCard) return;
                isDragging = false;
                activeCard.style.cursor = 'grab';

                const swipeThreshold = 100;
                if (Math.abs(currentX) > swipeThreshold) {
                    // Fly off screen left or right (Tinder swipe)
                    const flyX = currentX > 0 ? window.innerWidth : -window.innerWidth;
                    const rotation = currentX * 0.08;
                    activeCard.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                    activeCard.style.transform = `translate(${flyX}px, ${currentY}px) rotate(${rotation}deg)`;
                    activeCard.style.opacity = '0';
                    
                    // Increment slide index and update stack directly without double-triggering animations
                    setTimeout(() => {
                        this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
                        this.render();
                    }, 200);
                } else {
                    // Snap back
                    activeCard.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25)';
                    this.updateStackStyles();
                }
                
                currentX = 0;
                currentY = 0;
                activeCard = null;
            };

            // Mouse events
            stack.addEventListener('mousedown', (e) => {
                const card = e.target.closest('.promo-card');
                if (card && card.dataset.index == this.activeSlideIndex) {
                    onStart(e.clientX, e.clientY, card);
                }
            });

            document.addEventListener('mousemove', (e) => {
                onMove(e.clientX, e.clientY);
            });

            document.addEventListener('mouseup', () => {
                onEnd();
            });

            // Touch events
            stack.addEventListener('touchstart', (e) => {
                const card = e.target.closest('.promo-card');
                if (card && card.dataset.index == this.activeSlideIndex) {
                    onStart(e.touches[0].clientX, e.touches[0].clientY, card);
                }
            }, { passive: true });

            document.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    onMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            document.addEventListener('touchend', () => {
                onEnd();
            });
        },

        open: function() {
            const modal = document.getElementById('promoModal');
            if (!modal) return;

            this.activeSlideIndex = 0;
            this.render();

            modal.classList.remove('invisible', 'opacity-0');
            modal.classList.add('flex', 'opacity-100');
            
            const container = modal.querySelector('.promo-modal-container');
            if (container) {
                container.classList.remove('scale-95', 'translate-y-8', 'opacity-0');
                container.classList.add('scale-100', 'translate-y-0', 'opacity-100');
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

        nextSlide: function(direction = 'right') {
            const cards = document.querySelectorAll('.promo-card');
            const topCard = Array.from(cards).find(c => c.dataset.index == this.activeSlideIndex);
            
            if (topCard) {
                const flyX = direction === 'right' ? window.innerWidth : -window.innerWidth;
                const rot = direction === 'right' ? 15 : -15;
                topCard.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                topCard.style.transform = `translate(${flyX}px, -20px) rotate(${rot}deg)`;
                topCard.style.opacity = '0';
            }

            setTimeout(() => {
                this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
                this.render();
            }, 200);
        },

        prev: function() {
            // Programmatically return the previous card by flying it back in from the left
            const prevIndex = (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
            this.activeSlideIndex = prevIndex;
            this.render();
            
            // Set the new top card to start off-screen and transition in
            setTimeout(() => {
                const cards = document.querySelectorAll('.promo-card');
                const topCard = Array.from(cards).find(c => c.dataset.index == prevIndex);
                if (topCard) {
                    topCard.style.transition = 'none';
                    topCard.style.transform = `translate(-${window.innerWidth}px, -20px) rotate(-15deg)`;
                    topCard.style.opacity = '0';
                    // Force reflow
                    topCard.offsetHeight;
                    topCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.4s ease-out';
                    topCard.style.transform = 'translate(0px, 0px) rotate(0deg)';
                    topCard.style.opacity = '1';
                }
            }, 30);
        },

        render: function() {
            const slide = this.slides[this.activeSlideIndex];
            const whatsappLink = document.getElementById('promoModalWhatsappLink');
            const dotsContainer = document.getElementById('promoModalDots');

            // Apply 3D stack layering styles
            this.updateStackStyles();

            // Update WhatsApp link
            if (whatsappLink) {
                const encodedMsg = encodeURIComponent(slide.whatsappMessage);
                whatsappLink.href = `https://api.whatsapp.com/send?phone=94785959333&text=${encodedMsg}`;
            }

            // Render indicator dots (static dimensions to prevent shifting)
            if (dotsContainer) {
                dotsContainer.innerHTML = this.slides.map((_, idx) => {
                    const isActive = idx === this.activeSlideIndex;
                    return `<span class="h-2.5 w-2.5 rounded-full transition-all duration-300 transform ${isActive ? 'bg-accent scale-125 shadow-sm' : 'bg-white/30 scale-100'}"></span>`;
                }).join('');
            }

            // Re-trigger Lucide icons for zoom buttons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        },

        updateStackStyles: function() {
            const cards = document.querySelectorAll('.promo-card');
            cards.forEach(card => {
                const idx = parseInt(card.dataset.index, 10);
                
                // Calculate position relative to active slide
                let offset = (idx - this.activeSlideIndex + this.slides.length) % this.slides.length;
                
                card.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.15), opacity 0.45s ease-out, z-index 0.45s step-end';
                
                if (offset === 0) {
                    // Top Card (Active)
                    card.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
                    card.style.opacity = '1';
                    card.style.zIndex = '5';
                    card.style.pointerEvents = 'auto';
                } else if (offset === 1) {
                    // Second Card
                    card.style.transform = 'translate(0px, 12px) scale(0.95) rotate(0deg)';
                    card.style.opacity = '0.85';
                    card.style.zIndex = '4';
                    card.style.pointerEvents = 'none';
                } else if (offset === 2) {
                    // Third Card
                    card.style.transform = 'translate(0px, 24px) scale(0.9) rotate(0deg)';
                    card.style.opacity = '0.55';
                    card.style.zIndex = '3';
                    card.style.pointerEvents = 'none';
                } else {
                    // Hidden Cards
                    card.style.transform = 'translate(0px, 36px) scale(0.85) rotate(0deg)';
                    card.style.opacity = '0';
                    card.style.zIndex = '2';
                    card.style.pointerEvents = 'none';
                }
            });
        }
    };

    // Global PhotoSwipe opener for promo modal
    window.openPromoPhotoSwipe = (idx) => {
        const slides = window.PromoModule.slides;
        const pswpItems = slides.map(s => ({
            src: s.src,
            width: s.src.includes('promo-flyer-3') ? 1080 : 1254, // Yala is 1080x1350, others are 1254x1254
            height: s.src.includes('promo-flyer-3') ? 1350 : 1254
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
