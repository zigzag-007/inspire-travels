// Destination Route Module
// Author: Zig Zag AI
// Description: Resolves destination URLs and preserves public guide links.

(function() {
    'use strict';

    function records() {
        return window.DestinationsData && window.DestinationsData.destinations;
    }

    window.DestinationRouteModule = {
        get: function(slug) {
            var list = records();
            return list && slug ? list[slug.toLowerCase()] || null : null;
        },
        resolve: function() {
            var params = new URLSearchParams(window.location.search);
            var slug = params.get('destination') || params.get('slug') || window.location.hash.slice(1);
            return this.get(slug) ? slug.toLowerCase() : 'sigiriya';
        },
        updateUrl: function(slug) {
            window.history.pushState(null, '', window.location.pathname + '?destination=' + encodeURIComponent(slug));
        }
    };
})();

