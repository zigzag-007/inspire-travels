// Tour Gallery Data Module
// Author: Zig Zag AI
// Description: Stores the seven visual highlights used by each package page.

(function() {
    'use strict';

    window.TourGalleryDataModule = {
        galleries: {
            'highlights-escape': [
                { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Sigiriya Rock Fortress' }, { src: 'assets/img/main-gallery/pinnawala-elephant-watching.jpg', title: 'Pinnawala Elephant Sanctuary' }, { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Kandy Tea Estates' }, { src: 'assets/img/main-gallery/madu-river-safari.jpg', title: 'Bentota Boat Safari' }, { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Peradeniya Royal Gardens' }, { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Tea Plantation Visit' }, { src: 'assets/img/main-gallery/01-guests-with-tour-guide-beside-private-van.jpeg', title: 'Private Chauffeured AC Van' }
            ],
            'hills-to-beach': [
                { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Sigiriya Lion Rock Fortress' }, { src: 'assets/img/main-gallery/mirissa-coconut-tree-hill.jpg', title: 'Mirissa Coconut Tree Hill' }, { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Nuwara Eliya Tea Valleys' }, { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Mountain Zipline' }, { src: 'assets/img/main-gallery/waterfall-tour.jpg', title: 'Ravana Waterfalls' }, { src: 'assets/img/main-gallery/03-hill-country-group-viewpoint.jpeg', title: 'Hill Country Viewpoints' }, { src: 'assets/img/main-gallery/surfing-class.jpeg', title: 'Mirissa Surfing Bay' }
            ],
            'golden-triangle': [
                { src: 'assets/img/main-gallery/cultural-heritage-tour.jpeg', title: 'Cultural Heritage Monuments' }, { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Yala Wildlife Leopard Safari' }, { src: 'assets/img/main-gallery/waterfall-tour.jpg', title: 'Ramboda Scenic Waterfalls' }, { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Tea Plantation Hills' }, { src: 'assets/img/main-gallery/cooking-class.jpeg', title: 'Traditional Sri Lankan Cooking' }, { src: 'assets/img/main-gallery/05-tour-guide-van-selfie.jpeg', title: 'Guided Chauffeur Service' }, { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Peradeniya Botanical Gardens' }
            ],
            'ramayanaya-tour': [
                { src: 'assets/img/main-gallery/cultural-heritage-tour.jpeg', title: 'Sacred Temples & Shrines' }, { src: 'assets/img/main-gallery/botanical-garden-tour.jpg', title: 'Royal Botanical Gardens' }, { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Seetha Eliya Highlands' }, { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Highland Tea Gardens' }, { src: 'assets/img/main-gallery/16-welcome-to-sri-lanka-arrival-sign.jpeg', title: 'Sacred Shrine Welcome' }, { src: 'assets/img/main-gallery/18-tea-estate-view-with-waterfall.jpeg', title: 'Nuwara Eliya Valleys' }, { src: 'assets/img/main-gallery/pinnawala-elephant-watching.jpg', title: 'Pinnawala Elephant Sanctuary' }
            ],
            'pearl-of-asia': [
                { src: 'assets/img/main-gallery/pidurangala-rock.jpg', title: 'Dambulla & Pidurangala View' }, { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Gap Zipline Adventure' }, { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Udawalawe Elephant Safari' }, { src: 'assets/img/main-gallery/turtle-hatchery-visit.jpg', title: 'Turtle Hatchery Sanctuary' }, { src: 'assets/img/main-gallery/surfing-class.jpeg', title: 'Mirissa Beach Surfing' }, { src: 'assets/img/main-gallery/12-jeep-safari-group-tour.jpeg', title: '4x4 Wildlife Jeep Safari' }, { src: 'assets/img/main-gallery/madu-river-safari.jpg', title: 'Bentota Boat Cruise' }
            ],
            'grand-tour': [
                { src: 'assets/img/main-gallery/sigiriya-lion-rock.jpg', title: 'Ancient Sigiriya Fortress' }, { src: 'assets/img/main-gallery/yala-leopard-safari.jpg', title: 'Yala National Park Safari' }, { src: 'assets/img/main-gallery/mirissa-coconut-tree-hill.jpg', title: 'Southern Coast Surfing Bays' }, { src: 'assets/img/main-gallery/flying-ravana-ella-zipline-adventure.jpg', title: 'Ella Peak & Nine Arch Bridge' }, { src: 'assets/img/main-gallery/historic-galle-fort.jpg', title: 'Tea Country Views' }, { src: 'assets/img/main-gallery/09-outdoor-adventure-travelers-with-guide.jpeg', title: 'Complete Island Tour' }, { src: 'assets/img/main-gallery/tea-plantation-tour.jpeg', title: 'Highland Tea Valleys' }
            ]
        },

        getByTour: function(slug) {
            return this.galleries[slug] || this.galleries['highlights-escape'];
        }
    };
})();
