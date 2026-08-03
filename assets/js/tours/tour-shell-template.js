// Tour Shell Template Module
// Author: Zig Zag AI
// Description: Renders the tour hero, specifications, and quick navigation.

(function() {
    'use strict';

    window.TourShellTemplateModule = {
        render: function(tour) {
            return `
<!-- Hero Header -->
        <header id="tour-hero" class="relative min-h-[500px] h-[65vh] flex items-end pb-16 pt-32 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="../${tour.image}" alt="${tour.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30"></div>
            </div>

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <!-- Breadcrumb -->
                <nav class="flex items-center gap-2 text-white/70 text-sm mb-4 font-medium" aria-label="Breadcrumb">
                    <a href="../index.html" class="hover:text-white transition-colors">Home</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <a href="../index.html#tours" class="hover:text-white transition-colors">Tours</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <span class="text-white">${tour.title}</span>
                </nav>

                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 font-bold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${tour.duration}
                    </span>
                    <span class="bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold px-3.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i> ${tour.location}
                    </span>
                    <span class="bg-amber-400/20 border border-amber-400/40 backdrop-blur-md text-amber-300 font-bold px-3.5 py-1 rounded-full text-xs flex items-center gap-1">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i> ${tour.rating} Score
                    </span>
                </div>

                <h1 class="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-md">${tour.title}</h1>
                <p class="text-slate-200 text-base sm:text-xl max-w-3xl leading-relaxed drop-shadow">${tour.description}</p>
            </div>
        </header>

        <!-- Key Specs Summary Bar -->
        <div class="bg-slate-900 border-y border-slate-800 text-white py-6 relative z-20 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div class="pt-2 md:pt-0">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Vehicle Standard</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="car" class="w-4 h-4"></i> Private AC Vehicle
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Tour Driver</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="user-check" class="w-4 h-4"></i> English Speaking Guide
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Flexibility</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="sliders" class="w-4 h-4"></i> 100% Customizable
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Starting Price</span>
                        <span class="text-xl font-extrabold text-white flex items-center justify-center md:justify-start gap-1">
                            From $300 <span class="text-xs font-normal text-slate-400">/ person</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick-Links Sub-Navigation Bar (Matching Destinations & Gallery Design) -->
        <div class="bg-white border-b border-slate-200 py-3 shadow-xs relative z-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-center md:justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-600 overflow-x-auto no-scrollbar py-1">
                    <a href="#tour-tab-panel-overview" data-tour-tab="overview" data-tour-scroll="true" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i> Overview & Route
                    </a>
                    <a href="#tour-itinerary" data-tour-tab="overview" data-tour-scroll="true" data-tour-scroll-target="tour-itinerary" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i> Detailed Itinerary
                    </a>
                    <a href="#tour-tab-panel-details" data-tour-tab="details" data-tour-scroll="true" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600"></i> Inclusions & Amenities
                    </a>
                    <a href="#tour-sidebar-booking" class="hover:text-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap text-emerald-700 font-bold">
                        <i data-lucide="send" class="w-4 h-4"></i> WhatsApp Inquiry
                    </a>
                </div>
            </div>
        </div>
            `;
        }
    };
})();
