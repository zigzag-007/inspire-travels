// Preloader Module
// Shows a short first visit reveal without holding the page behind heavy media.

(function () {
    'use strict';

    window.PreloaderModule = {
        storageKey: 'inspire-preloader-seen',
        completed: false,

        init: function () {
            var loading = document.getElementById('loading');
            var progressBar = document.getElementById('loading-progress');
            if (!loading) return;

            if (this.wasSeen()) {
                loading.style.display = 'none';
                document.documentElement.classList.remove('is-loading');
                document.body.classList.remove('is-loading');
                this.complete();
                return;
            }

            this.rememberVisit();
            document.documentElement.classList.add('is-loading');
            document.body.classList.add('is-loading');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            this.initCanvasParticles();

            var progress = 12;
            var progressInterval = setInterval(function () {
                progress = Math.min(88, progress + Math.max(2, (88 - progress) * 0.18));
                if (progressBar) progressBar.style.width = progress + '%';
            }, 80);

            var startedAt = Date.now();
            var exit = function () {
                var minimumDisplay = 450;
                var remaining = Math.max(0, minimumDisplay - (Date.now() - startedAt));

                setTimeout(function () {
                    clearInterval(progressInterval);
                    if (progressBar) progressBar.style.width = '100%';
                    this.exit(loading);
                }.bind(this), remaining);
            }.bind(this);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', exit, { once: true });
            } else {
                exit();
            }

            // A slow image or third party file must never trap the visitor.
            setTimeout(function () {
                if (!this.completed && loading.style.display !== 'none') {
                    clearInterval(progressInterval);
                    this.exit(loading);
                }
            }.bind(this), 2500);
        },

        exit: function (loading) {
            if (loading.dataset.exiting === 'true') return;
            loading.dataset.exiting = 'true';
            loading.classList.remove('transition-all', 'duration-700');
            loading.style.transition = 'opacity 0.32s ease, transform 0.46s cubic-bezier(0.22, 1, 0.36, 1)';
            loading.style.opacity = '0';
            loading.style.transform = 'translate3d(0, -1.5rem, 0)';

            setTimeout(function () {
                loading.style.display = 'none';
                this.complete();
            }.bind(this), 470);
        },

        complete: function () {
            if (this.completed) return;
            this.completed = true;
            document.documentElement.classList.remove('is-loading');
            document.body.classList.remove('is-loading');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.dispatchEvent(new CustomEvent('app-loaded'));

            if (window.HeroModule && typeof window.HeroModule.initHeroAnimations === 'function') {
                window.HeroModule.initHeroAnimations();
            }
        },

        wasSeen: function () {
            try {
                return sessionStorage.getItem(this.storageKey) === 'true';
            } catch (error) {
                return false;
            }
        },

        rememberVisit: function () {
            try {
                sessionStorage.setItem(this.storageKey, 'true');
            } catch (error) {
                // Private browsing can block storage. The short reveal still works.
            }
        },

        initCanvasParticles: function () {
            var canvas = document.getElementById('preloader-canvas');
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var coarsePointer = window.matchMedia('(pointer: coarse)').matches;
            if (!canvas || reduceMotion || coarsePointer) return;

            var ctx = canvas.getContext('2d');
            var particles = [];
            var animationFrameId = null;
            var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

            var resize = function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            var trackMouse = function (event) {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            };

            function Particle() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.density = (Math.random() * 18) + 1;
                this.angle = Math.random() * 360;
                this.velocity = Math.random() * 0.02 + 0.01;
                this.color = 'rgba(43, 61, 38, ' + (Math.random() * 0.45 + 0.18) + ')';
            }

            Particle.prototype.update = function () {
                this.angle += this.velocity;
                this.x += Math.sin(this.angle);
                this.y += Math.cos(this.angle);

                var dx = mouse.x - this.x;
                var dy = mouse.y - this.y;
                var distance = Math.max(1, Math.sqrt((dx * dx) + (dy * dy)));
                if (distance < 130) {
                    var force = (130 - distance) / 130;
                    this.x -= (dx / distance) * force * this.density;
                    this.y -= (dy / distance) * force * this.density;
                }

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            };

            Particle.prototype.draw = function () {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            };

            resize();
            var particleCount = Math.min(48, Math.max(24, Math.floor(window.innerWidth / 24)));
            for (var i = 0; i < particleCount; i += 1) {
                particles.push(new Particle());
            }

            var animate = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(function (particle) {
                    particle.update();
                    particle.draw();
                });
                animationFrameId = requestAnimationFrame(animate);
            };

            window.addEventListener('resize', resize, { passive: true });
            document.addEventListener('mousemove', trackMouse, { passive: true });
            animate();

            document.addEventListener('app-loaded', function () {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                document.removeEventListener('mousemove', trackMouse);
            }, { once: true });
        }
    };
})();
