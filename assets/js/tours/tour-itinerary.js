// Tour Itinerary Module
// Author: Zig Zag AI
// Description: Keeps itinerary text preparation separate from page rendering.

(function() {
    'use strict';

    window.TourItineraryModule = {
        parse: function(highlight) {
            var parts = highlight.split(/\s\/\s[sS]tay\s/i);
            var mainText = parts[0];
            var match = mainText.match(/^(Day \d+(?:-\d+)?):\s*(.*)$/);

            return {
                dayNumber: match ? match[1] : mainText.split(':')[0],
                activity: match ? match[2] : mainText.split(':')[1] || mainText,
                stayLocation: parts[1] ? parts[1].trim() : ''
            };
        },

        countDays: function(highlights) {
            return highlights.reduce(function(total, highlight) {
                var match = highlight.match(/^Day (\d+)(?:-(\d+))?:/);
                if (!match) return total + 1;
                return total + (match[2] ? Number(match[2]) - Number(match[1]) + 1 : 1);
            }, 0);
        }
    };
})();
