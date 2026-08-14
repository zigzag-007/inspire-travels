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
                    <article class="single-blog-post gallery-archive-item break-inside-avoid inline-block w-full mb-5 sm:mb-6 group cursor-pointer"
                         data-category="${category}" 
                         data-year="${year}" 
                         onclick="window.openGalleryModal('${item.src}', '${escapedTitle}', '${escapedLocation}', '${escapedDate}')">
                        
                        <div data-spotlight class="gallery-archive-frame relative overflow-hidden ${heightClass}">
                            
                            <!-- Main Photo with Parallax Scale -->
                            <img src="${item.src}" alt="${escapedTitle || 'Sri Lanka Travel Gallery'}" 
                                 class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                 style="object-position: ${item.position || 'center'};">
                            
                            <div class="gallery-archive-caption">
                                <span>${category} · ${escapedLocation}</span>
                                ${hasTitle ? `<h3>${escapedTitle}</h3>` : ''}
                                <i class="ph ph-arrow-up-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    </article>
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
