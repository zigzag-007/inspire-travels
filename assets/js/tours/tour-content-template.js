// Tour Content Template Module
// Author: Zig Zag AI
// Description: Renders the tour tabs, itinerary, booking controls, and package switcher.

(function() {
    'use strict';

    window.TourContentTemplateModule = {
        render: function(tour, context) {
            const otherTours = context.otherTours;

            return `
<!-- Main Content Area -->
        <main class="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

                <!-- 2-Column Section: Itinerary & Sticky Sidebar -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

                    <!-- Left 2 Columns: Tabbed Navigation & Active Tab Panel -->
                    <div class="lg:col-span-2 space-y-10">

                        <!-- Horizontal Tab Switcher Bar (Apple / LESSTAXI Style) -->
                        <div class="border-b border-slate-200 bg-white/70 backdrop-blur-md rounded-2xl px-4 pt-3 shadow-sm border border-slate-200/80">
                            <div class="flex items-center gap-6 sm:gap-10">
                                <button id="tab-btn-overview" type="button" data-tour-tab="overview" class="tour-tab-btn pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 border-b-2 border-emerald-700 transition-all flex items-center gap-1.5">
                                    <i data-lucide="compass" class="w-4 h-4"></i> Overview
                                </button>
                                <button id="tab-btn-options" type="button" data-tour-tab="options" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-all flex items-center gap-1.5">
                                    <i data-lucide="sliders" class="w-4 h-4"></i> Options
                                </button>
                                <button id="tab-btn-details" type="button" data-tour-tab="details" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-all flex items-center gap-1.5">
                                    <i data-lucide="file-text" class="w-4 h-4"></i> Details
                                </button>
                            </div>
                        </div>

                        <!-- TAB PANEL 1: OVERVIEW (Itinerary & Highlights) -->
                        <div id="tour-tab-panel-overview" class="space-y-12">
                            <!-- Tour Vibe Intro Card -->
                            <div class="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
                                <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600"></i> Experience Vibe
                                </span>
                                <p class="text-slate-700 text-base leading-relaxed font-medium">
                                    ${tour.description} Handpicked private chauffeur routes, scenic photo opportunities, and authentic cultural encounters tailored to your travel pace.
                                </p>
                            </div>

                            <!-- Detailed Day-by-Day Itinerary Timeline -->
                            <div id="tour-itinerary">
                                <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                    <div>
                                        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                                            <i data-lucide="calendar" class="w-7 h-7 text-emerald-600"></i> Day-by-Day Detailed Itinerary
                                        </h2>
                                        <p class="text-slate-500 text-sm mt-1">Carefully planned for optimal travel pace & scenic views</p>
                                    </div>
                                    <span class="hidden sm:inline-block text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        ${window.TourItineraryModule.countDays(tour.highlights)} Scheduled Days
                                    </span>
                                </div>

                                <div class="relative border-l-2 border-emerald-200 ml-4 md:ml-6 space-y-8">
                                    ${tour.highlights.map((highlight, idx) => {
                                        const itineraryItem = window.TourItineraryModule.parse(highlight);
                                        let dayNum = itineraryItem.dayNumber;
                                        let activity = itineraryItem.activity;
                                        let stayLocation = itineraryItem.stayLocation;

                                        return `
                                        <div class="relative pl-8 md:pl-10 group">
                                            <!-- Timeline Bullet -->
                                            <div class="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-emerald-600 ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-125"></div>

                                            <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300">
                                                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                    <span class="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        ${dayNum}
                                                    </span>
                                                    ${stayLocation ? `
                                                    <span class="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                                        <i data-lucide="bed" class="w-3.5 h-3.5 text-emerald-600"></i> Overnight: <strong class="text-slate-800">${stayLocation}</strong>
                                                    </span>
                                                    ` : ''}
                                                </div>

                                                <h3 class="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">${activity}</h3>
                                                <p class="text-slate-600 text-sm leading-relaxed mb-4">Experience authentic Sri Lankan hospitality, guided sightseeing, and leisure time tailored to your comfort.</p>

                                                <!-- Inclusions Tags -->
                                                <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                                                    <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100/60 flex items-center gap-1">
                                                        <i data-lucide="check" class="w-3 h-3"></i> Private Driver
                                                    </span>
                                                    <span class="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                                                        <i data-lucide="camera" class="w-3 h-3 text-slate-400"></i> Sightseeing Stops
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- TAB PANEL 2: OPTIONS (Customization & WhatsApp Inquiry Form) -->
                        <div id="tour-tab-panel-options" class="hidden space-y-8">
                            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg relative overflow-hidden">
                                <div class="border-b border-slate-200 pb-6 mb-6">
                                    <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-2">
                                        Tailor Your Trip
                                    </span>
                                    <h3 class="font-serif text-2xl font-bold text-slate-900">Package Customization & Instant Inquiry</h3>
                                    <p class="text-slate-500 text-xs sm:text-sm mt-1">Select your dates, vehicle type, and add-on preferences to generate a direct WhatsApp quote.</p>
                                </div>

                                <form id="tour-booking-form" data-tour-title="${tour.title.replace(/"/g, '&quot;')}" novalidate class="space-y-6">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <!-- Travel Start Date -->
                                        <div>
                                            <label for="form-start-date" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Start Date</label>
                                            <input type="date" id="form-start-date" required aria-describedby="form-start-date-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                            <p id="form-start-date-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Required. Choose a date at least two days from today.</p>
                                        </div>

                                        <!-- Preferred Pickup Time -->
                                        <div>
                                            <label for="form-pickup-time" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Pickup Time</label>
                                            <select id="form-pickup-time" required aria-describedby="form-pickup-time-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Morning (06:00 - 08:30 AM)">Morning (06:00 - 08:30 AM)</option>
                                                <option value="Late Morning (09:00 - 11:30 AM)">Late Morning (09:00 - 11:30 AM)</option>
                                                <option value="Afternoon (12:00 - 03:00 PM)">Afternoon (12:00 - 03:00 PM)</option>
                                                <option value="Airport Flight Arrival Pickup">Airport Flight Arrival Pickup</option>
                                            </select>
                                            <p id="form-pickup-time-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose your preferred collection time.</p>
                                        </div>

                                        <!-- Group Size & Vehicle Choice -->
                                        <div>
                                            <label for="form-vehicle" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Vehicle Standard / Group Size</label>
                                            <select id="form-vehicle" required aria-describedby="form-vehicle-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Private AC Sedan (1-3 Pax)">Private AC Sedan (1-3 Pax)</option>
                                                <option value="Luxury AC High-Roof Van (4-8 Pax)">Luxury AC High-Roof Van (4-8 Pax)</option>
                                                <option value="Chauffeured VIP SUV 4x4">Chauffeured VIP SUV 4x4</option>
                                                <option value="Coaster Mini-Bus (9+ Pax)">Coaster Mini-Bus (9+ Pax)</option>
                                            </select>
                                            <p id="form-vehicle-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose a vehicle for your group.</p>
                                        </div>

                                        <!-- Accommodation Package Tier -->
                                        <div>
                                            <label for="form-hotel-tier" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hotel Package Tier</label>
                                            <select id="form-hotel-tier" required aria-describedby="form-hotel-tier-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Vehicle & Chauffeur Only (Self-Booked Hotels)">Vehicle & Chauffeur Only (Self-Booked Hotels)</option>
                                                <option value="Standard 3-Star Handpicked Boutique Hotels">Standard 3-Star Handpicked Boutique Hotels</option>
                                                <option value="Deluxe 4-Star Beach & Tea Resorts">Deluxe 4-Star Beach & Tea Resorts</option>
                                                <option value="Luxury 5-Star Heritage Villas">Luxury 5-Star Heritage Villas</option>
                                            </select>
                                            <p id="form-hotel-tier-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Choose the accommodation level you prefer.</p>
                                        </div>
                                    </div>

                                    <!-- Add-on Experience Checkboxes -->
                                    <div class="pt-4 border-t border-slate-100">
                                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Optional Add-on Experiences</label>
                                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 cursor-pointer">
                                                <input type="checkbox" id="addon-train" class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
                                                <span class="text-xs font-bold text-slate-800">Kandy to Ella Train Tickets</span>
                                            </label>
                                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 cursor-pointer">
                                                <input type="checkbox" id="addon-safari" class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
                                                <span class="text-xs font-bold text-slate-800">Yala 4x4 Safari Jeep</span>
                                            </label>
                                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 cursor-pointer">
                                                <input type="checkbox" id="addon-cooking" class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
                                                <span class="text-xs font-bold text-slate-800">Village Cooking & Spa</span>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Contact Info & Notes -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                        <div>
                                            <label for="form-guest-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
                                            <input type="text" id="form-guest-name" placeholder="Full Name" required aria-describedby="form-guest-name-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                            <p id="form-guest-name-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Required for your inquiry.</p>
                                        </div>
                                        <div>
                                            <label for="form-pax" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number of Persons</label>
                                            <input type="number" id="form-pax" min="1" max="30" value="2" required aria-describedby="form-pax-validation" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                            <p id="form-pax-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Enter 1 to 30 guests.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label for="form-notes" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Special Requests / Pickup Hotel</label>
                                        <textarea id="form-notes" rows="2" maxlength="500" aria-describedby="form-notes-validation" placeholder="e.g. Flight number, child seat requirement, hotel name in Negombo/Colombo..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"></textarea>
                                        <p id="form-notes-validation" aria-live="polite" class="mt-1.5 text-xs font-medium text-slate-400">Optional. Up to 500 characters.</p>
                                    </div>

                                    <!-- WhatsApp Action Button -->
                                    <button type="submit" class="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.01] active:scale-95 text-base">
                                        <i class="fa-brands fa-whatsapp text-xl"></i>
                                        <span>Book Now via WhatsApp</span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <!-- TAB PANEL 3: DETAILS (Location Map, Inclusions, Driver Amenities & Policies) -->
                        <div id="tour-tab-panel-details" class="hidden space-y-8">
                            <!-- Small Interactive Google Map Card -->
                            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <i data-lucide="map-pin" class="w-5 h-5 text-emerald-600"></i> Tour Route & Location Map
                                    </h3>
                                    <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        ${tour.location}
                                    </span>
                                </div>
                                <div class="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                                    <iframe class="w-full h-full border-0"
                                            src="https://maps.google.com/maps?q=Sri+Lanka,${encodeURIComponent(tour.location.split(',')[0])}&t=&z=7&ie=UTF8&iwloc=&output=embed"
                                            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>

                            <!-- Comprehensive What's Included List -->
                            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
                                <h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                                    <i data-lucide="shield-check" class="w-6 h-6 text-emerald-600"></i> What's Included in This Package
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-slate-700">
                                    <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                                        <div>
                                            <strong class="text-slate-900 block">Private Chauffeured Vehicle</strong>
                                            Air-conditioned sedan, van or SUV with unlimited tour mileage.
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                                        <div>
                                            <strong class="text-slate-900 block">English-Speaking Driver Guide</strong>
                                            Experienced local chauffeur licensed by Sri Lanka Tourism Development Authority.
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                                        <div>
                                            <strong class="text-slate-900 block">Fuel, Tolls & Parking Included</strong>
                                            Expressway tolls, fuel expenses, parking charges, and driver lodging/food covered.
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                                        <div>
                                            <strong class="text-slate-900 block">Airport Transfers & Hotel Pickups</strong>
                                            Door-to-door pickup from Colombo/Negombo Airport or any Sri Lankan hotel.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Driver & Vehicle Amenities & Luggage Policy -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
                                    <h4 class="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                                        <i data-lucide="car" class="w-5 h-5 text-emerald-600"></i> Driver & Vehicle Amenities
                                    </h4>
                                    <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                                        <li class="flex items-center gap-2"><i data-lucide="wifi" class="w-4 h-4 text-emerald-600"></i> Complimentary On-Board High Speed Wi-Fi</li>
                                        <li class="flex items-center gap-2"><i data-lucide="droplet" class="w-4 h-4 text-emerald-600"></i> Chilled Mineral Water Bottles Daily</li>
                                        <li class="flex items-center gap-2"><i data-lucide="shield" class="w-4 h-4 text-emerald-600"></i> Full Passenger Vehicle Insurance Coverage</li>
                                        <li class="flex items-center gap-2"><i data-lucide="baby" class="w-4 h-4 text-emerald-600"></i> Infant / Child Safety Seats Available on Request</li>
                                    </ul>
                                </div>

                                <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
                                    <h4 class="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                                        <i data-lucide="briefcase" class="w-5 h-5 text-emerald-600"></i> Luggage & Booking Terms
                                    </h4>
                                    <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                                        <li class="flex items-start gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> <strong>Luggage Allowance:</strong> 1 Large Checked Suitcase + 1 Carry-on per guest</li>
                                        <li class="flex items-start gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> <strong>Zero Deposit Option:</strong> Pay upon driver arrival in Sri Lanka</li>
                                        <li class="flex items-start gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> <strong>Free Cancellation:</strong> Cancel or adjust dates up to 48 hours prior</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column: Dedicated Sticky Sidebar (Sticks through itinerary & inclusions, stops naturally at section bottom) -->
                    <div class="lg:col-span-1 space-y-8 sticky top-24">

                        <!-- Sticky Booking & Inquiry Card -->
                        <div id="tour-sidebar-booking" class="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
                            <div class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 text-center relative">
                                <span class="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                    Instant Availability
                                </span>
                                <h3 class="font-serif text-2xl font-bold text-white">Customize & Book</h3>
                                <p class="text-slate-300 text-xs sm:text-sm mt-1">Get an instant quote on WhatsApp</p>
                            </div>

                            <div class="p-6 space-y-6">
                                <div>
                                    <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Starting Price</span>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-3xl font-extrabold text-slate-900">$300</span>
                                        <span class="text-sm font-medium text-slate-500">/ person (approx.)</span>
                                    </div>
                                    <p class="text-xs text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                                        <i data-lucide="tag" class="w-3.5 h-3.5"></i> Apply 15% discount promo codes on inquiry
                                    </p>
                                </div>

                                <hr class="border-slate-100">

                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-slate-800">Zero Booking Fees</p>
                                            <p class="text-xs text-slate-500">Pay directly during your tour</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-slate-800">Flexible Changes</p>
                                            <p class="text-xs text-slate-500">Adjust stops anytime with your driver</p>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" data-tour-tab="options" data-tour-scroll="true"
                                        class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base">
                                    <i data-lucide="sliders" class="w-5 h-5"></i>
                                    Select Options & Book
                                </button>
                            </div>
                        </div>

                        <!-- Quick Package Switcher Card -->
                        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
                            <h4 class="font-serif text-base font-bold text-slate-900 flex items-center justify-between">
                                <span class="flex items-center gap-2"><i data-lucide="compass" class="w-4 h-4 text-emerald-600"></i> Switch Package</span>
                                <a href="../index.html#tours" class="text-xs text-emerald-600 hover:underline">View All</a>
                            </h4>
                            <div class="space-y-3">
                                ${otherTours.map(ot => `
                                <a href="?tour=${ot.slug}" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                                    <img src="../${ot.image}" alt="${ot.title}" class="w-12 h-12 rounded-lg object-cover shrink-0">
                                    <div class="min-w-0 flex-1">
                                        <h5 class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">${ot.title}</h5>
                                        <span class="text-[11px] text-slate-500">${ot.duration} • ${ot.location.split(',')[0]}</span>
                                    </div>
                                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0"></i>
                                </a>
                                `).join('')}
                            </div>
                        </div>

                    </div>
                </div>
            `;
        }
    };
})();
