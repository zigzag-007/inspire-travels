// Tour Collection Template Module
// Author: Zig Zag AI
// Description: Renders a cinematic collection page from confirmed tour data.

(function() {
    'use strict';

    function renderWords(text, className) {
        return text.split(' ').map(function(word) {
            return '<span class="' + className + '"><span>' + word + '</span></span>';
        }).join(' ');
    }

    function renderCollectionDock(activeSlug) {
        return window.TourCollectionDataModule.collections.map(function(collection, index) {
            var activeClass = collection.slug === activeSlug ? ' is-active' : '';
            var current = collection.slug === activeSlug ? ' aria-current="page"' : '';

            return '<a href="?collection=' + collection.slug + '" class="tour-collection-dock-link' + activeClass + '"' + current + '>' +
                '<span class="tour-collection-dock-number">0' + (index + 1) + '</span>' +
                '<span class="tour-collection-dock-copy"><strong>' + collection.navLabel + '</strong><small>' + collection.eyebrow + '</small></span>' +
                '<span class="tour-collection-dock-arrow"><i class="ph ph-arrow-up-right"></i></span>' +
            '</a>';
        }).join('');
    }

    function renderTourCard(tour, index, collection) {
        var firstDay = tour.days[0];
        var lastDay = tour.days[tour.days.length - 1];
        var image = collection.packageImages && collection.packageImages[tour.slug] ? collection.packageImages[tour.slug] : tour.image;

        return '<article class="tour-atlas-shell tour-atlas-shell-' + (index + 1) + '" data-collection-reveal>' +
            '<a href="?tour=' + tour.slug + '" class="tour-atlas-card" data-collection-tilt aria-label="Open ' + tour.title + '">' +
                '<span class="tour-atlas-image">' +
                    '<img src="../' + image + '" alt="' + tour.title + '" loading="lazy" decoding="async">' +
                '</span>' +
                '<span class="tour-atlas-shade" aria-hidden="true"></span>' +
                '<span class="tour-atlas-index">0' + (index + 1) + '</span>' +
                '<span class="tour-atlas-copy">' +
                    '<span class="tour-atlas-meta">' + tour.duration + ' <span aria-hidden="true">•</span> ' + tour.nights + '</span>' +
                    '<strong>' + tour.title + '</strong>' +
                    '<span class="tour-atlas-description">' + tour.description + '</span>' +
                    '<span class="tour-atlas-route"><span>' + firstDay.title + '</span><i class="ph ph-arrow-right"></i><span>' + lastDay.title + '</span></span>' +
                '</span>' +
                '<span class="tour-atlas-action"><i class="ph ph-arrow-up-right"></i></span>' +
            '</a>' +
        '</article>';
    }

    function renderStoryPanels(collection) {
        return collection.storyPanels.map(function(panel, index) {
            return '<article class="tour-story-card" style="--story-index: ' + index + '; --story-offset: ' + (index * 0.7) + 'rem" data-story-card>' +
                '<img src="../' + panel.image + '" alt="' + panel.imageAlt + '" loading="lazy" decoding="async">' +
                '<span class="tour-story-card-shade" aria-hidden="true"></span>' +
                '<span class="tour-story-card-number">' + panel.number + '</span>' +
                '<div class="tour-story-card-copy">' +
                    '<h3>' + panel.title + '</h3>' +
                    '<p>' + panel.description + '</p>' +
                '</div>' +
            '</article>';
        }).join('');
    }

    function renderCollectionLinks(activeSlug) {
        return window.TourCollectionDataModule.collections.map(function(collection, index) {
            var activeClass = collection.slug === activeSlug ? ' is-active' : '';
            var current = collection.slug === activeSlug ? ' aria-current="page"' : '';

            return '<a href="?collection=' + collection.slug + '" class="tour-collection-link' + activeClass + '"' + current + '>' +
                '<img src="../' + collection.heroImage + '" alt="" loading="lazy" decoding="async">' +
                '<span class="tour-collection-link-shade" aria-hidden="true"></span>' +
                '<span class="tour-collection-link-index">0' + (index + 1) + '</span>' +
                '<span class="tour-collection-link-copy"><strong>' + collection.navLabel + '</strong><small>' + collection.note + '</small></span>' +
                '<i class="ph ph-arrow-up-right"></i>' +
            '</a>';
        }).join('');
    }

    window.TourCollectionTemplateModule = {
        render: function(collection, tours) {
            return '<main id="tour-collection" class="tour-collection-page" data-collection-accent="' + collection.accent + '">' +
                '<section class="tour-collection-hero" data-collection-hero>' +
                    '<div class="tour-collection-hero-background" aria-hidden="true">' +
                        '<img src="../' + collection.heroImage + '" alt="">' +
                    '</div>' +
                    '<div class="tour-collection-hero-grain" aria-hidden="true"></div>' +
                    '<nav class="tour-collection-breadcrumb" aria-label="Breadcrumb">' +
                        '<a href="../index.html">Home</a><i class="ph ph-caret-right"></i><a href="../index.html#tours">Tours</a><i class="ph ph-caret-right"></i><a href="?collection=' + collection.slug + '" aria-current="page">' + collection.navLabel + '</a>' +
                    '</nav>' +
                    '<div class="tour-collection-hero-layout">' +
                        '<div class="tour-collection-hero-copy">' +
                            '<span class="tour-collection-eyebrow"><span></span>' + collection.eyebrow + '</span>' +
                            '<h1>' + renderWords(collection.title, 'tour-hero-word') + '</h1>' +
                            '<p>' + collection.description + '</p>' +
                            '<a href="#collection-routes" class="tour-collection-primary-action">' +
                                '<span>Explore the journeys</span><i class="ph ph-arrow-down-right"></i>' +
                            '</a>' +
                        '</div>' +
                        '<figure class="tour-collection-hero-portrait" data-hero-portrait>' +
                            '<span class="tour-collection-portrait-frame">' +
                                '<img src="../' + collection.portraitImage + '" alt="' + collection.portraitImageAlt + '" decoding="async">' +
                            '</span>' +
                            '<figcaption><span>' + collection.note + '</span><small>Designed around real travellers</small></figcaption>' +
                        '</figure>' +
                    '</div>' +
                    '<div class="tour-collection-dock" aria-label="Tour collections">' + renderCollectionDock(collection.slug) + '</div>' +
                '</section>' +
                '<div class="tour-collection-ambient" data-collection-ambient aria-hidden="true">' +
                    '<span class="tour-ambient-scene tour-ambient-jungle" data-ambient-repel="1.05"><img src="../assets/img/main-gallery/wild-life-adventure.jpeg" alt=""></span>' +
                    '<span class="tour-ambient-scene tour-ambient-elephant" data-ambient-repel="0.82"><img src="../assets/img/main-gallery/pinnawala-elephant-watching.jpg" alt=""></span>' +
                    '<span class="tour-ambient-scene tour-ambient-coast" data-ambient-repel="0.92"><img src="../assets/img/destinations/arugam-bay-hero.jpg" alt=""></span>' +
                    '<span class="tour-ambient-scene tour-ambient-tea" data-ambient-repel="0.72"><img src="../assets/img/destinations/nuwara_eliya_tea.png" alt=""></span>' +
                    '<span class="tour-ambient-scene tour-ambient-rock" data-ambient-repel="0.86"><img src="../assets/img/destinations/sigiriya_lion_rock.png" alt=""></span>' +
                    '<span class="tour-ambient-leaf tour-ambient-leaf-one" data-ambient-repel="1.2"></span>' +
                    '<span class="tour-ambient-leaf tour-ambient-leaf-two" data-ambient-repel="1.1"></span>' +
                '</div>' +
                '<section id="collection-routes" class="tour-route-atlas section-curve-receiver section-curve-drift" aria-labelledby="collection-packages-heading">' +
                    '<div class="tour-route-atlas-heading" data-collection-reveal>' +
                        '<span>Route atlas <b>0' + tours.length + '</b></span>' +
                        '<h2 id="collection-packages-heading">Choose the journey that fits.</h2>' +
                        '<p>Every route is complete. The pace, dates, and personal details stay open to you.</p>' +
                    '</div>' +
                    '<div class="tour-atlas-grid" data-tour-count="' + tours.length + '">' + tours.map(function(tour, index) { return renderTourCard(tour, index, collection); }).join('') + '</div>' +
                '</section>' +
                '<section class="tour-story-section" aria-labelledby="collection-story-heading" data-story-section>' +
                    '<div class="tour-story-statement" data-story-statement>' +
                        '<span class="tour-story-kicker">How it should feel</span>' +
                        '<h2 id="collection-story-heading">' + renderWords(collection.storyTitle, 'tour-story-word') + '</h2>' +
                        '<p>' + collection.storyDescription + '</p>' +
                    '</div>' +
                    '<div class="tour-story-stack" data-story-stack data-story-step="1">' + renderStoryPanels(collection) + '</div>' +
                '</section>' +
                '<section class="tour-collection-switch section-curve-receiver" aria-labelledby="collection-switch-heading">' +
                    '<div class="tour-collection-switch-copy" data-collection-reveal>' +
                        '<span>Five ways into Sri Lanka</span>' +
                        '<h2 id="collection-switch-heading">Change the pace. Keep the sense of discovery.</h2>' +
                        '<p>Move between family travel, group journeys, the northern coast, living heritage, and active adventure.</p>' +
                    '</div>' +
                    '<div class="tour-collection-links">' + renderCollectionLinks(collection.slug) + '</div>' +
                '</section>' +
            '</main>';
        }
    };
})();
