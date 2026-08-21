// Tour Shell Template Module
// Author: Zig Zag AI
// Description: Renders the package hero, truthful specifications, and quick links.

(function() {
    'use strict';

    window.TourShellTemplateModule = {
        render: function(tour) {
            var isGroup = tour.travelMode === 'group';
            var collection = tour.collections[0];
            var collectionNames = {
                family: 'Family Tours',
                group: 'Group Tours',
                'northern-shores': 'Northern Shores',
                'cultural-heritage': 'Culture & Heritage',
                adventure: 'Adventure Tours'
            };
            var collectionName = collectionNames[collection] || 'Featured Tours';
            var collectionUrl = collection ? '?collection=' + collection : '../index.html#tours';
            var specs = isGroup ? [
                { label: 'Travel Style', icon: 'users', value: 'Shared Group Journey' },
                { label: 'Tour Support', icon: 'badge-check', value: 'Guided Daily Programme' },
                { label: 'Route Style', icon: 'route', value: 'Planned Itinerary' },
                { label: 'Dates and Price', icon: 'message-circle', value: 'Available on Inquiry' }
            ] : [
                { label: 'Travel Style', icon: 'car', value: 'Private AC Vehicle' },
                { label: 'Tour Support', icon: 'user-check', value: 'English Speaking Driver Guide' },
                { label: 'Flexibility', icon: 'sliders', value: 'Tailored on Request' },
                { label: 'Starting Price', icon: 'message-circle', value: 'Quote on Request' }
            ];

            var hero = window.SecondaryHeroModule ? window.SecondaryHeroModule.render({
                id: 'tour-hero',
                image: '../' + tour.image,
                imageAlt: tour.title + ' in Sri Lanka',
                eyebrow: collectionName,
                title: tour.title,
                description: tour.description,
                note: tour.duration + ' · ' + tour.nights,
                noteDetail: tour.location,
                breadcrumbs: [
                    { label: 'Home', href: '../index.html' },
                    { label: collectionName, href: collectionUrl },
                    { label: tour.title }
                ],
                action: { label: 'View the itinerary', href: '#tour-itinerary' }
            }) : '';

            return hero + `

        <div class="secondary-facts-dock" aria-label="Tour quick facts">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    ${specs.map(function(spec, index) {
                        return `<div class="pt-${index ? '4' : '2'} md:pt-0 ${index ? 'md:pl-6' : ''}">
                            <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">${spec.label}</span>
                            <span class="text-sm sm:text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                                <i data-lucide="${spec.icon}" class="w-4 h-4"></i>${spec.value}
                            </span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>`;
        }
    };
})();
