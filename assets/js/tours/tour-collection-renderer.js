// Tour Collection Renderer Module
// Author: Zig Zag AI
// Description: Finds a collection and replaces the loading shell with its page.

(function() {
    'use strict';

    window.TourCollectionRendererModule = {
        render: function(collection) {
            if (!collection || !window.TourDataModule || !window.TourCollectionTemplateModule) return false;

            var tours = window.TourDataModule.getByCollection(collection.slug);
            var container = document.getElementById('tour-content');
            if (!container || !tours.length) return false;

            container.outerHTML = window.TourCollectionTemplateModule.render(collection, tours);
            document.title = collection.navLabel + ' | Inspire Travels & Tours';
            if (window.SearchMetadataModule) window.SearchMetadataModule.update({
                title: document.title,
                label: collection.navLabel,
                description: collection.description,
                path: '/tours/?collection=' + encodeURIComponent(collection.slug),
                image: collection.heroImage,
                type: 'CollectionPage'
            });
            document.body.classList.add('tour-collection-view');
            document.body.classList.remove('tour-detail-view');
            document.body.dataset.collectionAccent = collection.accent;

            if (window.PhosphorBridge) window.PhosphorBridge.reinit();
            if (window.CardSpotlightModule) window.CardSpotlightModule.scan(document);
            if (window.TourCollectionMotionModule) window.TourCollectionMotionModule.init();
            window.dispatchEvent(new Event('scroll'));

            return Boolean(document.getElementById('tour-collection'));
        }
    };
})();
