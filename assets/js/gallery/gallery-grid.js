// Dynamic Gallery Grid Renderer (Premium Light Biophilic Architecture)
// Author: Zig Zag AI
// Description: Builds a Pinterest-style fluid column masonry layout tailored for Inspire Travels light theme

(function() {
    'use strict';

    const GalleryGrid = {
        init: function() {
            const container = document.getElementById('dynamic-gallery-grid');
            if (!container) return;

            this.renderGrid(container);
        },

        renderGrid: function(container) {
            if (!window.GalleryData || !Array.isArray(window.GalleryData)) {
                container.innerHTML = '<p class="text-center text-slate-500 w-full py-12">No photos found.</p>';
                return;
            }

            let htmlContent = '';

            // Dynamic height distribution for organic column masonry rhythm
            const heightSequence = [
                'h-80 sm:h-96',
                'h-64 sm:h-72',
                'h-96 sm:h-[420px]',
                'h-72 sm:h-80',
                'h-80 sm:h-96',
                'h-64 sm:h-72'
            ];

            window.GalleryData.forEach((item, index) => {
                const category = item.category ? item.category.toLowerCase() : 'nature';
                const hasTitle = item.title && item.title.trim() !== '';
                const heightClass = heightSequence[index % heightSequence.length];

                let year = 'older';
                if (item.date) {
                    const yearMatch = item.date.match(/\b(202\d)\b/);
                    if (yearMatch) {
                        const parsedYear = parseInt(yearMatch[1], 10);
                        if (parsedYear >= 2025) {
                            year = parsedYear.toString();
                        } else {
                            year = 'older';
                        }
                    }
                }

                const escapedTitle = this.escapeHtml(item.title || '');
                const escapedLocation = this.escapeHtml(item.location || 'Sri Lanka');
                const escapedDate = this.escapeHtml(item.date || '');

                htmlContent += `
                    <div class="single-blog-post break-inside-avoid inline-block w-full mb-10 group cursor-pointer"
                         data-category="${category}" 
                         data-year="${year}" 
                         onclick="window.openGalleryModal('${item.src}', '${escapedTitle}', '${escapedLocation}', '${escapedDate}')">
                        
                        <div data-spotlight class="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-1.5 ${heightClass}">
                            
                            <!-- Main Photo with Parallax Scale -->
                            <img src="${item.src}" alt="${escapedTitle || 'Sri Lanka Travel Gallery'}" 
                                 class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                 style="object-position: ${item.position || 'center'};">
                            
                            <!-- Soft Cinematic Dark Gradient Vignette for Text Contrast -->
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                            <!-- Floating Glass Zoom Icon -->
                            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                    <i data-lucide="maximize-2" class="w-4 h-4 text-white"></i>
                                </div>
                            </div>

                            <!-- Bottom Metadata Block -->
                            <div class="absolute bottom-0 inset-x-0 p-5 z-10 text-white space-y-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        ${category}
                                    </span>
                                    ${item.location ? `
                                    <span class="bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                        <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i> ${escapedLocation}
                                    </span>
                                    ` : ''}
                                </div>

                                ${hasTitle ? `
                                <h3 class="font-display text-base sm:text-lg font-bold text-white leading-snug drop-shadow-md line-clamp-2">${escapedTitle}</h3>
                                ` : ''}

                                ${escapedDate ? `
                                <p class="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5 font-sans">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-400"></i> ${escapedDate}
                                </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });

            // Set CSS Column Masonry container
            container.className = "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mb-16";
            container.innerHTML = htmlContent;

            // Re-initialize icons for dynamic elements
            if (window.PhosphorBridge) {
                window.PhosphorBridge.reinit(container);
            }
        },

        escapeHtml: function(text) {
            if (!text) return '';
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GalleryGrid.init());
    } else {
        GalleryGrid.init();
    }
})();
