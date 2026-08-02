// Tour Booking Module
// Author: Zig Zag AI
// Description: Builds the package inquiry from the selected tour options.

(function() {
    'use strict';

    window.TourBookingModule = {
        fieldRules: {
            'form-start-date': {
                message: 'Choose a travel date at least two days from today.',
                validate: function(field) {
                    return Boolean(field.value) && field.value >= field.min;
                }
            },
            'form-pickup-time': {
                message: 'Choose a preferred pickup time.',
                validate: function(field) {
                    return Boolean(field.value);
                }
            },
            'form-vehicle': {
                message: 'Choose a vehicle option.',
                validate: function(field) {
                    return Boolean(field.value);
                }
            },
            'form-hotel-tier': {
                message: 'Choose a hotel package tier.',
                validate: function(field) {
                    return Boolean(field.value);
                }
            },
            'form-guest-name': {
                message: 'Enter your name using at least two characters.',
                validate: function(field) {
                    return field.value.trim().length >= 2;
                }
            },
            'form-pax': {
                message: 'Enter between 1 and 30 guests.',
                validate: function(field) {
                    var value = Number(field.value);
                    return Number.isInteger(value) && value >= 1 && value <= 30;
                }
            },
            'form-notes': {
                message: 'Keep special requests under 500 characters.',
                validate: function(field) {
                    return field.value.length <= 500;
                }
            }
        },

        init: function() {
            var bookingForm = document.getElementById('tour-booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    window.TourBookingModule.sendInquiry(bookingForm.dataset.tourTitle || 'Custom Sri Lanka Tour');
                });
            }

            var dateField = document.getElementById('form-start-date');
            if (dateField) {
                var today = new Date();
                var earliestStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
                dateField.min = earliestStartDate.getFullYear() + '-' +
                    String(earliestStartDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(earliestStartDate.getDate()).padStart(2, '0');
            }

            Object.keys(this.fieldRules).forEach(function(fieldId) {
                var field = document.getElementById(fieldId);
                if (!field) return;

                field.addEventListener('blur', function() {
                    window.TourBookingModule.validateField(fieldId, true);
                });

                field.addEventListener('input', function() {
                    if (field.dataset.tourTouched === 'true') {
                        window.TourBookingModule.validateField(fieldId, true);
                    }
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
            var messageId = fieldId + '-validation';
            var message = document.getElementById(messageId);

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
                var fieldIsValid = self.validateField(fieldId, true);
                if (!fieldIsValid && !firstInvalidField) firstInvalidField = document.getElementById(fieldId);
                if (!fieldIsValid) isValid = false;
            });

            if (firstInvalidField) firstInvalidField.focus();
            return isValid;
        },

        sendInquiry: function(tourTitle) {
            var getValue = function(id, fallback) {
                return document.getElementById(id)?.value || fallback;
            };
            var startDate = getValue('form-start-date', 'Flexible / Unspecified');
            var pickupTime = getValue('form-pickup-time', 'Morning');
            var vehicle = getValue('form-vehicle', 'Private AC Vehicle');
            var hotelTier = getValue('form-hotel-tier', 'Standard');
            var guestName = getValue('form-guest-name', 'Valued Guest');
            var pax = getValue('form-pax', '2');
            var notes = getValue('form-notes', 'None');
            var addons = [];
            if (!this.validateForm()) return;

            if (document.getElementById('addon-train')?.checked) addons.push('Kandy to Ella Train Tickets');
            if (document.getElementById('addon-safari')?.checked) addons.push('Yala 4x4 Safari Jeep Upgrade');
            if (document.getElementById('addon-cooking')?.checked) addons.push('Village Cooking & Spa');

            var message = '⭐ *Custom Tour Inquiry - Inspire Travels* ⭐\n\n' +
                '✈️ *Tour Package:* ' + tourTitle + '\n' +
                '📅 *Start Date:* ' + startDate + ' (' + pickupTime + ')\n' +
                '🚗 *Vehicle Choice:* ' + vehicle + '\n' +
                '🏨 *Hotel Option:* ' + hotelTier + '\n' +
                '👥 *Group Size:* ' + pax + ' Person(s)\n' +
                (addons.length ? '🎯 *Add-on Experiences:* ' + addons.join(', ') + '\n' : '') +
                '👤 *Guest Name:* ' + guestName + '\n' +
                (notes !== 'None' && notes.trim() ? '📝 *Special Notes:* ' + notes + '\n\n' : '\n') +
                'Please confirm vehicle availability and total package quote. Thank you!';

            if (window.WhatsAppModule) {
                window.WhatsAppModule.open(message);
                return;
            }

            window.open('https://api.whatsapp.com/send?phone=94785959333&text=' + encodeURIComponent(message), '_blank', 'noopener');
        }
    };

})();
