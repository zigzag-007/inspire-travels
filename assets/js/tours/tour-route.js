// Tour Route Module
// Author: Zig Zag AI
// Description: Reads a tour slug and finds its matching package data.

(function() {
    'use strict';

    window.TourRouteModule = {
        getRequestedSlug: function() {
            return new URLSearchParams(window.location.search).get('tour');
        },

        getRequestedTour: function() {
            var slug = this.getRequestedSlug();
            if (!slug || !window.TourDataModule) return null;
            return window.TourDataModule.getBySlug(slug);
        },

        returnToTours: function() {
            window.location.href = '../index.html#tours';
        }
    };
})();
