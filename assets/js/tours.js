// Tours Module - Manages tour filtering, hover effects, and modals
// Author: Zig Zag AI
// Description: Handles tour functionality including filtering, animations, and modal displays

(function() {
    'use strict';

    window.ToursModule = {
        tourCardsLarge: null,
        categoryBtns: null,
        tourCardsSmall: null,

        // Tour data with EXACT detailed itineraries as provided by user
        tourData: [
            {
                title: "Sri Lanka Highlights Escape",
                image: "assets/img/packages/3-day-package.jpeg",
                rating: 9.0,
                duration: "5 DAYS",
                location: "COLOMBO, KANDY & BENTOTA",
                description: "A perfect 5-day escape combining cultural highlights, city exploration, and coastal relaxation.",
                highlights: [
                    "Day 1: Scenic drive to Kandy via Pinnawala Elephant Sanctuary / stay Kandy",
                    "Day 2: Tea factory walk & Nuwara Eliya colonial city explorer / Stay Nuwara Eliya",
                    "Day 3: Bentota water sports & golden beach leisure / stay Bentota",
                    "Day 4: Colombo landmarks tour & final departure"
                ]
            },
            {
                title: "Hills to Beach Escape",
                image: "assets/img/packages/4-day-package.jpeg",
                rating: 9.2,
                duration: "7 DAYS",
                location: "SIGIRIYA TO MIRISSA",
                description: "Journey through cultural fortresses, tranquil harbors, and hill country scenic views to southern beaches.",
                highlights: [
                    "Day 1: Sigiriya Lion Rock fortress climb & village tour / stay Sigiriya",
                    "Day 2: Trincomalee harbor view & Nilaveli beach swim / Stay Trincomalee",
                    "Day 3-4: Temple of the Tooth Relic & Kandy botanical gardens / Stay Kandy",
                    "Day 5: Scenic train ride to Ella & Nine Arch Bridge hike / stay Ella",
                    "Day 6: Mirissa whale watching & sunset coconut hill walk / stay Mirissa",
                    "Day 7: Colombo landmarks sightseeing & airport transfer"
                ]
            },
            {
                title: "Golden Triangle & Beyond",
                image: "assets/img/packages/5-day-package.jpeg",
                rating: 9.3,
                duration: "7 DAYS",
                location: "COLOMBO, KANDY & YALA",
                description: "Discover cultural heritage monuments, high-country waterfalls, and Yala wildlife safari.",
                highlights: [
                    "Day 1: Colombo arrival & evening city street-food walk / stay Colombo",
                    "Day 2: Spice gardens & traditional Kandy cultural dance show / stay Kandy",
                    "Day 3: Ramboda waterfalls & Nuwara Eliya tea estates / stay Nuwara Eliya",
                    "Day 4: Ella Rock trekking & iconic Ravana waterfall visit / stay Ella",
                    "Day 5: Wilderness safari in Yala National Park / Stay Yala",
                    "Day 6: Madu River boat safari & marine turtle hatchery / stay Bentota",
                    "Day 7: Galle Fort ramparts walk, Colombo tour & airport departure"
                ]
            },
            {
                title: "Ramayanaya Tour",
                image: "assets/img/packages/7-day-package.jpeg",
                rating: 9.5,
                duration: "8 DAYS",
                location: "ANURADHAPURA TO KATARAGAMA",
                description: "Follow the sacred paths of Ramayana legend through historic shrines and temples.",
                highlights: [
                    "Day 1: Ancient ruins explorer in Anuradhapura kingdom / stay Anuradhapura",
                    "Day 2: Trincomalee Koneswaram temple & beach swim / stay Trincomalee",
                    "Day 3-4: Kandy cultural temples & Royal Botanical Gardens / stay Kandy",
                    "Day 5: Seetha Amman temple & Nuwara Eliya tea estate tour / stay Nuwara Eliya",
                    "Day 6: Kataragama temple complex spiritual experience / stay Kataragama",
                    "Day 7: Colombo landmarks tour & evening Galle Face green walk / Stay Colombo",
                    "Day 8: Colombo premium shopping walk & airport transfer"
                ]
            },
            {
                title: "Pearl Of Asia Tour",
                image: "assets/img/packages/10-day-package.jpeg",
                rating: 9.4,
                duration: "10 DAYS",
                location: "DAMBULLA TO COLOMBO",
                description: "A comprehensive 10-day tour covering cave temples, tea hills, elephant safaris, and beach leisure.",
                highlights: [
                    "Day 1: Golden Temple of Dambulla & Sigiriya viewpoint / stay Dambulla",
                    "Day 2: Kandy Tooth Relic Temple & evening cultural show / stay Kandy",
                    "Day 3: Nuwara Eliya tea valley & Gregory Lake boat ride / stay Nuwara Eliya",
                    "Day 4: Ella gap hiking & Nine Arch Bridge walk / stay Ella",
                    "Day 5: Elephant Transit Home & Udawalawe safari / stay Udawalawe",
                    "Day 6-7: Mirissa gold beach relaxation & surfing / stay Mirissa",
                    "Day 8: Madu River boat cruise & Bentota beach leisure / stay Bentota",
                    "Day 9: Colombo historic landmarks & shopping explorer / Stay Colombo",
                    "Day 10: Colombo departure transfer"
                ]
            },
            {
                title: "Sri Lanka Grand Tour",
                image: "assets/img/packages/14-day-package.jpeg",
                rating: 10.0,
                duration: "14 DAYS",
                location: "COMPLETE SRI LANKA",
                description: "The ultimate 14-day grand tour covering every cultural monument and scenic landscape of Sri Lanka.",
                highlights: [
                    "Day 1: Colombo arrival & evening city walk / stay Colombo",
                    "Day 2-3: Sigiriya Lion Rock fortress & Pidurangala sunset / Stay Sigiriya",
                    "Day 4: Polonnaruwa medieval ruins bicycle exploration / stay Polonnaruwa",
                    "Day 5-6: Trincomalee harbor & Pigeon Island snorkeling / stay Trincomalee",
                    "Day 7: Kandy city highlights & Peradeniya gardens / stay Kandy",
                    "Day 8: Nuwara Eliya tea factory walk & Gregory Lake boat ride / stay Nuwara Eliya",
                    "Day 9-10: Ella gap trekking & Ravana pool visit / stay Ella",
                    "Day 11: Yala National Park leopard watching safari / stay Yala",
                    "Day 12: Hirikatiya surf bay beach relaxation / stay Hirikatiya",
                    "Day 13: Weligama bay surfing & Bentota boat ride / stay Bentota",
                    "Day 14: Colombo city highlights & airport departure"
                ]
            }
        ],

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
