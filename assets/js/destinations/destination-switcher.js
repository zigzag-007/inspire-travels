// Destination Switcher Module
// Author: Zig Zag AI
// Description: Renders destination selector pills without inline event handlers.

(function() {
    'use strict';

    window.DestinationSwitcherModule = {
        render: function(currentSlug, onSelect) {
            var container = document.getElementById('dest-tabs-container');
            var records = window.DestinationsData && window.DestinationsData.destinations;
            if (!container || !records) return;

            container.innerHTML = Object.keys(records).map(function(slug) {
                var destination = records[slug];
                var active = slug === currentSlug;
                var classes = active
                    ? 'dest-pill-btn active-pill flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 transition-all duration-300 border border-emerald-400/40 cursor-pointer whitespace-nowrap'
                    : 'dest-pill-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/70 backdrop-blur-md text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 border border-slate-200/80 shadow-sm cursor-pointer whitespace-nowrap';
                return '<button type="button" class="' + classes + '" data-destination-slug="' + destination.slug + '">' + destination.name + '</button>';
            }).join('');

            container.querySelectorAll('[data-destination-slug]').forEach(function(button) {
                button.addEventListener('click', function() { onSelect(button.dataset.destinationSlug); });
            });
        }
    };
})();

