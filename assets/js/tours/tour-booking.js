// Tour Booking Module
// Author: Zig Zag AI
// Description: Validates the visible inquiry fields and opens a clear WhatsApp message.

(function() {
    'use strict';

    window.TourBookingModule = {
        fieldRules: {
            'form-start-date': {
                message: 'Choose a travel date at least two days from today.',
                validate: function(field) { return Boolean(field.value) && field.value >= field.min; }
            },
            'form-pickup-time': {
                message: 'Choose a preferred pickup time.',
                validate: function(field) { return Boolean(field.value); }
            },
            'form-vehicle': {
                message: 'Choose a vehicle option.',
                validate: function(field) { return Boolean(field.value); }
            },
            'form-hotel-tier': {
                message: 'Choose an accommodation preference.',
                validate: function(field) { return Boolean(field.value); }
            },
            'form-guest-name': {
                message: 'Enter your name using at least two characters.',
                validate: function(field) { return field.value.trim().length >= 2; }
            },
            'form-pax': {
                message: 'Enter between 1 and 30 travellers.',
                validate: function(field) {
                    var value = Number(field.value);
                    return Number.isInteger(value) && value >= 1 && value <= 30;
                }
            },
            'form-notes': {
                message: 'Keep questions and requests under 500 characters.',
                validate: function(field) { return field.value.length <= 500; }
            }
        },

        init: function() {
            var bookingForm = document.getElementById('tour-booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    window.TourBookingModule.sendInquiry(bookingForm.dataset.tourTitle || 'Sri Lanka Tour');
                });
            }

            var dateField = document.getElementById('form-start-date');
            if (dateField) {
                var today = new Date();
                var earliest = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
                dateField.min = earliest.getFullYear() + '-' + String(earliest.getMonth() + 1).padStart(2, '0') + '-' + String(earliest.getDate()).padStart(2, '0');
            }

            Object.keys(this.fieldRules).forEach(function(fieldId) {
                var field = document.getElementById(fieldId);
                if (!field) return;

                field.addEventListener('blur', function() {
                    window.TourBookingModule.validateField(fieldId, true);
                });
                field.addEventListener('input', function() {
                    if (field.dataset.tourTouched === 'true') window.TourBookingModule.validateField(fieldId, true);
                });
                field.addEventListener('change', function() {
                    window.TourBookingModule.validateField(fieldId, true);
                });
            });
        },

        validateField: function(fieldId, showFeedback) {
            var field = document.getElementById(fieldId);
            var rule = this.fieldRules[fieldId];
            if (!field || !rule) return true;

            field.dataset.tourTouched = 'true';
            var isValid = rule.validate(field);
            var message = document.getElementById(fieldId + '-validation');

            field.classList.remove('border-rose-500', 'focus:ring-rose-500', 'border-emerald-400', 'focus:ring-emerald-500');
            field.removeAttribute('aria-invalid');
            if (!showFeedback) return isValid;

            if (isValid) {
                field.classList.add('border-emerald-400', 'focus:ring-emerald-500');
                field.setCustomValidity('');
                if (message) {
                    message.textContent = 'Looks good.';
                    message.className = 'mt-1.5 text-xs font-semibold text-emerald-700';
                }
            } else {
                field.classList.add('border-rose-500', 'focus:ring-rose-500');
                field.setAttribute('aria-invalid', 'true');
                field.setCustomValidity(rule.message);
                if (message) {
                    message.textContent = rule.message;
                    message.className = 'mt-1.5 text-xs font-semibold text-rose-600';
                }
            }

            return isValid;
        },

        validateForm: function() {
            var self = this;
            var firstInvalidField = null;
            var isValid = true;

            Object.keys(this.fieldRules).forEach(function(fieldId) {
                var field = document.getElementById(fieldId);
                if (!field) return;
                var fieldIsValid = self.validateField(fieldId, true);
                if (!fieldIsValid && !firstInvalidField) firstInvalidField = field;
                if (!fieldIsValid) isValid = false;
            });

            if (firstInvalidField) firstInvalidField.focus();
            return isValid;
        },

        sendInquiry: function(tourTitle) {
            var getValue = function(id, fallback) {
                var field = document.getElementById(id);
                return field && field.value ? field.value : fallback;
            };
            var bookingForm = document.getElementById('tour-booking-form');
            var isGroup = bookingForm && bookingForm.dataset.tourMode === 'group';

            if (!this.validateForm()) return;

            var startDate = getValue('form-start-date', 'Flexible');
            var pickupTime = getValue('form-pickup-time', 'To be confirmed');
            var vehicle = getValue('form-vehicle', 'To be recommended');
            var hotelTier = getValue('form-hotel-tier', 'To be discussed');
            var guestName = getValue('form-guest-name', 'Guest');
            var pax = getValue('form-pax', '2');
            var notes = getValue('form-notes', '');
            var message = '*' + (isGroup ? 'Group Journey Inquiry' : 'Private Tour Inquiry') + ' | Inspire Travels*\n\n' +
                '*Tour:* ' + tourTitle + '\n' +
                '*Preferred Start Date:* ' + startDate + '\n' +
                (!isGroup ? '*Pickup Time:* ' + pickupTime + '\n*Vehicle:* ' + vehicle + '\n' : '') +
                '*' + (isGroup ? 'Room Preference' : 'Hotel Preference') + ':* ' + hotelTier + '\n' +
                '*Travellers:* ' + pax + '\n' +
                '*Guest Name:* ' + guestName + '\n' +
                (notes.trim() ? '*Questions or Requests:* ' + notes + '\n\n' : '\n') +
                (isGroup ? 'Please confirm the next departure, availability, full price, and inclusions.' : 'Please confirm availability, the complete quote, and inclusions.');

            if (window.WhatsAppModule) {
                window.WhatsAppModule.open(message);
                return;
            }

            window.open('https://api.whatsapp.com/send?phone=94785959333&text=' + encodeURIComponent(message), '_blank', 'noopener');
        }
    };
})();
