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

                self.elements.label.textContent = 'Verified Google Maps excerpt';
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
                self.elements.nextLabel.textContent = 'Verified Google Maps excerpt';
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
