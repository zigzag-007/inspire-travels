(function() {
    'use strict';

    // Fill each half of the ribbon before making its hidden mirror for a clean loop.
    function buildRow(viewport) {
        var track = viewport.querySelector('.hotel-partner-track');
        var band = track && track.querySelector('.hotel-partner-band:not([data-partner-copy-band])');
        var source = band && band.querySelector('.hotel-partner-set:not([data-partner-copy])');
        if (!track || !band || !source) return;

        track.querySelectorAll('[data-partner-copy-band]').forEach(function(copy) {
            copy.remove();
        });
        band.querySelectorAll('[data-partner-copy]').forEach(function(copy) {
            copy.remove();
        });

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            while (band.scrollWidth < viewport.clientWidth + source.offsetWidth) {
                var logoCopy = source.cloneNode(true);
                logoCopy.setAttribute('aria-hidden', 'true');
                logoCopy.setAttribute('inert', '');
                logoCopy.setAttribute('data-partner-copy', '');
                band.appendChild(logoCopy);
            }

            var bandCopy = band.cloneNode(true);
            bandCopy.setAttribute('aria-hidden', 'true');
            bandCopy.setAttribute('inert', '');
            bandCopy.setAttribute('data-partner-copy-band', '');
            track.appendChild(bandCopy);
        }
    }

    // Keep the ribbons still when people cannot see them or asked for less motion.
    function setupPartnerMarquees() {
        var section = document.querySelector('.hotel-partners');
        var rows = section && section.querySelectorAll('[data-partner-row]');
        if (!section || !rows || !rows.length) return;

        var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        var isInView = !('IntersectionObserver' in window);

        function refreshRows() {
            rows.forEach(buildRow);
            syncVisibility();
        }

        function syncVisibility() {
            section.classList.toggle('is-ready', !motionPreference.matches);
            section.classList.toggle('is-paused', !isInView || document.hidden);
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                isInView = entries.some(function(entry) { return entry.isIntersecting; });
                syncVisibility();
            }, { rootMargin: '100px 0px' });
            observer.observe(section);
        }

        document.addEventListener('visibilitychange', syncVisibility);
        window.addEventListener('resize', refreshRows, { passive: true });
        if (motionPreference.addEventListener) {
            motionPreference.addEventListener('change', refreshRows);
        } else {
            motionPreference.addListener(refreshRows);
        }
        refreshRows();
        syncVisibility();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPartnerMarquees, { once: true });
    } else {
        setupPartnerMarquees();
    }
})();
