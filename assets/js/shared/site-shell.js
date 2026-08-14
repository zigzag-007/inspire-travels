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
                        '<i class="ph ph-list"></i>' +
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
                        '<span>Inspire Travels</span>' +
                    '</a>' +
                    '<button type="button" id="mobile-menu-close" aria-label="Close mobile menu" title="Close navigation menu"><i class="ph ph-x"></i></button>' +
                '</div>' +
                '<div class="secondary-mobile-links">' +
                    '<a href="' + pathTo('index.html#home') + '" class="mobile-nav-link" data-section="home"><i class="ph ph-house"></i><span>Home</span></a>' +
                    '<div data-mobile-menu="tours"></div>' +
                    '<div data-mobile-menu="destinations"></div>' +
                    '<a href="' + pathTo('index.html#about') + '" class="mobile-nav-link" data-section="about"><i class="ph ph-users-three"></i><span>About</span></a>' +
                    '<div data-mobile-menu="gallery"></div>' +
                    '<a href="' + pathTo('index.html#reviews') + '" class="mobile-nav-link" data-section="reviews"><i class="ph ph-star"></i><span>Reviews</span></a>' +
                '</div>' +
                '<div class="secondary-mobile-socials">' +
                    '<span>Follow the journey</span>' +
                    '<div>' +
                        '<a href="https://www.facebook.com/share/1CUqzA7tAu/?mibextid=wwXIfr" target="_blank" rel="noopener" aria-label="Facebook"><i class="ph ph-facebook-logo"></i></a>' +
                        '<a href="https://www.instagram.com/inspiretravels_tours" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a>' +
                        '<a href="https://www.tiktok.com/@inspiretravelstours?_t=ZS-903Za2uRoUU&_r=1" target="_blank" rel="noopener" aria-label="TikTok"><i class="ph ph-tiktok-logo"></i></a>' +
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

        return '<footer id="footer" class="main-footer gowilds-footer secondary-site-footer pt-20">' +
            '<div class="secondary-footer-inner max-w-[1800px] mx-auto px-6 md:px-8 lg:px-12 xl:px-16">' +
                '<div class="footer-top py-6 border-y border-white/10"><div class="footer-contact-grid">' +
                    renderContact('map-pin', 'Location', 'Bankada Road, Katuneriya', 'https://maps.app.goo.gl/9yWk4ZRWJ8TZfrW99?g_st=ic', 'Open our location in Google Maps', true) +
                    renderContact('envelope-simple', 'Email', 'travelerinspire@gmail.com', 'mailto:travelerinspire@gmail.com', 'Email Inspire Travels', false) +
                    renderContact('phone', 'Hotline', '+94 78 595 9333', 'tel:+94785959333', 'Call Inspire Travels', false) +
                    '<div class="social-box lg:text-right lg:mb-0 mb-4"><div class="flex items-center gap-3 lg:justify-end"><a href="https://www.facebook.com/share/1CUqzA7tAu/?mibextid=wwXIfr" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="Facebook"><i class="ph ph-facebook-logo"></i></a><a href="https://www.tiktok.com/@inspiretravelstours?_t=ZS-903Za2uRoUU&_r=1" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="TikTok"><i class="ph ph-tiktok-logo"></i></a><a href="https://www.instagram.com/inspiretravels_tours" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a><a href="https://youtube.com/@InspireTravelandTours" target="_blank" rel="noopener" class="liquid-glass w-10 h-10 rounded-xl flex items-center justify-center" aria-label="YouTube"><i class="ph ph-youtube-logo"></i></a></div></div>' +
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
        return '<div class="secondary-page-ambient" aria-hidden="true">' +
            '<canvas class="secondary-ambient-particles"></canvas>' +
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
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!canvas || reduceMotion) return;

        var context = canvas.getContext('2d');
        var particles = [];
        var pointer = { x: -1000, y: -1000 };
        var ratio = Math.min(window.devicePixelRatio || 1, 1.5);

        function resize() {
            canvas.width = Math.round(window.innerWidth * ratio);
            canvas.height = Math.round(window.innerHeight * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            particles = Array.from({ length: Math.max(24, Math.min(54, Math.round(window.innerWidth / 28))) }, function (_, index) {
                return {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: 0.8 + Math.random() * 2.2,
                    speedX: (Math.random() - 0.5) * 0.12,
                    speedY: -0.08 - Math.random() * 0.16,
                    alpha: 0.13 + Math.random() * 0.28,
                    phase: index * 0.73
                };
            });
        }

        function draw(time) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            particles.forEach(function (particle) {
                var deltaX = particle.x - pointer.x;
                var deltaY = particle.y - pointer.y;
                var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
                if (distance < 110 && distance > 0) {
                    particle.x += (deltaX / distance) * (1 - distance / 110) * 1.8;
                    particle.y += (deltaY / distance) * (1 - distance / 110) * 1.8;
                }
                particle.x += particle.speedX + Math.sin((time * 0.00028) + particle.phase) * 0.045;
                particle.y += particle.speedY;
                if (particle.y < -8) { particle.y = window.innerHeight + 8; particle.x = Math.random() * window.innerWidth; }
                if (particle.x < -8) particle.x = window.innerWidth + 8;
                if (particle.x > window.innerWidth + 8) particle.x = -8;
                var glow = particle.alpha * (0.72 + Math.sin((time * 0.0011) + particle.phase) * 0.28);
                context.beginPath();
                context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                context.fillStyle = 'rgba(173, 121, 43, ' + Math.max(0.04, glow).toFixed(3) + ')';
                context.shadowColor = 'rgba(224, 174, 84, 0.42)';
                context.shadowBlur = 8;
                context.fill();
            });
            window.requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('pointermove', function (event) { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
        document.addEventListener('mouseleave', function () { pointer.x = -1000; pointer.y = -1000; });
        resize();
        window.requestAnimationFrame(draw);
    }

    function initAmbientMotion() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var ambient = document.querySelector('.secondary-page-ambient');
        var pieces = ambient ? Array.prototype.slice.call(ambient.querySelectorAll('[data-ambient-repel]')) : [];
        var states = pieces.map(function (piece) {
            return { piece: piece, x: 0, y: 0, velocityX: 0, velocityY: 0, targetX: 0, targetY: 0 };
        });
        var frame = null;

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

        window.addEventListener('pointermove', function (event) {
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

        if (!new URLSearchParams(window.location.search).has('collection')) {
            document.body.insertAdjacentHTML('afterbegin', renderAmbient());
            initAmbientMotion();
            initAmbientParticles();
        }

        var updateHeader = function () {
            document.body.classList.toggle('secondary-shell-scrolled', window.scrollY > 24);
        };

        var updateAmbientLight = function (event) {
            var x = Math.round((event.clientX / window.innerWidth) * 100);
            var y = Math.round((event.clientY / window.innerHeight) * 100);
            document.body.style.setProperty('--secondary-pointer-x', x + '%');
            document.body.style.setProperty('--secondary-pointer-y', y + '%');
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            window.addEventListener('pointermove', updateAmbientLight, { passive: true });
        }
    }

    window.SiteShellModule = { init: init };
    init();
})();
