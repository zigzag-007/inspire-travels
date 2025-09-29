// Gallery Module - Handles gallery filtering, slider, and modal functionality
// Author: Zig Zag AI
// Description: Manages gallery features including filtering, slider, and modal displays

(function() {
    'use strict';

    window.GalleryModule = {
        galleryFilterBtns: null,
        galleryItems: null,
        currentModalIndex: 0,

        // Gallery images array for navigation
        galleryImages: [
            // Main Gallery Images (from gallery folder)
            { src: 'assets/img/gallery/adams-peak.jpg', title: 'Adams Peak Sunrise', location: 'Adams Peak', description: 'Sacred mountain peak with breathtaking sunrise views' },
            { src: 'assets/img/gallery/beach-sunset.jpg', title: 'Beach Sunset', location: 'Sri Lankan Coast', description: 'Stunning sunset over pristine beaches' },
            { src: 'assets/img/gallery/galle-fort.jpg', title: 'Galle Fort', location: 'Galle', description: 'Historic Dutch colonial fort overlooking the ocean' },
            { src: 'assets/img/gallery/nine-arch-bridge.jpg', title: 'Nine Arch Bridge', location: 'Ella', description: 'Iconic railway bridge surrounded by lush greenery' },
            { src: 'assets/img/gallery/rainforest.jpg', title: 'Tropical Rainforest', location: 'Sinharaja', description: 'Biodiverse rainforest with exotic wildlife' },
            { src: 'assets/img/gallery/sigiriya.jpg', title: 'Sigiriya Rock Fortress', location: 'Sigiriya', description: 'Ancient rock fortress and UNESCO World Heritage site' },
            { src: 'assets/img/gallery/tea-hills.jpg', title: 'Tea Hills', location: 'Nuwara Eliya', description: 'Rolling tea plantations in the hill country' },
            { src: 'assets/img/gallery/temple-visit.jpg', title: 'Temple Visit', location: 'Kandy', description: 'Sacred Buddhist temple with rich cultural heritage' },
            { src: 'assets/img/gallery/whale-watching.jpg', title: 'Whale Watching', location: 'Mirissa', description: 'Blue whale watching in the Indian Ocean' },

            // Background Images
            { src: 'assets/img/bg/tropical-beach-1.jpg', title: 'Pristine Beach Paradise', location: 'Unawatuna', description: 'Crystal clear waters and swaying palm trees' },
            { src: 'assets/img/bg/waterfall-1.jpg', title: 'Cascading Waterfall', location: 'Bambarakanda', description: 'Sri Lanka\'s highest waterfall in all its glory' },
            { src: 'assets/img/bg/mountain-lake-1.jpg', title: 'Serene Mountain Lake', location: 'Ella', description: 'Peaceful lake surrounded by misty mountains' },
            { src: 'assets/img/bg/city-sunset-1.jpg', title: 'City Sunset View', location: 'Colombo', description: 'Breathtaking sunset over the bustling city' },

            // Feature Images
            { src: 'assets/img/features/wildlife-elephant.jpg', title: 'Majestic Elephant', location: 'Yala National Park', description: 'Wild elephant in its natural habitat' },
            { src: 'assets/img/features/spice-market.jpg', title: 'Vibrant Spice Market', location: 'Kandy', description: 'Colorful spices and local market culture' },
            { src: 'assets/img/features/stilt-fisherman.jpg', title: 'Traditional Stilt Fisherman', location: 'Galle', description: 'Iconic Sri Lankan fishing tradition' },
            { src: 'assets/img/features/surfing.jpg', title: 'Surfing Adventure', location: 'Arugam Bay', description: 'World-class surfing destination' },
            { src: 'assets/img/features/tea-picking.jpg', title: 'Tea Picking Experience', location: 'Nuwara Eliya', description: 'Hands-on tea plantation experience' },
            { src: 'assets/img/features/train-ride.jpg', title: 'Scenic Train Journey', location: 'Ella to Kandy', description: 'Picturesque train ride through tea country' },

            // Package Images
            { src: 'assets/img/packages/adventure-package.jpg', title: 'Adventure Package', location: 'Sri Lanka', description: 'Experience thrilling adventures in the heart of Sri Lanka with our adventure package.' },
            { src: 'assets/img/packages/beach-package.jpg', title: 'Beach Package', location: 'Sri Lanka', description: 'Relax and unwind on Sri Lanka\'s pristine beaches with our exclusive beach package.' },
            { src: 'assets/img/packages/cultural-package.jpg', title: 'Cultural Package', location: 'Sri Lanka', description: 'Immerse yourself in Sri Lanka\'s rich cultural heritage with our cultural package.' },
            { src: 'assets/img/packages/hill-country-package.jpg', title: 'Hill Country Package', location: 'Sri Lanka', description: 'Discover the misty mountains and tea plantations of Sri Lanka\'s hill country.' },
            { src: 'assets/img/packages/wildlife-package.jpg', title: 'Wildlife Package', location: 'Sri Lanka', description: 'Encounter Sri Lanka\'s incredible wildlife with our specialized wildlife safari package.' },
            { src: 'assets/img/packages/budget-package.jpg', title: 'Budget Package', location: 'Sri Lanka', description: 'Explore Sri Lanka on a budget with our affordable travel packages.' },
            { src: 'assets/img/packages/family-package.jpg', title: 'Family Package', location: 'Sri Lanka', description: 'Perfect family-friendly adventures for all ages in Sri Lanka.' },
            { src: 'assets/img/packages/honeymoon-package.jpg', title: 'Honeymoon Package', location: 'Sri Lanka', description: 'Romantic getaways and intimate experiences for couples.' },
            { src: 'assets/img/packages/luxury-package.jpg', title: 'Luxury Package', location: 'Sri Lanka', description: 'Premium luxury experiences with the finest accommodations and services.' }
        ],

        init: function() {
            this.initGalleryFiltering();
            this.initGalleryModals();
            this.initGallerySlider();
            this.initGalleryLightbox();
        },

        // Gallery filtering
        initGalleryFiltering: function() {
            this.galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
            this.galleryItems = document.querySelectorAll('.gallery-item');

            if (this.galleryFilterBtns) {
                this.galleryFilterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const category = btn.dataset.category;

                        // Update button states
                        this.galleryFilterBtns.forEach(b => {
                            b.classList.remove('bg-primary', 'text-primary-foreground', 'scale-105', 'shadow-lg');
                            b.classList.add('bg-transparent', 'border', 'border-border');
                        });

                        btn.classList.add('bg-primary', 'text-primary-foreground', 'scale-105', 'shadow-lg');
                        btn.classList.remove('bg-transparent', 'border', 'border-border');

                        // Filter gallery items
                        if (this.galleryItems) {
                            this.galleryItems.forEach(item => {
                                if (category === 'all' || item.dataset.category === category) {
                                    item.style.display = 'block';
                                    setTimeout(() => {
                                        item.style.opacity = '1';
                                        item.style.transform = 'translateY(0)';
                                    }, 100);
                                } else {
                                    item.style.opacity = '0';
                                    item.style.transform = 'translateY(20px)';
                                    setTimeout(() => {
                                        item.style.display = 'none';
                                    }, 300);
                                }
                            });
                        }
                    });
                });
            }
        },

        // Gallery modal functions for package images
        initGalleryModals: function() {
            window.openGalleryModal = (imageSrc, title, location, description) => {
                // Find the index of the current image
                this.currentModalIndex = this.galleryImages.findIndex(img => img.src === imageSrc);

                // If image not found, try to find by title as fallback
                if (this.currentModalIndex === -1) {
                    this.currentModalIndex = this.galleryImages.findIndex(img => img.title === title);
                }

                // If still not found, default to 0
                if (this.currentModalIndex === -1) {
                    this.currentModalIndex = 0;
                }

                this.updateModalContent();
                this.showModal();
            };

            // Close modal on escape key and handle arrow keys
            document.addEventListener('keydown', (e) => {
                const modal = document.getElementById('galleryModal');
                if (!modal || modal.classList.contains('invisible')) return;

                if (e.key === 'Escape') {
                    this.closeGalleryModal();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigateModal(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateModal(1);
                }
            });

            // Close modal on backdrop click
            document.addEventListener('click', (e) => {
                const modal = document.getElementById('galleryModal');
                if (e.target === modal) {
                    this.closeGalleryModal();
                }
            });
        },

        updateModalContent: function() {
            const modal = document.getElementById('galleryModal');
            const modalImage = document.getElementById('modalImage');
            const prevBtn = document.getElementById('modalPrevBtn');
            const nextBtn = document.getElementById('modalNextBtn');

            if (modal && modalImage) {
                const currentImage = this.galleryImages[this.currentModalIndex];

                modalImage.src = currentImage.src;
                modalImage.alt = currentImage.title;

                // Update button states
                if (prevBtn) prevBtn.style.opacity = this.currentModalIndex === 0 ? '0.5' : '1';
                if (nextBtn) nextBtn.style.opacity = this.currentModalIndex === this.galleryImages.length - 1 ? '0.5' : '1';
            }
        },

        showModal: function() {
            const modal = document.getElementById('galleryModal');
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

        closeGalleryModal: function() {
            const modal = document.getElementById('galleryModal');
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

        // Placeholder for global functions - will be set after module initialization

        // Navigation function
        navigateModal: function(direction) {
            const modal = document.getElementById('galleryModal');
            if (!modal || modal.classList.contains('invisible')) return;

            this.currentModalIndex += direction;

            // Loop around if at the beginning or end
            if (this.currentModalIndex < 0) {
                this.currentModalIndex = this.galleryImages.length - 1;
            } else if (this.currentModalIndex >= this.galleryImages.length) {
                this.currentModalIndex = 0;
            }

            this.updateModalContent();
        },

        // Gallery Slider Functionality (GoWilds Style)
        initGallerySlider: function() {
            let currentGalleryIndex = 0;
            let gallerySliderInterval;
            const gallerySlider = document.getElementById('gallery-slider');
            const gallerySliderItems = document.querySelectorAll('.single-gallery-item');
            const totalGalleryItems = gallerySliderItems.length;
            const itemWidth = 320; // w-80 = 320px
            const visibleItems = 5; // Number of items visible at once

            if (!gallerySlider || totalGalleryItems === 0) return;

            const updateGallerySlider = () => {
                if (gallerySlider) {
                    const translateX = -currentGalleryIndex * itemWidth;
                    gallerySlider.style.transform = `translateX(${translateX}px)`;
                }
            };

            const nextGallerySlide = () => {
                currentGalleryIndex = (currentGalleryIndex + 1) % (totalGalleryItems - visibleItems + 1);
                updateGallerySlider();
            };

            const startGallerySlider = () => {
                // Auto-advance every 3 seconds
                gallerySliderInterval = setInterval(nextGallerySlide, 3000);
            };

            const stopGallerySlider = () => {
                if (gallerySliderInterval) {
                    clearInterval(gallerySliderInterval);
                }
            };

            // Pause on hover
            const galleryContainer = document.querySelector('.gallery-slider-container');
            if (galleryContainer) {
                galleryContainer.addEventListener('mouseenter', stopGallerySlider);
                galleryContainer.addEventListener('mouseleave', startGallerySlider);
            }

            // Start the automatic slider
            startGallerySlider();
        },

        // Gallery lightbox functionality (basic implementation)
        initGalleryLightbox: function() {
            if (this.galleryItems) {
                this.galleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        // Basic alert for now - could be enhanced with a proper lightbox
                        const img = item.querySelector('img');
                        const title = item.querySelector('h3').textContent;
                        console.log(`Opening lightbox for: ${title}`);
                        // In a full implementation, this would open a modal with the image
                    });
                });
            }
        }
    };

})();

// Make modal functions globally available - using the module instance
const galleryModule = window.GalleryModule;
window.closeGalleryModal = () => galleryModule.closeGalleryModal();
window.openGalleryModal = (imageSrc, title, location, description) => galleryModule.openGalleryModal(imageSrc, title, location, description);
window.navigateModal = (direction) => galleryModule.navigateModal(direction);
