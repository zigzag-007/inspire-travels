// Traveler reviews
// Shows one story at a time and keeps the page calm.

(function () {
    'use strict';

    var reviews = [
        {
                "name": "Sarah & Mike Johnson",
                "image": "https://tevily-html.vercel.app/assets/images/testimonial/testimonial-one-img-3.png",
                "country": "Australia",
                "date": "March 2024",
                "tour": "Cultural Heritage Tour",
                "quote": "Absolutely incredible experience! Our guide Kalum was phenomenal - so knowledgeable about Sri Lankan history and culture. The temples were breathtaking, and the local food experiences were unforgettable.",
                "rating": 5
        },
        {
                "name": "Hans Mueller",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjXSN2lO4-2d3uEldFvhZ86d2AbsiUaMw3ee0dopnvNHUKFTf6sh=w54-h54-p-rp-mo-ba4-br100",
                "country": "Germany",
                "date": "February 2024",
                "tour": "Wildlife Safari Adventure",
                "quote": "The wildlife safari was a dream come true! We saw elephants, leopards, and countless bird species. The accommodations were excellent, and the entire team was professional and caring.",
                "rating": 5
        },
        {
                "name": "Priya & Raj Patel",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocIQHi3clwfkgjkA_Qjv02HjgJvH0YHP_3moxTZo2gvqM1JOuyg=w54-h54-p-rp-mo-br100",
                "country": "United Kingdom",
                "date": "January 2024",
                "tour": "Complete Sri Lanka Discovery",
                "quote": "Our 12-day journey through Sri Lanka was perfectly organized. From the ancient cities to the tea plantations and beaches, every moment was magical. The small group size made it feel very personal.",
                "rating": 5
        },
        {
                "name": "Emma Thompson",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjU2yLNWorl9PgyTnovRbD0pnMD076avlqvkvQZ3vGB6k4GIMft7=w54-h54-p-rp-mo-br100",
                "country": "Canada",
                "date": "December 2021",
                "tour": "Hill Country Tea Experience",
                "quote": "The tea plantation tour was stunning! The train journey through the mountains was like something from a movie. The tea tasting was educational and delicious.",
                "rating": 5
        },
        {
                "name": "Carlos Rodriguez",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjXzJHfWgB5u1rj8EQiwGhEJt1DlBhd3AdMpjToPupNsr-TvuT0=w54-h54-p-rp-mo-br100",
                "country": "Spain",
                "date": "November 2023",
                "tour": "Adventure Trekking Tour",
                "quote": "Amazing trekking! The waterfalls were spectacular and the trails offered incredible views. The team ensured our safety while pushing us to see hidden gems.",
                "rating": 5
        },
        {
                "name": "Lisa & David Chen",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjXP-SwJsCLFr85GSo6DHcndM7xT_tH7ioKQQDGeFf5HPfXpyTCt=w54-h54-p-rp-mo-br100",
                "country": "Singapore",
                "date": "October 2023",
                "tour": "Beach Paradise Tour",
                "quote": "Perfect beach getaway! The coastal towns were charming, whale watching was incredible, and the seafood was fresh and delicious. Great balance of relaxation and adventure.",
                "rating": 5
        },
        {
                "name": "Nadia Kaur",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjU5wTiSpVF0bgn-EH7uep-eRHZgcOYz5wqL7T736xM35-d-BOmEGQ=w54-h54-p-rp-mo-ba4-br100",
                "country": "India",
                "date": "September 2025",
                "tour": "Cultural Food Journey",
                "quote": "A delightful experience! The cooking class and spice garden tour were highlights of my trip. I learned so much about Sri Lankan cuisine and culture, and everything tasted divine.",
                "rating": 5
        },
        {
                "name": "Oliver Brown",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjWdI34ScBZOvB42i-XhpAoOYOTvk8CWYcHjPWw1b_u0AAS1Esc=w54-h54-p-rp-mo-br100",
                "country": "United States",
                "date": "August 2023",
                "tour": "Adventure & Wildlife Tour",
                "quote": "The adventure and wildlife combination was perfect! Kayaking through mangroves and then spotting wild elephants on safari was unforgettable. I would book again without hesitation.",
                "rating": 4
        },
        {
                "name": "Amara Silva",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjXaJkmJ7-qtXMiSfsevllGbK1eLhZz5SwAMFKD09r_Zfl5h15s=w54-h54-p-rp-mo-br100",
                "country": "Brazil",
                "date": "July 2023",
                "tour": "Family Vacation Package",
                "quote": "A truly magical family vacation! The team planned everything perfectly for our group of six. From kid-friendly activities to relaxing beach days, every detail was handled with care.",
                "rating": 5
        },
        {
                "name": "Sathya narayanan TG",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjUb1KPt_4mJ4BZopKJFuwWPzA4z4Nh827TGK-UACdwp6_Nk5Jk=w54-h54-p-rp-mo-br100",
                "country": "India",
                "date": "April 2024",
                "tour": "Customized Sri Lanka Tour",
                "quote": "We did our Sri Lanka trip through Mr.Kalum. He was excellent with his driving and was patient enough to wait and take us to all places we wanted. Excellent service provided.",
                "rating": 5
        },
        {
                "name": "Mukesh Rathod",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjWrX-PihWQx0oD1N9XCY3UN-AFMfsRpOw-zonZyljm8Kays4fPd=w54-h54-p-rp-mo-br100",
                "country": "India",
                "date": "May 2024",
                "tour": "Comprehensive Sri Lanka Tour",
                "quote": "We just completed Sri Lanka tour for around days, it was wonderful experience. Our guide was very patient and supportive throughout the tour",
                "rating": 5
        },
        {
                "name": "Shailesh Kedari",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjUcBX-9LaSc-yQkON4lm4E1c2YtjYB43dPY29S9XxJWqga3W2Mf=w54-h54-p-rp-mo-br100",
                "country": "United States",
                "date": "June 2024",
                "tour": "Adventure & Photography Tour",
                "quote": "We had Kalum as our driver for almost a week. He was funny, enthusiastic, sweet and had great ideas. He was willing to go on activities with us and took great pictures. His driving felt very save as well. We can't recommend him enough!!",
                "rating": 5
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

        cacheElements: function () {
            this.elements = {
                tour: document.getElementById('review-tour'),
                stars: document.getElementById('review-stars'),
                quote: document.getElementById('review-quote'),
                avatar: document.getElementById('review-avatar'),
                name: document.getElementById('review-name'),
                country: document.getElementById('review-country'),
                date: document.getElementById('review-date'),
                nextName: document.getElementById('review-next-name'),
                nextTour: document.getElementById('review-next-tour'),
                status: document.getElementById('review-status'),
                toggle: document.getElementById('review-toggle')
            };
        },

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

        move: function (direction, manual) {
            if (this.isChanging) return;
            this.currentIndex = (this.currentIndex + direction + reviews.length) % reviews.length;
            this.render(direction, false);
            if (manual) this.restart();
        },

        render: function (direction, immediate) {
            var self = this;
            var update = function () {
                var review = reviews[self.currentIndex];
                var next = reviews[(self.currentIndex + 1) % reviews.length];

                self.elements.tour.textContent = review.tour;
                self.elements.stars.textContent = '\u2605'.repeat(review.rating);
                self.elements.stars.setAttribute('aria-label', review.rating + ' out of 5 stars');
                self.elements.quote.textContent = '\u201c' + self.getQuoteSnippet(review.quote) + '\u201d';
                self.elements.avatar.src = review.image;
                self.elements.avatar.alt = '';
                self.elements.name.textContent = review.name;
                self.elements.country.textContent = review.country;
                self.elements.date.textContent = review.date;
                self.elements.nextName.textContent = next.name;
                self.elements.nextTour.textContent = next.tour;
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

        getQuoteSnippet: function (quote) {
            var sentences = quote.match(/[^.!?]+[.!?]+/g) || [quote];
            var snippet = sentences[0].trim();

            if (sentences[1] && (snippet.length + sentences[1].length) <= 155) {
                snippet += sentences[1];
            }

            return snippet;
        },

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
