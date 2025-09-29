// Reviews Module - Manages reviews carousel
// Author: Zig Zag AI
// Description: Handles the reviews carousel functionality and auto-advance features

(function() {
    'use strict';

    window.ReviewsModule = {
        currentReviewIndex: 0,
        reviewCarousel: null,
        reviewPrevBtn: null,
        reviewNextBtn: null,
        reviewIndicators: null,

        // Review data
        reviewData: [
            {
                name: "Sarah & Mike Johnson",
                country: "Australia",
                date: "March 2024",
                tour: "Cultural Heritage Tour",
                rating: 5,
                review: "Absolutely incredible experience! Our guide Rajesh was phenomenal - so knowledgeable about Sri Lankan history and culture. The temples were breathtaking, and the local food experiences were unforgettable. This trip exceeded all our expectations.",
                highlights: ["Expert Guide", "Cultural Immersion", "Amazing Food"]
            },
            {
                name: "Hans Mueller",
                country: "Germany",
                date: "February 2024",
                tour: "Wildlife Safari Adventure",
                rating: 5,
                review: "The wildlife safari was a dream come true! We saw elephants, leopards, and countless bird species. The accommodations were excellent, and the entire team was professional and caring. Highly recommend Inspire Travels!",
                highlights: ["Wildlife Viewing", "Professional Service", "Great Accommodations"]
            },
            {
                name: "Emma Thompson",
                country: "Canada",
                date: "December 2023",
                tour: "Hill Country Tea Experience",
                rating: 5,
                review: "The tea plantation tour was absolutely stunning! The train journey through the mountains was like something from a movie. Our guide was fantastic and the tea tasting was educational and delicious.",
                highlights: ["Scenic Train Journey", "Tea Tasting", "Mountain Views"]
            },
            {
                name: "Carlos Rodriguez",
                country: "Spain",
                date: "November 2023",
                tour: "Adventure Trekking Tour",
                rating: 5,
                review: "Amazing trekking experience! The waterfalls were spectacular and the hiking trails offered incredible views. The team ensured our safety while pushing us to see the most beautiful spots in Sri Lanka.",
                highlights: ["Spectacular Waterfalls", "Safety First", "Beautiful Trails"]
            },
            {
                name: "Priya & Raj Patel",
                country: "United Kingdom",
                date: "January 2024",
                tour: "Complete Sri Lanka Discovery",
                rating: 5,
                review: "Our 12-day journey through Sri Lanka was perfectly organized. From the ancient cities to the tea plantations and beautiful beaches, every moment was magical. The small group size made it feel very personal.",
                highlights: ["Perfect Organization", "Diverse Experiences", "Small Groups"]
            },
            {
                name: "Lisa & David Chen",
                country: "Singapore",
                date: "October 2023",
                tour: "Beach Paradise Tour",
                rating: 5,
                review: "Perfect beach getaway! The coastal towns were charming, whale watching was incredible, and the seafood was fresh and delicious. Great balance of relaxation and adventure.",
                highlights: ["Whale Watching", "Fresh Seafood", "Charming Towns"]
            }
        ],

        init: function() {
            this.reviewCarousel = document.getElementById('review-carousel');
            this.reviewPrevBtn = document.getElementById('review-prev');
            this.reviewNextBtn = document.getElementById('review-next');
            this.reviewIndicators = document.querySelectorAll('.review-indicator');

            this.initReviewNavigation();
            this.initAutoAdvance();
        },

        updateReviewCarousel: function() {
            const review = this.reviewData[this.currentReviewIndex];
            if (this.reviewCarousel && review) {
                // Update carousel content would go here
                // For now, we'll just update the indicators
                this.updateReviewIndicators();
            }
        },

        updateReviewIndicators: function() {
            if (this.reviewIndicators) {
                this.reviewIndicators.forEach((indicator, index) => {
                    if (index === this.currentReviewIndex) {
                        indicator.classList.add('bg-primary', 'scale-125');
                        indicator.classList.remove('bg-primary/30');
                    } else {
                        indicator.classList.remove('bg-primary', 'scale-125');
                        indicator.classList.add('bg-primary/30');
                    }
                });
            }
        },

        // Review navigation
        initReviewNavigation: function() {
            if (this.reviewPrevBtn) {
                this.reviewPrevBtn.addEventListener('click', () => {
                    this.currentReviewIndex = (this.currentReviewIndex - 1 + this.reviewData.length) % this.reviewData.length;
                    this.updateReviewCarousel();
                });
            }

            if (this.reviewNextBtn) {
                this.reviewNextBtn.addEventListener('click', () => {
                    this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviewData.length;
                    this.updateReviewCarousel();
                });
            }

            // Review indicator clicks
            if (this.reviewIndicators) {
                this.reviewIndicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        this.currentReviewIndex = index;
                        this.updateReviewCarousel();
                    });
                });
            }
        },

        // Auto-advance reviews
        initAutoAdvance: function() {
            setInterval(() => {
                this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviewData.length;
                this.updateReviewCarousel();
            }, 8000);
        }
    };
})();
