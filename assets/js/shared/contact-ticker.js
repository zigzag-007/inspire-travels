// Mobile contact ticker
// Turns the existing contact row into one seamless, repeating strip on phones.

(function () {
    'use strict';

    var ContactTicker = {
        selector: '.top-contact-bar',

        init: function () {
            var bars = document.querySelectorAll(this.selector);
            for (var i = 0; i < bars.length; i++) {
                this.build(bars[i]);
            }
        },

        build: function (bar) {
            if (!bar || bar.dataset.tickerReady === 'true') return;

            var sequence = bar.firstElementChild;
            if (!sequence) return;

            bar.dataset.tickerReady = 'true';
            sequence.classList.add('top-contact-sequence');

            var copy = sequence.cloneNode(true);
            copy.setAttribute('aria-hidden', 'true');

            var track = document.createElement('div');
            track.className = 'top-contact-track';
            bar.insertBefore(track, sequence);
            track.appendChild(sequence);
            track.appendChild(copy);
        }
    };

    window.ContactTickerModule = ContactTicker;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            ContactTicker.init();
        }, { once: true });
    } else {
        ContactTicker.init();
    }
})();
