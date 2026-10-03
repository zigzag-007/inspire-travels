// Ambient Particles Module (Butterflies, Dragonflies, Moths & Firefly Motes)
// Author: Zig Zag AI
// Description: Drifting tropical insects and gold motes with wing animation and cursor drift

(function() {
    'use strict';

    function initAmbientParticles() {
        var canvas = document.querySelector('.secondary-ambient-particles');
        if (!canvas) return;

        canvas.style.position = 'absolute';
        canvas.style.zIndex = '2';
        canvas.hidden = true;

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

        var color = '#eab05b'; // Warm golden-amber tone for home
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
            width = Math.max(1, canvas.parentElement.clientWidth);
            height = Math.max(1, canvas.parentElement.clientHeight);
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

        // Keep the field inside the hero, including after its size changes.
        function fitHero() {
            var hero = document.getElementById('home');
            canvas.hidden = !hero;
            if (!hero) return false;
            if (canvas.parentElement !== hero) hero.appendChild(canvas);
            if (width !== hero.clientWidth || height !== hero.clientHeight) build();
            return true;
        }

        function loop(time) {
            if (!fitHero()) {
                lastTime = 0;
                frame = window.requestAnimationFrame(loop);
                return;
            }
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
            fitHero();
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

        fitHero();
        draw(0);
        frame = window.requestAnimationFrame(loop);
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.addEventListener('mouseleave', resetPointerDrift);
        window.addEventListener('pagehide', function () {
            window.cancelAnimationFrame(frame);
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAmbientParticles);
    } else {
        initAmbientParticles();
    }
})();
