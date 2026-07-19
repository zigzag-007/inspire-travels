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
                    
                    <!-- Left 2 Columns: Itinerary & Inclusions -->
                    <div class="lg:col-span-2 space-y-16">
                        
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

                        <!-- Included vs Excluded List -->
                        <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                            <h3 class="font-serif text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <i data-lucide="shield-check" class="w-6 h-6 text-emerald-600"></i> What's Included in Your Package
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i> Always Included
                                    </h4>
                                    <ul class="space-y-3 text-sm text-slate-700 font-medium">
                                        <li class="flex items-start gap-2.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> Air-conditioned private vehicle throughout</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> English-speaking professional driver/guide</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> Fuel, highway tolls, parking & driver lodging</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> Airport pickup and drop-off transfers</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i> Free hotel reservation assistance</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <i data-lucide="info" class="w-4 h-4 text-slate-400"></i> Flexible / Optional
                                    </h4>
                                    <ul class="space-y-3 text-sm text-slate-600">
                                        <li class="flex items-start gap-2.5"><i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i> Monument & attraction entry tickets</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i> Lunch & dinner meal upgrades</li>
                                        <li class="flex items-start gap-2.5"><i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i> Optional safari jeep rentals or boat rides</li>
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

                                ${(() => {
                                    const message = encodeURIComponent(
                                        `⭐ *New Tour Inquiry - Inspire Travels* ⭐\n\n` +
                                        `Hi! I would like to book or customize this tour package:\n\n` +
                                        `✈️ *Package:* ${tour.title}\n` +
                                        `⏳ *Duration:* ${tour.duration}\n` +
                                        `📍 *Route:* ${tour.location}\n\n` +
                                        `Please confirm vehicle availability and total price details. Thank you!`
                                    );
                                    return `
                                    <a href="https://api.whatsapp.com/send?phone=94785959333&text=${message}" 
                                       target="_blank" rel="noopener"
                                       class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base">
                                        <i class="fa-brands fa-whatsapp text-lg"></i>
                                        Inquire via WhatsApp
                                    </a>
                                    `;
                                })()}
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
                        <div class="lg:col-span-4 relative rounded-3xl overflow-hidden group shadow-md min-h-[380px] h-full">
                            <img src="../${galleryImages[0].src}" alt="${galleryImages[0].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent"></div>
                            <div class="absolute bottom-5 left-5 right-5 text-white">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-emerald-500/30">Highlight 1</span>
                                <h4 class="font-serif text-lg sm:text-xl font-bold text-white leading-snug drop-shadow">${galleryImages[0].title}</h4>
                            </div>
                        </div>

                        <!-- Column 2 (30% Width - Col Span 3): Image B (Top Large) + Image C & D (Bottom Small 2-up) -->
                        <div class="lg:col-span-3 flex flex-col gap-4">
                            <!-- Image B (Large wide image top) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full">
                                <img src="../${galleryImages[1].src}" alt="${galleryImages[1].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
                                <div class="absolute bottom-4 left-4 right-4 text-white">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-500/30">Highlight 2</span>
                                    <h4 class="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">${galleryImages[1].title}</h4>
                                </div>
                            </div>

                            <!-- Images C & D (Two small images bottom side-by-side) -->
                            <div class="grid grid-cols-2 gap-4 h-[182px] w-full">
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full">
                                    <img src="../${galleryImages[2].src}" alt="${galleryImages[2].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[2].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full">
                                    <img src="../${galleryImages[3].src}" alt="${galleryImages[3].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
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
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full">
                                    <img src="../${galleryImages[4].src}" alt="${galleryImages[4].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[4].title}</h4>
                                    </div>
                                </div>
                                <div class="relative rounded-3xl overflow-hidden group shadow-md h-full w-full">
                                    <img src="../${galleryImages[5].src}" alt="${galleryImages[5].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                                    <div class="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 class="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">${galleryImages[5].title}</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- Image G (Large wide image bottom) -->
                            <div class="relative rounded-3xl overflow-hidden group shadow-md h-[182px] w-full">
                                <img src="../${galleryImages[6].src}" alt="${galleryImages[6].title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"></div>
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

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});
