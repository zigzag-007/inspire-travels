// Tour Entry Module
// Author: Zig Zag AI
// Description: Starts the tour detail page after all focused modules load.

(function() {
    'use strict';

    var hasStarted = false;

    function startTourPage() {
        if (hasStarted) return;
        hasStarted = true;

        var collection = window.TourRouteModule && window.TourRouteModule.getRequestedCollection();
        if (collection && window.TourCollectionRendererModule && window.TourCollectionRendererModule.render(collection)) {
            return;
        }

        var tour = window.TourRouteModule && window.TourRouteModule.getRequestedTour();

        if (!tour || !window.TourRendererModule || !window.TourRendererModule.render(tour)) {
            if (window.TourRouteModule) {
                window.TourRouteModule.returnToTours();
            } else {
                window.location.href = '../index.html#tours';
            }
            return;
        }

        if (window.TourBookingModule) {
            window.TourBookingModule.init();
        }

        if (window.TourTabsModule) {
            window.TourTabsModule.init();
        }

        if (window.TourGalleryModule) {
            window.TourGalleryModule.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTourPage, { once: true });
    }

    // Covers browsers that complete parsing before this final classic script executes.
    window.setTimeout(startTourPage, 0);
})();
