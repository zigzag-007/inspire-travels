// Tour Data Module
// Author: Zig Zag AI
// Description: Keeps featured, family, group, and regional tour records in one place.

(function() {
    'use strict';

    var tours = [
        {
            slug: 'highlights-escape',
            title: 'Sri Lanka Highlights Escape',
            image: 'assets/img/tours/3-day-package.jpeg',
            rating: 9.0,
            duration: '5 DAYS',
            nights: '4 NIGHTS',
            location: 'KANDY, NUWARA ELIYA, BENTOTA & COLOMBO',
            description: 'A compact family journey through royal Kandy, the misty tea country, Bentota beaches, and Colombo.',
            travelMode: 'private',
            collections: ['family'],
            days: [
                { label: 'Day 1', title: 'Kandy and Pinnawala', overnight: 'Kandy', activities: ['Pinnawala Elephant Experience', 'Temple of the Sacred Tooth Relic', 'Kandy View Point', 'Gem Museum', 'Cultural Dance Show'] },
                { label: 'Day 2', title: 'Nuwara Eliya tea country', overnight: 'Nuwara Eliya', activities: ['Ramboda Waterfall', 'Tea Plantation and Factory Visit', 'Gregory Lake and Park', 'Explore Nuwara Eliya City'] },
                { label: 'Day 3', title: 'Bentota coast', overnight: 'Bentota', activities: ['Scenic journey to Bentota', 'Madu River Safari', 'Turtle Hatchery', 'Beach and leisure time'] },
                { label: 'Day 4', title: 'Colombo city tour', overnight: 'Colombo', activities: ['Gangaramaya Temple', 'Lotus Tower', 'Galle Face area', 'One Galle Face Mall', 'Colombo city highlights'] },
                { label: 'Day 5', title: 'Departure', overnight: '', activities: ['Breakfast and check out', 'Airport transfer', 'Departure from Sri Lanka'] }
            ]
        },
        {
            slug: 'hills-to-beach',
            title: 'Hills to Beach Escape',
            image: 'assets/img/tours/4-day-package.jpeg',
            rating: 9.2,
            duration: '7 DAYS',
            nights: '6 NIGHTS',
            location: 'SIGIRIYA TO MIRISSA',
            description: 'Journey through cultural fortresses, tranquil harbors, hill country views, and southern beaches.',
            travelMode: 'private',
            collections: [],
            days: [
                { label: 'Day 1', title: 'Sigiriya fortress and village', overnight: 'Sigiriya', activities: ['Sigiriya Lion Rock fortress', 'Village experience'] },
                { label: 'Day 2', title: 'Trincomalee coast', overnight: 'Trincomalee', activities: ['Harbor viewpoint', 'Nilaveli Beach'] },
                { label: 'Days 3 and 4', title: 'Kandy heritage', overnight: 'Kandy', activities: ['Temple of the Sacred Tooth Relic', 'Royal Botanical Gardens'] },
                { label: 'Day 5', title: 'Scenic journey to Ella', overnight: 'Ella', activities: ['Hill country train journey', 'Nine Arch Bridge'] },
                { label: 'Day 6', title: 'Mirissa coast', overnight: 'Mirissa', activities: ['Whale watching', 'Coconut Tree Hill sunset'] },
                { label: 'Day 7', title: 'Colombo and departure', overnight: '', activities: ['Colombo sightseeing', 'Airport transfer'] }
            ]
        },
        {
            slug: 'golden-triangle',
            title: 'Golden Triangle & Beyond',
            image: 'assets/img/tours/5-day-package.jpeg',
            rating: 9.3,
            duration: '7 DAYS',
            nights: '6 NIGHTS',
            location: 'COLOMBO, KANDY, ELLA, YALA & BENTOTA',
            description: 'A family route linking Colombo, the central highlands, Ella, Yala wildlife, and Bentota.',
            travelMode: 'private',
            collections: ['family'],
            days: [
                { label: 'Day 1', title: 'Arrival in Colombo', overnight: 'Colombo', activities: ['Airport welcome', 'Settle into Colombo'] },
                { label: 'Day 2', title: 'Kandy city tour', overnight: 'Kandy', activities: ['Explore Kandy city'] },
                { label: 'Day 3', title: 'Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Travel through the hill country', 'Explore Nuwara Eliya'] },
                { label: 'Day 4', title: 'Ella', overnight: 'Ella', activities: ['Scenic journey to Ella', 'Explore Ella'] },
                { label: 'Day 5', title: 'Yala safari', overnight: 'Yala', activities: ['Wildlife safari experience'] },
                { label: 'Day 6', title: 'Bentota', overnight: 'Bentota', activities: ['Travel to Bentota', 'Coastal leisure time'] },
                { label: 'Day 7', title: 'Colombo and departure', overnight: '', activities: ['Colombo city tour', 'Airport transfer'] }
            ]
        },
        {
            slug: 'cultural-heritage-journey',
            title: 'Sri Lanka Cultural & Heritage Journey',
            image: 'assets/img/main-gallery/cultural-heritage-tour.jpeg',
            duration: '7 DAYS',
            nights: '6 NIGHTS',
            location: 'NEGOMBO, ANURADHAPURA, SIGIRIYA, POLONNARUWA, KANDY & COLOMBO',
            description: 'A focused heritage route through sacred cities, ancient kingdoms, royal Kandy, and historic Colombo.',
            travelMode: 'private',
            collections: ['cultural-heritage'],
            days: [
                { label: 'Day 1', title: 'Airport arrival and Negombo', overnight: 'Negombo', activities: ['Airport pickup and meet and greet', 'Angurukaramulla Buddhist Temple', 'St. Mary\'s Church', 'Negombo beach sunset'] },
                { label: 'Day 2', title: 'Anuradhapura and Sigiriya', overnight: 'Sigiriya', activities: ['Sacred City of Anuradhapura', 'Sri Maha Bodhi', 'Ruwanwelisaya Stupa', 'Thuparamaya', 'Abhayagiri Monastery', 'Ancient ruins and sacred sites', 'Continue to Sigiriya'] },
                { label: 'Day 3', title: 'Sigiriya ancient kingdom', overnight: 'Sigiriya', activities: ['Sigiriya Rock Fortress climb', 'Ancient palace complex', 'Sigiriya frescoes and Mirror Wall', 'Water Gardens', 'Village experience and traditional lunch', 'Optional traditional cooking experience'] },
                { label: 'Day 4', title: 'Polonnaruwa ancient city', overnight: 'Sigiriya', activities: ['Royal Palace ruins', 'Gal Vihara', 'Parakrama Samudraya', 'Ancient temples and monuments', 'Return to Sigiriya'] },
                { label: 'Day 5', title: 'Dambulla and Kandy', overnight: 'Kandy', activities: ['Dambulla Cave Temple', 'Spice Garden', 'Kandy View Point', 'Gem Museum', 'Traditional Cultural Dance Show', 'Temple of the Sacred Tooth Relic', 'Kandy Lake evening walk'] },
                { label: 'Day 6', title: 'Kandy and Colombo', overnight: 'Colombo', activities: ['Kandy city experience', 'Royal Botanical Gardens, Peradeniya', 'Colombo city tour', 'Galle Face Green', 'Colombo Fort', 'Gangaramaya Temple', 'Shopping time'] },
                { label: 'Day 7', title: 'Colombo to airport', overnight: '', activities: ['Breakfast', 'Free time or last minute shopping based on flight time', 'Bandaranaike International Airport transfer'] }
            ]
        },
        {
            slug: 'ramayanaya-tour',
            title: 'Ramayanaya Tour',
            image: 'assets/img/main-gallery/koneswaram-temple.jpeg',
            rating: 9.5,
            duration: '8 DAYS',
            nights: '7 NIGHTS',
            location: 'ANURADHAPURA, TRINCOMALEE, KANDY, NUWARA ELIYA, KATARAGAMA & COLOMBO',
            description: 'Follow sacred Ramayana locations through northern temples, royal Kandy, the highlands, and Kataragama.',
            travelMode: 'private',
            collections: ['cultural-heritage'],
            days: [
                { label: 'Day 1', title: 'Arrival and Anuradhapura', overnight: 'Anuradhapura', activities: ['Airport pickup and meet and greet', 'Anuradhapura Ancient City', 'Sri Maha Bodhi', 'Ruwanwelisaya', 'Isurumuniya Temple'] },
                { label: 'Day 2', title: 'Anuradhapura to Trincomalee', overnight: 'Trincomalee', activities: ['Koneswaram Temple', 'Fort Frederick', 'Shri Badrakali Amman Hindu Kovil', 'Shankari Devi Temple', 'Trincomalee Beach'] },
                { label: 'Day 3', title: 'Trincomalee to Kandy', overnight: 'Kandy', activities: ['Scenic journey to Kandy', 'Spice Garden tour', 'Kandy View Point'] },
                { label: 'Day 4', title: 'Kandy Ramayanaya experience', overnight: 'Kandy', activities: ['Temple of the Sacred Tooth Relic at Sri Dalada Maligawa', 'Kandy Lake', 'Sri Maha Vishnu Temple', 'Traditional Kandyan Cultural Dance', 'Evening leisure'] },
                { label: 'Day 5', title: 'Kandy to Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Scenic hill country drive', 'Tea Plantation and Factory', 'Shri Badrakali Amman Hindu Kovil', 'Ramboda Falls', 'Seetha Amman Temple', 'Ashok Vatika or Hakgala Botanical Garden', 'Gregory Lake', 'Nuwara Eliya city tour'] },
                { label: 'Day 6', title: 'Nuwara Eliya to Kataragama', overnight: 'Kataragama', activities: ['Scenic countryside journey', 'Kataragama Temple', 'Evening worship'] },
                { label: 'Day 7', title: 'Kataragama to Colombo', overnight: 'Colombo', activities: ['Rumassala Ramayanaya site', 'Colombo city tour', 'Gangaramaya Temple', 'Independence Square', 'Galle Face Green', 'Colombo Fort'] },
                { label: 'Day 8', title: 'Colombo shopping and departure', overnight: '', activities: ['Breakfast', 'Colombo shopping', 'Bandaranaike International Airport transfer'] }
            ]
        },
        {
            slug: 'unesco-heritage-tour',
            title: 'Sri Lanka UNESCO Heritage Tour',
            image: 'assets/img/main-gallery/dambulla-cave-temple.jpeg',
            duration: '14 DAYS',
            nights: '13 NIGHTS',
            location: 'ANURADHAPURA, CULTURAL TRIANGLE, KANDY, HIGHLANDS, SINHARAJA & GALLE',
            description: 'A complete route linking Sri Lanka\'s UNESCO cities, sacred landscapes, highlands, rainforest, and Galle Fort.',
            travelMode: 'private',
            collections: ['cultural-heritage'],
            days: [
                { label: 'Day 1', title: 'Airport to Anuradhapura', overnight: 'Anuradhapura', activities: ['Airport arrival and meet and greet', 'Transfer to Anuradhapura', 'Relaxed evening city experience'] },
                { label: 'Day 2', title: 'Anuradhapura heritage tour', overnight: 'Anuradhapura', activities: ['UNESCO Sacred City of Anuradhapura', 'Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya', 'Abhayagiri', 'Ancient ruins and stupas'] },
                { label: 'Day 3', title: 'Polonnaruwa and Sigiriya', overnight: 'Sigiriya', activities: ['UNESCO Ancient City of Polonnaruwa', 'Royal Palace', 'Quadrangle', 'Gal Vihara', 'Parakrama Samudra', 'Continue to Sigiriya'] },
                { label: 'Day 4', title: 'Sigiriya and Dambulla', overnight: 'Sigiriya', activities: ['Early Sigiriya Lion Rock Fortress climb', 'Ancient fortress exploration', 'UNESCO Dambulla Cave Temple', 'Cave temples and Buddha statues', 'Village cultural experience'] },
                { label: 'Day 5', title: 'Sigiriya to Kandy', overnight: 'Kandy', activities: ['Spice Garden', 'Matale cultural attractions', 'Kandy View Point', 'Kandyan Cultural Dance'] },
                { label: 'Day 6', title: 'Sacred Kandy', overnight: 'Kandy', activities: ['UNESCO Sacred City of Kandy', 'Temple of the Sacred Tooth Relic', 'Kandy Lake', 'Royal Botanical Gardens', 'Kandy city tour'] },
                { label: 'Day 7', title: 'Kandy to Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['UNESCO Central Highlands journey', 'Tea Plantation and Factory', 'Ramboda Falls', 'Nuwara Eliya town', 'Gregory Lake'] },
                { label: 'Day 8', title: 'Horton Plains and Ella', overnight: 'Ella', activities: ['Horton Plains National Park', 'World\'s End viewpoint', 'Scenic mountain journey to Ella'] },
                { label: 'Day 9', title: 'Ella', overnight: 'Ella', activities: ['Little Adam\'s Peak', 'Nine Arch Bridge', 'Ella town', 'Ravana Falls', 'Optional scenic train experience'] },
                { label: 'Day 10', title: 'Ella to Yala or Kataragama', overnight: 'Yala or Kataragama', activities: ['Scenic southern journey', 'Optional Yala National Park safari', 'Kataragama area visit'] },
                { label: 'Day 11', title: 'Yala or Kataragama to Sinharaja', overnight: 'Sinharaja area', activities: ['Travel through southern Sri Lanka', 'UNESCO Sinharaja Forest Reserve', 'Guided forest walk and nature experience'] },
                { label: 'Day 12', title: 'Sinharaja to Galle', overnight: 'Galle', activities: ['Morning rainforest experience', 'UNESCO Galle Old Town and Dutch Fort', 'Colonial buildings and ramparts', 'Galle Lighthouse', 'Fort sunset'] },
                { label: 'Day 13', title: 'Galle, Bentota, and Colombo', overnight: 'Colombo', activities: ['Southern coastal drive', 'Bentota River experience', 'Turtle Conservation Centre', 'Beach time', 'Colombo city tour and shopping'] },
                { label: 'Day 14', title: 'Colombo to airport', overnight: '', activities: ['Breakfast', 'Free time or shopping based on flight time', 'Airport transfer'] }
            ]
        },
        {
            slug: 'pearl-of-asia',
            title: 'Pearl Of Asia Tour',
            image: 'assets/img/tours/10-day-package.jpeg',
            rating: 9.4,
            duration: '10 DAYS',
            nights: '9 NIGHTS',
            location: 'SIGIRIYA TO COLOMBO',
            description: 'A complete family tour through Sigiriya, tea country, Udawalawe, Mirissa, Bentota, and Colombo.',
            travelMode: 'private',
            collections: ['family'],
            days: [
                { label: 'Day 1', title: 'Arrival in Sigiriya', overnight: 'Sigiriya', activities: ['Travel to Sigiriya', 'Settle into the Cultural Triangle'] },
                { label: 'Day 2', title: 'Kandy', overnight: 'Kandy', activities: ['Travel to Kandy', 'Explore the royal city'] },
                { label: 'Day 3', title: 'Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Explore the tea country'] },
                { label: 'Day 4', title: 'Ella', overnight: 'Ella', activities: ['Scenic journey to Ella', 'Explore Ella'] },
                { label: 'Day 5', title: 'Udawalawe safari', overnight: 'Udawalawe', activities: ['Wildlife safari experience'] },
                { label: 'Days 6 and 7', title: 'Mirissa coast', overnight: 'Mirissa', activities: ['Beach time', 'Coastal leisure'] },
                { label: 'Day 8', title: 'Bentota', overnight: 'Bentota', activities: ['Travel to Bentota', 'Beach leisure'] },
                { label: 'Day 9', title: 'Colombo city tour', overnight: 'Colombo', activities: ['Colombo sightseeing'] },
                { label: 'Day 10', title: 'Shopping and departure', overnight: '', activities: ['Colombo shopping', 'Airport transfer'] }
            ]
        },
        {
            slug: 'grand-tour',
            title: 'Sri Lanka Grand Tour',
            image: 'assets/img/tours/14-day-package.jpeg',
            rating: 10.0,
            duration: '14 DAYS',
            nights: '13 NIGHTS',
            location: 'COMPLETE SRI LANKA',
            description: 'A broad island journey connecting ancient cities, the east coast, hill country, wildlife, and southern beaches.',
            travelMode: 'private',
            collections: ['family'],
            days: [
                { label: 'Day 1', title: 'Colombo arrival', overnight: 'Colombo', activities: ['Airport welcome', 'Evening city walk'] },
                { label: 'Days 2 and 3', title: 'Sigiriya', overnight: 'Sigiriya', activities: ['Sigiriya Lion Rock', 'Pidurangala sunset'] },
                { label: 'Day 4', title: 'Polonnaruwa', overnight: 'Polonnaruwa', activities: ['Ancient city bicycle exploration'] },
                { label: 'Days 5 and 6', title: 'Trincomalee', overnight: 'Trincomalee', activities: ['Harbor and beach time', 'Pigeon Island snorkeling'] },
                { label: 'Day 7', title: 'Kandy', overnight: 'Kandy', activities: ['Kandy city highlights', 'Royal Botanical Gardens'] },
                { label: 'Day 8', title: 'Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Tea factory visit', 'Gregory Lake'] },
                { label: 'Days 9 and 10', title: 'Ella', overnight: 'Ella', activities: ['Ella trails', 'Ravana Falls'] },
                { label: 'Day 11', title: 'Yala safari', overnight: 'Yala', activities: ['Yala National Park safari'] },
                { label: 'Day 12', title: 'Hiriketiya', overnight: 'Hiriketiya', activities: ['Surf bay and beach time'] },
                { label: 'Day 13', title: 'Southern coast', overnight: 'Bentota', activities: ['Weligama Bay', 'Bentota coast'] },
                { label: 'Day 14', title: 'Colombo and departure', overnight: '', activities: ['Colombo highlights', 'Airport transfer'] }
            ]
        },
        {
            slug: 'sri-lanka-dream-journey',
            title: 'Sri Lanka Dream Journey',
            image: 'assets/img/main-gallery/06-airport-arrival-group-sri-lanka.jpeg',
            duration: '5 DAYS',
            nights: '4 NIGHTS',
            location: 'KANDY, NUWARA ELIYA, BENTOTA & COLOMBO',
            description: 'A shared journey from cultural Kandy and misty tea country to Bentota beaches and vibrant Colombo.',
            travelMode: 'group',
            collections: ['group'],
            days: [
                { label: 'Day 1', title: 'Airport arrival and Kandy', overnight: 'Kandy', activities: ['Airport meet and greet', 'Pinnawala Elephant Park', 'Spice Garden', 'Wood Carving Centre', 'Gem Museum', 'Batik Factory', 'Kandy View Point', 'Temple of the Sacred Tooth Relic'] },
                { label: 'Day 2', title: 'Kandy to Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Scenic central highlands journey', 'Ramboda Waterfall', 'Tea Factory and Plantation', 'Hanuman Temple', 'Seetha Amman Temple'] },
                { label: 'Day 3', title: 'Nuwara Eliya to Bentota', overnight: 'Bentota', activities: ['Scenic journey to the southern coast', 'Bentota Beach', 'Turtle Hatchery', 'Evening leisure'] },
                { label: 'Day 4', title: 'Bentota to Colombo', overnight: 'Colombo', activities: ['Colombo city tour', 'Galle Face Green', 'Independence Square', 'Old Parliament', 'Colombo Port City', 'Local market'] },
                { label: 'Day 5', title: 'Colombo and airport', overnight: '', activities: ['Final city tour or free time based on flight schedule', 'Airport transfer'] }
            ]
        },
        {
            slug: 'discover-ceylon-group',
            title: 'Discover Ceylon Group Journey',
            image: 'assets/img/main-gallery/19-airport-group-selfie-with-guests.jpeg',
            duration: '8 DAYS',
            nights: '7 NIGHTS',
            location: 'NEGOMBO, SIGIRIYA, KANDY, ELLA, YALA & MIRISSA',
            description: 'An eight day group route through the Cultural Triangle, tea country, Ella, Yala, and the south coast.',
            travelMode: 'group',
            collections: ['group'],
            days: [
                { label: 'Day 1', title: 'Airport arrival and Negombo', overnight: 'Negombo', activities: ['Airport pickup', 'Meet the tour representative', 'Beach leisure'] },
                { label: 'Day 2', title: 'Negombo to Sigiriya', overnight: 'Sigiriya or Dambulla', activities: ['Sigiriya Rock Fortress', 'Ancient palace ruins and frescoes', 'Lion Paw', 'Summit views'] },
                { label: 'Day 3', title: 'Dambulla and Kandy', overnight: 'Kandy', activities: ['Dambulla Cave Temple', 'Spice and Herbal Garden', 'Temple of the Sacred Tooth Relic', 'Cultural Dance Show', 'Kandy Lake walk'] },
                { label: 'Day 4', title: 'Kandy to Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Tea Factory and Plantation', 'Ramboda Waterfall', 'Gregory Lake', 'Victoria Park', 'Nuwara Eliya town'] },
                { label: 'Day 5', title: 'Scenic train to Ella', overnight: 'Ella', activities: ['Hill country train journey', 'Nine Arch Bridge', 'Optional Little Adam\'s Peak hike', 'Ella town'] },
                { label: 'Day 6', title: 'Ella to Yala', overnight: 'Yala or Tissamaharama', activities: ['Evening Yala National Park safari', 'Wildlife viewing'] },
                { label: 'Day 7', title: 'Yala to Mirissa', overnight: 'Mirissa', activities: ['Mirissa Beach', 'Optional whale watching', 'Coastal leisure'] },
                { label: 'Day 8', title: 'Galle, Bentota, and Colombo', overnight: '', activities: ['Galle Dutch Fort', 'Madu River safari', 'Turtle Hatchery', 'Colombo sightseeing and shopping', 'Hotel or airport drop off'] }
            ]
        },
        {
            slug: 'grand-island-journey-group',
            title: 'Sri Lanka Grand Island Journey',
            image: 'assets/img/main-gallery/group_arrival_fuso.jpg',
            duration: '14 DAYS',
            nights: '13 NIGHTS',
            location: 'NEGOMBO, CULTURAL TRIANGLE, EAST COAST, HILLS & SOUTH COAST',
            description: 'A complete group journey combining culture, wildlife, mountains, beaches, and local experiences.',
            travelMode: 'group',
            collections: ['group'],
            days: [
                { label: 'Day 1', title: 'Airport arrival and Negombo', overnight: 'Negombo', activities: ['Airport pickup', 'Beach or pool leisure', 'Sunset'] },
                { label: 'Day 2', title: 'Pinnawala and Sigiriya', overnight: 'Sigiriya or Dambulla', activities: ['Pinnawala Elephant Orphanage', 'Sigiriya Lion Rock Fortress', 'Ancient gardens and summit views'] },
                { label: 'Day 3', title: 'Sigiriya village experience', overnight: 'Sigiriya or Dambulla', activities: ['Optional hot air balloon ride', 'Village tour', 'Tuk tuk ride', 'Catamaran ride', 'Local home visit', 'Cooking demonstration and lunch', 'Optional Pidurangala sunset'] },
                { label: 'Day 4', title: 'Sigiriya to Trincomalee', overnight: 'Trincomalee', activities: ['Koneswaram Temple', 'Fort Frederick', 'Indian Ocean viewpoints', 'Beach leisure'] },
                { label: 'Day 5', title: 'Nilaveli and Pigeon Island', overnight: 'Trincomalee', activities: ['Nilaveli Beach', 'Optional Pigeon Island boat trip', 'Snorkeling and swimming'] },
                { label: 'Day 6', title: 'Polonnaruwa and elephant safari', overnight: 'Dambulla or Sigiriya', activities: ['Ancient Polonnaruwa', 'Bicycle tour', 'Minneriya or Kaudulla safari', 'Elephant gathering'] },
                { label: 'Day 7', title: 'Dambulla to Kandy', overnight: 'Kandy', activities: ['Dambulla Cave Temple', 'Temple of the Sacred Tooth Relic', 'Kandy Lake', 'Kandy View Point'] },
                { label: 'Day 8', title: 'Kandy culture', overnight: 'Kandy', activities: ['Gem Museum', 'Royal Botanical Gardens', 'Kandy city and market', 'Cultural Dance Show'] },
                { label: 'Day 9', title: 'Kandy to Nuwara Eliya', overnight: 'Nuwara Eliya', activities: ['Tea Plantation and Factory', 'Tea tasting', 'Victoria Park', 'Local market'] },
                { label: 'Day 10', title: 'Scenic train, Ella, and Yala', overnight: 'Yala or Tissamaharama', activities: ['Train from Nanu Oya to Ella', 'Nine Arch Bridge', 'Ravana Falls'] },
                { label: 'Day 11', title: 'Yala safari and Galle', overnight: 'Galle', activities: ['Yala National Park safari', 'Galle Fort', 'Turtle Conservation Centre', 'South coast beach'] },
                { label: 'Day 12', title: 'South coast leisure', overnight: 'South Coast', activities: ['Beach and hotel leisure', 'Optional water activities', 'Optional seasonal whale watching'] },
                { label: 'Day 13', title: 'South coast to Colombo', overnight: 'Colombo', activities: ['Red Mosque', 'Gangaramaya Temple', 'Lotus Tower', 'Shopping areas'] },
                { label: 'Day 14', title: 'Colombo and airport', overnight: '', activities: ['Colombo shopping', 'Farewell meal based on flight time', 'Airport transfer'] }
            ]
        },
        {
            slug: 'east-coast-discovery',
            title: 'Sri Lanka East Coast Discovery',
            image: 'assets/img/main-gallery/pigeon-island-snorkeling.jpeg',
            duration: '9 DAYS',
            nights: '8 NIGHTS',
            location: 'SIGIRIYA, TRINCOMALEE, ARUGAM BAY & COLOMBO',
            description: 'A relaxed journey combining ancient heritage, tropical beaches, marine life, wildlife, and East Coast culture.',
            travelMode: 'private',
            collections: ['northern-shores'],
            days: [
                { label: 'Day 1', title: 'Airport to Sigiriya', overnight: 'Sigiriya', activities: ['Airport arrival and meet your guide', 'Transfer to Sigiriya', 'Dambulla Cave Temple', 'Spice Garden experience', 'Hotel check in'] },
                { label: 'Day 2', title: 'Sigiriya and cultural experience', overnight: 'Sigiriya', activities: ['Early morning Sigiriya Rock Fortress', 'Village tour and local lunch', 'Traditional Sri Lankan cooking experience', 'Sunset experience'] },
                { label: 'Day 3', title: 'Sigiriya to Trincomalee', overnight: 'Trincomalee', activities: ['Breakfast and departure', 'Polonnaruwa Ancient City', 'Continue to Trincomalee', 'Evening beach relaxation'] },
                { label: 'Day 4', title: 'Trincomalee beach and culture', overnight: 'Trincomalee', activities: ['Koneswaram Temple', 'Fort Frederick', 'Local markets', 'Nilaveli Beach', 'Sunset by the sea'] },
                { label: 'Day 5', title: 'Pigeon Island experience', overnight: 'Trincomalee', activities: ['Boat trip to Pigeon Island National Park', 'Snorkeling and swimming', 'Coral reefs and marine life', 'Nilaveli Beach leisure'] },
                { label: 'Day 6', title: 'Trincomalee to Arugam Bay', overnight: 'Arugam Bay', activities: ['Scenic East Coast drive', 'Batticaloa stop', 'Kallady Bridge and lagoon', 'Arugam Bay beach sunset'] },
                { label: 'Day 7', title: 'Arugam Bay adventure', overnight: 'Arugam Bay', activities: ['Arugam Bay Beach', 'Optional surfing experience', 'Local lagoon visit', 'Optional Kumana National Park safari', 'Beach sunset'] },
                { label: 'Day 8', title: 'Arugam Bay to Colombo', overnight: 'Colombo', activities: ['Scenic drive to Colombo', 'Local attractions along the route', 'Colombo city tour', 'Galle Face Green', 'Gangaramaya Temple', 'Shopping'] },
                { label: 'Day 9', title: 'Colombo to airport', overnight: '', activities: ['Breakfast', 'Free time or last minute shopping', 'Bandaranaike International Airport transfer'] }
            ]
        },
        {
            slug: 'north-east-coast-explorer',
            title: 'North & East Coast Explorer',
            image: 'assets/img/main-gallery/koneswaram-temple.jpeg',
            duration: '12 DAYS',
            nights: '11 NIGHTS',
            location: 'NEGOMBO, ANURADHAPURA, JAFFNA, TRINCOMALEE, PASIKUDA, ARUGAM BAY, ELLA & COLOMBO',
            description: 'An immersive northern and eastern journey through sacred cities, Jaffna culture, marine adventures, beaches, and Ella.',
            travelMode: 'private',
            collections: ['northern-shores'],
            days: [
                { label: 'Day 1', title: 'Airport to Negombo', overnight: 'Negombo', activities: ['Airport arrival and meet your guide', 'Negombo city tour', 'Fish Market and Dutch Canal', 'Beach sunset'] },
                { label: 'Day 2', title: 'Anuradhapura and Jaffna', overnight: 'Jaffna', activities: ['Breakfast and departure', 'Anuradhapura Ancient City', 'Sri Maha Bodhi', 'Ruwanwelisaya Stupa', 'Continue to Jaffna', 'Free evening'] },
                { label: 'Day 3', title: 'Jaffna heritage and culture', overnight: 'Jaffna', activities: ['Jaffna Fort', 'Nallur Kandaswamy Kovil', 'Jaffna Public Library', 'Local market', 'Authentic Jaffna cuisine'] },
                { label: 'Day 4', title: 'Delft Island experience', overnight: 'Jaffna', activities: ['Boat trip to Delft Island', 'Colonial ruins and stone buildings', 'Wild ponies', 'Giant baobab tree', 'Local village experience'] },
                { label: 'Day 5', title: 'Jaffna to Trincomalee', overnight: 'Trincomalee', activities: ['Scenic East Coast drive', 'Koneswaram Temple', 'Deer Park', 'Fort Frederick', 'Trincomalee town', 'Beach relaxation'] },
                { label: 'Day 6', title: 'Trincomalee marine experience', overnight: 'Trincomalee', activities: ['Early whale and dolphin watching', 'Pigeon Island boat trip', 'Snorkeling and swimming', 'Coral reefs and tropical fish', 'Nilaveli Beach', 'Coastal sunset'] },
                { label: 'Day 7', title: 'Trincomalee to Pasikuda', overnight: 'Pasikuda', activities: ['Breakfast and departure', 'Batticaloa stop', 'Batticaloa Lagoon', 'Pasikuda beach relaxation'] },
                { label: 'Day 8', title: 'Pasikuda to Arugam Bay', overnight: 'Arugam Bay', activities: ['Relaxed morning at Pasikuda Beach', 'East Coast drive', 'Local villages', 'Arugam Bay beach and sunset'] },
                { label: 'Day 9', title: 'Arugam Bay adventure', overnight: 'Arugam Bay', activities: ['Arugam Bay Beach', 'Optional surfing lesson', 'Kumana National Park safari', 'Lagoon and wildlife experience', 'Beach sunset'] },
                { label: 'Day 10', title: 'Arugam Bay to Ella', overnight: 'Ella', activities: ['Scenic hill country journey', 'Ravana Falls', 'Nine Arch Bridge', 'Ella town', 'Optional Little Adam\'s Peak'] },
                { label: 'Day 11', title: 'Ella to Colombo', overnight: 'Colombo', activities: ['Free morning in Ella', 'Optional scenic train journey', 'Colombo city tour', 'Galle Face Green', 'Lotus Tower', 'Shopping'] },
                { label: 'Day 12', title: 'Colombo to airport', overnight: '', activities: ['Breakfast', 'Last minute shopping', 'Bandaranaike International Airport transfer'] }
            ]
        },
        {
            slug: 'northern-shores-eastern-wonders',
            title: 'Northern Shores & Eastern Wonders',
            image: 'assets/img/destinations/trincomalee_beach.png',
            duration: '14 DAYS',
            nights: '13 NIGHTS',
            location: 'ANURADHAPURA, JAFFNA, EAST COAST, SIGIRIYA & KANDY',
            description: 'A culture rich coastal route through the north and east, returning through Sigiriya, Kandy, and Colombo.',
            travelMode: 'private',
            collections: ['northern-shores'],
            days: [
                { label: 'Day 1', title: 'Airport to Anuradhapura', overnight: 'Anuradhapura', activities: ['Airport meet and greet', 'Sri Maha Bodhi', 'Ruwanwelisaya Stupa', 'Ancient city area'] },
                { label: 'Day 2', title: 'Anuradhapura to Jaffna', overnight: 'Jaffna', activities: ['Nagadeepa or Nainativu Island if time permits', 'Evening city walk', 'Jaffna local food experience'] },
                { label: 'Day 3', title: 'Jaffna cultural tour', overnight: 'Jaffna', activities: ['Nallur Kandaswamy Temple', 'Jaffna Fort', 'Jaffna Public Library', 'Local market', 'Jaffna Hindu temples'] },
                { label: 'Day 4', title: 'Jaffna to Trincomalee', overnight: 'Trincomalee', activities: ['Koneswaram Temple', 'Fort Frederick', 'Lover\'s Leap', 'Evening beach time'] },
                { label: 'Day 5', title: 'Trincomalee beach day', overnight: 'Trincomalee', activities: ['Nilaveli Beach', 'Optional Pigeon Island boat trip and snorkeling', 'Beach leisure', 'Coastal sunset'] },
                { label: 'Day 6', title: 'Trincomalee exploration', overnight: 'Trincomalee', activities: ['Marble Beach', 'Local fishing village experience', 'Hot Water Springs', 'Free evening at Nilaveli or Uppuveli'] },
                { label: 'Day 7', title: 'Trincomalee to Batticaloa', overnight: 'Batticaloa', activities: ['East Coast drive', 'Batticaloa Fort', 'Kallady Bridge', 'Lagoon sunset'] },
                { label: 'Day 8', title: 'Batticaloa to Arugam Bay', overnight: 'Arugam Bay', activities: ['Coastal viewpoints', 'Beach time and sunset', 'Explore the surfing town'] },
                { label: 'Day 9', title: 'Arugam Bay adventure', overnight: 'Arugam Bay', activities: ['Early lagoon or wildlife safari', 'Optional surfing lesson', 'Panama Village', 'Elephant Rock', 'Arugam Bay Beach'] },
                { label: 'Day 10', title: 'Arugam Bay to Sigiriya', overnight: 'Sigiriya', activities: ['Pidurangala Rock', 'Sunset viewpoint'] },
                { label: 'Day 11', title: 'Sigiriya and wildlife', overnight: 'Sigiriya', activities: ['Sigiriya Lion Rock Fortress', 'Dambulla Cave Temple', 'Minneriya or Kaudulla National Park safari'] },
                { label: 'Day 12', title: 'Sigiriya to Kandy', overnight: 'Kandy', activities: ['Spice Garden', 'Kandy Lake', 'Kandy View Point', 'Temple of the Sacred Tooth Relic', 'Cultural Dance Show'] },
                { label: 'Day 13', title: 'Kandy to Colombo', overnight: 'Colombo', activities: ['Colombo city tour', 'Galle Face Green', 'Gangaramaya Temple', 'Lotus Tower', 'Pettah or Colombo shopping', 'Final Sri Lankan dinner'] },
                { label: 'Day 14', title: 'Colombo to airport', overnight: '', activities: ['Free time based on flight schedule', 'Last minute shopping', 'Airport transfer'] }
            ]
        },
        {
            slug: 'adventure-escape',
            title: 'Sri Lanka Adventure Escape',
            image: 'assets/img/main-gallery/hiking-rock.jpeg',
            duration: '8 DAYS',
            nights: '7 NIGHTS',
            location: 'SIGIRIYA, KANDY, KITULGALA, ADAM\'S PEAK, ELLA, YALA & GALLE',
            description: 'An active island route combining rock climbs, white water, mountain trails, ziplining, wildlife, and the south coast.',
            travelMode: 'private',
            collections: ['adventure'],
            days: [
                { label: 'Day 1', title: 'Airport to Sigiriya or Habarana', overnight: 'Habarana', activities: ['Airport pickup and welcome', 'Direct journey to Sigiriya or Habarana', 'Pidurangala Rock sunset hike', 'Evening Cultural Dance Show'] },
                { label: 'Day 2', title: 'Sigiriya adventure day', overnight: 'Habarana', activities: ['Early Sigiriya Rock Fortress climb', 'Ancient fortress and gardens', 'Habarana village cycling', 'Catamaran lake ride', 'Traditional village lunch', 'Optional elephant safari'] },
                { label: 'Day 3', title: 'Habarana to Kandy', overnight: 'Kandy', activities: ['Scenic journey to Kandy', 'Temple of the Sacred Tooth Relic', 'Kandy Lake', 'Kandy View Point', 'Evening city exploration'] },
                { label: 'Day 4', title: 'Kandy to Kitulgala', overnight: 'Kitulgala', activities: ['Scenic drive to Kitulgala', 'Kelani River white water rafting', 'Adventure trekking or jungle walk', 'Optional canyoning or waterfall experience', 'Eco or jungle style accommodation'] },
                { label: 'Day 5', title: 'Adam\'s Peak and Ella', overnight: 'Ella', activities: ['Transfer towards Adam\'s Peak', 'Sri Pada trek and sunrise experience', 'Mountain descent', 'Continue to Ella'] },
                { label: 'Day 6', title: 'Ella adventure day', overnight: 'Ella', activities: ['Ella Rock hike', 'Tea plantation walk', 'Nine Arch Bridge', 'Flying Ravana Zipline', 'Ravana Falls', 'Ella Gap viewpoint'] },
                { label: 'Day 7', title: 'Ella to Yala', overnight: 'Yala', activities: ['Scenic viewpoints and waterfalls', 'Yala National Park Jeep Safari', 'Elephant, crocodile, and wildlife viewing', 'Adventure tented camp', 'Optional night jungle experience'] },
                { label: 'Day 8', title: 'Yala, Galle, and departure', overnight: '', activities: ['Morning coastal experience', 'Galle Dutch Fort', 'Traditional stilt fishermen', 'Continue to Colombo', 'City sightseeing or shopping based on flight time', 'Airport drop off'] }
            ]
        },
        {
            slug: 'epic-adventure-journey',
            title: 'Sri Lanka Epic Adventure Journey',
            image: 'assets/img/main-gallery/surfing-class.jpeg',
            duration: '10 DAYS',
            nights: '9 NIGHTS',
            location: 'SIGIRIYA, KNUCKLES, KITULGALA, ELLA, WELIGAMA, MIRISSA & GALLE',
            description: 'A fast moving adventure through rock fortresses, mountain wilderness, white water, Ella hikes, and southern surf beaches.',
            travelMode: 'private',
            collections: ['adventure'],
            days: [
                { label: 'Day 1', title: 'Airport to Sigiriya', overnight: 'Sigiriya or Habarana', activities: ['Airport pickup', 'Travel to Sigiriya', 'Pidurangala Rock sunset hike', 'Ancient rock monastery area', 'Panoramic views of Sigiriya Rock'] },
                { label: 'Day 2', title: 'Sigiriya adventure', overnight: 'Sigiriya or Habarana', activities: ['Early Sigiriya Rock Fortress climb', 'Ancient ruins and gardens', 'Summit views', 'Kandalama Lake kayaking', 'Lake sunset'] },
                { label: 'Day 3', title: 'Sigiriya to Knuckles', overnight: 'Knuckles', activities: ['Scenic mountain journey', 'Guided jungle trek', 'Village and forest exploration', 'Waterfall or natural pool experience'] },
                { label: 'Day 4', title: 'Knuckles mountain trek', overnight: 'Knuckles', activities: ['Early mountain hike', 'Forest trails and viewpoints', 'Stream crossings', 'Waterfall exploration', 'Mountain picnic lunch'] },
                { label: 'Day 5', title: 'Knuckles wilderness expedition', overnight: 'Kitulgala', activities: ['Sunrise mountain experience', 'Extended Knuckles trekking route', 'Remote villages and forest trails', 'Waterfalls and natural swimming spots', 'Afternoon transfer to Kitulgala'] },
                { label: 'Day 6', title: 'Kitulgala white water adventure', overnight: 'Kitulgala', activities: ['Kelani River white water rafting', 'River rapids', 'Jungle and river adventure', 'Optional canyoning or waterfall activity'] },
                { label: 'Day 7', title: 'Kitulgala to Ella', overnight: 'Ella', activities: ['Scenic journey to Ella', 'Little Adam\'s Peak hike', 'Nine Arch Bridge', 'Tea plantation experience', 'Ravana Falls', 'Ella town'] },
                { label: 'Day 8', title: 'Ella Rock adventure', overnight: 'Ella', activities: ['Early Ella Rock hike', 'Tea plantations and forest trails', 'Mountain viewpoints', 'Afternoon relaxation', 'Optional Flying Ravana Zipline'] },
                { label: 'Day 9', title: 'Ella to Weligama and Mirissa', overnight: 'Mirissa', activities: ['Travel to Weligama', 'Surfing lesson', 'Weligama Beach leisure', 'Continue to Mirissa', 'Secret Beach', 'Ocean sunset'] },
                { label: 'Day 10', title: 'Mirissa, Galle, and departure', overnight: '', activities: ['Mirissa Beach morning', 'Optional coastal activity', 'Galle Dutch Fort', 'Historic streets and ramparts', 'Continue to Colombo or airport', 'Airport departure'] }
            ]
        },
        {
            slug: 'ultimate-adventure',
            title: 'Sri Lanka Ultimate Adventure',
            image: 'assets/img/main-gallery/wild-life-adventure.jpeg',
            duration: '21 DAYS',
            nights: '20 NIGHTS',
            location: 'SIGIRIYA, KNUCKLES, KITULGALA, ADAM\'S PEAK, ELLA, YALA, SOUTH COAST, SINHARAJA & COLOMBO',
            description: 'The complete active island expedition, linking mountains, jungle rivers, ancient kingdoms, wildlife, surf, rainforest, and ocean adventures.',
            travelMode: 'private',
            collections: ['adventure'],
            days: [
                { label: 'Day 1', title: 'Airport to Sigiriya', overnight: 'Sigiriya', activities: ['Airport pickup and welcome', 'Transfer to Sigiriya or Habarana', 'Pidurangala Rock sunset hike', 'Ancient rock monastery', 'Panoramic Sigiriya views', 'Adventure dinner'] },
                { label: 'Day 2', title: 'Sigiriya and Kandalama', overnight: 'Sigiriya', activities: ['Early Sigiriya Rock Fortress climb', 'Ancient palace ruins and gardens', 'Local lunch', 'Kandalama Lake kayaking', 'Nature and birdlife', 'Lake sunset'] },
                { label: 'Day 3', title: 'Polonnaruwa cycling adventure', overnight: 'Habarana', activities: ['Polonnaruwa Ancient City', 'Cycling through temples and palace ruins', 'Local village lunch', 'Traditional catamaran ride', 'Optional elephant safari'] },
                { label: 'Day 4', title: 'Kandy and Knuckles', overnight: 'Knuckles', activities: ['Scenic journey to Kandy', 'Temple of the Sacred Tooth Relic', 'Kandy Lake viewpoint', 'Mountain village exploration', 'Jungle trek', 'Waterfall or natural pool'] },
                { label: 'Day 5', title: 'Knuckles mountain expedition', overnight: 'Knuckles', activities: ['Sunrise trek', 'Manigala or Knuckles mountain trails', 'Cloud forest', 'Stream crossings and waterfalls', 'Remote villages', 'Mountain viewpoints', 'Picnic lunch'] },
                { label: 'Day 6', title: 'Knuckles deep wilderness', overnight: 'Kitulgala', activities: ['Remote mountain trails', 'Hidden viewpoints', 'Forest and wildlife exploration', 'Natural pools', 'Waterfall experience', 'Afternoon transfer to Kitulgala'] },
                { label: 'Day 7', title: 'Kitulgala river adventure', overnight: 'Kitulgala', activities: ['Kelani River white water rafting', 'Rainforest rapids', 'Jungle trekking', 'Waterfall or canyon adventure', 'Natural pool experience'] },
                { label: 'Day 8', title: 'Kitulgala to Adam\'s Peak', overnight: 'Adam\'s Peak area', activities: ['Hill country journey', 'Tea plantations and mountain villages', 'Prepare for the climb', 'Local dinner', 'Night trek to Adam\'s Peak'] },
                { label: 'Day 9', title: 'Adam\'s Peak sunrise and Ella', overnight: 'Ella', activities: ['Summit sunrise', 'Mountain descent', 'Transfer to Hatton or Nanu Oya', 'Scenic train to Ella', 'Tea country views', 'Ella town leisure'] },
                { label: 'Day 10', title: 'Ella Rock and Pekoe Trail', overnight: 'Ella', activities: ['Pekoe Trail hike', 'Tea plantations and eucalyptus forests', 'Ella Rock summit', 'Ella Gap views', 'Ella Forest Reserve', 'Nine Arch Bridge', 'Demodara Railway Loop'] },
                { label: 'Day 11', title: 'Ella flavours and adrenaline', overnight: 'Ella', activities: ['Sri Lankan cooking class and lunch', 'Little Adam\'s Peak', 'Flying Ravana Zipline', 'Ravana Falls', 'Tea plantation experience', 'Free time'] },
                { label: 'Day 12', title: 'Buduruwagala and Yala safari', overnight: 'Yala', activities: ['Buduruwagala Ancient Temple', 'Rock carved Buddhist statues', 'Afternoon Yala Jeep Safari', 'Elephants, leopards, crocodiles, and birds', 'Wilderness camp sunset'] },
                { label: 'Day 13', title: 'Ultimate Yala wildlife day', overnight: 'Yala', activities: ['Early Yala Jeep Safari', 'Wildlife photography', 'Leopard and elephant tracking', 'Birdwatching', 'Jungle experience', 'Optional nature walk'] },
                { label: 'Day 14', title: 'Yala to Weligama', overnight: 'Weligama', activities: ['South coast journey', 'Surf safety briefing', 'Beginner or intermediate surf lesson', 'First surf session', 'Beach relaxation', 'Sunset'] },
                { label: 'Day 15', title: 'Weligama surf day', overnight: 'Weligama', activities: ['Sunrise beach walk', 'Morning surf session', 'Professional coaching', 'Free surfing time', 'Beach relaxation', 'Weligama Bay sunset'] },
                { label: 'Day 16', title: 'Weligama to Mirissa', overnight: 'Mirissa', activities: ['Whale and dolphin watching', 'Snorkeling or swimming when conditions permit', 'Mirissa Beach', 'Coconut Tree Hill coastal experience', 'Sunset'] },
                { label: 'Day 17', title: 'Mirissa to Galle', overnight: 'Galle', activities: ['Morning beach experience', 'Galle Fish Market', 'Local fishermen and market atmosphere', 'Galle Dutch Fort', 'Lighthouse and historic streets', 'Shopping', 'Fort sunset'] },
                { label: 'Day 18', title: 'Galle to Sinharaja', overnight: 'Sinharaja', activities: ['Transfer to Sinharaja', 'Rainforest lodge check in', 'Guided rainforest trek', 'Jungle trails, streams, and waterfalls', 'Birdwatching and wildlife', 'Natural pool'] },
                { label: 'Day 19', title: 'Sinharaja jungle expedition', overnight: 'Sinharaja', activities: ['Early rainforest trek', 'Deep forest exploration', 'Endemic birdwatching', 'Waterfalls and streams', 'Natural swimming', 'Local village or nature experience'] },
                { label: 'Day 20', title: 'Sinharaja to Colombo', overnight: 'Colombo', activities: ['Morning rainforest walk', 'Transfer to Colombo', 'Pettah Market', 'Shopping', 'Galle Face Green', 'Port City Beach', 'Lotus Tower at night'] },
                { label: 'Day 21', title: 'Colombo to airport', overnight: '', activities: ['Breakfast', 'Free time based on flight schedule', 'Last minute shopping', 'Optional Colombo sightseeing', 'Airport transfer', 'Departure from Sri Lanka'] }
            ]
        }
    ];

    tours.forEach(function(tour) {
        tour.highlights = tour.days.map(function(day) {
            return day.label + ': ' + day.title + (day.overnight ? ' / stay ' + day.overnight : '');
        });
    });

    window.TourDataModule = {
        tourData: tours,

        getBySlug: function(slug) {
            return tours.find(function(tour) {
                return tour.slug === slug;
            });
        },

        getByCollection: function(collectionSlug) {
            return tours.filter(function(tour) {
                return tour.collections.indexOf(collectionSlug) !== -1;
            });
        },

        getRelated: function(tour, limit) {
            var collection = tour.collections[0];
            var related = tours.filter(function(candidate) {
                return candidate.slug !== tour.slug && collection && candidate.collections.indexOf(collection) !== -1;
            });

            tours.forEach(function(candidate) {
                if (candidate.slug !== tour.slug && related.indexOf(candidate) === -1) related.push(candidate);
            });

            return related.slice(0, limit || 3);
        }
    };
})();
