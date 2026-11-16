// Destination Contents Module
// Author: Zig Zag AI
// Description: Tracks the visible editorial section across both contents menus.

(function() {
    'use strict';

    var observer;

    function setActive(sectionId) {
        document.querySelectorAll('[data-destination-toc]').forEach(function(link) {
            var active = link.getAttribute('data-destination-toc') === sectionId;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    window.DestinationContentsModule = {
        init: function() {
            if (observer) observer.disconnect();
            var sections = ['overview', 'experiences', 'itinerary', 'cuisine', 'tips', 'inquire']
                .map(function(id) { return document.getElementById(id); })
                .filter(Boolean);
            if (!sections.length || !('IntersectionObserver' in window)) {
                setActive('overview');
                return;
            }
            observer = new IntersectionObserver(function(entries) {
                var visible = entries.filter(function(entry) { return entry.isIntersecting; })
                    .sort(function(left, right) { return right.intersectionRatio - left.intersectionRatio; })[0];
                if (visible) setActive(visible.target.id);
            }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.25] });
            sections.forEach(function(section) { observer.observe(section); });
            setActive('overview');

            document.querySelectorAll('[data-destination-toc]').forEach(function(link) {
                if (link.dataset.destinationScrollBound === 'true') return;
                link.dataset.destinationScrollBound = 'true';
                link.addEventListener('click', function(event) {
                    var target = document.getElementById(link.getAttribute('data-destination-toc'));
                    if (!target) return;
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if (window.NavigationModule && typeof window.NavigationModule.smoothScrollTo === 'function') {
                        var top = window.NavigationModule.getScrollTargetY
                            ? window.NavigationModule.getScrollTargetY(target)
                            : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92);
                        window.NavigationModule.smoothScrollTo(top, 850);
                    } else {
                        var top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92);
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                });
            });
        }
    };
})();

