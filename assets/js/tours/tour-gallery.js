// Tour Gallery Module
// Author: Zig Zag AI
// Description: Opens package highlight photos in the PhotoSwipe lightbox.

(function() {
    'use strict';

    window.TourGalleryModule = {
        init: function() {
            document.querySelectorAll('[data-tour-gallery-index]').forEach(function(trigger) {
                var openGallery = function() {
                    window.TourGalleryModule.open(Number(trigger.dataset.tourGalleryIndex));
                };

                trigger.addEventListener('click', openGallery);
                trigger.addEventListener('keydown', function(event) {
                    if (event.key !== 'Enter' && event.key !== ' ') return;

                    event.preventDefault();
                    openGallery();
                });
            });
        },

        open: function(index) {
            if (!window.activeTourGallery || !window.activeTourGallery.length) return;

            if (!window.PhotoSwipeLightbox || !window.PhotoSwipe) {
                console.warn('Photo viewer is not available yet');
                return;
            }

            var items = window.activeTourGallery.map(function(item) {
                var data = { src: item.src, w: 1600, h: 1067, alt: item.title, title: item.title };
                var filename = item.src.split('/').pop();
                var existingImage = filename ? document.querySelector('img[src*="' + filename + '"]') : null;

                if (existingImage && existingImage.naturalWidth > 0) {
                    data.w = existingImage.naturalWidth;
                    data.h = existingImage.naturalHeight;
                    data.msrc = existingImage.src;
                }

                return data;
            });

            var lightbox = new window.PhotoSwipeLightbox({
                dataSource: items,
                index: index,
                pswpModule: window.PhotoSwipe,
                bgOpacity: 0.92,
                showHideAnimationType: 'zoom'
            });

            // Keep the small tour information card, without PhotoSwipe's large caption bar.
            lightbox.on('uiRegister', function() {
                lightbox.pswp.ui.registerElement({
                    name: 'tour-highlight-card',
                    order: 9,
                    isButton: false,
                    appendTo: 'root',
                    html: '',
                    onInit: function(element, pswp) {
                        var renderHighlightCard = function() {
                            var slide = pswp.currSlide;
                            if (!slide || !slide.data) return;

                            element.innerHTML = '<div class="pswp__tour-highlight-card absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/85 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-2xl text-center max-w-md w-full pointer-events-auto z-[1005]">' +
                                '<span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block mb-1">Highlight ' + (pswp.currIndex + 1) + ' of ' + pswp.getNumItems() + '</span>' +
                                '<h4 class="font-display text-base font-bold text-white drop-shadow truncate">' + (slide.data.title || '') + '</h4>' +
                                '</div>';
                        };

                        renderHighlightCard();
                        pswp.on('change', renderHighlightCard);
                    }
                });
            });

            lightbox.init();
            lightbox.loadAndOpen(index);
        }
    };

})();
