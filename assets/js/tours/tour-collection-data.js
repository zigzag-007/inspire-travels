// Tour Collection Data Module
// Author: Zig Zag AI
// Description: Defines the collection pages that currently have confirmed itineraries.

(function() {
    'use strict';

    var collections = [
        {
            slug: 'family',
            navLabel: 'Family Tours',
            eyebrow: 'Family Tours',
            title: 'Family tours in Sri Lanka',
            description: 'Compare four private routes from 5 to 14 days. Plan the pace, stops and hotels around your family.',
            heroImage: 'assets/img/gallery/main/hill-country-family-viewpoint-sri-lanka.jpg',
            heroImageAlt: 'A family enjoying the green Sri Lankan hill country',
            portraitImage: 'assets/img/gallery/main/04-family-by-tour-van-sri-lanka.jpeg',
            portraitImageAlt: 'Family guests beside an Inspire Travels tour van in Sri Lanka',
            note: 'Four routes from 5 to 14 days',
            accent: 'family',
            storyTitle: 'Plan around the people travelling.',
            storyDescription: 'Tell us the ages in your group, your interests and how much time you want on the road each day.',
            storyPanels: [
                {
                    number: '01',
                    title: 'Small moments become the trip',
                    description: 'Warm welcomes, curious detours, and plenty of time to enjoy being together.',
                    image: 'assets/img/gallery/main/14-airport-welcome-family-with-gifts.jpeg',
                    imageAlt: 'A family receiving a warm airport welcome in Sri Lanka'
                },
                {
                    number: '02',
                    title: 'Room for every generation',
                    description: 'A comfortable rhythm for children, parents, and grandparents without losing the adventure.',
                    image: 'assets/img/gallery/main/hill-country-family-viewpoint-sri-lanka.jpg',
                    imageAlt: 'A family looking across the Sri Lankan hill country'
                },
                {
                    number: '03',
                    title: 'Your driver, your pace',
                    description: 'A private vehicle and a local guide keep every day flexible and personal.',
                    image: 'assets/img/gallery/main/01-guests-with-tour-guide-beside-private-van.jpeg',
                    imageAlt: 'Guests with their local guide beside a private tour van'
                }
            ]
        },
        {
            slug: 'group',
            navLabel: 'Group Tours',
            eyebrow: 'Group Journeys',
            title: 'Group tours in Sri Lanka',
            description: 'Choose a shared journey from 5 to 14 days. Ask our team about departure dates, available seats and confirmed inclusions.',
            heroImage: 'assets/img/gallery/main/03-hill-country-group-viewpoint.jpeg',
            heroImageAlt: 'A group of travellers overlooking the Sri Lankan hill country',
            portraitImage: 'assets/img/gallery/main/group_arrival_fuso.jpg',
            portraitImageAlt: 'Group travellers arriving in Sri Lanka with Inspire Travels',
            note: 'Three planned journeys from 5 to 14 days',
            accent: 'group',
            packageImages: {
                'sri-lanka-dream-journey': 'assets/img/gallery/main/03-hill-country-group-viewpoint.jpeg',
                'discover-ceylon-group': 'assets/img/gallery/main/02-pekoe-trail-start-point-group-photo.jpeg',
                'grand-island-journey-group': 'assets/img/gallery/main/12-jeep-safari-group-tour.jpeg'
            },
            storyTitle: 'Know the plan before you join.',
            storyDescription: 'Confirm the departure, daily programme, transport and inclusions with our team before booking a group journey.',
            storyPanels: [
                {
                    number: '01',
                    title: 'Arrive as a group',
                    description: 'A warm welcome, one clear plan, and a local team ready for every traveller.',
                    image: 'assets/img/gallery/main/19-airport-group-selfie-with-guests.jpeg',
                    imageAlt: 'Group travellers taking a welcome selfie at the airport'
                },
                {
                    number: '02',
                    title: 'Share the wild',
                    description: 'Safaris, mountain roads, and coastlines feel bigger when the whole group sees them together.',
                    image: 'assets/img/gallery/main/12-jeep-safari-group-tour.jpeg',
                    imageAlt: 'A group tour enjoying a Sri Lankan jeep safari'
                },
                {
                    number: '03',
                    title: 'Keep the stories',
                    description: 'The route ends, but the friendships and shared memories travel home with you.',
                    image: 'assets/img/gallery/main/02-pekoe-trail-start-point-group-photo.jpeg',
                    imageAlt: 'Group travellers together at the Pekoe Trail starting point'
                }
            ]
        },
        {
            slug: 'northern-shores',
            navLabel: 'Northern Shores',
            eyebrow: 'North and East Coast',
            title: 'North and east coast tours',
            description: 'Compare three routes from 9 to 14 days, with different combinations of Jaffna, Trincomalee, Arugam Bay and the Cultural Triangle.',
            heroImage: 'assets/img/destinations/trincomalee_beach.png',
            heroImageAlt: 'The clear blue coast of Trincomalee in eastern Sri Lanka',
            portraitImage: 'assets/img/destinations/arugam-bay-hero.jpg',
            portraitImageAlt: 'The broad beach and coastline of Arugam Bay',
            note: 'Three coastal routes from 9 to 14 days',
            accent: 'coast',
            packageImages: {
                'east-coast-discovery': 'assets/img/gallery/main/pigeon-island-snorkeling.jpeg',
                'north-east-coast-explorer': 'assets/img/gallery/main/koneswaram-temple.jpeg',
                'northern-shores-eastern-wonders': 'assets/img/destinations/arugam-bay-hero.jpg'
            },
            storyTitle: 'Choose how far along the coast to go.',
            storyDescription: 'Read each itinerary for its coastal stops and inland journeys. The three routes cover different parts of the north and east.',
            storyPanels: [
                {
                    number: '01',
                    title: 'Temples above the sea',
                    description: 'Sacred places and layered histories meet the open Indian Ocean along the eastern coast.',
                    image: 'assets/img/gallery/main/koneswaram-temple.jpeg',
                    imageAlt: 'Koneswaram Temple overlooking the sea in Trincomalee'
                },
                {
                    number: '02',
                    title: 'Clear water, quiet shores',
                    description: 'Snorkel, swim, or simply slow down where the east coast feels wonderfully unhurried.',
                    image: 'assets/img/gallery/main/pigeon-island-snorkeling.jpeg',
                    imageAlt: 'Guests together aboard a covered boat'
                },
                {
                    number: '03',
                    title: 'Ancient roads home',
                    description: 'The return journey crosses the Cultural Triangle and ties the island into one remarkable story.',
                    image: 'assets/img/gallery/main/sigiriya-lion-rock.jpg',
                    imageAlt: 'Guests and their guide beside Sri Lankan heritage ruins'
                }
            ]
        },
        {
            slug: 'cultural-heritage',
            navLabel: 'Culture & Heritage',
            eyebrow: 'Culture and Heritage',
            title: 'Culture and heritage tours',
            description: 'Sacred cities, ancient kingdoms, and traditions that still shape the island today.',
            heroImage: 'assets/img/destinations/sigiriya_lion_rock.png',
            heroImageAlt: 'Sigiriya Lion Rock rising above Sri Lanka\'s Cultural Triangle',
            portraitImage: 'assets/img/gallery/main/temple-of-sacred-tooth-relic.png',
            portraitImageAlt: 'The Temple of the Sacred Tooth Relic illuminated in Kandy',
            note: 'Three heritage routes from 7 to 14 days',
            accent: 'culture',
            packageImages: {
                'cultural-heritage-journey': 'assets/img/gallery/main/cultural-heritage-tour.jpeg',
                'ramayanaya-tour': 'assets/img/gallery/main/koneswaram-temple.jpeg',
                'unesco-heritage-tour': 'assets/img/gallery/main/dambulla-cave-temple.jpeg'
            },
            storyTitle: 'Find the heritage route that interests you.',
            storyDescription: 'Compare the cultural journey, Ramayanaya route and UNESCO heritage tour. Their planned stops are listed day by day.',
            storyPanels: [
                {
                    number: '01',
                    title: 'Kingdoms written in stone',
                    description: 'Walk through ancient capitals, royal gardens, and monumental ruins with their stories brought to life.',
                    image: 'assets/img/gallery/main/cultural-heritage-tour.jpeg',
                    imageAlt: 'Travellers exploring ancient Sri Lankan ruins with their guide'
                },
                {
                    number: '02',
                    title: 'Sacred spaces, carefully entered',
                    description: 'Visit cave temples and living shrines with the time and guidance needed to experience them respectfully.',
                    image: 'assets/img/gallery/main/dambulla-cave-temple.jpeg',
                    imageAlt: 'Travellers visiting the Dambulla Cave Temple complex'
                },
                {
                    number: '03',
                    title: 'Traditions that still move',
                    description: 'Meet the island through ritual, dance, architecture, and the communities that keep them alive.',
                    image: 'assets/img/gallery/main/kandyan-cultural-dance-performance.jpeg',
                    imageAlt: 'A traditional Kandyan cultural dance performance'
                }
            ]
        },
        {
            slug: 'adventure',
            navLabel: 'Adventure Tours',
            eyebrow: 'Adventure Routes',
            title: 'Sri Lanka adventure tours',
            description: 'Compare active routes from 8 to 21 days, combining mountain trails, rafting, wildlife and the coast.',
            heroImage: 'assets/img/gallery/main/hiking-rock.jpeg',
            heroImageAlt: 'Travellers watching sunset from a high rocky viewpoint in Sri Lanka',
            portraitImage: 'assets/img/gallery/main/flying-ravana-ella-zipline-adventure.jpg',
            portraitImageAlt: 'Travellers ready for the Flying Ravana zipline in Ella',
            note: 'Three adventure routes from 8 to 21 days',
            accent: 'adventure',
            packageImages: {
                'adventure-escape': 'assets/img/gallery/main/water-rafting.jpg',
                'epic-adventure-journey': 'assets/img/gallery/main/surfing-class.jpeg',
                'ultimate-adventure': 'assets/img/gallery/main/wild-life-adventure.jpeg'
            },
            storyTitle: 'Match the activities to your pace.',
            storyDescription: 'Tell us about your experience and interests. Confirm activity arrangements and any requirements with the team before booking.',
            storyPanels: [
                {
                    number: '01',
                    title: 'Meet the river head on',
                    description: 'Take on the Kelani River with trained rafting teams and a jungle landscape on every side.',
                    image: 'assets/img/gallery/main/water-rafting.jpg',
                    imageAlt: 'Travellers prepared for white water rafting in Kitulgala'
                },
                {
                    number: '02',
                    title: 'Climb, cross, then fly',
                    description: 'Link mountain hikes, tea trails, Nine Arch Bridge, and the Flying Ravana zipline in one remarkable day.',
                    image: 'assets/img/gallery/main/flying-ravana-ella-zipline-adventure.jpg',
                    imageAlt: 'Travellers wearing zipline equipment in Ella'
                },
                {
                    number: '03',
                    title: 'End where the wild begins',
                    description: 'Trade the mountain trail for a safari track and a night close to the landscapes of Yala.',
                    image: 'assets/img/gallery/main/yala-leopard-safari.jpg',
                    imageAlt: 'Travellers seated inside a safari vehicle'
                }
            ]
        }
    ];

    window.TourCollectionDataModule = {
        collections: collections,

        getBySlug: function(slug) {
            return collections.find(function(collection) {
                return collection.slug === slug;
            });
        }
    };
})();
