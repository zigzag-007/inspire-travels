// Tour Media Template Module
// Author: Zig Zag AI
// Description: Renders the tour gallery and related package cards.

(function() {
    'use strict';

    window.TourMediaTemplateModule = {
        render: function(tour, context) {
            const galleryImages = context.galleryImages;
            const otherTours = context.otherTours;

            return `
<!-- Full Width Section: 3-Column Masonry Photo Gallery (40% / 30% / 30% ratio matching user ASCII diagram) -->
                <div class="pt-8 border-t border-slate-200">
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Visual Highlights</span>
                            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Destination Photos</h2>
                            <p class="text-slate-500 text-sm mt-1">Real guest moments and iconic landmarks included in this itinerary</p>
                        </div>
                        <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start md:self-auto">
                            7 Highlight Photos
                        </span>
                    </div>

                    <!-- 10-Column Grid (4 cols = 40%, 3 cols = 30%, 3 cols = 30%) -->
                    <div id="tour-gallery" class="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
                        <!-- Column 1 (40% Width - Col Span 4): Image A (Large Tall Vertical) -->
                        <div class="lg:col-span-4 relative rounded-3xl overflow-hidden group shadow-md min-h-[380px] h-full cursor-pointer" data-tour-gallery-index="0" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[0].title}">
                            <img src="../${galleryImages[0].src}" alt="${galleryImages[0].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent"></div>
                            <!-- Floating Zoom Icon -->
                            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                    <i data-lucide="maximize-2" class="w-4 h-4 text-white"></i>
                                </div>
                            </div>
                            <div class="absolute bottom-5 left-5 right-5 text-white">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-emerald-500/30">Highlight 1</span>
                                <h4 class="font-serif text-lg sm:text-xl font-bold text-white leading-snug drop-shadow">${galleryImages[0].title}</h4>
                            </div>
                        </div>

                        <!-- Column 2 (30% Width - Col Span 3): Image B (Top Large) + Image C & D (Bottom Small 2-up) -->
                        <div class="lg:col-span-3 flex flex-col gap-4">
                            <!-- Image B (Large wide image top) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full cursor-pointer" data-tour-gallery-index="1" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[1].title}">
                                <img src="../${galleryImages[1].src}" alt="${galleryImages[1].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
                                <!-- Floating Zoom Icon -->
                                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                    <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                        <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-white"></i>
                                    </div>
                                </div>
                                <div class="absolute bottom-4 left-4 right-4 text-white">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-500/30">Highlight 2</span>
                                    <h4 class="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">${galleryImages[1].title}</h4>
                                </div>
                            </div>

                            <!-- Images C & D (Two small images bottom side-by-side) -->
                            <div class="grid grid-cols-2 gap-4 h-[182px] w-full">
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" data-tour-gallery-index="2" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[2].title}">
                                    <img src="../${galleryImages[2].src}" alt="${galleryImages[2].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[2].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" data-tour-gallery-index="3" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[3].title}">
                                    <img src="../${galleryImages[3].src}" alt="${galleryImages[3].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[3].title}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Column 3 (30% Width - Col Span 3): Inverted - Images C & D (Top Small 2-up) + Image B (Bottom Large) -->
                        <div class="lg:col-span-3 flex flex-col gap-4">
                            <!-- Images E & F (Two small images top side-by-side) -->
                            <div class="grid grid-cols-2 gap-4 h-[182px] w-full">
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" data-tour-gallery-index="4" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[4].title}">
                                    <img src="../${galleryImages[4].src}" alt="${galleryImages[4].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[4].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" data-tour-gallery-index="5" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[5].title}">
                                    <img src="../${galleryImages[5].src}" alt="${galleryImages[5].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[5].title}</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- Image G (Large wide image bottom) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full cursor-pointer" data-tour-gallery-index="6" role="button" tabindex="0" aria-label="Open photo: ${galleryImages[6].title}">
                                <img src="../${galleryImages[6].src}" alt="${galleryImages[6].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
                                <!-- Floating Zoom Icon -->
                                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                    <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                        <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-white"></i>
                                    </div>
                                </div>
                                <div class="absolute bottom-4 left-4 right-4 text-white">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-500/30">Highlight 3</span>
                                    <h4 class="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">${galleryImages[6].title}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Full Width Section: Similar Tour Packages -->
                <div class="pt-12 border-t border-slate-200">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Explore Options</span>
                            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Similar Tour Packages You May Like</h2>
                        </div>
                        <a href="../index.html#tours" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline">
                            View All Packages <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${otherTours.map(ot => `
                        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                            <div class="relative h-48 overflow-hidden">
                                <img src="../${ot.image}" alt="${ot.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-current"></i> ${ot.rating}
                                </div>
                                <div class="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    ${ot.duration}
                                </div>
                            </div>

                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
                                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${ot.location}
                                    </span>
                                    <h3 class="font-serif text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">${ot.title}</h3>
                                    <p class="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">${ot.description}</p>
                                </div>

                                <a href="?tour=${ot.slug}" class="w-full bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold py-3 px-4 rounded-xl text-center transition-colors text-xs flex items-center justify-center gap-1.5">
                                    View Package Details <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </a>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        </main>
            `;
        }
    };
})();
