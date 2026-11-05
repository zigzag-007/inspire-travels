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
            var fileName = window.location.pathname.split('/').pop() || '';
            var pathSlug = fileName.replace(/\.html$/i, '');
            var slug = params.get('destination') || params.get('slug') || (pathSlug !== 'index' ? pathSlug : '') || window.location.hash.slice(1);
            return this.get(slug) ? slug.toLowerCase() : 'sigiriya';
        },
        updateUrl: function(slug) {
            var directory = window.location.pathname.replace(/[^/]*$/, '');
            window.history.pushState(null, '', directory + encodeURIComponent(slug) + '.html');
        }
    };
})();

