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
            const otherTours = window.TourDataModule.getRelated(tour, 3);
            const context = { galleryImages: galleryImages, otherTours: otherTours };
            const html = [
                window.TourShellTemplateModule.render(tour),
                window.TourContentTemplateModule.render(tour, context),
                window.TourMediaTemplateModule.render(tour, context)
            ].join('\n');

            document.title = tour.title + ' | Inspire Travels & Tours';
            const routePath = '/tours/' + encodeURIComponent(tour.slug) + '.html';
            const collection = tour.collections[0] && window.TourCollectionDataModule
                ? window.TourCollectionDataModule.getBySlug(tour.collections[0])
                : null;
            if (window.SearchMetadataModule) window.SearchMetadataModule.update({
                title: document.title,
                label: tour.title,
                description: tour.description,
                path: routePath,
                image: tour.image,
                breadcrumbs: window.SearchMetadataModule.buildTourBreadcrumbs(tour, collection),
                mainEntity: window.SearchMetadataModule.buildTourEntity(tour)
            });
            document.body.classList.remove('tour-collection-view', 'tour-collection-scrolled');
            document.body.classList.add('tour-detail-view');
            delete document.body.dataset.collectionAccent;

            const container = document.getElementById('tour-content');
            if (!container) return false;

            container.outerHTML = html;
            window.activeTourGallery = galleryImages.map(function(image) {
                return { src: '../' + image.src, title: image.title };
            });

            if (window.PhosphorBridge) {
                window.PhosphorBridge.reinit();
            }

            window.dispatchEvent(new Event('scroll'));

            return Boolean(document.getElementById('tour-hero'));
        }
    };
})();
