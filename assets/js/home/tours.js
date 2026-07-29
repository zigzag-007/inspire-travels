// Tours Module - Manages tour filtering, hover effects, and modals
// Author: Zig Zag AI
// Description: Handles tour functionality including filtering, animations, and modal displays

(function() {
    'use strict';

    window.ToursModule = {
        tourCardsLarge: null,
        categoryBtns: null,
        tourCardsSmall: null,

        // Shared package data is loaded before this module.
        tourData: window.TourDataModule ? window.TourDataModule.tourData : [],

        init: function() {
            this.initTourHoverEffects();
            this.initTourModals();
            this.initScrollAnimations();
        },

        // Tour card hover effects
        initTourHoverEffects: function() {
            this.tourCardsLarge = document.querySelectorAll('.tour-card');
            if (this.tourCardsLarge) {
                this.tourCardsLarge.forEach(card => {
                    card.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-8px)';
                    });

                    card.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0)';
                    });
                });
            }
        },


        // Tour modal functionality (for duration/location buttons)
        initTourModals: function() {
            // Tour modal functionality - no carousel needed
            window.openTourModal = (tourIndex) => {
                const tour = this.tourData[tourIndex];
                const modal = document.getElementById('tourModal');
                const modalTitle = document.getElementById('tourModalTitle');
                const modalDescription = document.getElementById('tourModalDescription');
                const modalHighlights = document.getElementById('tourModalHighlights');

                if (modal && modalTitle && modalDescription && modalHighlights) {
                    modalTitle.textContent = tour.title;
                    modalDescription.textContent = ''; // description hidden per design
                    modalHighlights.innerHTML = tour.highlights.map(highlight =>
                        `<li class="flex items-start gap-3 text-slate-700 font-medium py-1"><span class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 mt-0.5"><i data-lucide="check" class="w-3.5 h-3.5"></i></span><span>${highlight}</span></li>`
                    ).join('');

                    // Re-initialize icons for the new content
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }

                    // Dynamically set WhatsApp link with selected package name & duration (Premium formatted message)
                    // Dynamically set WhatsApp link with selected package name & duration (Premium formatted message)
                    const whatsappBtn = modal.querySelector('a[href*="whatsapp.com/send"]');
                    if (whatsappBtn) {
                        const star  = '\u2B50';
                        const plane = '\u2708\uFE0F';
                        const clock = '\u23F3';
                        const pin   = '\uD83D\uDCCD';
                        const message = encodeURIComponent(
                            `${star} *New Tour Inquiry - Inspire Travels* ${star}\n\n` +
                            `Hi! I am interested in booking this customized tour package:\n\n` +
                            `${plane} *Package:* ${tour.title}\n` +
                            `${clock} *Duration:* ${tour.duration}\n` +
                            `${pin} *Route:* ${tour.location}\n\n` +
                            `Could you please verify availability and share pricing details?\n\nThank you!`
                        );
                        whatsappBtn.href = `https://api.whatsapp.com/send?phone=94785959333&text=${message}`;
                    }

                    // Show scrollbar on active scrolling using temporary class
                    const scrollContainer = modal.querySelector('.custom-scrollbar');
                    if (scrollContainer) {
                        scrollContainer.classList.remove('is-scrolling');
                        scrollContainer.addEventListener('scroll', () => {
                            scrollContainer.classList.add('is-scrolling');
                            clearTimeout(scrollContainer.scrollTimeout);
                            scrollContainer.scrollTimeout = setTimeout(() => {
                                scrollContainer.classList.remove('is-scrolling');
                            }, 800);
                        });
                    }

                    this.showTourModal();
                }
            };

            // Close tour modal on escape key and handle backdrop clicks
            document.addEventListener('keydown', (e) => {
                const modal = document.getElementById('tourModal');
                if (!modal || modal.classList.contains('invisible')) return;

                if (e.key === 'Escape') {
                    this.closeTourModal();
                }
            });

            // Close tour modal on backdrop click
            document.addEventListener('click', (e) => {
                const modal = document.getElementById('tourModal');
                if (!modal || modal.classList.contains('invisible')) return;

                const card = modal.querySelector('.tour-modal-card');
                if (card && !card.contains(e.target) && modal.contains(e.target)) {
                    this.closeTourModal();
                }
            });
        },

        showTourModal: function() {
            const modal = document.getElementById('tourModal');
            if (modal) {
                modal.classList.remove('opacity-0', 'invisible');
                modal.classList.add('opacity-100', 'visible');
                const modalContent = modal.querySelector('.relative');
                if (modalContent) {
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }
                // Lock scrollbars on body and documentElement for premium look
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            }
        },

        closeTourModal: function() {
            const modal = document.getElementById('tourModal');
            if (modal) {
                modal.classList.add('opacity-0', 'invisible');
                modal.classList.remove('opacity-100', 'visible');
                const modalContent = modal.querySelector('.relative');
                if (modalContent) {
                    modalContent.classList.remove('scale-100');
                    modalContent.classList.add('scale-95');
                }
                // Restore scrollbars
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        },


        // Animate elements on scroll with optimized performance
        initScrollAnimations: function() {
            let ticking = false; // RAF throttle flag

            const animateOnScroll = () => {
                const elements = document.querySelectorAll('.tour-card, .gallery-item, [class*="fade-in"]');

                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;

                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('animate-fade-in');
                    }
                });
                ticking = false;
            };

            // Use requestAnimationFrame for smoother animations
            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(animateOnScroll);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', onScroll, { passive: true });

            // Initialize animations
            animateOnScroll();
        },

        // Utility function for debouncing
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

})();

// Make modal functions globally available - using the module instance
const toursModule = window.ToursModule;
window.closeTourModal = () => toursModule.closeTourModal();
window.openTourModal = (tourIndex) => toursModule.openTourModal(tourIndex);
