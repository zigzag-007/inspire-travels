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

            return `
        <header id="tour-hero" class="relative min-h-[500px] h-[65vh] flex items-end pb-16 pt-32 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="../${tour.image}" alt="${tour.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-900/25"></div>
            </div>

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <nav class="flex items-center gap-2 text-white/75 text-sm mb-5 font-medium" aria-label="Breadcrumb">
                    <a href="../index.html" class="hover:text-white transition-colors">Home</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <a href="${collectionUrl}" class="hover:text-white transition-colors">${collectionName}</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <span class="text-white">${tour.title}</span>
                </nav>

                <div class="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    <span class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i>${tour.duration}</span>
                    <span class="flex items-center gap-1.5"><i data-lucide="moon" class="w-3.5 h-3.5"></i>${tour.nights}</span>
                    <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${tour.location}</span>
                </div>

                <h1 class="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-md">${tour.title}</h1>
                <p class="text-slate-200 text-base sm:text-xl max-w-3xl leading-relaxed drop-shadow">${tour.description}</p>
            </div>
        </header>

        <div class="bg-slate-900 border-y border-slate-800 text-white py-6 relative z-20 shadow-lg">
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
        </div>

        <div class="bg-white border-b border-slate-200 py-3 shadow-xs relative z-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="section-quick-links flex items-center justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-600 overflow-x-auto no-scrollbar py-1 snap-x snap-proximity scroll-px-1 overscroll-x-contain [&>a]:min-h-11 [&>a]:px-[0.2rem] [&>a]:snap-start">
                    <a href="#tour-tab-panel-overview" data-tour-tab="overview" data-tour-scroll="true" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>Overview and Route</a>
                    <a href="#tour-itinerary" data-tour-tab="overview" data-tour-scroll="true" data-tour-scroll-target="tour-itinerary" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i>Detailed Itinerary</a>
                    <a href="#tour-tab-panel-details" data-tour-tab="details" data-tour-scroll="true" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="file-text" class="w-4 h-4 text-emerald-600"></i>Package Notes</a>
                    <a href="#tour-sidebar-booking" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap text-emerald-700 font-bold"><i data-lucide="send" class="w-4 h-4"></i>WhatsApp Inquiry</a>
                </div>
            </div>
        </div>`;
        }
    };
})();
