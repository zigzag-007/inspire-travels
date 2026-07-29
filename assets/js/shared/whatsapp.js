// WhatsApp Module
// Author: Zig Zag AI
// Description: Keeps the business contact number and message links consistent.

(function() {
    'use strict';

    window.WhatsAppModule = {
        phoneNumber: '94785959333',

        createUrl: function(message) {
            return 'https://api.whatsapp.com/send?phone=' + this.phoneNumber + '&text=' + encodeURIComponent(message);
        },

        open: function(message) {
            window.open(this.createUrl(message), '_blank', 'noopener');
        }
    };
})();
