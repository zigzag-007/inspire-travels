// Shared Site Shell Module
// Keeps the secondary page header, mobile menu, and footer in one place.

(function () {
    'use strict';

    function pathTo(path) {
        return (document.body.dataset.navBase || '') + path;
    }

    function renderDesktopMenu(key, label) {
        return '<div class="desktop-nav-menu" data-desktop-menu="' + key + '">' +
            '<a href="' + pathTo(key === 'gallery' ? 'gallery.html' : 'index.html#' + key) + '" class="nav-link desktop-nav-trigger" aria-haspopup="true">' +
                label + ' <i class="ph ph-caret-down desktop-nav-chevron"></i>' +
            '</a>' +
            '<div class="desktop-nav-dropdown" data-nav-panel aria-label="' + label + ' submenu"></div>' +
        '</div>';
    }

    function renderHeader() {
        return '<nav id="navbar" class="secondary-site-header" aria-label="Primary navigation">' +
            '<div id="scroll-progress" aria-hidden="true"></div>' +
            '<div class="secondary-header-inner">' +
                '<a href="' + pathTo('index.html#home') + '" class="secondary-brand" aria-label="Inspire Travels home">' +
                    '<img src="' + pathTo('assets/img/logo.png') + '" alt="Inspire Travels & Tours" class="nav-logo">' +
                '</a>' +
                '<div class="desktop-primary-nav">' +
                    '<a href="' + pathTo('index.html#home') + '" class="nav-link">Home</a>' +
                    renderDesktopMenu('tours', 'Tours') +
                    renderDesktopMenu('destinations', 'Destinations') +
                    '<a href="' + pathTo('index.html#about') + '" class="nav-link">About</a>' +
                    renderDesktopMenu('gallery', 'Gallery') +
                    '<a href="' + pathTo('index.html#reviews') + '" class="nav-link">Reviews</a>' +
                '</div>' +
                '<div class="secondary-header-actions">' +
                    '<a href="#footer" class="secondary-contact-action">Contact Now</a>' +
                    '<button type="button" id="mobile-menu-btn" aria-label="Open mobile menu" aria-expanded="false" title="Open navigation menu">' +
                        '<span class="secondary-menu-trigger-glyph" aria-hidden="true"><span></span><span></span></span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</nav>';
    }

    function renderMobileMenu() {
        return '<div id="mobile-menu" class="mobile-menu -translate-x-full" aria-hidden="true">' +
            '<div class="secondary-mobile-menu-inner">' +
                '<div class="secondary-mobile-menu-header">' +
                    '<a href="' + pathTo('index.html#home') + '" class="secondary-mobile-brand">' +
                        '<img src="' + pathTo('assets/img/logo.png') + '" alt="Inspire Travels">' +
                        '<span class="secondary-mobile-brand-copy"><strong>Inspire Travels</strong><small>Sri Lanka · Private travel</small></span>' +
                    '</a>' +
                    '<button type="button" id="mobile-menu-close" aria-label="Close mobile menu" title="Close navigation menu"><i class="ph ph-x"></i></button>' +
                '</div>' +
                '<div class="secondary-mobile-menu-intro">' +
                    '<span><i class="ph ph-compass-rose"></i> Island navigation</span>' +
                    '<p>Small island.<br><em>Remarkable journeys.</em></p>' +
                '</div>' +
                '<div class="secondary-mobile-links">' +
                    '<a href="' + pathTo('index.html#home') + '" class="mobile-nav-link" data-section="home"><span class="secondary-mobile-nav-index">01</span><span class="secondary-mobile-nav-icon"><i class="ph ph-house"></i></span><span class="secondary-mobile-nav-label">Home</span><i class="ph ph-arrow-up-right secondary-mobile-nav-arrow"></i></a>' +
                    '<div data-mobile-menu="tours"></div>' +
                    '<div data-mobile-menu="destinations"></div>' +
                    '<a href="' + pathTo('index.html#about') + '" class="mobile-nav-link" data-section="about"><span class="secondary-mobile-nav-index">04</span><span class="secondary-mobile-nav-icon"><i class="ph ph-users-three"></i></span><span class="secondary-mobile-nav-label">About</span><i class="ph ph-arrow-up-right secondary-mobile-nav-arrow"></i></a>' +
                    '<div data-mobile-menu="gallery"></div>' +
                    '<a href="' + pathTo('index.html#reviews') + '" class="mobile-nav-link" data-section="reviews"><span class="secondary-mobile-nav-index">06</span><span class="secondary-mobile-nav-icon"><i class="ph ph-star"></i></span><span class="secondary-mobile-nav-label">Reviews</span><i class="ph ph-arrow-up-right secondary-mobile-nav-arrow"></i></a>' +
                '</div>' +
                '<div class="secondary-mobile-socials">' +
                    '<span>Follow our island journal</span>' +
                    '<div>' +
                        '<a href="https://www.facebook.com/share/1CUqzA7tAu/?mibextid=wwXIfr" target="_blank" rel="noopener" aria-label="Facebook"><i class="ph ph-facebook-logo"></i></a>' +
                        '<a href="https://www.instagram.com/inspiretravels_tours" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a>' +
                        '<a href="https://www.linkedin.com/in/inspire-travel-and-tours-a02371416?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>' +
                        '<a href="https://youtube.com/@InspireTravelandTours" target="_blank" rel="noopener" aria-label="YouTube"><i class="ph ph-youtube-logo"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div id="blur-overlay" class="hidden opacity-0" aria-hidden="true"></div>';
    }

    function renderContact(icon, title, text, href, label, external) {
        return '<div class="single-info-item">' +
            '<div class="flex items-center gap-4">' +
                '<a href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : '') + ' class="footer-contact-icon" aria-label="' + label + '"><span class="liquid-glass w-12 h-12 rounded-xl flex items-center justify-center"><i class="ph ph-' + icon + ' text-2xl text-white"></i></span></a>' +
                '<div class="info"><span class="title text-lg font-bold mb-2 block">' + title + '</span><p><a href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + text + '</a></p></div>' +
            '</div>' +
        '</div>';
    }

        var sliderPhotos = [
        {
                "src": "assets/img/footer-gallery/sunset-group-photo.jpg",
                "title": "Sunset Group Adventure",
                "loc": "Sri Lanka",
                "desc": "Unforgettable moments with friends at a scenic sunset viewpoint."
        },
        {
                "src": "assets/img/footer-gallery/cannon-cart.jpg",
                "title": "Cannon Cart Adventure",
                "loc": "Sri Lanka",
                "desc": "Experience thrilling cannon cart rides through scenic landscapes."
        },
        {
                "src": "assets/img/footer-gallery/thank-you-collage.jpg",
                "title": "Thank You for Visit Sri Lanka",
                "loc": "Sri Lanka",
                "desc": "Treasured memories and happy moments from our tour experiences."
        },
        {
                "src": "assets/img/footer-gallery/lotus-tower.jpg",
                "title": "Lotus Tower View",
                "loc": "Colombo",
                "desc": "Stunning panoramic views from the iconic Lotus Tower."
        },
        {
                "src": "assets/img/footer-gallery/mirissa-treehill.jpg",
                "title": "Mirissa Tree Hill",
                "loc": "Mirissa",
                "desc": "Breathtaking views from the famous Mirissa tree hill."
        },
        {
                "src": "assets/img/footer-gallery/turtle-sea.jpg",
                "title": "Turtle Sea Conservation",
                "loc": "Coastal Sri Lanka",
                "desc": "Witness turtle hatching and sea turtle conservation efforts."
        },
        {
                "src": "assets/img/footer-gallery/holy-statue.jpg",
                "title": "Holy Statue Shrine",
                "loc": "Sri Lanka",
                "desc": "Sacred statues and spiritual sites across the island."
        },
        {
                "src": "assets/img/footer-gallery/holy-temple.jpg",
                "title": "Holy Temple Visit",
                "loc": "Sri Lanka",
                "desc": "Ancient temples and religious architecture."
        },
        {
                "src": "assets/img/footer-gallery/temple-entrance.jpg",
                "title": "Temple Entrance",
                "loc": "Sri Lanka",
                "desc": "Beautiful entrances to historic temples."
        },
        {
                "src": "assets/img/footer-gallery/turtle-entrance.jpg",
                "title": "Turtle Hatchery Entrance",
                "loc": "Coastal Sri Lanka",
                "desc": "Gateway to turtle conservation facilities."
        },
        {
                "src": "assets/img/footer-gallery/holy-buddha.jpg",
                "title": "Holy Buddha Statue",
                "loc": "Sri Lanka",
                "desc": "Majestic Buddha statues and monuments."
        }
];

    function renderFooterSlider() {
        var itemsHtml = sliderPhotos.map(function(item) {
            var fullSrc = pathTo(item.src);
            return '<div class="single-gallery-item flex-shrink-0 w-72 sm:w-80 mx-2 sm:mx-3 group cursor-pointer" data-slider-src="' + fullSrc + '" data-slider-title="' + item.title + '" data-slider-loc="' + item.loc + '" data-slider-desc="' + item.desc + '">' +
                '<div class="gallery-img relative overflow-hidden rounded-2xl border border-white/10 shadow-lg h-60 sm:h-72">' +
                    '<img src="' + fullSrc + '" alt="' + item.title + '" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105">' +
                    '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">' +
                        '<div class="flex items-center justify-between w-full text-white">' +
                            '<span class="text-xs font-semibold truncate">' + item.title + '</span>' +
                            '<span class="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0"><i class="ph ph-plus text-sm"></i></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        return '<div class="w-full mb-12 sm:mb-16 overflow-hidden">' +
            '<div class="gallery-slider-container overflow-hidden">' +
                '<div id="gallery-slider" class="flex transition-transform duration-1000 ease-in-out">' +
                    itemsHtml +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function initFooterSlider() {
        var currentGalleryIndex = 0;
        var gallerySliderInterval;
        var gallerySlider = document.getElementById('gallery-slider');
        var gallerySliderItems = document.querySelectorAll('#gallery-slider .single-gallery-item');
        var totalGalleryItems = gallerySliderItems.length;
        var itemWidth = 320;
        var visibleItems = 5;

        if (!gallerySlider || totalGalleryItems === 0) return;

        gallerySliderItems.forEach(function(el) {
            el.addEventListener('click', function() {
                if (typeof window.openGalleryModal === 'function') {
                    window.openGalleryModal(el.dataset.sliderSrc, el.dataset.sliderTitle, el.dataset.sliderLoc, el.dataset.sliderDesc);
                }
            });
        });

        var updateGallerySlider = function () {
            if (gallerySlider) {
                var translateX = -currentGalleryIndex * itemWidth;
                gallerySlider.style.transform = 'translateX(' + translateX + 'px)';
            }
        };

        var nextGallerySlide = function () {
            currentGalleryIndex = (currentGalleryIndex + 1) % (totalGalleryItems - visibleItems + 1);
            updateGallerySlider();
        };

        var startGallerySlider = function () {
            gallerySliderInterval = setInterval(nextGallerySlide, 3000);
        };

        var stopGallerySlider = function () {
            if (gallerySliderInterval) clearInterval(gallerySliderInterval);
        };

        var galleryContainer = document.querySelector('.gallery-slider-container');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', stopGallerySlider);
            galleryContainer.addEventListener('mouseleave', startGallerySlider);
        }

        startGallerySlider();
    }

    function renderFooter() {
        var tourLinks = [
            ['family', 'Family Tours'],
            ['group', 'Group Tours'],
            ['northern-shores', 'Northern Shores'],
            ['cultural-heritage', 'Culture & Heritage'],
            ['adventure', 'Adventure Tours']
        ].map(function (item) {
            return '<li><a href="' + pathTo('tours/?collection=' + item[0]) + '">' + item[1] + '</a></li>';
        }).join('');

        return '<footer id="footer" class="main-footer gowilds-footer secondary-site-footer pt-16 md:pt-20">' +
            renderFooterSlider() +
            '<div class="secondary-footer-inner max-w-[1800px] mx-auto px-6 md:px-8 lg:px-12 xl:px-16">' +
                '<div class="footer-top py-6 border-y border-white/10"><div class="footer-contact-grid">' +
                    renderContact('map-pin', 'Location', 'Bankada Road, Katuneriya', 'https://maps.app.goo.gl/9yWk4ZRWJ8TZfrW99?g_st=ic', 'Open our location in Google Maps', true) +
                    renderContact('envelope-simple', 'Email', 'travelerinspire@gmail.com', 'mailto:travelerinspire@gmail.com', 'Email Inspire Travels', false) +
                    renderContact('phone', 'Hotline', '+94 78 595 9333', 'tel:+94785959333', 'Call Inspire Travels', false) +
                    '<div class="social-box lg:text-right lg:mb-0 mb-4"><div class="flex items-center gap-3 lg:justify-end"><a href="https://www.facebook.com/share/1CUqzA7tAu/?mibextid=wwXIfr" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="Facebook"><i class="ph ph-facebook-logo"></i></a><a href="https://www.linkedin.com/in/inspire-travel-and-tours-a02371416?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a><a href="https://www.instagram.com/inspiretravels_tours" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a><a href="https://youtube.com/@InspireTravelandTours" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="YouTube"><i class="ph ph-youtube-logo"></i></a></div></div>' +
                '</div></div>' +
                '<div class="footer-widget-area pt-16 pb-0"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">' +
                    '<div class="footer-widget about-company-widget mb-8"><h4 class="widget-title font-display text-xl font-bold mb-4">About Inspire Travels</h4><div class="footer-content"><p class="leading-relaxed mb-4">For over 5 years, we have been creating unforgettable journeys that showcase the authentic beauty and rich culture of Sri Lanka.</p><div class="footer-logo flex items-center space-x-2"><div class="flex flex-col"><span class="font-display font-bold text-lg text-white">Inspire Travels</span><span class="text-sm text-white/60">& Tours</span></div></div></div></div>' +
                    '<div class="footer-widget service-nav-widget mb-8"><h4 class="widget-title font-display text-xl font-bold mb-4">Our Tours</h4><div class="footer-content"><ul class="footer-widget-nav space-y-2">' + tourLinks + '</ul></div></div>' +
                    '<div class="footer-widget service-nav-widget mb-8"><h4 class="widget-title font-display text-xl font-bold mb-4">Quick Links</h4><div class="footer-content"><ul class="footer-widget-nav space-y-2"><li><a href="' + pathTo('index.html#about') + '">About Us</a></li><li><a href="' + pathTo('gallery.html') + '">Photo Gallery</a></li><li><a href="' + pathTo('index.html#reviews') + '">Customer Reviews</a></li><li><a href="#footer">Contact Us</a></li><li><a href="#footer">Get Quote</a></li></ul></div></div>' +
                '</div></div>' +
                '<div class="footer-copyright border-t border-white/10 py-8"><div class="text-center"><p class="text-sm md:text-base flex flex-wrap justify-center gap-1"><span>Copyright © 2026 Inspire Travels & Tours, All Rights Reserved.</span><span>Made with <i class="ph-fill ph-heart"></i> by Zig Zag</span></p></div></div>' +
            '</div>' +
        '</footer>';
    }

    function renderAmbient() {
        return '<canvas class="secondary-ambient-particles" aria-hidden="true"></canvas>' +
            '<div class="secondary-page-ambient" aria-hidden="true">' +
            '<div class="secondary-ambient-contours"></div>' +
            '<svg class="secondary-ambient-route secondary-ambient-route-one" viewBox="0 0 420 900" preserveAspectRatio="none"><path d="M56 0C365 120 54 249 299 374S342 642 82 900"/><circle cx="180" cy="153" r="7"/><circle cx="284" cy="365" r="7"/><circle cx="144" cy="711" r="7"/></svg>' +
            '<svg class="secondary-ambient-route secondary-ambient-route-two" viewBox="0 0 420 900" preserveAspectRatio="none"><path d="M364 0C78 138 357 290 121 438S98 714 354 900"/><circle cx="236" cy="116" r="6"/><circle cx="136" cy="424" r="6"/><circle cx="283" cy="739" r="6"/></svg>' +
            '<span class="secondary-ambient-piece ambient-compass" data-ambient-repel="1.2"><span class="ambient-piece-motion"><i class="ph ph-compass-rose"></i><small>INDIAN OCEAN</small></span></span>' +
            '<span class="secondary-ambient-piece ambient-coordinate ambient-coordinate-one" data-ambient-repel="0.85"><span class="ambient-piece-motion">07.8731° N<br>80.7718° E</span></span>' +
            '<span class="secondary-ambient-piece ambient-coordinate ambient-coordinate-two" data-ambient-repel="1"><span class="ambient-piece-motion">ELEV 1,041M<br>TRAIL 06.8667</span></span>' +
            '<span class="secondary-ambient-piece ambient-coordinate ambient-coordinate-three" data-ambient-repel="0.9"><span class="ambient-piece-motion">OCEAN POINT<br>06.8433° N</span></span>' +
            '<span class="secondary-ambient-piece ambient-route-stamp" data-ambient-repel="1.05"><span class="ambient-piece-motion">LK.ROUTE<br><b>EXP 2026</b></span></span>' +
            '<span class="secondary-ambient-piece ambient-waypoints ambient-waypoints-one" data-ambient-repel="1.15"><span class="ambient-piece-motion"><i></i><i></i><i></i><i></i></span></span>' +
            '<span class="secondary-ambient-piece ambient-waypoints ambient-waypoints-two" data-ambient-repel="0.95"><span class="ambient-piece-motion"><i></i><i></i><i></i></span></span>' +
            '<span class="secondary-ambient-piece ambient-botanical ambient-botanical-one" data-ambient-repel="0.75"><span class="ambient-piece-motion"><svg viewBox="0 0 170 300"><path d="M88 292C84 216 91 120 79 12M83 246C52 224 35 199 25 166M86 211C118 187 135 153 143 118M82 167C54 144 40 119 33 87M81 129C108 109 124 79 132 48"/><path d="M25 166C49 168 65 181 83 202M143 118C120 124 105 145 88 166M33 87C54 92 69 105 81 128M132 48C112 55 98 72 83 92"/></svg></span></span>' +
            '<span class="secondary-ambient-piece ambient-botanical ambient-botanical-two" data-ambient-repel="0.88"><span class="ambient-piece-motion"><svg viewBox="0 0 170 300"><path d="M88 292C84 216 91 120 79 12M83 246C52 224 35 199 25 166M86 211C118 187 135 153 143 118M82 167C54 144 40 119 33 87M81 129C108 109 124 79 132 48"/><path d="M25 166C49 168 65 181 83 202M143 118C120 124 105 145 88 166M33 87C54 92 69 105 81 128M132 48C112 55 98 72 83 92"/></svg></span></span>' +
        '</div>';
    }

    function initAmbientParticles() {
        var canvas = document.querySelector('.secondary-ambient-particles');
        if (!canvas) return;

        var context = canvas.getContext('2d');
        if (!context) return;

        var config = {
            desktopCount: 112,
            mobileCount: 62,
            speedMin: 0.6,
            speedMax: 2.4,
            wind: 0,
            windVariation: 0.8,
            sizeMin: 1,
            sizeMax: 4,
            opacityMin: 0.3,
            opacityMax: 0.9
        };
        var pageTone = document.body.dataset.currentNav || 'tours';
        var colors = {
            gallery: '#b77a38',
            destinations: '#bd8234',
            tours: '#c58a3b'
        };
        var color = colors[pageTone] || colors.tours;
        var ratio = Math.min(window.devicePixelRatio || 1, 2);
        var width = 0;
        var height = 0;
        var particles = [];
        var frame = 0;
        var lastTime = 0;
        var pointerTargetX = 0;
        var pointerTargetY = 0;
        var pointerDriftX = 0;
        var pointerDriftY = 0;

        function randomBetween(min, max) {
            return min + Math.random() * (max - min);
        }

        function build() {
            width = Math.max(1, Math.floor(window.innerWidth));
            height = Math.max(1, Math.floor(window.innerHeight));
            canvas.width = Math.floor(width * ratio);
            canvas.height = Math.floor(height * ratio);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            var particleCount = width < 768 ? config.mobileCount : config.desktopCount;
            particles = Array.from({ length: particleCount }, function (_, index) {
                var slot = index % 24;
                var type = slot === 0 ? 'butterfly' : slot === 8 ? 'dragonfly' : slot === 16 ? 'moth' : 'mote';
                var isInsect = type !== 'mote';
                return {
                    type: type,
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: isInsect ? randomBetween(4.8, 7.2) : randomBetween(config.sizeMin, config.sizeMax),
                    speedY: isInsect ? randomBetween(0.22, 0.58) : randomBetween(config.speedMin, config.speedMax),
                    speedX: randomBetween(-1, 1),
                    phase: Math.random() * Math.PI * 2,
                    wingPhase: Math.random() * Math.PI * 2,
                    sway: randomBetween(0.2, 0.9),
                    alpha: isInsect ? randomBetween(0.42, 0.72) : randomBetween(config.opacityMin, config.opacityMax)
                };
            });
            lastTime = 0;
        }

        function drawButterfly(particle, time) {
            var wingOpen = 0.2 + Math.abs(Math.sin(time * 0.011 + particle.wingPhase)) * 0.8;
            var tilt = Math.sin(time * 0.0015 + particle.phase) * 0.2;

            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(tilt);
            context.globalAlpha = particle.alpha;
            context.fillStyle = '#d45f54';
            context.beginPath();
            context.ellipse(-particle.radius * 0.46, 0, particle.radius * 0.72 * wingOpen, particle.radius * 0.48, -0.32, 0, Math.PI * 2);
            context.ellipse(particle.radius * 0.46, 0, particle.radius * 0.72 * wingOpen, particle.radius * 0.48, 0.32, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = Math.min(0.9, particle.alpha + 0.18);
            context.strokeStyle = '#7c302b';
            context.lineWidth = 0.8;
            context.beginPath();
            context.moveTo(0, -particle.radius * 0.45);
            context.lineTo(0, particle.radius * 0.58);
            context.stroke();
            context.restore();
        }

        function drawDragonfly(particle, time) {
            var wingOpen = 0.42 + Math.abs(Math.sin(time * 0.018 + particle.wingPhase)) * 0.58;
            var tilt = Math.sin(time * 0.0018 + particle.phase) * 0.14;

            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(tilt);
            context.globalAlpha = particle.alpha;
            context.fillStyle = '#526eb5';
            context.beginPath();
            context.ellipse(-particle.radius * 0.72, -particle.radius * 0.14, particle.radius * 0.76 * wingOpen, particle.radius * 0.18, -0.18, 0, Math.PI * 2);
            context.ellipse(particle.radius * 0.72, -particle.radius * 0.14, particle.radius * 0.76 * wingOpen, particle.radius * 0.18, 0.18, 0, Math.PI * 2);
            context.ellipse(-particle.radius * 0.58, particle.radius * 0.2, particle.radius * 0.6 * wingOpen, particle.radius * 0.14, 0.22, 0, Math.PI * 2);
            context.ellipse(particle.radius * 0.58, particle.radius * 0.2, particle.radius * 0.6 * wingOpen, particle.radius * 0.14, -0.22, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = Math.min(0.88, particle.alpha + 0.16);
            context.strokeStyle = '#2f477e';
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(0, -particle.radius * 0.48);
            context.lineTo(0, particle.radius * 0.78);
            context.stroke();
            context.fillStyle = '#2f477e';
            context.beginPath();
            context.arc(0, -particle.radius * 0.52, particle.radius * 0.16, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        function drawMoth(particle, time) {
            var wingOpen = 0.34 + Math.abs(Math.sin(time * 0.0075 + particle.wingPhase)) * 0.66;
            var tilt = Math.sin(time * 0.0012 + particle.phase) * 0.16;

            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(tilt);
            context.globalAlpha = particle.alpha;
            context.fillStyle = '#9567a6';
            context.beginPath();
            context.moveTo(0, -particle.radius * 0.18);
            context.quadraticCurveTo(-particle.radius * 0.75 * wingOpen, -particle.radius * 0.72, -particle.radius * 1.05 * wingOpen, particle.radius * 0.14);
            context.quadraticCurveTo(-particle.radius * 0.48 * wingOpen, particle.radius * 0.62, 0, particle.radius * 0.28);
            context.quadraticCurveTo(particle.radius * 0.48 * wingOpen, particle.radius * 0.62, particle.radius * 1.05 * wingOpen, particle.radius * 0.14);
            context.quadraticCurveTo(particle.radius * 0.75 * wingOpen, -particle.radius * 0.72, 0, -particle.radius * 0.18);
            context.fill();
            context.globalAlpha = Math.min(0.88, particle.alpha + 0.14);
            context.fillStyle = '#59365f';
            context.beginPath();
            context.ellipse(0, particle.radius * 0.08, particle.radius * 0.15, particle.radius * 0.55, 0, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        function draw(time) {
            context.clearRect(0, 0, width, height);
            context.fillStyle = color;
            particles.forEach(function (particle) {
                if (particle.type === 'butterfly') {
                    drawButterfly(particle, time);
                    return;
                }
                if (particle.type === 'dragonfly') {
                    drawDragonfly(particle, time);
                    return;
                }
                if (particle.type === 'moth') {
                    drawMoth(particle, time);
                    return;
                }
                context.globalAlpha = particle.alpha;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });
            context.globalAlpha = 1;
        }

        function loop(time) {
            var delta = lastTime ? Math.min((time - lastTime) / (1000 / 60), 4) : 1;
            lastTime = time;
            pointerDriftX += (pointerTargetX - pointerDriftX) * Math.min(0.035 * delta, 1);
            pointerDriftY += (pointerTargetY - pointerDriftY) * Math.min(0.035 * delta, 1);

            particles.forEach(function (particle) {
                particle.y += (particle.speedY + pointerDriftY) * delta;
                particle.x += (config.wind +
                    particle.speedX * config.windVariation +
                    Math.sin(time * 0.0012 + particle.phase) * particle.sway +
                    pointerDriftX) * delta;

                if (particle.y - particle.radius > height) {
                    particle.y = -particle.radius;
                    particle.x = Math.random() * width;
                }
                if (particle.x < -particle.radius) particle.x = width + particle.radius;
                else if (particle.x > width + particle.radius) particle.x = -particle.radius;
            });
            draw(time);
            frame = window.requestAnimationFrame(loop);
        }

        function handleResize() {
            build();
            draw(0);
        }

        function handlePointerMove(event) {
            pointerTargetX = ((event.clientX / width) - 0.5) * 0.2;
            pointerTargetY = ((event.clientY / height) - 0.5) * 0.08;
        }

        function resetPointerDrift() {
            pointerTargetX = 0;
            pointerTargetY = 0;
        }

        build();
        draw(0);
        frame = window.requestAnimationFrame(loop);
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.addEventListener('mouseleave', resetPointerDrift);
        window.addEventListener('pagehide', function () {
            window.cancelAnimationFrame(frame);
        }, { once: true });
    }

    function initAmbientMotion() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var ambient = document.querySelector('.secondary-page-ambient');
        var pieces = ambient ? Array.prototype.slice.call(ambient.querySelectorAll('[data-ambient-repel]')) : [];
        var states = pieces.map(function (piece) {
            return { piece: piece, x: 0, y: 0, velocityX: 0, velocityY: 0, targetX: 0, targetY: 0 };
        });
        var frame = null;
        var ambientPointerFrame = null;
        var latestAmbientPointer = null;

        if (!ambient || !states.length) return;

        function render() {
            var moving = false;

            states.forEach(function (state) {
                state.velocityX += (state.targetX - state.x) * 0.055;
                state.velocityY += (state.targetY - state.y) * 0.055;
                state.velocityX *= 0.78;
                state.velocityY *= 0.78;
                state.x += state.velocityX;
                state.y += state.velocityY;
                state.piece.style.transform = 'translate3d(' + state.x.toFixed(2) + 'px, ' + state.y.toFixed(2) + 'px, 0)';

                if (Math.abs(state.targetX - state.x) > 0.08 || Math.abs(state.targetY - state.y) > 0.08 || Math.abs(state.velocityX) > 0.08 || Math.abs(state.velocityY) > 0.08) moving = true;
            });

            frame = moving ? window.requestAnimationFrame(render) : null;
        }

        function requestRender() {
            if (!frame) frame = window.requestAnimationFrame(render);
        }

        function updateAmbientPointerTargets() {
            var event = latestAmbientPointer;
            ambientPointerFrame = null;
            if (!event) return;
            var bounds = ambient.getBoundingClientRect();

            states.forEach(function (state) {
                var piece = state.piece;
                var centerX = bounds.left + piece.offsetLeft + (piece.offsetWidth / 2);
                var centerY = bounds.top + piece.offsetTop + (piece.offsetHeight / 2);
                var deltaX = centerX - event.clientX;
                var deltaY = centerY - event.clientY;
                var distance = Math.max(Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)), 1);
                var force = distance < 360 ? Math.pow(1 - (distance / 360), 2) * 105 * (parseFloat(piece.dataset.ambientRepel) || 1) : 0;
                state.targetX = (deltaX / distance) * force;
                state.targetY = (deltaY / distance) * force;
            });
            requestRender();
        }

        window.addEventListener('pointermove', function (event) {
            latestAmbientPointer = event;
            if (!ambientPointerFrame) ambientPointerFrame = window.requestAnimationFrame(updateAmbientPointerTargets);
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            states.forEach(function (state) {
                state.targetX = 0;
                state.targetY = 0;
            });
            requestRender();
        });
    }

    function init() {
        if (!document.body.classList.contains('secondary-page-theme')) return;

        document.querySelector('.top-contact-bar')?.remove();

        var navbar = document.getElementById('navbar');
        if (navbar) navbar.outerHTML = renderHeader();

        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.outerHTML = renderMobileMenu();

        var footer = document.getElementById('footer');
        if (footer) footer.outerHTML = renderFooter();

        document.body.insertAdjacentHTML('afterbegin', renderAmbient());
        initAmbientMotion();
        initAmbientParticles();
        initFooterSlider();

        var updateHeader = function () {
            document.body.classList.toggle('secondary-shell-scrolled', window.scrollY > 40);
        };
        var headerScrollFrame = null;
        var requestHeaderUpdate = function () {
            if (headerScrollFrame) return;
            headerScrollFrame = window.requestAnimationFrame(function () {
                headerScrollFrame = null;
                updateHeader();
            });
        };

        var updateAmbientLight = function (event) {
            var x = Math.round((event.clientX / window.innerWidth) * 100);
            var y = Math.round((event.clientY / window.innerHeight) * 100);
            document.body.style.setProperty('--secondary-pointer-x', x + '%');
            document.body.style.setProperty('--secondary-pointer-y', y + '%');
        };
        var lightPointerFrame = null;
        var latestLightPointer = null;
        var requestAmbientLightUpdate = function (event) {
            latestLightPointer = event;
            if (lightPointerFrame) return;
            lightPointerFrame = window.requestAnimationFrame(function () {
                lightPointerFrame = null;
                updateAmbientLight(latestLightPointer);
            });
        };

        updateHeader();
        window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            window.addEventListener('pointermove', requestAmbientLightUpdate, { passive: true });
        }
    }

    window.SiteShellModule = { init: init };
    init();
})();
