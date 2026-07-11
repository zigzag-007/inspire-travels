// Dynamic Gallery Grid Renderer
// Author: Zig Zag AI
// Description: Builds the gallery masonry grid dynamically based on GalleryData.
//              Adapts styling based on whether metadata (title/date) is present.

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
                container.innerHTML = '<p class="text-center text-muted-foreground w-full py-8">No photos found.</p>';
                return;
            }

            let htmlContent = '';

            window.GalleryData.forEach(item => {
                const category = item.category ? item.category.toLowerCase() : 'nature';
                const hasMetadata = item.title && item.title.trim() !== '';

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

                if (hasMetadata) {
                    // Render standard postcard style
                    htmlContent += `
                        <div class="single-blog-post mb-4 group cursor-pointer hover:scale-105" data-category="${category}" data-year="${year}" onclick="window.openGalleryModal('${item.src}', '${this.escapeHtml(item.title)}', '${this.escapeHtml(item.location || '')}', '${this.escapeHtml(item.date || '')}')">
                            <div class="post-thumbnail relative overflow-hidden rounded-2xl">
                                <img src="${item.src}" alt="${this.escapeHtml(item.title)}" class="w-full h-36 sm:h-48 md:h-64 object-cover" style="object-position: ${item.position || 'center'};">
                            </div>
                            <div class="entry-content">
                                <span class="cat-btn">${category}</span>
                                <div class="post-meta">
                                    <span>
                                        <i data-lucide="calendar" class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"></i>
                                        <span class="text-xs sm:text-sm">${this.escapeHtml(item.date || 'Recent')}</span>
                                    </span>
                                </div>
                                <h3 class="title"><a class="text-sm sm:text-lg md:text-2xl line-clamp-2">${this.escapeHtml(item.title)}</a></h3>
                            </div>
                        </div>
                    `;
                } else {
                    // Render clean full-bleed image card
                    htmlContent += `
                        <div class="single-blog-post mb-4 group cursor-pointer hover:scale-[1.03] transition-transform duration-300" data-category="${category}" data-year="${year}" onclick="window.openGalleryModal('${item.src}', '', '', '')">
                            <div class="post-thumbnail relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <img src="${item.src}" alt="Sri Lanka Travel Gallery" class="w-full h-36 sm:h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105" style="object-position: ${item.position || 'center'};">
                                <!-- Hover Blur Overlay -->
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <div class="bg-white/20 border border-white/30 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                                        <i data-lucide="maximize-2" class="text-white w-5 h-5"></i>
                                    </div>
                                </div>
                                <!-- Category Tag Absolute Overlay -->
                                <span class="absolute bottom-3 left-3 bg-[#F7921E] text-white px-2 py-0.5 text-[9px] sm:text-xs rounded font-semibold tracking-wider uppercase shadow-sm z-10">${category}</span>
                            </div>
                        </div>
                    `;
                }
            });

            container.innerHTML = htmlContent;

            // Re-initialize Lucide icons for the newly added HTML elements
            if (window.lucide) {
                window.lucide.createIcons();
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

    // Run grid builder as soon as script runs so DOM elements exist before DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GalleryGrid.init());
    } else {
        GalleryGrid.init();
    }
})();
