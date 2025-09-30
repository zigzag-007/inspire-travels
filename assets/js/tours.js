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
                title: "Ceylon City & Beach Escape",
                image: "assets/img/main-gallery/sigiriya-lion-rock.jpg",
                rating: 8.0,
                duration: "3 DAYS",
                location: "COLOMBO & BENTOTA",
                description: "A perfect 3-day escape combining city exploration and beach relaxation.",
                highlights: ["Day 1: Colombo city tour / stay Colombo", "Day 2: Bentota activity / stay Bentota", "Day 3: Tour end departure"]
            },
            {
                title: "City to Sea Adventure",
                image: "assets/img/main-gallery/mirissa-coconut-tree-hill.jpg",
                rating: 8.0,
                duration: "4 DAYS",
                location: "COLOMBO TO MIRISSA",
                description: "Journey from urban Colombo to the pristine southern beaches.",
                highlights: ["Day 1: Colombo city tour / stay Colombo", "Day 2: Bentota activity / stay Bentota", "Day 3: Mirissa activity / stay Mirissa", "Day 4: Tour end departure"]
            },
            {
                title: "Hills to Coast Escape",
                image: "assets/img/main-gallery/horton-plains-national-park.jpg",
                rating: 8.0,
                duration: "5 DAYS",
                location: "KANDY TO MIRISSA",
                description: "Experience Sri Lanka's beautiful hill country before reaching the coast.",
                highlights: ["Day 1: Kandy city tour / stay Kandy", "Day 2: Nuwara Eliya / stay Nuwara Eliya", "Day 3: Ella / stay Ella", "Day 4: Mirissa / stay Mirissa", "Day 5: Colombo city tour and departure"]
            },
            {
                title: "Golden Triangle & Beyond",
                image: "assets/img/main-gallery/waterfall-tour.jpg",
                rating: 8.0,
                duration: "7 DAYS",
                location: "SIGIRIYA TO GALLE",
                description: "Explore Sri Lanka's cultural triangle and coastal heritage.",
                highlights: ["Day 1: Sigiriya / stay Sigiriya", "Day 2: Kandy city tour / stay Kandy", "Day 3: Nuwara Eliya / stay Nuwara Eliya", "Day 4: Ella / stay Ella", "Day 5-6: Galle / stay Galle", "Day 7: Colombo city tour and departure"]
            },
            {
                title: "Pearl of Asia Journey",
                image: "assets/img/main-gallery/pidurangala-rock.jpg",
                rating: 8.0,
                duration: "10 DAYS",
                location: "COMPREHENSIVE TOUR",
                description: "The ultimate comprehensive journey through Sri Lanka's highlights.",
                highlights: ["Day 1: Negombo / stay Negombo", "Day 2: Sigiriya / stay Sigiriya", "Day 3: Kandy city tour / stay Kandy", "Day 4: Nuwara Eliya / stay Nuwara Eliya", "Day 5: Ella / stay Ella", "Day 6: Udawalawe / stay Udawalawe", "Day 7-8: Mirissa / stay Mirissa", "Day 9: Bentota / stay Bentota", "Day 10: Colombo city tour and departure"]
            },
            {
                title: "Sri Lanka Grand Tour",
                image: "assets/img/main-gallery/pinnawala-elephant-watching.jpg",
                rating: 8.0,
                duration: "14 DAYS",
                location: "COMPLETE SRI LANKA",
                description: "The most comprehensive tour covering every major destination in Sri Lanka.",
                highlights: ["Day 1: Negombo / stay Negombo", "Day 2: Anuradhapura / stay Trincomalee", "Day 3: Trincomalee city / stay Sigiriya", "Day 4: Sigiriya, Dambulla / stay Sigiriya", "Day 5: Kandy city tour / stay Kandy", "Day 6: Nuwara Eliya / stay Nuwara Eliya", "Day 7: Ella / stay Ella", "Day 8: Yala / stay Yala", "Day 9: Udawalawe / stay Udawalawe", "Day 10: Mirissa / stay Mirissa", "Day 11-12: Bentota / stay Bentota", "Day 13-14: Colombo city tour and departure"]
            }
        ],

        init: function() {
            this.initTourHoverEffects();
            this.initTourModals();
            this.initFloatingActionButton();
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
                    modalDescription.textContent = tour.description;
                    modalHighlights.innerHTML = tour.highlights.map(highlight =>
                        `<li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-primary"></i>${highlight}</li>`
                    ).join('');

                    // Re-initialize icons for the new content
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
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
                if (e.target === modal) {
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
                document.body.style.overflow = 'hidden';
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
                document.body.style.overflow = 'auto';
            }
        },

        // Floating Action Button functionality
        initFloatingActionButton: function() {
            const floatingBtn = document.querySelector('.fixed.bottom-6.right-6 button');
            if (floatingBtn) {
                floatingBtn.addEventListener('click', () => {
                    // This would typically open a contact modal or initiate a call
                    window.location.href = 'tel:+94785959333';
                });
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
