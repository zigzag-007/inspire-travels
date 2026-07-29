// Tour Renderer Module
// Author: Zig Zag AI
// Description: Composes prepared tour data and focused template sections into the live page.

(function() {
    'use strict';

    function canRender() {
        return Boolean(
            window.TourShellTemplateModule &&
            window.TourContentTemplateModule &&
            window.TourMediaTemplateModule &&
            window.TourGalleryDataModule &&
            window.TourDataModule
        );
    }

    window.TourRendererModule = {
        render: function(tour) {
            if (!tour || !canRender()) return false;

            const galleryImages = window.TourGalleryDataModule.getByTour(tour.slug);
            const otherTours = window.TourDataModule.tourData
                .filter(function(candidate) {
                    return candidate.slug !== tour.slug;
                })
                .slice(0, 3);
            const context = { galleryImages: galleryImages, otherTours: otherTours };
            const html = [
                window.TourShellTemplateModule.render(tour),
                window.TourContentTemplateModule.render(tour, context),
                window.TourMediaTemplateModule.render(tour, context)
            ].join('\n');

            document.title = tour.title + ' — Inspire Travels & Tours';

            const container = document.getElementById('tour-content');
            if (!container) return false;

            container.outerHTML = html;
            window.activeTourGallery = galleryImages.map(function(image) {
                return { src: '../' + image.src, title: image.title };
            });

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            return Boolean(document.getElementById('tour-hero'));
        }
    };
})();
