// Destinations Module - 2026 Editorial Destination Magazine Renderer
// Author: Dark Net Studio / Worker 2
// Description: Renders deep 2026 editorial travel magazine guides with interactive switcher and direct WhatsApp trip customizer.

(function() {
    'use strict';

    window.DestinationsModule = {
        currentSlug: 'sigiriya',

        init: function() {
            this.parseUrlOrHash();
            this.bindEvents();
            this.renderDestinationBlogPage();
            this.updateSwitcherPills();
            this.initSectionTracking();
        },

        parseUrlOrHash: function() {
            const urlParams = new URLSearchParams(window.location.search);
            let slug = urlParams.get('destination') || urlParams.get('slug');

            if (!slug && window.location.hash) {
                const hash = window.location.hash.replace('#', '').toLowerCase();
                if (window.DestinationsData && window.DestinationsData.destinations && window.DestinationsData.destinations[hash]) {
                    slug = hash;
                }
            }

            if (slug && window.DestinationsData && window.DestinationsData.destinations && window.DestinationsData.destinations[slug.toLowerCase()]) {
                this.currentSlug = slug.toLowerCase();
            } else {
                this.currentSlug = 'sigiriya';
            }
        },

        bindEvents: function() {
            const self = this;
            window.addEventListener('popstate', function() {
                self.parseUrlOrHash();
                self.renderDestinationBlogPage();
                self.updateSwitcherPills();
            });
            window.addEventListener('hashchange', function() {
                if (window.location.hash) {
                    const hash = window.location.hash.replace('#', '').toLowerCase();
                    if (window.DestinationsData && window.DestinationsData.destinations && window.DestinationsData.destinations[hash] && hash !== self.currentSlug) {
                        self.switchDestination(hash);
                    }
                }
            });
        },

        initSectionTracking: function() {
            const sectionIds = ['overview', 'experiences', 'itinerary', 'cuisine', 'tips', 'inquire'];
            const sections = sectionIds.map(function(id) {
                return document.getElementById(id);
            }).filter(Boolean);
            const self = this;

            if (!sections.length || !('IntersectionObserver' in window)) {
                this.setActiveSection('overview');
                return;
            }

            this.sectionObserver = new IntersectionObserver(function(entries) {
                const visibleEntry = entries
                    .filter(function(entry) {
                        return entry.isIntersecting;
                    })
                    .sort(function(a, b) {
                        return b.intersectionRatio - a.intersectionRatio;
                    })[0];

                if (visibleEntry) {
                    self.setActiveSection(visibleEntry.target.id);
                }
            }, {
                rootMargin: '-22% 0px -62% 0px',
                threshold: [0, 0.1, 0.25]
            });

            sections.forEach(function(section) {
                self.sectionObserver.observe(section);
            });

            this.setActiveSection('overview');
        },

        setActiveSection: function(sectionId) {
            const links = document.querySelectorAll('[data-destination-toc]');

            links.forEach(function(link) {
                const isActive = link.getAttribute('data-destination-toc') === sectionId;
                link.classList.toggle('is-active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },

        switchDestination: function(slug) {
            if (!slug || !window.DestinationsData || !window.DestinationsData.destinations || !window.DestinationsData.destinations[slug]) return;
            this.currentSlug = slug;

            const mainContent = document.getElementById('destination-article-main');
            if (mainContent) {
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(15px)';
                mainContent.style.transition = 'all 300ms ease-out';
            }

            const self = this;
            setTimeout(function() {
                self.renderDestinationBlogPage();
                self.updateSwitcherPills();
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }
                const heroEl = document.getElementById('dest-hero');
                if (heroEl) {
                    heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 250);

            if (history.pushState) {
                const newUrl = window.location.pathname + '?destination=' + slug;
                history.pushState(null, null, newUrl);
            } else {
                window.location.hash = '#' + slug;
            }
        },

        updateSwitcherPills: function() {
            const tabsContainer = document.getElementById('dest-tabs-container');
            if (tabsContainer && window.DestinationsData && window.DestinationsData.destinations) {
                const list = Object.keys(window.DestinationsData.destinations);
                const self = this;
                tabsContainer.innerHTML = list.map(function(s) {
                    const d = window.DestinationsData.destinations[s];
                    const isActive = s === self.currentSlug;
                    const btnClass = isActive
                        ? 'dest-pill-btn active-pill flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 transition-all duration-300 border border-emerald-400/40 cursor-pointer whitespace-nowrap'
                        : 'dest-pill-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/70 backdrop-blur-md text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 border border-slate-200/80 shadow-sm cursor-pointer whitespace-nowrap';
                    return '<button class="' + btnClass + '" data-dest-slug="' + d.slug + '" onclick="window.DestinationsModule.switchDestination(\'' + d.slug + '\')">' + d.name + '</button>';
                }).join('');
            }
        },

        renderDestinationBlogPage: function() {
            const data = window.DestinationsData && window.DestinationsData.destinations ? window.DestinationsData.destinations[this.currentSlug] : null;
            if (!data) return;

            const isSubfolder = window.location.pathname.includes('/destinations/');
            const pathPrefix = isSubfolder ? '../' : '';

            // Document Title
            document.title = data.name + ' Travel Guide & Official Magazine | Inspire Travels & Tours';

            // Hero Image
            const heroBg = document.getElementById('dest-hero-bg-img');
            if (heroBg && data.heroImage) {
                const imgPath = data.heroImage.startsWith('assets/') ? pathPrefix + data.heroImage : data.heroImage;
                heroBg.src = imgPath;
                heroBg.alt = data.name + ' Hero View';
            }

            // Core Header Information
            const titleEl = document.getElementById('dest-title');
            if (titleEl) titleEl.textContent = data.name;

            const taglineEl = document.getElementById('dest-tagline');
            if (taglineEl) taglineEl.textContent = data.tagline;

            const readTimeEl = document.getElementById('dest-readtime');
            if (readTimeEl) readTimeEl.textContent = data.readTime || '6 Min Read';

            const coordsEl = document.getElementById('dest-coords');
            if (coordsEl) coordsEl.textContent = '[ ' + (data.coordinates || '07.8731 N') + ' // ELEV ' + (data.elevation || '0m') + ' ]';

            const excerptEl = document.getElementById('dest-excerpt');
            if (excerptEl) excerptEl.textContent = data.excerpt;

            // Dashboard Specs Bar
            const seasonEl = document.getElementById('dest-spec-season');
            if (seasonEl) seasonEl.innerHTML = '<i data-lucide="sun" class="w-5 h-5"></i> ' + data.bestSeason;

            const durationEl = document.getElementById('dest-spec-duration');
            if (durationEl) durationEl.innerHTML = '<i data-lucide="clock" class="w-5 h-5"></i> ' + data.idealDuration;

            const vibeEl = document.getElementById('dest-spec-vibe');
            if (vibeEl) vibeEl.innerHTML = '<i data-lucide="compass" class="w-5 h-5"></i> ' + data.vibe;

            const elevEl = document.getElementById('dest-spec-elevation');
            if (elevEl) elevEl.innerHTML = '<i data-lucide="mountain" class="w-5 h-5 text-emerald-400"></i> ' + data.elevation;

            // Article Content
            const art = data.article || {};

            const introTitleEl = document.getElementById('dest-intro-title');
            if (introTitleEl) introTitleEl.textContent = art.introTitle || ('Discovering ' + data.name);

            const introTextContainer = document.getElementById('dest-intro-text');
            if (introTextContainer && art.introParagraphs) {
                introTextContainer.innerHTML = art.introParagraphs.map(function(p, idx) {
                    if (idx === 0) {
                        return '<p class="text-slate-700 text-lg sm:text-xl leading-relaxed mb-5 first-letter:text-5xl first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-emerald-700 font-serif">' + p + '</p>';
                    }
                    return '<p class="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">' + p + '</p>';
                }).join('');
            }

            const historyTitleEl = document.getElementById('dest-history-title');
            if (historyTitleEl) historyTitleEl.textContent = art.historyTitle || 'History & Cultural Heritage';

            const historyTextContainer = document.getElementById('dest-history-text');
            if (historyTextContainer && art.historyParagraphs) {
                historyTextContainer.innerHTML = art.historyParagraphs.map(function(p) {
                    return '<p class="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">' + p + '</p>';
                }).join('');
            }

            const tipsTitleEl = document.getElementById('dest-tips-title');
            if (tipsTitleEl) tipsTitleEl.textContent = art.tipsTitle || ('Insider Travel Tips for ' + data.name);

            const tipsListContainer = document.getElementById('dest-tips-list');
            if (tipsListContainer && art.tips) {
                tipsListContainer.innerHTML = art.tips.map(function(tip, index) {
                    const numStr = index < 9 ? '0' + (index + 1) : '' + (index + 1);
                    return '' +
                        '<li class="destination-tip-item">' +
                        '  <span class="destination-tip-number">' + numStr + '</span>' +
                        '  <span>' + tip + '</span>' +
                        '</li>';
                }).join('');
            }

            // Food & Cuisine Section
            const foodTitleEl = document.getElementById('dest-food-title');
            if (foodTitleEl) foodTitleEl.textContent = art.foodTitle || ('Local Cuisine & Culinary Highlights in ' + data.name);

            const foodTextEl = document.getElementById('dest-food-text');
            if (foodTextEl) foodTextEl.textContent = art.foodParagraph || 'Enjoy delicious authentic local dishes prepared in surrounding traditional eateries.';

            const foodDishesContainer = document.getElementById('dest-food-dishes');
            if (foodDishesContainer && art.foodDishes) {
                foodDishesContainer.innerHTML = art.foodDishes.map(function(dish) {
                    const dishName = typeof dish === 'string' ? dish : dish.name;
                    const dishDesc = typeof dish === 'object' && dish.description ? dish.description : '';
                    return '' +
                        '<article class="destination-food-item">' +
                        '  <h4 class="destination-food-title text-lg text-slate-950">' + dishName + '</h4>' +
                        (dishDesc ? '  <p class="destination-food-description">' + dishDesc + '</p>' : '') +
                        '</article>';
                }).join('');
            }

            // Activities Grid
            const activitiesContainer = document.getElementById('dest-activities-container');
            if (activitiesContainer && data.activities) {
                activitiesContainer.innerHTML = data.activities.map(function(act, index) {
                    const imgPath = act.image.startsWith('assets/') ? pathPrefix + act.image : act.image;
                    const numStr = index < 9 ? '0' + (index + 1) : '' + (index + 1);
                    return '' +
                        '<article class="destination-activity group">' +
                        '  <div class="destination-activity-copy">' +
                        '    <span class="destination-activity-number">' + numStr + '</span>' +
                        '    <div>' +
                        '      <h4 class="destination-activity-title text-2xl leading-tight text-slate-950 sm:text-3xl">' + act.title + '</h4>' +
                        '      <p class="destination-activity-description">' + act.description + '</p>' +
                        '      <span class="destination-activity-meta"><i data-lucide="' + (act.icon || 'star') + '" class="h-4 w-4"></i> ' + (act.category || 'Highlight') + '</span>' +
                        '    </div>' +
                        '  </div>' +
                        '  <div class="overflow-hidden">' +
                        '    <img src="' + imgPath + '" alt="' + act.title + '" class="destination-activity-image" loading="lazy">' +
                        '  </div>' +
                        '</article>';
                }).join('');
            }

            // Itinerary Timeline Preview
            const itineraryContainer = document.getElementById('dest-itinerary-container');
            if (itineraryContainer && data.itinerary) {
                itineraryContainer.innerHTML = data.itinerary.map(function(item) {
                    return '' +
                        '<article class="destination-itinerary-item">' +
                        '  <span class="destination-itinerary-day">' + item.day + '</span>' +
                        '  <div>' +
                        '    <h4 class="destination-itinerary-title text-2xl leading-tight text-slate-950">' + item.title + '</h4>' +
                        '    <p class="destination-itinerary-description">' + item.description + '</p>' +
                        '  </div>' +
                        '</article>';
                }).join('');
            }

            // WhatsApp Direct Inquiry Button
            const whatsappBtn = document.getElementById('dest-whatsapp-btn');
            if (whatsappBtn) {
                const message = encodeURIComponent(
                    '*Destination Travel Inquiry - ' + data.name + '*\n\n' +
                    'Hi Inspire Travels & Tours!\n' +
                    'I read your 2026 travel magazine guide for *' + data.name + '*.\n' +
                    'Could you please share custom tour itinerary options, driver availability, and tailored pricing for ' + data.name + '?\n\nThank you!'
                );
                whatsappBtn.href = 'https://api.whatsapp.com/send?phone=94785959333&text=' + message;
            }

            // Re-initialize Lucide Icons & Refresh AOS
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
    };
})();
