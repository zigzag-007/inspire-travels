// Destination Inquiry Module
// Author: Zig Zag AI
// Description: Creates a contextual WhatsApp inquiry from the current guide.

(function() {
    'use strict';

    window.DestinationInquiryModule = {
        populate: function(destination) {
            var button = document.getElementById('dest-whatsapp-btn');
            if (!button || !destination || !window.WhatsAppModule) return;
            var message = '*Destination Travel Inquiry - ' + destination.name + '*\n\n' +
                'Hi Inspire Travels & Tours!\n' +
                'I read your 2026 travel magazine guide for *' + destination.name + '*.\n' +
                'Could you please share custom tour itinerary options, driver availability, and tailored pricing for ' + destination.name + '?\n\nThank you!';
            button.href = window.WhatsAppModule.createUrl(message);
        }
    };
})();

