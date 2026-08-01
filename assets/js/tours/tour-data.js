// Tour Data Module
// Author: Zig Zag AI
// Description: Keeps the six package records shared by home and detail pages.

(function() {
    'use strict';

    window.TourDataModule = {
        tourData: [
            {
                slug: 'highlights-escape', title: 'Sri Lanka Highlights Escape', image: 'assets/img/tours/3-day-package.jpeg', rating: 9.0, duration: '5 DAYS', location: 'COLOMBO, KANDY & BENTOTA',
                description: 'A perfect 5-day escape combining cultural highlights, city exploration, and coastal relaxation.',
                highlights: ['Day 1: Scenic drive to Kandy via Pinnawala Elephant Sanctuary / stay Kandy', 'Day 2: Tea factory walk & Nuwara Eliya colonial city explorer / Stay Nuwara Eliya', 'Day 3: Bentota water sports & golden beach leisure / stay Bentota', 'Day 4: Colombo landmarks tour & final departure']
            },
            {
                slug: 'hills-to-beach', title: 'Hills to Beach Escape', image: 'assets/img/tours/4-day-package.jpeg', rating: 9.2, duration: '7 DAYS', location: 'SIGIRIYA TO MIRISSA',
                description: 'Journey through cultural fortresses, tranquil harbors, and hill country scenic views to southern beaches.',
                highlights: ['Day 1: Sigiriya Lion Rock fortress climb & village tour / stay Sigiriya', 'Day 2: Trincomalee harbor view & Nilaveli beach swim / Stay Trincomalee', 'Day 3-4: Temple of the Tooth Relic & Kandy botanical gardens / Stay Kandy', 'Day 5: Scenic train ride to Ella & Nine Arch Bridge hike / stay Ella', 'Day 6: Mirissa whale watching & sunset coconut hill walk / stay Mirissa', 'Day 7: Colombo landmarks sightseeing & airport transfer']
            },
            {
                slug: 'golden-triangle', title: 'Golden Triangle & Beyond', image: 'assets/img/tours/5-day-package.jpeg', rating: 9.3, duration: '7 DAYS', location: 'COLOMBO, KANDY & YALA',
                description: 'Discover cultural heritage monuments, high-country waterfalls, and Yala wildlife safari.',
                highlights: ['Day 1: Colombo arrival & evening city street-food walk / stay Colombo', 'Day 2: Spice gardens & traditional Kandy cultural dance show / stay Kandy', 'Day 3: Ramboda waterfalls & Nuwara Eliya tea estates / stay Nuwara Eliya', 'Day 4: Ella Rock trekking & iconic Ravana waterfall visit / stay Ella', 'Day 5: Wilderness safari in Yala National Park / Stay Yala', 'Day 6: Madu River boat safari & marine turtle hatchery / stay Bentota', 'Day 7: Galle Fort ramparts walk, Colombo tour & airport departure']
            },
            {
                slug: 'ramayanaya-tour', title: 'Ramayanaya Tour', image: 'assets/img/tours/7-day-package.jpeg', rating: 9.5, duration: '8 DAYS', location: 'ANURADHAPURA TO KATARAGAMA',
                description: 'Follow the sacred paths of Ramayana legend through historic shrines and temples.',
                highlights: ['Day 1: Ancient ruins explorer in Anuradhapura kingdom / stay Anuradhapura', 'Day 2: Trincomalee Koneswaram temple & beach swim / Stay Trincomalee', 'Day 3-4: Kandy cultural temples & Royal Botanical Gardens / stay Kandy', 'Day 5: Seetha Amman temple & Nuwara Eliya tea estate tour / stay Nuwara Eliya', 'Day 6: Kataragama temple complex spiritual experience / stay Kataragama', 'Day 7: Colombo landmarks tour & evening Galle Face green walk / Stay Colombo', 'Day 8: Colombo premium shopping walk & airport transfer']
            },
            {
                slug: 'pearl-of-asia', title: 'Pearl Of Asia Tour', image: 'assets/img/tours/10-day-package.jpeg', rating: 9.4, duration: '10 DAYS', location: 'DAMBULLA TO COLOMBO',
                description: 'A comprehensive 10-day tour covering cave temples, tea hills, elephant safaris, and beach leisure.',
                highlights: ['Day 1: Golden Temple of Dambulla & Sigiriya viewpoint / stay Dambulla', 'Day 2: Kandy Tooth Relic Temple & evening cultural show / stay Kandy', 'Day 3: Nuwara Eliya tea valley & Gregory Lake boat ride / stay Nuwara Eliya', 'Day 4: Ella gap hiking & Nine Arch Bridge walk / stay Ella', 'Day 5: Elephant Transit Home & Udawalawe safari / stay Udawalawe', 'Day 6-7: Mirissa gold beach relaxation & surfing / stay Mirissa', 'Day 8: Madu River boat cruise & Bentota beach leisure / stay Bentota', 'Day 9: Colombo historic landmarks & shopping explorer / Stay Colombo', 'Day 10: Colombo departure transfer']
            },
            {
                slug: 'grand-tour', title: 'Sri Lanka Grand Tour', image: 'assets/img/tours/14-day-package.jpeg', rating: 10.0, duration: '14 DAYS', location: 'COMPLETE SRI LANKA',
                description: 'The ultimate 14-day grand tour covering every cultural monument and scenic landscape of Sri Lanka.',
                highlights: ['Day 1: Colombo arrival & evening city walk / stay Colombo', 'Day 2-3: Sigiriya Lion Rock fortress & Pidurangala sunset / Stay Sigiriya', 'Day 4: Polonnaruwa medieval ruins bicycle exploration / stay Polonnaruwa', 'Day 5-6: Trincomalee harbor & Pigeon Island snorkeling / stay Trincomalee', 'Day 7: Kandy city highlights & Peradeniya gardens / stay Kandy', 'Day 8: Nuwara Eliya tea factory walk & Gregory Lake boat ride / stay Nuwara Eliya', 'Day 9-10: Ella gap trekking & Ravana pool visit / stay Ella', 'Day 11: Yala National Park leopard watching safari / stay Yala', 'Day 12: Hirikatiya surf bay beach relaxation / stay Hirikatiya', 'Day 13: Weligama bay surfing & Bentota boat ride / stay Bentota', 'Day 14: Colombo city highlights & airport departure']
            }
        ],

        getBySlug: function(slug) {
            return this.tourData.find(function(tour) {
                return tour.slug === slug;
            });
        }
    };
})();
