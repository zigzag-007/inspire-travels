// Shared Secondary Hero Module
// Renders one consistent editorial hero for every secondary page.

(function () {
    'use strict';

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
        });
    }

    function renderBreadcrumbs(items) {
        return items.map(function (item, index) {
            var content = item.href ? '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a>' : '<span aria-current="page">' + escapeHtml(item.label) + '</span>';
            return content + (index < items.length - 1 ? '<i class="ph ph-caret-right" aria-hidden="true"></i>' : '');
        }).join('');
    }

    function render(config) {
        var title = escapeHtml(config.title);
        var image = escapeHtml(config.image);
        var imageAlt = escapeHtml(config.imageAlt || config.title);
        var eyebrow = escapeHtml(config.eyebrow);
        var description = escapeHtml(config.description);
        var note = escapeHtml(config.note);
        var noteDetail = escapeHtml(config.noteDetail || 'Designed around real travellers');
        var actionToc = config.action && config.action.toc ? ' data-destination-toc="' + escapeHtml(config.action.toc) + '"' : '';
        var action = config.action ? '<a href="' + escapeHtml(config.action.href) + '" class="secondary-hero-action"' + actionToc + '><span>' + escapeHtml(config.action.label) + '</span><i class="ph ph-arrow-down-right"></i></a>' : '';

        return '<header id="' + escapeHtml(config.id) + '" class="secondary-editorial-hero">' +
            '<div class="secondary-hero-background" aria-hidden="true"><img id="' + escapeHtml(config.imageId || '') + '" src="' + image + '" alt=""></div>' +
            '<div class="secondary-hero-grain" aria-hidden="true"></div>' +
            '<nav class="secondary-hero-breadcrumb" aria-label="Breadcrumb">' + renderBreadcrumbs(config.breadcrumbs || []) + '</nav>' +
            '<div class="secondary-hero-layout">' +
                '<div class="secondary-hero-copy">' +
                    '<span class="secondary-hero-eyebrow"><span></span>' + eyebrow + '</span>' +
                    '<h1 id="' + escapeHtml(config.titleId || '') + '">' + title + '</h1>' +
                    '<p id="' + escapeHtml(config.descriptionId || '') + '">' + description + '</p>' +
                    action +
                '</div>' +
                '<figure class="secondary-hero-portrait">' +
                    '<span class="secondary-hero-portrait-frame"><img src="' + image + '" alt="' + imageAlt + '" decoding="async"></span>' +
                    '<figcaption><span id="' + escapeHtml(config.noteId || '') + '">' + note + '</span><small id="' + escapeHtml(config.noteDetailId || '') + '">' + noteDetail + '</small></figcaption>' +
                '</figure>' +
            '</div>' +
        '</header>';
    }

    function renderInto(target, config) {
        if (!target) return null;
        target.outerHTML = render(config);
        var hero = document.getElementById(config.id);
        var action = hero && hero.querySelector('.secondary-hero-action');
        if (action && config.action && config.action.toc) {
            action.addEventListener('click', function(event) {
                var targetSection = document.getElementById(config.action.toc);
                if (!targetSection) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                var top = Math.max(0, targetSection.getBoundingClientRect().top + window.scrollY - 92);
                if (window.NavigationModule && typeof window.NavigationModule.smoothScrollTo === 'function') {
                    window.NavigationModule.smoothScrollTo(top, 850);
                } else {
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        }
        if (window.PhosphorBridge) window.PhosphorBridge.reinit();
        return hero;
    }

    function renderGallery() {
        var target = document.querySelector('[data-secondary-gallery-hero]');
        if (!target) return;

        var hero = renderInto(target, {
            id: 'gallery-hero',
            image: 'assets/img/main-gallery/tea-plantation-tour.jpeg',
            imageAlt: 'Tea country guest experience in Sri Lanka',
            eyebrow: 'The guest archive',
            title: 'Sri Lanka through real journeys.',
            description: 'Candid arrivals, quiet highland moments, wildlife encounters, and coastlines seen with Inspire Travels.',
            note: '60+ real travel moments',
            noteDetail: 'Captured across the island',
            breadcrumbs: [
                { label: 'Home', href: 'index.html' },
                { label: 'Gallery', href: 'index.html#gallery' },
                { label: 'Photo archive' }
            ],
            action: { label: 'Explore the archive', href: '#dynamic-gallery-grid' }
        });

        var factsDock = document.querySelector('.secondary-facts-dock[aria-label="Gallery quick facts"]');
        if (hero && factsDock && hero.nextElementSibling !== factsDock) {
            hero.insertAdjacentElement('afterend', factsDock);
        }

    }

    window.SecondaryHeroModule = {
        render: render,
        renderInto: renderInto,
        renderGallery: renderGallery
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderGallery, { once: true });
    } else {
        renderGallery();
    }
})();
