// Dynamic Tour Page Renderer
// Loads package details dynamically based on ?tour=slug URL parameter

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tourSlug = urlParams.get('tour');

    if (!tourSlug) {
        window.location.href = '../index.html#tours';
        return;
    }

    // 7 Real Destination Photos per tour matching exact 40% / 30% / 30% grid
    const tourGalleries = {
        'highlights-escape': [
            { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Sigiriya Rock Fortress' },
            { src: 'assets/img/main-gallery/pinnawala-elephant-watching.jpg', title: 'Pinnawala Elephant Sanctuary' },
            { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Kandy Tea Estates' },
            { src: 'assets/img/main-gallery/madu-river-safari.jpg', title: 'Bentota Boat Safari' },
            { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Peradeniya Royal Gardens' },
            { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Historic Galle Fort' },
            { src: 'assets/img/main-gallery/01-guests-with-tour-guide-beside-private-van.jpeg', title: 'Private Chauffeured AC Van' }
        ],
        'hills-to-beach': [
            { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Sigiriya Lion Rock Fortress' },
            { src: 'assets/img/main-gallery/mirissa-coconut-tree-hill.jpg', title: 'Mirissa Coconut Tree Hill' },
            { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Nuwara Eliya Tea Valleys' },
            { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Mountain Zipline' },
            { src: 'assets/img/main-gallery/waterfall-tour.jpg', title: 'Ravana Waterfalls' },
            { src: 'assets/img/main-gallery/03-hill-country-group-viewpoint.jpeg', title: 'Hill Country Viewpoints' },
            { src: 'assets/img/main-gallery/surfing-class.jpeg', title: 'Mirissa Surfing Bay' }
        ],
        'golden-triangle': [
            { src: 'assets/img/main-gallery/cultural-heritage-tour.jpeg', title: 'Cultural Heritage Monuments' },
            { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Yala Wildlife Leopard Safari' },
            { src: 'assets/img/main-gallery/waterfall-tour.jpg', title: 'Ramboda Scenic Waterfalls' },
            { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Historic Galle Fort Ramparts' },
            { src: 'assets/img/main-gallery/cooking-class.jpeg', title: 'Traditional Sri Lankan Cooking' },
            { src: 'assets/img/main-gallery/05-tour-guide-van-selfie.jpeg', title: 'Guided Chauffeur Service' },
            { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Peradeniya Botanical Gardens' }
        ],
        'ramayanaya-tour': [
            { src: 'assets/img/main-gallery/cultural-heritage-tour.jpeg', title: 'Sacred Temples & Shrines' },
            { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Royal Botanical Gardens' },
            { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Seetha Eliya Highlands' },
            { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Historic Southern Shrines' },
            { src: 'assets/img/main-gallery/16-welcome-to-sri-lanka-arrival-sign.jpeg', title: 'Sacred Shrine Welcome' },
            { src: 'assets/img/main-gallery/18-tea-estate-view-with-waterfall.jpeg', title: 'Nuwara Eliya Valleys' },
            { src: 'assets/img/main-gallery/pinnawala-elephant-watching.jpg', title: 'Pinnawala Elephant Sanctuary' }
        ],
        'pearl-of-asia': [
            { src: 'assets/img/main-gallery/pidurangala-rock.jpg', title: 'Dambulla & Pidurangala View' },
            { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Gap Zipline Adventure' },
            { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Udawalawe Elephant Safari' },
            { src: 'assets/img/main-gallery/turtle-hatchery-visit.jpg', title: 'Turtle Hatchery Sanctuary' },
            { src: 'assets/img/main-gallery/surfing-class.jpeg', title: 'Mirissa Beach Surfing' },
            { src: 'assets/img/main-gallery/12-jeep-safari-group-tour.jpeg', title: '4x4 Wildlife Jeep Safari' },
            { src: 'assets/img/main-gallery/madu-river-safari.jpg', title: 'Bentota Boat Cruise' }
        ],
        'grand-tour': [
            { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Ancient Sigiriya Fortress' },
            { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Yala National Park Safari' },
            { src: 'assets/img/main-gallery/mirissa-coconut-tree-hill.jpg', title: 'Southern Coast Surfing Bays' },
            { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Peak & Nine Arch Bridge' },
            { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'UNESCO Galle Fort Ramparts' },
            { src: 'assets/img/main-gallery/09-outdoor-adventure-travelers-with-guide.jpeg', title: 'Complete Island Tour' },
            { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Highland Tea Valleys' }
        ]
    };

    // Wait for ToursModule data to load
    const checkTours = setInterval(() => {
        if (window.ToursModule && window.ToursModule.tourData) {
            clearInterval(checkTours);
            const tour = window.ToursModule.tourData.find(t => t.slug === tourSlug);
            
            if (tour) {
                renderTourPage(tour);
            } else {
                window.location.href = '../index.html#tours';
            }
        }
    }, 50);

    setTimeout(() => {
        clearInterval(checkTours);
        if (!document.getElementById('tour-hero')) {
            window.location.href = '../index.html#tours';
        }
    }, 3000);

    function renderTourPage(tour) {
        document.title = `${tour.title} — Inspire Travels & Tours`;

        const galleryImages = tourGalleries[tour.slug] || tourGalleries['highlights-escape'];
        const allTours = window.ToursModule.tourData;
        const otherTours = allTours.filter(t => t.slug !== tour.slug).slice(0, 3);

        const html = `
        <!-- Hero Header -->
        <header id="tour-hero" class="relative min-h-[500px] h-[65vh] flex items-end pb-16 pt-32 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="../${tour.image}" alt="${tour.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30"></div>
            </div>
            
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <!-- Breadcrumb -->
                <nav class="flex items-center gap-2 text-white/70 text-sm mb-4 font-medium" aria-label="Breadcrumb">
                    <a href="../index.html" class="hover:text-white transition-colors">Home</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <a href="../index.html#tours" class="hover:text-white transition-colors">Tours</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400"></i>
                    <span class="text-white">${tour.title}</span>
                </nav>

                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 font-bold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${tour.duration}
                    </span>
                    <span class="bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold px-3.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i> ${tour.location}
                    </span>
                    <span class="bg-amber-400/20 border border-amber-400/40 backdrop-blur-md text-amber-300 font-bold px-3.5 py-1 rounded-full text-xs flex items-center gap-1">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i> ${tour.rating} Score
                    </span>
                </div>

                <h1 class="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-md">${tour.title}</h1>
                <p class="text-slate-200 text-base sm:text-xl max-w-3xl leading-relaxed drop-shadow">${tour.description}</p>
            </div>
        </header>

        <!-- Key Specs Summary Bar -->
        <div class="bg-slate-900 border-y border-slate-800 text-white py-6 relative z-20 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div class="pt-2 md:pt-0">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Vehicle Standard</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="car" class="w-4 h-4"></i> Private AC Vehicle
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Tour Driver</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="user-check" class="w-4 h-4"></i> English Speaking Guide
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Flexibility</span>
                        <span class="text-base font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                            <i data-lucide="sliders" class="w-4 h-4"></i> 100% Customizable
                        </span>
                    </div>
                    <div class="pt-4 md:pt-0 md:pl-6">
                        <span class="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Starting Price</span>
                        <span class="text-xl font-extrabold text-white flex items-center justify-center md:justify-start gap-1">
                            From $300 <span class="text-xs font-normal text-slate-400">/ person</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

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
                                <button id="tab-btn-overview" onclick="window.switchTourTab('overview')" class="tour-tab-btn pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 border-b-2 border-emerald-700 transition-all flex items-center gap-1.5">
                                    <i data-lucide="compass" class="w-4 h-4"></i> Overview
                                </button>
                                <button id="tab-btn-options" onclick="window.switchTourTab('options')" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-all flex items-center gap-1.5">
                                    <i data-lucide="sliders" class="w-4 h-4"></i> Options
                                </button>
                                <button id="tab-btn-details" onclick="window.switchTourTab('details')" class="tour-tab-btn pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-700 border-b-2 border-transparent transition-all flex items-center gap-1.5">
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
                            <div>
                                <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                    <div>
                                        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                                            <i data-lucide="calendar" class="w-7 h-7 text-emerald-600"></i> Day-by-Day Detailed Itinerary
                                        </h2>
                                        <p class="text-slate-500 text-sm mt-1">Carefully planned for optimal travel pace & scenic views</p>
                                    </div>
                                    <span class="hidden sm:inline-block text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        ${tour.highlights.length} Scheduled Days
                                    </span>
                                </div>

                                <div class="relative border-l-2 border-emerald-200 ml-4 md:ml-6 space-y-8">
                                    ${tour.highlights.map((highlight, idx) => {
                                        const match = highlight.match(/Day \d+(-\d+)?: (.*?)(?:\s\/\s[sS]stay (.*))?$/);
                                        let dayNum = highlight.split(':')[0];
                                        let activity = match ? match[2] : highlight.split(':')[1] || highlight;
                                        let stayLocation = match && match[3] ? match[3] : '';

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

                                <form onsubmit="event.preventDefault(); window.sendTourWhatsAppInquiry('${tour.title.replace(/'/g, "\\'")}');" class="space-y-6">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <!-- Travel Start Date -->
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Start Date</label>
                                            <input type="date" id="form-start-date" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                        </div>

                                        <!-- Preferred Pickup Time -->
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Pickup Time</label>
                                            <select id="form-pickup-time" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Morning (06:00 - 08:30 AM)">Morning (06:00 - 08:30 AM)</option>
                                                <option value="Late Morning (09:00 - 11:30 AM)">Late Morning (09:00 - 11:30 AM)</option>
                                                <option value="Afternoon (12:00 - 03:00 PM)">Afternoon (12:00 - 03:00 PM)</option>
                                                <option value="Airport Flight Arrival Pickup">Airport Flight Arrival Pickup</option>
                                            </select>
                                        </div>

                                        <!-- Group Size & Vehicle Choice -->
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Vehicle Standard / Group Size</label>
                                            <select id="form-vehicle" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Private AC Sedan (1-3 Pax)">Private AC Sedan (1-3 Pax)</option>
                                                <option value="Luxury AC High-Roof Van (4-8 Pax)">Luxury AC High-Roof Van (4-8 Pax)</option>
                                                <option value="Chauffeured VIP SUV 4x4">Chauffeured VIP SUV 4x4</option>
                                                <option value="Coaster Mini-Bus (9+ Pax)">Coaster Mini-Bus (9+ Pax)</option>
                                            </select>
                                        </div>

                                        <!-- Accommodation Package Tier -->
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hotel Package Tier</label>
                                            <select id="form-hotel-tier" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                                <option value="Vehicle & Chauffeur Only (Self-Booked Hotels)">Vehicle & Chauffeur Only (Self-Booked Hotels)</option>
                                                <option value="Standard 3-Star Handpicked Boutique Hotels">Standard 3-Star Handpicked Boutique Hotels</option>
                                                <option value="Deluxe 4-Star Beach & Tea Resorts">Deluxe 4-Star Beach & Tea Resorts</option>
                                                <option value="Luxury 5-Star Heritage Villas">Luxury 5-Star Heritage Villas</option>
                                            </select>
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
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
                                            <input type="text" id="form-guest-name" placeholder="Full Name" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number of Persons</label>
                                            <input type="number" id="form-pax" min="1" max="30" value="2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Special Requests / Pickup Hotel</label>
                                        <textarea id="form-notes" rows="2" placeholder="e.g. Flight number, child seat requirement, hotel name in Negombo/Colombo..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"></textarea>
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
                        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
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

                                <button onclick="window.switchTourTab('options', true)" 
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

                <!-- Full Width Section: 3-Column Masonry Photo Gallery (40% / 30% / 30% ratio matching user ASCII diagram) -->
                <div class="pt-8 border-t border-slate-200">
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Visual Highlights</span>
                            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Destination Photos</h2>
                            <p class="text-slate-500 text-sm mt-1">Real guest moments and iconic landmarks included in this itinerary</p>
                        </div>
                        <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start md:self-auto">
                            7 Highlight Photos
                        </span>
                    </div>

                    <!-- 10-Column Grid (4 cols = 40%, 3 cols = 30%, 3 cols = 30%) -->
                    <div class="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6" id="tour-gallery">
                        <!-- Column 1 (40% Width - Col Span 4): Image A (Large Tall Vertical) -->
                        <div class="lg:col-span-4 relative rounded-3xl overflow-hidden group shadow-md min-h-[380px] h-full cursor-pointer" onclick="window.openTourPhotoModal(0)">
                            <img src="../${galleryImages[0].src}" alt="${galleryImages[0].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent"></div>
                            <!-- Floating Zoom Icon -->
                            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                    <i data-lucide="maximize-2" class="w-4 h-4 text-white"></i>
                                </div>
                            </div>
                            <div class="absolute bottom-5 left-5 right-5 text-white">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-emerald-500/30">Highlight 1</span>
                                <h4 class="font-serif text-lg sm:text-xl font-bold text-white leading-snug drop-shadow">${galleryImages[0].title}</h4>
                            </div>
                        </div>

                        <!-- Column 2 (30% Width - Col Span 3): Image B (Top Large) + Image C & D (Bottom Small 2-up) -->
                        <div class="lg:col-span-3 flex flex-col gap-4">
                            <!-- Image B (Large wide image top) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full cursor-pointer" onclick="window.openTourPhotoModal(1)">
                                <img src="../${galleryImages[1].src}" alt="${galleryImages[1].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
                                <!-- Floating Zoom Icon -->
                                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                    <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                        <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-white"></i>
                                    </div>
                                </div>
                                <div class="absolute bottom-4 left-4 right-4 text-white">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-500/30">Highlight 2</span>
                                    <h4 class="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">${galleryImages[1].title}</h4>
                                </div>
                            </div>

                            <!-- Images C & D (Two small images bottom side-by-side) -->
                            <div class="grid grid-cols-2 gap-4 h-[182px] w-full">
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" onclick="window.openTourPhotoModal(2)">
                                    <img src="../${galleryImages[2].src}" alt="${galleryImages[2].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[2].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" onclick="window.openTourPhotoModal(3)">
                                    <img src="../${galleryImages[3].src}" alt="${galleryImages[3].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[3].title}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Column 3 (30% Width - Col Span 3): Inverted - Images C & D (Top Small 2-up) + Image B (Bottom Large) -->
                        <div class="lg:col-span-3 flex flex-col gap-4">
                            <!-- Images E & F (Two small images top side-by-side) -->
                            <div class="grid grid-cols-2 gap-4 h-[182px] w-full">
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" onclick="window.openTourPhotoModal(4)">
                                    <img src="../${galleryImages[4].src}" alt="${galleryImages[4].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[4].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full cursor-pointer" onclick="window.openTourPhotoModal(5)">
                                    <img src="../${galleryImages[5].src}" alt="${galleryImages[5].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                        <div class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                            <i data-lucide="maximize-2" class="w-3 h-3 text-white"></i>
                                        </div>
                                    </div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[5].title}</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- Image G (Large wide image bottom) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full cursor-pointer" onclick="window.openTourPhotoModal(6)">
                                <img src="../${galleryImages[6].src}" alt="${galleryImages[6].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
                                <!-- Floating Zoom Icon -->
                                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                    <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                        <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-white"></i>
                                    </div>
                                </div>
                                <div class="absolute bottom-4 left-4 right-4 text-white">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-500/30">Highlight 3</span>
                                    <h4 class="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">${galleryImages[6].title}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Full Width Section: Similar Tour Packages -->
                <div class="pt-12 border-t border-slate-200">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Explore Options</span>
                            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Similar Tour Packages You May Like</h2>
                        </div>
                        <a href="../index.html#tours" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline">
                            View All Packages <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${otherTours.map(ot => `
                        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                            <div class="relative h-48 overflow-hidden">
                                <img src="../${ot.image}" alt="${ot.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-current"></i> ${ot.rating}
                                </div>
                                <div class="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    ${ot.duration}
                                </div>
                            </div>
                            
                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
                                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${ot.location}
                                    </span>
                                    <h3 class="font-serif text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">${ot.title}</h3>
                                    <p class="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">${ot.description}</p>
                                </div>

                                <a href="?tour=${ot.slug}" class="w-full bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold py-3 px-4 rounded-xl text-center transition-colors text-xs flex items-center justify-center gap-1.5">
                                    View Package Details <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </a>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        </main>
        `;

        const container = document.getElementById('tour-content');
        if (container) {
            container.outerHTML = html;
        }

        window.activeTourGallery = galleryImages.map(g => ({ src: '../' + g.src, title: g.title }));

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});

// PhotoSwipe v5 Lightbox Modal for Tour Destination Highlights
window.openTourPhotoModal = function(index) {
    if (!window.activeTourGallery || window.activeTourGallery.length === 0) return;

    if (!window.PhotoSwipeLightbox || !window.PhotoSwipe) {
        console.warn('PhotoSwipe library is not loaded yet');
        return;
    }

    const pswpItems = window.activeTourGallery.map(item => {
        const data = {
            src: item.src,
            w: 0,
            h: 0,
            alt: item.title,
            title: item.title
        };

        const filename = item.src.split('/').pop();
        if (filename) {
            try {
                const existingImg = document.querySelector(`img[src*="${filename}"]`);
                if (existingImg && existingImg.naturalWidth > 0) {
                    data.w = existingImg.naturalWidth;
                    data.h = existingImg.naturalHeight;
                    data.msrc = existingImg.src;
                }
            } catch (err) {}
        }
        if (data.w === 0) {
            data.w = 1600;
            data.h = 1067;
        }
        return data;
    });

    const lightbox = new window.PhotoSwipeLightbox({
        dataSource: pswpItems,
        index: index,
        pswpModule: window.PhotoSwipe,
        bgOpacity: 0.92,
        showHideAnimationType: 'zoom'
    });

    lightbox.on('uiRegister', function() {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: '',
            onInit: (el, pswp) => {
                pswp.on('change', () => {
                    const currSlide = pswp.currSlide;
                    if (currSlide && currSlide.data) {
                        el.innerHTML = `
                            <div class="pswp__custom-caption absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/85 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl shadow-2xl text-center max-w-md w-full pointer-events-auto z-[1005]">
                                <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block mb-1">Highlight ${pswp.currIndex + 1} of ${pswp.getNumItems()}</span>
                                <h4 class="font-serif text-base font-bold text-white drop-shadow truncate">${currSlide.data.title || ''}</h4>
                            </div>
                        `;
                    }
                });
            }
        });
    });

    lightbox.init();
    lightbox.loadAndOpen(index);
};

// Global Tab Switcher Function
window.switchTourTab = function(tabName, doScroll = false) {
    const tabs = ['overview', 'options', 'details'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const panel = document.getElementById(`tour-tab-panel-${t}`);
        const isActive = (t === tabName);

        if (btn) {
            btn.classList.toggle('text-emerald-700', isActive);
            btn.classList.toggle('font-bold', isActive);
            btn.classList.toggle('border-emerald-700', isActive);
            btn.classList.toggle('text-slate-500', !isActive);
            btn.classList.toggle('font-semibold', !isActive);
            btn.classList.toggle('border-transparent', !isActive);
        }
        if (panel) {
            panel.classList.toggle('hidden', !isActive);
        }
    });

    if (doScroll) {
        const activePanel = document.getElementById(`tour-tab-panel-${tabName}`);
        if (activePanel) {
            const yOffset = -100;
            const y = activePanel.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
};

// Form Handler: Compiles Options Form & Sends Pre-filled WhatsApp Message
window.sendTourWhatsAppInquiry = function(tourTitle) {
    const startDate = document.getElementById('form-start-date')?.value || 'Flexible / Unspecified';
    const pickupTime = document.getElementById('form-pickup-time')?.value || 'Morning';
    const vehicle = document.getElementById('form-vehicle')?.value || 'Private AC Vehicle';
    const hotelTier = document.getElementById('form-hotel-tier')?.value || 'Standard';
    const guestName = document.getElementById('form-guest-name')?.value || 'Valued Guest';
    const pax = document.getElementById('form-pax')?.value || '2';
    const notes = document.getElementById('form-notes')?.value || 'None';

    const addons = [];
    if (document.getElementById('addon-train')?.checked) addons.push('Kandy to Ella Train Tickets');
    if (document.getElementById('addon-safari')?.checked) addons.push('Yala 4x4 Safari Jeep Upgrade');
    if (document.getElementById('addon-cooking')?.checked) addons.push('Village Cooking & Spa');

    const message = encodeURIComponent(
        `⭐ *Custom Tour Inquiry - Inspire Travels* ⭐\n\n` +
        `✈️ *Tour Package:* ${tourTitle}\n` +
        `📅 *Start Date:* ${startDate} (${pickupTime})\n` +
        `🚗 *Vehicle Choice:* ${vehicle}\n` +
        `🏨 *Hotel Option:* ${hotelTier}\n` +
        `👥 *Group Size:* ${pax} Person(s)\n` +
        (addons.length > 0 ? `🎯 *Add-on Experiences:* ${addons.join(', ')}\n` : '') +
        `👤 *Guest Name:* ${guestName}\n` +
        (notes !== 'None' && notes.trim() !== '' ? `📝 *Special Notes:* ${notes}\n\n` : '\n') +
        `Please confirm vehicle availability and total package quote. Thank you!`
    );

    window.open(`https://api.whatsapp.com/send?phone=94785959333&text=${message}`, '_blank');
};
