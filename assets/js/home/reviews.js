// Traveler reviews
// Shows one story at a time and keeps the page calm.

(function () {
    'use strict';

    var reviews = [
        {
                "name": "Vivaan Shenoy",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjVyxKBvTCsy0WikxD4S4dBs6BbhQ3vLTrTyNpzLI7ZhRfGRalCahg=w80-h80-p-rp-mo-ba12-br100",
                "country": "Family Holiday",
                "date": "July 2026",
                "tour": "Bespoke Cultural Route",
                "quote": "Very pleasant trip with a very friendly and knowledgeable guide - Lakshan. He was very helpful and kind and always on time, which made the stay in Sri Lanka very peaceful and enjoyable.",
                "rating": 5
        },
        {
                "name": "Zeeshan Ahmed",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjVIwW-h7Up-Nq3sdjpVFmPogn1E9Fnshk9eGLm1biReyDsOO1g=w80-h80-p-rp-mo-br100",
                "country": "Family Booking",
                "date": "July 2026",
                "tour": "Private Guided Vacation",
                "quote": "If I could give more than 5 stars I would. I had booked this trip for my mother as I was not able to make it. The driver Kalum was the kindest and sweetest soul who took care of everything and handled it all very neatly. Would recommend this tour group to everyone!",
                "rating": 5
        },
        {
                "name": "Mandars Backup",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjVwLyZv9zq6BaJALWcLRdlKqW9jI6zn1-dzkq6PmPbN2CpmZHH-Zg=w80-h80-p-rp-mo-br100",
                "country": "United States",
                "date": "June 2026",
                "tour": "Tailored Island Vacation",
                "quote": "If you're visiting Sri Lanka, having Kalum as your driver will make your trip so much better. From day one, he was professional, patient, and incredibly easy to communicate with. He knows amazing hidden spots and his food recommendations were outstanding. He even surprised us with a thoughtful goodbye gift at the end of our journey.",
                "rating": 5
        },
        {
                "name": "Hans Mueller",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjXSN2lO4-2d3uEldFvhZ86d2AbsiUaMw3ee0dopnvNHUKFTf6sh=w80-h80-p-rp-mo-ba4-br100",
                "country": "Germany",
                "date": "February 2026",
                "tour": "Wildlife Safari Adventure",
                "quote": "The wildlife safari was a dream come true! We saw elephants, leopards, and countless bird species. The accommodations were excellent, and the entire team was professional and caring.",
                "rating": 5
        },
        {
                "name": "Daniya Tariq",
                "image": "https://lh3.googleusercontent.com/a-/ALV-UjWzQ4hjUU_FSHX_f4nb4w_JZo8nhQYGOfQQNfzVCPaQFhWy1obi=w80-h80-p-rp-mo-br100",
                "country": "Solo Travelers",
                "date": "July 2026",
                "tour": "Private Island Journey",
                "quote": "I highly recommend Inspire Travels for making travel easy, affordable, secure, and professional. Finding them on Instagram was a stroke of luck for our trip. As two females traveling alone, we had many concerns, but they answered all our queries, expertly guided us, and provided daily follow-ups throughout our time in Sri Lanka. I strongly recommend their services, especially for solo female travelers, families and groups.",
                "rating": 5
        },
        {
                "name": "Mohit Malhotra",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocKiHc9Pcrna3EEf8ETWUgErD5Q6WkFdPMyCKAVUH7760gIg9w=w80-h80-p-rp-mo-br100",
                "country": "Family Journey",
                "date": "July 2026",
                "tour": "9-Day Island-Wide Tour",
                "quote": "This was our first trip to Sri Lanka with my family, and we were looking for someone who could be our driver and guide for the entire 9-day journey. We were fortunate to find him! He took us all across Sri Lanka, took exceptional care of us, and treated us like family rather than tourists. He guided us at every step, recommended the best places to visit, and made sure we were comfortable throughout the trip. Very affordable packages, excellent vehicles, and an incredibly comfortable experience!",
                "rating": 5
        },
        {
                "name": "Sandra",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocJHAxTcdjolgM4MyfOU1lXa4b6zAV-UYcXdMqsAkZv_9847Pw=w80-h80-p-rp-mo-ba12-br100",
                "country": "Germany",
                "date": "January 2026",
                "tour": "3-Week Island Expedition",
                "quote": "We were incredibly lucky and got the best driver on the island for our three-week vacation - Kalum. We were in excellent hands with him. He's a fantastic driver and took great care of us at all times. Thanks to Kalum, we not only saw the famous highlights but also discovered hidden gems that aren't in any guidebook. If you're looking for someone to show you the heart and soul of Sri Lanka - he's the perfect choice.",
                "rating": 5
        },
        {
                "name": "Manish Kundu",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocK2WsPucXp5BDBKvZpevbnxn_RDaOpsQPPMoO4xJqmEApY5QWzq=w80-h80-p-rp-mo-ba12-br100",
                "country": "India",
                "date": "May 2026",
                "tour": "8-Day Explorer Route",
                "quote": "One of the most memorable trips: Spent 8 days exploring Sri Lanka with Kalum and couldn't have asked for a better experience. He is an outstanding host - super friendly, very knowledgeable, and always went the extra mile to make our trip special. The car was always spotless, and his recommendations through Colombo, Mirissa, Hikkaduwa, and Ella were spot on. 10/10 would recommend!",
                "rating": 5
        },
        {
                "name": "Vic Naathen",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocJVnGV9zlFhL-ZDoandBCvoMAkFi1V4tLvIZMxe-KmJMzw3PQ=w80-h80-p-rp-mo-br100",
                "country": "United Kingdom",
                "date": "July 2026",
                "tour": "9-Day Classic Route",
                "quote": "Just finished a 9 day trip around Sri Lanka. Inspire Travels were very helpful and responsive. Our driver Thusitha was fantastic! Accommodating, courteous, reliable and very safe driver. I would recommend to anyone visiting Sri Lanka.",
                "rating": 5
        },
        {
                "name": "Dide Jansen",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocKSm_T3GmzqVrVhGdX0p_eiy1WvbtxFV3L13jLKvCNILfEYKQ=w80-h80-p-rp-mo-br100",
                "country": "Netherlands",
                "date": "January 2026",
                "tour": "Highland & Coast Discovery",
                "quote": "We had Kalum as our driver for almost a week. He was funny, enthusiastic, sweet and had great ideas. He was willing to go on activities with us and took great pictures. His driving felt very safe as well. We can't recommend him enough!!",
                "rating": 5
        },
        {
                "name": "Rakshith Srujan",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocLYe7kFbHalcgf_9ehorpfwJuDrbbg2k8BnoqhCtTyAA1M6JQ=w80-h80-p-rp-mo-br100",
                "country": "India",
                "date": "July 2026",
                "tour": "Private Island Excursion",
                "quote": "Their service was very good. Our driver Lakshan was very kind and helpful throughout the journey. We really enjoyed Sri Lanka because of him.",
                "rating": 5
        },
        {
                "name": "Sarah & Mike Johnson",
                "image": "https://tevily-html.vercel.app/assets/images/testimonial/testimonial-one-img-3.png",
                "country": "Australia",
                "date": "March 2026",
                "tour": "Cultural Heritage Tour",
                "quote": "Absolutely incredible experience! Our guide Kalum was phenomenal - so knowledgeable about Sri Lankan history and culture. The temples were breathtaking, and the local food experiences were unforgettable.",
                "rating": 5
        },
        {
                "name": "Priya & Raj Patel",
                "image": "https://lh3.googleusercontent.com/a/ACg8ocIQHi3clwfkgjkA_Qjv02HjgJvH0YHP_3moxTZo2gvqM1JOuyg=w80-h80-p-rp-mo-br100",
                "country": "United Kingdom",
                "date": "January 2026",
                "tour": "Complete Sri Lanka Discovery",
                "quote": "Our 12-day journey through Sri Lanka was perfectly organized. From the ancient cities to the tea plantations and beaches, every moment was magical. The small group size made it feel very personal.",
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
