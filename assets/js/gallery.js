// Gallery Module - Handles gallery filtering, slider, and modal functionality
// Author: Zig Zag AI
// Description: Manages gallery features including filtering, slider, and modal displays

(function() {
    'use strict';

    window.GalleryModule = {
        galleryFilterBtns: null,
        galleryItems: null,
        currentModalIndex: 0,

        // Gallery images array (built dynamically from main gallery HTML)
        galleryImages: [],

        // Slider images (hardcoded for maintenance - new filenames)
        sliderImages: [
            { src: 'assets/img/footer-gallery/cannon-cart.jpg', title: 'Cannon Cart Adventure', location: 'Sri Lanka', description: 'Experience thrilling cannon cart rides through scenic landscapes.' },
            { src: 'assets/img/footer-gallery/lotus-tower.jpg', title: 'Lotus Tower View', location: 'Colombo', description: 'Stunning panoramic views from the iconic Lotus Tower.' },
            { src: 'assets/img/footer-gallery/mirissa-treehill.jpg', title: 'Mirissa Tree Hill', location: 'Mirissa', description: 'Breathtaking views from the famous Mirissa tree hill.' },
            { src: 'assets/img/footer-gallery/turtle-sea.jpg', title: 'Turtle Sea Conservation', location: 'Coastal Sri Lanka', description: 'Witness turtle hatching and sea turtle conservation efforts.' },
            { src: 'assets/img/footer-gallery/holy-statue.jpg', title: 'Holy Statue Shrine', location: 'Sri Lanka', description: 'Sacred statues and spiritual sites across the island.' },
            { src: 'assets/img/footer-gallery/holy-temple.jpg', title: 'Holy Temple Visit', location: 'Sri Lanka', description: 'Ancient temples and religious architecture.' },
            { src: 'assets/img/footer-gallery/temple-entrance.jpg', title: 'Temple Entrance', location: 'Sri Lanka', description: 'Beautiful entrances to historic temples.' },
            { src: 'assets/img/footer-gallery/turtle-entrance.jpg', title: 'Turtle Hatchery Entrance', location: 'Coastal Sri Lanka', description: 'Gateway to turtle conservation facilities.' },
            { src: 'assets/img/footer-gallery/holy-buddha.jpg', title: 'Holy Buddha Statue', location: 'Sri Lanka', description: 'Majestic Buddha statues and monuments.' }
        ],

        init: function() {
            // Build galleryImages from current HTML so edits are single-source in index.html
            this.buildGalleryImagesFromDOM();
            this.initGalleryModals();
            this.initSliderItems();
            this.initGallerySlider();
            this.initGalleryLightbox();
        },

        // Build gallery list from the onclick attributes in the main gallery cards only
        // (Slider uses its own images; we will resolve by filename/title when opening)
        buildGalleryImagesFromDOM: function() {
            const items = [];
            const pattern = /openGalleryModal\('\s*([^']+?)\s*'\s*,\s*'\s*([^']+?)\s*'\s*,\s*'\s*([^']+?)\s*'\s*,\s*'\s*([^']+?)\s*'\)/;

            const gridCards = document.querySelectorAll('#gallery .single-blog-post');
            gridCards.forEach(card => {
                const onClick = card.getAttribute('onclick') || '';
                const match = onClick.match(pattern);
                if (match) {
                    const [, src, title, location, description] = match;
                    items.push({ src, title, location, description });
                                } else {
                    const img = card.querySelector('img');
                    const titleEl = card.querySelector('h3.title, h3 .title, h3');
                    const titleText = titleEl ? (titleEl.textContent || '').trim() : '';
                    items.push({
                        src: img ? img.getAttribute('src') || '' : '',
                        title: titleText || 'Untitled',
                        location: '',
                        description: ''
                            });
                        }
                    });

            this.galleryImages = items;
            // Safety: ensure we have items; if not, keep existing list
            if (!Array.isArray(this.galleryImages) || this.galleryImages.length === 0) {
                console.warn('GalleryModule: No gallery items found in DOM.');
                this.galleryImages = [];
            }
        },

        // Gallery filtering (condensed)
        initGalleryFiltering: function() {
            this.galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
            this.galleryItems = document.querySelectorAll('.single-gallery-item');
            if (!this.galleryFilterBtns) return;

            this.galleryFilterBtns.forEach(btn => btn.addEventListener('click', () => {
                        const category = btn.dataset.category;
                        this.galleryFilterBtns.forEach(b => {
                    b.classList.toggle('bg-primary', b === btn);
                    b.classList.toggle('text-primary-foreground', b === btn);
                    b.classList.toggle('scale-105', b === btn);
                    b.classList.toggle('shadow-lg', b === btn);
                    b.classList.toggle('bg-transparent', b !== btn);
                    b.classList.toggle('border', b !== btn);
                    b.classList.toggle('border-border', b !== btn);
                });
                            this.galleryItems.forEach(item => {
                    const show = category === 'all' || item.dataset.category === category;
                    item.style.display = show ? 'block' : 'none';
                    item.style.opacity = show ? '1' : '0';
                    item.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
                });
            }));
        },

        // Gallery modal functions (condensed)
        initGalleryModals: function() {
            // Combine gallery and slider images for modal navigation
            this.allImages = [...this.galleryImages, ...this.sliderImages];

            window.openGalleryModal = (imageSrc, title) => {
                this.currentModalIndex = this.allImages.findIndex(img => img.src === imageSrc) ||
                                       this.allImages.findIndex(img => img.title === title) || 0;
                this.updateModalContent();
                this.showModal();
            };

            document.addEventListener('keydown', e => {
                const modal = document.getElementById('galleryModal');
                if (!modal || modal.classList.contains('invisible')) return;
                if (e.key === 'Escape') this.closeGalleryModal();
                else if (e.key === 'ArrowLeft') { e.preventDefault(); this.navigateModal(-1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); this.navigateModal(1); }
            });

            document.addEventListener('click', e => {
                if (e.target.id === 'galleryModal') this.closeGalleryModal();
            });
        },

        // Bind slider items to hardcoded sliderImages (condensed)
        initSliderItems: function() {
            document.querySelectorAll('#gallery-slider .single-gallery-item').forEach((el, index) => {
                const data = this.sliderImages[index];
                if (!data) return;
                const img = el.querySelector('img');
                const btn = el.querySelector('button');
                if (img) { img.src = data.src; img.alt = data.title; }
                if (btn) {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        window.openGalleryModal(data.src, data.title);
                    };
                }
            });
        },

        updateModalContent: function() {
            const modal = document.getElementById('galleryModal');
            const modalImage = document.getElementById('modalImage');
            const prevBtn = document.getElementById('modalPrevBtn');
            const nextBtn = document.getElementById('modalNextBtn');

            if (modal && modalImage) {
                const currentImage = this.allImages[this.currentModalIndex];

                modalImage.src = currentImage.src;
                modalImage.alt = currentImage.title;

                // Update button states
                if (prevBtn) prevBtn.style.opacity = this.currentModalIndex === 0 ? '0.5' : '1';
                if (nextBtn) nextBtn.style.opacity = this.currentModalIndex === this.allImages.length - 1 ? '0.5' : '1';
            }
        },

        showModal: function() {
            const modal = document.getElementById('galleryModal');
            if (!modal) return;
            modal.classList.replace('opacity-0', 'opacity-100');
            modal.classList.replace('invisible', 'visible');
            const content = modal.querySelector('.relative');
            if (content) {
                content.classList.replace('scale-95', 'scale-100');
                }
                document.body.style.overflow = 'hidden';
        },

        closeGalleryModal: function() {
            const modal = document.getElementById('galleryModal');
            if (!modal) return;
            modal.classList.replace('opacity-100', 'opacity-0');
            modal.classList.replace('visible', 'invisible');
            const content = modal.querySelector('.relative');
            if (content) {
                content.classList.replace('scale-100', 'scale-95');
                }
                document.body.style.overflow = 'auto';
        },

        // Placeholder for global functions - will be set after module initialization

        // Navigation function
        navigateModal: function(direction) {
            const modal = document.getElementById('galleryModal');
            if (!modal || modal.classList.contains('invisible')) return;

            this.currentModalIndex += direction;

            // Loop around if at the beginning or end
            if (this.currentModalIndex < 0) {
                this.currentModalIndex = this.allImages.length - 1;
            } else if (this.currentModalIndex >= this.allImages.length) {
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
