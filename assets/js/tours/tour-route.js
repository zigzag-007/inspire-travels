// Tour Route Module
// Author: Zig Zag AI
// Description: Reads a tour slug and finds its matching package data.

(function() {
    'use strict';

    window.TourRouteModule = {
        getRequestedSlug: function() {
            return new URLSearchParams(window.location.search).get('tour');
        },

        getRequestedCollectionSlug: function() {
            return new URLSearchParams(window.location.search).get('collection');
        },

        getRequestedTour: function() {
            var slug = this.getRequestedSlug();
            if (!slug || !window.TourDataModule) return null;
            return window.TourDataModule.getBySlug(slug);
        },

        getRequestedCollection: function() {
            var slug = this.getRequestedCollectionSlug();
            if (!slug || !window.TourCollectionDataModule) return null;
            return window.TourCollectionDataModule.getBySlug(slug);
        },

        returnToTours: function() {
            window.location.href = '../index.html#tours';
        }
    };
})();
