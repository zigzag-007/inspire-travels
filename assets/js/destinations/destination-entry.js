// Destination Entry Module
// Author: Zig Zag AI
// Description: Coordinates destination routing, rendering, navigation, and section tracking.

(function() {
    'use strict';

    var currentSlug;
    var started = false;

    function render() {
        var destination = window.DestinationRouteModule.get(currentSlug);
        if (!destination) return false;
        window.DestinationRendererModule.render(destination);
        window.DestinationSwitcherModule.render(currentSlug, switchDestination);
        window.DestinationContentsModule.init();
        return true;
    }

    function switchDestination(slug, scrollToHero) {
        if (!window.DestinationRouteModule.get(slug) || slug === currentSlug) return;
        var article = document.getElementById('destination-article-main');
        currentSlug = slug;
        window.DestinationRouteModule.updateUrl(slug);
        if (article) {
            article.style.opacity = '0';
            article.style.transform = 'translateY(15px)';
            article.style.transition = 'all 300ms ease-out';
        }
        window.setTimeout(function() {
            render();
            if (article) {
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }
            if (scrollToHero !== false) {
                var hero = document.getElementById('dest-hero');
                if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 250);
    }

    function syncFromLocation() {
        currentSlug = window.DestinationRouteModule.resolve();
        render();
    }

    function start() {
        if (started) return;
        started = true;
        syncFromLocation();
        window.addEventListener('popstate', syncFromLocation);
        window.addEventListener('hashchange', function() {
            var slug = window.DestinationRouteModule.resolve();
            if (slug !== currentSlug) switchDestination(slug);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    window.setTimeout(start, 0);
})();

