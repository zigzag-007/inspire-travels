// Shows verified review excerpts with a link to each Google reviewer profile.

(function () {
    'use strict';

    // Keep only reviews whose names, words, ratings, and profile pages were checked.
    var reviews = [
        {
            name: 'manish kundu',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocK2WsPucXp5BDBKvZpevbnxn_RDaOpsQPPMoO4xJqmEApY5QWzq=w36-h36-p-rp-mo-ba12-br100',
            profile: 'https://www.google.com/maps/contrib/114010618743342096318/reviews?hl=en-GB',
            quote: 'Spent 8 days exploring Sri Lanka with Kalum and couldn\'t have asked for a better experience. He is an outstanding host—super friendly, very knowledgeable, and always went the extra mile to make our trip special.',
            rating: 5
        },
        {
            name: 'Hemanth D',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocI1WYfSz19RUBBgALG-susK1JvaeYabiQ4H4IuGjP1E_ABgjQ=w36-h36-p-rp-mo-ba12-br100',
            profile: 'https://www.google.com/maps/contrib/106008157020140095115/reviews?hl=en-GB',
            quote: 'Our trip changes were handled smoothly, including getting bookings for hotel in middle of the trip and at good rates. He was with us for 7 days and enjoyed the conversation, to learn about the locations, his journey.',
            rating: 5
        },
        {
            name: 'Bhagyashree Nichite',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocKZjU5-4aFt4E8rApKXdY2muKY1zmVvLm3MQjrrH9gT9YJ4fuk=w36-h36-p-rp-mo-br100',
            profile: 'https://www.google.com/maps/contrib/118224888790977037677/reviews?hl=en-GB',
            quote: 'Flexible and accommodating: He happily adjusted the plan according to our interests and preferences.\nMemorable experience: His friendly nature and support made the trip truly enjoyable and unforgettable.',
            rating: 5
        },
        {
            "name": "Mayuri Suryavanshi",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjW_fIp6FZEUEpZW9PVmKojpey4hrudZFtzXBHAomUjzsqQ5-0nD=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/105442413635229281478/reviews?hl=en-GB",
            "quote": "One of my most memorable international trip! 🇱🇰🤍\n\nHighly recommended to anyone looking for a safe, reliable tour in Sri Lanka and to have local srilankan experience.\n\nWe were a group of four adults and one child visiting Sri Lanka from India, including three ladies. We genuinely felt safe, comfortable and secure while travelling with Kalum throughout the trip.\nHe was always punctual, respectful, kind and patient, as well as an extremely safe driver.",
            "rating": 5
        },
        {
            "name": "Biju Thomas",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjXQtIvU0_CucfsPCwekqo8gRKBvuoYxLbBQQoTmUX4m08eGOaKE=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/104579560199970409498/reviews?hl=en-GB",
            "quote": "Mr. Kalum provided exceptional service as our driver in Sri Lanka for three days. He was professional, punctual, and extremely safe on the road. His deep knowledge of the local routes, made our trip smooth and memorable. We always felt comfortable and well cared for.",
            "rating": 5
        },
        {
            "name": "Malith Thennakoon",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjWIhOTojQTUDU6m28cDjojp76PuMAGnw3YczVeSG9l78kP9MkE=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/117364092495330090399/reviews?hl=en-GB",
            "quote": "We had an amazing experience with Inspire Travels. Everything was well organized from the airport pickup to the end of our trip. Kalum was friendly, helpful, and always had great suggestions. He made us feel comfortable and safe throughout the journey. Highly recommended!",
            "rating": 5
        },
        {
            "name": "Daniya Tariq",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjWzQ4hjUU_FSHX_f4nb4w_JZo8nhQYGOfQQNfzVCPaQFhWy1obi=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/117391524575225885145/reviews?hl=en",
            "quote": "I highly recommend Inspire Travels for making travel easy, affordable, secure, and professional. Finding them on Instagram was a stroke of luck for our trip. As two females traveling alone, we had many concerns, but they answered all our queries, expertly guided us, and provided daily follow-ups throughout our time in Sri Lanka. I strongly recommend their services, especially for solo female travelers, families and groups.",
            "rating": 5
        },
        {
            "name": "Kaveesha Weebedda",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjXBSxi_1nSjq_N7IJIPFnPSy0Jy0re9mwPeUESvM9zGEMvQPLBd=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/117959642723133249848/reviews?hl=en",
            "quote": "We were very happy with the service from Inspire Travel and Tours. Communication was fast, clear, and reliable throughout. Everything was handled professionally, making our trip easy and stress-free.",
            "rating": 5
        },
        {
            "name": "Vivaan Shenoy",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjVyxKBvTCsy0WikxD4S4dBs6BbhQ3vLTrTyNpzLI7ZhRfGRalCahg=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/116999920827781880992/reviews?hl=en",
            "quote": "Very pleasant trip with a very friendly and knowledgeable guide - Lakshan. He was very helpful and kind and always on time made the stay in srilanka very peaceful and enjoyable",
            "rating": 5
        },
        {
            "name": "Thisara Janith",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjVgvYEdvz2DJUNlcy8g0JSTkfH0VhSQsyuBMUHrJE40W-nb-9I=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/113667510643687037302/reviews?hl=en",
            "quote": "Excellent service from Inspire Travel and Tours! Our entire trip was organized professionally, and everything went smoothly as planned.A truly reliable travel company.",
            "rating": 5
        },
        {
            "name": "Disha Ranka",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjXpI068YZSY4zt-4yfsCMDuVPvTF9C9toaa-e6hfxeu7wMKPi-p=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/117115065348333965356/reviews?hl=en",
            "quote": "Amazing experience..\nGuided us with all the best things and places in Sri Lanka.\nHad a wonderful experience with them",
            "rating": 5
        },
        {
            "name": "Juhil Vora",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjXSeH4L5Ta59ik7smu9cVasYKQoWnFM6skwgd5DD-T7plV23N2PEQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/106503573847882196512/reviews?hl=en",
            "quote": "The trip was amazing. We spent 7 days and the it was well spent. The traveller was spotless and maintained throughout the travel.",
            "rating": 5
        },
        {
            "name": "Sathya narayanan TG",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjUb1KPt_4mJ4BZopKJFuwWPzA4z4Nh827TGK-UACdwp6_Nk5Jk=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/107427393450464763870/reviews?hl=en",
            "quote": "We did our Sri Lanka trip through Mr.Kalum. He was excellent with his driving and was patient enough to wait and take us to all places we wanted. Excellent service provided.",
            "rating": 5
        },
        {
            "name": "Anusha Shivashankar",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjX9u4us0EIJeT88DwWr_v9WzmK9stZK7AppvhcSZr_mdTygAK1qNQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/111809483577379151298/reviews?hl=en",
            "quote": "Highly recommended!! Kalum is a great guide and made the trip hassle free and memorable.",
            "rating": 5
        },
        {
            "name": "Ruwan Ranga",
            "image": "https://lh3.googleusercontent.com/a-/ALV-UjXW4QLzsJQSNBO0GUqJBRI60sCRtj7qZ_FyJ6bT9JZVN7jaY-M=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/109664069415181542818/reviews?hl=en",
            "quote": "Very good service and kalum was superb..thanks for everything...",
            "rating": 5
        },
        {
            "name": "Eric",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocIHM9SCXhqB5fMB0BTfSJ7NAIpFg5JZebjLDsq00aHOjtGugqs=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/103382600271861460424/reviews?hl=en-GB",
            "quote": "Kalum is genuinely exceptional at what he does. From the very beginning, he went above and beyond to make my trip to Sri Lanka as enjoyable and comfortable as possible.\n\nHe was incredibly patient, flexible, and always accommodating, even when I made last-minute changes to my plans. What impressed me most was his extensive knowledge of Sri Lanka.",
            "rating": 5
        },
        {
            "name": "Mohit Malhotra",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocKiHc9Pcrna3EEf8ETWUgErD5Q6WkFdPMyCKAVUH7760gIg9w=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/108893297779853181761/reviews?hl=en-GB",
            "quote": "This was our first trip to Sri Lanka with my family, and we were looking for someone who could be our driver and guide for the entire 9-day journey. We were fortunate to find him!\n\nHe took us all across Sri Lanka, took exceptional care of us, and treated us like family rather than tourists. He guided us at every step, recommended the best places to visit, and made sure we were comfortable throughout the trip.\n\nI highly recommend his services.",
            "rating": 5
        },
        {
            "name": "Bhavin Jain",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocL9dZ3jCVccRoU2j9ueHblPiwTfpvjQTkjsPf2mwZVJFf8d4lU=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/112094660601306417449/reviews?hl=en",
            "quote": "We had an absolutely wonderful experience with Inspire Tours and Travels during our 8-day trip to Sri Lanka. From the very beginning until the end of our journey, everything was perfectly organized, and the service was truly exceptional.",
            "rating": 5
        },
        {
            "name": "Suhra Sahabdeen",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocJYa0-_9sy_cQEGSInOCt5K4PivEJqCscyNttqStVo6NgfvOg=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/102094738934608362492/reviews?hl=en",
            "quote": "Our Sri Lanka trip was unforgettable thanks to Inspire TravelTours. The guide was professional, caring, and extremely knowledgeable, making every destination more meaningful. We felt safe, comfortable, and well guided throughout the entire journey. Highly recommended for anyone looking for the best tour service in Sri Lanka!",
            "rating": 5
        },
        {
            "name": "Jayani Sanjana",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocKnjseUm5WYLmbhh3TTwQOfDpSV-VLxCDVUv_V_cH9j2h4REg=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/104965212240670290245/reviews?hl=en",
            "quote": "Excellent service! Very friendly and professional team. They organized everything perfectly from transport to hotels. No hidden charges and very responsive on WhatsApp. Highly recommended for anyone looking for a hassle-free tour. Will definitely travel with them again!",
            "rating": 5
        },
        {
            "name": "Rakshith Srujan",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocLYe7kFbHalcgf_9ehorpfwJuDrbbg2k8BnoqhCtTyAA1M6JQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/115387437196273161293/reviews?hl=en",
            "quote": "Their service was very good. Our driver Lakshan was very kind and helpful throughout the journey. We really enjoyed Sri Lanka because of him.",
            "rating": 5
        },
        {
            "name": "Raneesha Waas",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocLXWUlYMOmSx2VMghnwwtGzNjW2stSd9-fquObYTCZVGWdXJQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/115780424322488565331/reviews?hl=en",
            "quote": "Traveling with Inspire Tour Company was one of the best decisions we made for our Sri Lanka vacation! From the start, the team was incredibly responsive and helped us plan a wonderful itinerary. Everything ran smoothly  comfortable vehicle, great hotels, and a driver who was not only professional but also fun and kind. We got to see beautiful places like Dambulla, Nuwara Eliya, and Mirissa, and our guide shared so much knowledge about local culture and history.",
            "rating": 5
        },
        {
            "name": "Suchethani Raneesha",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocJQLHV-aObrQXLM7kJb550bZO_WUT9uQZybazUAeMsTWvZFrQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/113379313926874783339/reviews?hl=en",
            "quote": "Our trip around Sri Lanka with Inspire Tour Company was absolutely amazing! From the moment we landed, everything was perfectly organized. Airport pickup, hotels, daily tours, and even small details. Our driver-guide was friendly, knowledgeable, and always went the extra mile to make sure we were happy. We visited Sigiriya, Kandy, Ella, and Galle. Every stop was unforgettable. The team communicated clearly, responded quickly, and customized the trip to suit us perfectly.",
            "rating": 5
        },
        {
            "name": "Dide Jansen",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocKSm_T3GmzqVrVhGdX0p_eiy1WvbtxFV3L13jLKvCNILfEYKQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/114533832957789123598/reviews?hl=en",
            "quote": "We had Kalum as our driver for almost a week. He was funny, enthusiastic, sweet and had great ideas. He was willing to go on activities with us and took great pictures. His driving felt very save as well. We can’t recommend him enough!!",
            "rating": 5
        },
        {
            "name": "V P STRUCTURES",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocLVL8h-bxA-4MbLdQPRO4Ew8wkKXnbPtsYAUVjzVwxaOR5sbQ=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/117456561933465724196/reviews?hl=en",
            "quote": "Kalum was a Jovial and nice driver and a tour Guide too.Great Experience.",
            "rating": 5
        },
        {
            "name": "sriram ravi",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocK9FTqrxS87INoaIJvGvwVV-vwIoIr8Dmj2DxhK_pYqa1Lx-g=w36-h36-p-rp-mo-br100",
            "profile": "https://www.google.com/maps/contrib/111824307786693493708/reviews?hl=en",
            "quote": "We just completed Sri Lanka tour for around days, it was wonderful experience. Our guide was very patient and supportive throughout the tour",
            "rating": 5
        },
        {
            "name": "Sandra",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocJHAxTcdjolgM4MyfOU1lXa4b6zAV-UYcXdMqsAkZv_9847Pw=w36-h36-p-rp-mo-ba12-br100",
            "profile": "https://www.google.com/maps/contrib/108701737225580144997/reviews?hl=en",
            "quote": "We were incredibly lucky and got the best driver on the island for our three-week vacation – Kalum.\n\nWe were in excellent hands with him. He's a fantastic driver and took great care of us at all times. We immediately welcomed him into our group and had an unforgettable time filled with wonderful and fun memories.\n\nThanks to Kalum, we not only saw the famous highlights but also discovered hidden gems that aren't in any guidebook.",
            "rating": 5,
            "translated": true
        }
    ];

    var ReviewsModule = {
        currentIndex: 0,
        timer: null,
        transitionTimer: null,
        carousel: null,
        card: null,
        isChanging: false,
        isVisible: true,
        userPaused: false,
        delay: 11000,
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

        init: function () {
            this.carousel = document.getElementById('reviews-carousel');
            this.card = document.getElementById('review-card');
            if (!this.carousel || !this.card || this.carousel.dataset.ready === 'true') return;

            this.carousel.dataset.ready = 'true';
            this.cacheElements();
            this.bindControls();
            this.observeVisibility();
            this.render(0, true);
            this.start();
        },

        // Cache the live card fields so each change updates one review together.
        cacheElements: function () {
            this.elements = {
                label: document.getElementById('review-label'),
                stars: document.getElementById('review-stars'),
                quote: document.getElementById('review-quote'),
                avatar: document.getElementById('review-avatar'),
                name: document.getElementById('review-name'),
                date: document.getElementById('review-date'),
                source: document.getElementById('review-source'),
                nextName: document.getElementById('review-next-name'),
                nextLabel: document.getElementById('review-next-label'),
                status: document.getElementById('review-status'),
                toggle: document.getElementById('review-toggle')
            };
            this.elements.avatar.onerror = function () { this.hidden = true; };
        },

        // Keep the existing click, keyboard focus, swipe, and page visibility behavior.
        bindControls: function () {
            var self = this;
            var preview = document.getElementById('review-next-preview');
            var toggle = document.getElementById('review-toggle');

            if (preview) preview.addEventListener('click', function () { self.move(1, true); });
            if (toggle) toggle.addEventListener('click', function () { self.toggleAutoplay(); });

            this.carousel.addEventListener('mouseenter', function () { self.stop(); });
            this.carousel.addEventListener('mouseleave', function () { self.start(); });
            this.carousel.addEventListener('focusin', function () { self.stop(); });
            this.carousel.addEventListener('focusout', function (event) {
                if (!self.carousel.contains(event.relatedTarget)) self.start();
            });

            var startX = 0;
            this.carousel.addEventListener('touchstart', function (event) {
                startX = event.changedTouches[0].clientX;
            }, { passive: true });
            this.carousel.addEventListener('touchend', function (event) {
                var distance = event.changedTouches[0].clientX - startX;
                if (Math.abs(distance) > 55) self.move(distance > 0 ? -1 : 1, true);
            }, { passive: true });

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) self.stop();
                else self.start();
            });
        },

        // Stop the timer when the review card is outside the visible page area.
        observeVisibility: function () {
            if (!('IntersectionObserver' in window)) return;

            var self = this;
            this.observer = new IntersectionObserver(function (entries) {
                self.isVisible = entries[0].isIntersecting;
                if (self.isVisible) self.start();
                else self.stop();
            }, { threshold: 0.18 });
            this.observer.observe(this.carousel);
        },

        // Move through the verified review list and wrap at either end.
        move: function (direction, manual) {
            if (this.isChanging) return;
            this.currentIndex = (this.currentIndex + direction + reviews.length) % reviews.length;
            this.render(direction, false);
            if (manual) this.restart();
        },

        // Update the quote, source link, rating, and preview as one carousel state.
        render: function (direction, immediate) {
            var self = this;
            var update = function () {
                var review = reviews[self.currentIndex];
                var next = reviews[(self.currentIndex + 1) % reviews.length];

                self.elements.label.textContent = review.translated ? 'Google Maps excerpt, translated by Google' : 'Verified Google Maps excerpt';
                self.elements.stars.textContent = '\u2605'.repeat(review.rating);
                self.elements.stars.setAttribute('aria-label', review.rating + ' out of 5 stars');
                self.elements.quote.textContent = '\u201c' + self.getQuoteSnippet(review.quote) + '\u201d';
                self.elements.avatar.hidden = false;
                self.elements.avatar.src = review.image;
                self.elements.avatar.alt = '';
                self.elements.name.textContent = review.name;
                self.elements.date.textContent = 'Verified on Google Maps · 16 November 2026';
                self.elements.source.href = review.profile;
                self.elements.source.setAttribute('aria-label', 'View ' + review.name + ' on Google Maps');
                self.elements.nextName.textContent = next.name;
                self.elements.nextLabel.textContent = next.translated ? 'Google Maps excerpt, translated by Google' : 'Verified Google Maps excerpt';
                self.elements.status.textContent = 'Review ' + (self.currentIndex + 1) + ' of ' + reviews.length;
                self.preloadNext(next.image);
            };

            if (immediate || this.reduceMotion) {
                update();
                return;
            }

            this.isChanging = true;
            this.card.classList.add(direction > 0 ? 'is-leaving-next' : 'is-leaving-prev');

            clearTimeout(this.transitionTimer);
            this.transitionTimer = setTimeout(function () {
                update();
                self.card.className = 'review-card-content relative z-[1] ' + (direction > 0 ? 'is-entering-next' : 'is-entering-prev');

                window.requestAnimationFrame(function () {
                    window.requestAnimationFrame(function () {
                        self.card.className = 'review-card-content relative z-[1]';
                        self.isChanging = false;
                    });
                });
            }, 280);
        },

        // Keep each supplied excerpt intact, including its original wording.
        getQuoteSnippet: function (quote) {
            return (quote || '').trim();
        },

        // Warm the next profile photo before it becomes the active review.
        preloadNext: function (source) {
            var image = new Image();
            image.decoding = 'async';
            image.src = source;
        },

        start: function () {
            if (this.reduceMotion || this.userPaused || document.hidden || !this.isVisible || this.timer) return;

            var self = this;
            this.timer = window.setInterval(function () {
                self.move(1, false);
            }, this.delay);
        },

        stop: function () {
            if (this.timer) {
                window.clearInterval(this.timer);
                this.timer = null;
            }
        },

        restart: function () {
            this.stop();
            this.start();
        },

        toggleAutoplay: function () {
            this.userPaused = !this.userPaused;
            if (this.userPaused) this.stop();
            else this.start();

            if (this.elements.toggle) {
                this.elements.toggle.textContent = this.userPaused ? 'Play' : 'Pause';
                this.elements.toggle.setAttribute('aria-pressed', this.userPaused ? 'true' : 'false');
                this.elements.toggle.setAttribute(
                    'aria-label',
                    this.userPaused ? 'Resume automatic review rotation' : 'Pause automatic review rotation'
                );
            }
        }
    };

    window.ReviewsModule = ReviewsModule;
})();
