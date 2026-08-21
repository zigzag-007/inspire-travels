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
        },

        init: function() {
            var self = this;

            document.querySelectorAll('[data-whatsapp-message]').forEach(function(control) {
                var message = control.dataset.whatsappMessage;
                if (!message || control.dataset.whatsappBound === 'true') return;

                control.dataset.whatsappBound = 'true';

                if (control.tagName === 'A') {
                    control.href = self.createUrl(message);
                    return;
                }

                var openInquiry = function(event) {
                    if (event) event.preventDefault();
                    self.open(message);
                };

                control.addEventListener('click', openInquiry);
                control.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') openInquiry(event);
                });
            });
        }
    };
})();
