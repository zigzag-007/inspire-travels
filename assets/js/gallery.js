// Gallery Module - Handles gallery filtering, slider, and PhotoSwipe functionality
// Author: Zig Zag AI
// Description: Manages gallery features including filtering, slider, and PhotoSwipe integration

(function() {
    'use strict';

    window.GalleryModule = {
        galleryFilterBtns: null,
        galleryItems: null,
        lightbox: null, // PhotoSwipe instance

        // Gallery images array (built dynamically from main gallery HTML)
        galleryImages: [],

        // Slider images (hardcoded for maintenance - new filenames)
        sliderImages: [
            { src: 'assets/img/footer-gallery/sunset-group-photo.jpg', title: 'Sunset Group Adventure', location: 'Sri Lanka', description: 'Unforgettable moments with friends at a scenic sunset viewpoint.' },
            { src: 'assets/img/footer-gallery/cannon-cart.jpg', title: 'Cannon Cart Adventure', location: 'Sri Lanka', description: 'Experience thrilling cannon cart rides through scenic landscapes.' },
            { src: 'assets/img/footer-gallery/thank-you-collage.jpg', title: 'Thank You for Visit Sri Lanka', location: 'Sri Lanka', description: 'Treasured memories and happy moments from our tour experiences.' },
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
            this.initGalleryFiltering();
            this.initSliderItems();
            this.initGallerySlider();
        },

        // Build gallery list from the onclick attributes in the main gallery cards only
        buildGalleryImagesFromDOM: function() {
            if (window.GalleryData && window.GalleryData.length > 0) {
                this.galleryImages = window.GalleryData;
                return;
            }

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

        activeCategory: 'all',
        activeYear: 'all',

        // Gallery filtering
        initGalleryFiltering: function() {
            const categoryBtns = document.querySelectorAll('.gallery-filter-btn');
            const yearBtns = document.querySelectorAll('.gallery-year-btn');

            if (!categoryBtns && !yearBtns) return;

            const applyCombinedFilters = () => {
                // Dynamically fetch items inside click handler to resolve timing race conditions
                const galleryItems = document.querySelectorAll('#dynamic-gallery-grid .single-blog-post, .single-gallery-item');
                
                galleryItems.forEach(item => {
                    // Check category match
                    const itemCategory = item.dataset.category || '';
                    let categoryMatch = false;
                    
                    if (this.activeCategory === 'all') {
                        // Exclude marketing flyers from 'All Photos' to preserve premium photography aesthetic
                        categoryMatch = itemCategory !== 'offers';
                    } else {
                        categoryMatch = itemCategory === this.activeCategory;
                    }

                    // Check year match
                    const itemYear = item.dataset.year || '';
                    const yearMatch = this.activeYear === 'all' || itemYear === this.activeYear;

                    const show = categoryMatch && yearMatch;
                    
                    item.style.display = show ? 'block' : 'none';
                    item.style.opacity = show ? '1' : '0';
                    item.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
                });
            };

            if (categoryBtns) {
                categoryBtns.forEach(btn => btn.addEventListener('click', () => {
                    this.activeCategory = btn.dataset.category || 'all';
                    categoryBtns.forEach(b => {
                        const isActive = b === btn;
                        b.classList.toggle('bg-primary', isActive);
                        b.classList.toggle('text-primary-foreground', isActive);
                        b.classList.toggle('scale-105', isActive);
                        b.classList.toggle('shadow-md', isActive);
                        b.classList.toggle('bg-transparent', !isActive);
                        b.classList.toggle('border', !isActive);
                        b.classList.toggle('border-border', !isActive);
                    });
                    applyCombinedFilters();
                }));
            }

            if (yearBtns) {
                yearBtns.forEach(btn => btn.addEventListener('click', () => {
                    this.activeYear = btn.dataset.year || 'all';
                    yearBtns.forEach(b => {
                        const isActive = b === btn;
                        b.classList.toggle('bg-primary', isActive);
                        b.classList.toggle('text-primary-foreground', isActive);
                        b.classList.toggle('scale-105', isActive);
                        b.classList.toggle('shadow-md', isActive);
                        b.classList.toggle('bg-transparent', !isActive);
                        b.classList.toggle('border', !isActive);
                        b.classList.toggle('border-border', !isActive);
                    });
                    applyCombinedFilters();
                }));
            }

            // Automatically trigger filter from query parameter (e.g. gallery.html?filter=offers)
            const urlParams = new URLSearchParams(window.location.search);
            const filterParam = urlParams.get('filter');
            if (filterParam && categoryBtns) {
                const matchingBtn = Array.from(categoryBtns).find(btn => btn.dataset.category === filterParam);
                if (matchingBtn) {
                    setTimeout(() => {
                        matchingBtn.click();
                    }, 100);
                }
            } else {
                applyCombinedFilters();
            }
        },

        // Open PhotoSwipe Lightbox
        openGalleryModal: function(imageSrc, title, location, description) {
            const allImages = [...this.galleryImages, ...this.sliderImages];
            
            // Find index of clicked image
            let index = allImages.findIndex(img => img.src === imageSrc);
            if (index === -1) index = 0;

            // Prepare items for PhotoSwipe with immediate dimension discovery
            const pswpItems = allImages.map(item => {
                const data = {
                    src: item.src,
                    w: 0,
                    h: 0,
                    alt: item.title,
                    title: item.title,
                    description: item.description
                };

                // Try to find the image in the DOM to get dimensions instantly
                const existingImg = document.querySelector(`img[src*="${item.src.split('/').pop()}"]`);
                if (existingImg && existingImg.naturalWidth > 0) {
                    data.w = existingImg.naturalWidth;
                    data.h = existingImg.naturalHeight;
                    data.msrc = existingImg.src; // Use as thumbnail for smoother transition
                }

                return data;
            });

            // For the first image, if we still don't have dimensions, try to get them before opening
            // This prevents the "stretching" on the very first view
            const startItem = pswpItems[index];
            if (startItem.w === 0) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    startItem.w = tempImg.naturalWidth;
                    startItem.h = tempImg.naturalHeight;
                    this.launchPhotoSwipe(pswpItems, index);
                };
                tempImg.src = startItem.src;
            } else {
                this.launchPhotoSwipe(pswpItems, index);
            }
        },

        // Helper to launch the gallery
        launchPhotoSwipe: function(items, index) {
            const allImages = [...this.galleryImages, ...this.sliderImages];
            
            const options = {
                dataSource: items,
                index: index,
                pswpModule: window.PhotoSwipe,
                closeOnVerticalDrag: true,
                bgOpacity: 0.9,
                padding: { 
                    top: window.innerWidth < 768 ? 40 : 80, 
                    bottom: window.innerWidth < 768 ? 40 : 80, 
                    left: window.innerWidth < 768 ? 10 : 20, 
                    right: window.innerWidth < 768 ? 10 : 20 
                },
                
                // ZOOM ANIMATION LOGIC
                // This function tells PhotoSwipe where the thumbnail is on the screen
                getThumbBoundsFn: (idx) => {
                    const item = allImages[idx];
                    if (!item) return;
                    
                    // Find the thumbnail in the DOM
                    // We look for an image that matches the filename
                    const fileName = item.src.split('/').pop();
                    const thumbnail = document.querySelector(`img[src*="${fileName}"]`);
                    
                    if (thumbnail) {
                        const rect = thumbnail.getBoundingClientRect();
                        return {
                            x: rect.left + window.scrollX,
                            y: rect.top + window.scrollY,
                            w: rect.width
                        };
                    }
                },
                
                // Animation settings
                showAnimationDuration: 400,
                hideAnimationDuration: 400,
                showHideAnimationType: 'zoom' 
            };

            const pswp = new window.PhotoSwipe(options);

            // Register custom caption
            pswp.on('uiRegister', function() {
                pswp.ui.registerElement({
                    name: 'custom-caption',
                    order: 9,
                    isButton: false,
                    appendTo: 'root',
                    onInit: (el, pswpInstance) => {
                        pswpInstance.on('change', () => {
                            const currSlide = pswpInstance.currSlide;
                            if (currSlide && currSlide.data && (currSlide.data.title || currSlide.data.description)) {
                                el.style.display = 'block';
                                let captionHtml = '';
                                if (currSlide.data.title) {
                                    captionHtml += `<div class="pswp__caption-title">${currSlide.data.title}</div>`;
                                }
                                if (currSlide.data.description) {
                                    captionHtml += `<div class="pswp__caption-desc">${currSlide.data.description}</div>`;
                                }
                                el.innerHTML = captionHtml;
                            } else {
                                el.style.display = 'none';
                                el.innerHTML = '';
                            }
                        });
                    }
                });
            });

            // Handle dynamic image dimensions for items that weren't discovered yet
            pswp.on('contentLoad', (e) => {
                const { content } = e;
                if (content.data.w && content.data.h && content.data.w > 0) return;
                if (content.isLoadingDims) return;

                content.isLoadingDims = true;
                const img = new Image();
                img.onload = () => {
                    content.data.w = img.naturalWidth;
                    content.data.h = img.naturalHeight;
                    content.isLoadingDims = false;
                    content.update();
                };
                img.src = content.data.src;
            });

            pswp.init();
            this.pswp = pswp;
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
                        window.openGalleryModal(data.src, data.title, data.location, data.description);
                    };
                }
            });
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
        }
    };

})();

// Make modal functions globally available - using the module instance
const galleryModule = window.GalleryModule;
// openGalleryModal is the only one needed externally now
window.openGalleryModal = (imageSrc, title, location, description) => galleryModule.openGalleryModal(imageSrc, title, location, description);
