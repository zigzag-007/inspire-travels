// Tour Content Template Module
// Author: Zig Zag AI
// Description: Renders the itinerary, inquiry form, and package notes for each travel style.

(function() {
    'use strict';

    function renderActivities(activities) {
        return '<ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-sm text-slate-600">' + activities.map(function(activity) {
            return '<li class="flex items-start gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i><span>' + activity + '</span></li>';
        }).join('') + '</ul>';
    }

    function renderItinerary(tour) {
        var isGroup = tour.travelMode === 'group';

        return tour.days.map(function(day) {
            return `<article class="tour-itinerary-entry relative pl-8 md:pl-10 group">
                <div class="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-emerald-600 ring-4 ring-white shadow-md"></div>
                <div class="tour-itinerary-card bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span class="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">${day.label}</span>
                        ${day.overnight ? `<span class="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><i data-lucide="bed" class="w-3.5 h-3.5 text-emerald-600"></i>Overnight: <strong class="text-slate-800">${day.overnight}</strong></span>` : ''}
                    </div>
                    <h3 class="font-display text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">${day.title}</h3>
                    ${renderActivities(day.activities)}
                    <div class="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-100 text-[11px] font-semibold">
                        <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100/60 flex items-center gap-1"><i data-lucide="${isGroup ? 'users' : 'car'}" class="w-3 h-3"></i>${isGroup ? 'Shared Group Route' : 'Private Driver'}</span>
                        <span class="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i>Planned Stops</span>
                    </div>
                </div>
            </article>`;
        }).join('');
    }

    function renderPrivateOptions() {
        return `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label for="form-pickup-time" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Pickup Time</label>
                <select id="form-pickup-time" required aria-describedby="form-pickup-time-validation" class="tour-form-field">
                    <option value="Morning">Morning</option><option value="Late Morning">Late Morning</option><option value="Afternoon">Afternoon</option><option value="Airport Flight Arrival">Airport Flight Arrival</option>
                </select>
                <p id="form-pickup-time-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose your preferred collection time.</p>
            </div>
            <div>
                <label for="form-vehicle" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Vehicle and Group Size</label>
                <select id="form-vehicle" required aria-describedby="form-vehicle-validation" class="tour-form-field">
                    <option value="Private AC Sedan, 1 to 3 guests">Private AC Sedan, 1 to 3 guests</option><option value="Private AC Van, 3 to 9 guests">Private AC Van, 3 to 9 guests</option><option value="Coaster or Bus, 9 or more guests">Coaster or Bus, 9 or more guests</option>
                </select>
                <p id="form-vehicle-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose the closest vehicle size.</p>
            </div>
        </div>`;
    }

    function renderGroupOptions() {
        return `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <div class="flex items-start gap-3"><i data-lucide="users" class="w-5 h-5 shrink-0 mt-0.5"></i><p><strong class="block mb-1">This is a shared group journey.</strong>The route is planned in advance. Send your preferred date and group size so the team can confirm the next departure, price, and room options.</p></div>
        </div>`;
    }

    function renderInquiryForm(tour) {
        var isGroup = tour.travelMode === 'group';
        return `<form id="tour-booking-form" data-tour-title="${tour.title.replace(/"/g, '&quot;')}" data-tour-mode="${tour.travelMode}" novalidate class="space-y-6">
            ${isGroup ? renderGroupOptions() : renderPrivateOptions()}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label for="form-start-date" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Start Date</label>
                    <input type="date" id="form-start-date" required aria-describedby="form-start-date-validation" class="tour-form-field">
                    <p id="form-start-date-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose a date at least two days from today.</p>
                </div>
                <div>
                    <label for="form-hotel-tier" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">${isGroup ? 'Room Preference' : 'Hotel Preference'}</label>
                    <select id="form-hotel-tier" required aria-describedby="form-hotel-tier-validation" class="tour-form-field">
                        ${isGroup ? '<option value="Single room">Single room</option><option value="Twin room">Twin room</option><option value="Double room">Double room</option><option value="Family room">Family room</option>' : '<option value="Vehicle and chauffeur only">Vehicle and chauffeur only</option><option value="Standard hotels">Standard hotels</option><option value="Deluxe hotels">Deluxe hotels</option><option value="Luxury hotels">Luxury hotels</option>'}
                    </select>
                    <p id="form-hotel-tier-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">This helps the team prepare the right quote.</p>
                </div>
                <div>
                    <label for="form-guest-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
                    <input type="text" id="form-guest-name" placeholder="Full name" required aria-describedby="form-guest-name-validation" class="tour-form-field">
                    <p id="form-guest-name-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Required for your inquiry.</p>
                </div>
                <div>
                    <label for="form-pax" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number of Travellers</label>
                    <input type="number" id="form-pax" min="1" max="30" value="2" required aria-describedby="form-pax-validation" class="tour-form-field">
                    <p id="form-pax-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Enter 1 to 30 travellers.</p>
                </div>
            </div>
            <div>
                <label for="form-notes" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Questions or Special Requests</label>
                <textarea id="form-notes" rows="3" maxlength="500" aria-describedby="form-notes-validation" placeholder="Tell us about children, room needs, flight details, or any route questions." class="tour-form-field"></textarea>
                <p id="form-notes-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Optional. Up to 500 characters.</p>
            </div>
            <button type="submit" class="tour-inquiry-button"><i class="ph-fill ph-whatsapp-logo text-xl" aria-hidden="true"></i><span>${isGroup ? 'Ask About Group Departures' : 'Request a Private Tour Quote'}</span></button>
        </form>`;
    }

    function renderPackageNotes(tour) {
        var isGroup = tour.travelMode === 'group';
        var items = isGroup ? [
            ['Shared Journey', 'Transport and the daily route are planned for the travelling group.'],
            ['Guided Programme', 'A tour representative or guide supports the group during the journey.'],
            ['Overnight Route', 'The listed overnight towns show the planned accommodation sequence.'],
            ['Airport Support', 'Airport pickup or drop off is included where the itinerary states it.']
        ] : [
            ['Private Transport', 'An air conditioned private vehicle is matched to your party size.'],
            ['Driver Guide', 'An English speaking local driver guide supports the route.'],
            ['Route Planning', 'The confirmed plan can be adjusted with the team before travel.'],
            ['Airport Support', 'Airport pickup or drop off is included where the itinerary states it.']
        ];

        return `<div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
            <h3 class="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5"><i data-lucide="clipboard-check" class="w-6 h-6 text-emerald-600"></i>Package Planning Notes</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-slate-700">
                ${items.map(function(item) { return `<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100"><i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i><div><strong class="text-slate-900 block">${item[0]}</strong>${item[1]}</div></div>`; }).join('')}
            </div>
            <div class="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600"><strong class="text-slate-900">Please confirm before booking.</strong> The final quote will state accommodation, meals, entrance tickets, transport, optional activities, payment terms, and cancellation terms.</div>
        </div>`;
    }

    window.TourContentTemplateModule = {
        render: function(tour) {
            var isGroup = tour.travelMode === 'group';

            return `
        <main class="tour-detail-canvas py-16 md:py-24 relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
                    <div class="tour-detail-main-column lg:col-span-2 space-y-10">
                        <div class="tour-detail-tabs border-b border-slate-200 bg-white/70 backdrop-blur-md rounded-2xl px-4 pt-3 shadow-sm border border-slate-200/80">
                            <div class="tour-detail-tabs-list flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar">
                                <button id="tab-btn-overview" type="button" data-tour-tab="overview" class="tour-tab-btn pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 border-b-2 border-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="compass" class="w-4 h-4"></i>Overview</button>
                                <button id="tab-btn-options" type="button" data-tour-tab="options" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="message-square-text" class="w-4 h-4"></i>Enquire</button>
                                <button id="tab-btn-details" type="button" data-tour-tab="details" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-colors flex items-center gap-1.5 whitespace-nowrap"><i data-lucide="file-text" class="w-4 h-4"></i>Details</button>
                            </div>
                        </div>

                        <div id="tour-tab-panel-overview" class="space-y-12">
                            <div class="tour-route-intro bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
                                <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2"><i data-lucide="route" class="w-4 h-4 text-emerald-600"></i>${isGroup ? 'Shared Group Route' : 'Private Journey'}</span>
                                <p class="text-slate-700 text-base leading-relaxed font-medium">${tour.description} ${isGroup ? 'Departure dates, group size, price, and final inclusions are confirmed by inquiry.' : 'Your final route, hotels, price, and inclusions are confirmed with the team before booking.'}</p>
                            </div>

                            <section id="tour-itinerary">
                                <div class="mb-8 pb-4 border-b border-slate-200">
                                    <h2 class="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3"><i data-lucide="calendar" class="w-7 h-7 text-emerald-600"></i>Day by Day Itinerary</h2>
                                    <p class="text-slate-500 text-sm mt-1">${tour.duration} and ${tour.nights}, with ${tour.days.length} planned itinerary entries</p>
                                </div>
                                <div class="relative border-l-2 border-emerald-200 ml-4 md:ml-6 space-y-8">${renderItinerary(tour)}</div>
                            </section>
                        </div>

                        <div id="tour-tab-panel-options" class="hidden space-y-8">
                            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg">
                                <div class="border-b border-slate-200 pb-6 mb-6">
                                    <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider">Direct WhatsApp Inquiry</span>
                                    <h3 class="font-display text-2xl font-bold text-slate-900 mt-2">${isGroup ? 'Check the next group departure' : 'Plan this journey for your party'}</h3>
                                    <p class="text-slate-500 text-sm mt-1">Send the key details once. The team can reply with availability and a complete quote.</p>
                                </div>
                                ${renderInquiryForm(tour)}
                            </div>
                        </div>

                        <div id="tour-tab-panel-details" class="hidden space-y-8">
                            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <h3 class="font-display text-xl font-bold text-slate-900 flex items-center gap-2"><i data-lucide="map-pin" class="w-5 h-5 text-emerald-600"></i>Tour Route Map</h3>
                                    <span class="text-xs font-semibold text-slate-500">${tour.location}</span>
                                </div>
                                <div class="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner"><iframe title="Map for ${tour.title}" class="w-full h-full border-0" src="https://maps.google.com/maps?q=Sri+Lanka,${encodeURIComponent(tour.location.split(',')[0])}&t=&z=7&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
                            </div>
                            ${renderPackageNotes(tour)}
                        </div>
                    </div>

                    <aside class="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                        <div id="tour-sidebar-booking" class="tour-quote-panel bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
                            <div class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 text-center">
                                <span class="text-emerald-300 text-[11px] font-bold uppercase tracking-wider">${isGroup ? 'Group departure inquiry' : 'Private tour inquiry'}</span>
                                <h3 class="font-display text-2xl font-bold text-white mt-2">${isGroup ? 'Dates and Price on Request' : 'Build Your Quote'}</h3>
                                <p class="text-slate-300 text-xs sm:text-sm mt-1">Talk directly with the Inspire Travels team</p>
                            </div>
                            <div class="p-6 space-y-5">
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><i data-lucide="calendar-check" class="w-5 h-5"></i></div><div><p class="text-sm font-bold text-slate-800">Confirm Availability</p><p class="text-xs text-slate-500">Dates are checked before payment</p></div></div>
                                    <div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><i data-lucide="file-check" class="w-5 h-5"></i></div><div><p class="text-sm font-bold text-slate-800">Receive the Full Quote</p><p class="text-xs text-slate-500">Inclusions and terms are written clearly</p></div></div>
                                </div>
                                <button type="button" data-tour-tab="options" data-tour-scroll="true" class="tour-inquiry-button"><i data-lucide="message-circle" class="w-5 h-5"></i>${isGroup ? 'Ask About Departures' : 'Request a Quote'}</button>
                            </div>
                        </div>
                    </aside>
                </div>`;
        }
    };
})();
