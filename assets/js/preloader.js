// Preloader Module - Handles the loading animation, GSAP exits, and Canvas Particles
// Author: Zig Zag AI
// Description: Manages the cinematic loading screen with GSAP and Firefly particles

(function() {
    'use strict';

    window.PreloaderModule = {
        init: function() {
            const loading = document.getElementById('loading');
            const progressBar = document.getElementById('loading-progress');
            let progress = 0;
            let loaded = false;
            if (!loading) return;

            // Hide scrollbars during page loading wrapper
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // --- 1. Canvas Particle Engine (Fireflies) ---
            this.initCanvasParticles();

            // --- 2. Progress Bar Logic ---
            const progressInterval = setInterval(() => {
                if (!loaded && progress < 90) {
                    const remaining = 90 - progress;
                    progress += Math.max(0.5, Math.random() * remaining * 0.15);
                    progress = Math.min(90, progress);
                    if (progressBar) progressBar.style.width = progress + '%';
                }
            }, 100);

            // --- 3. Cinematic GSAP Exit Reveal ---
            const hidePreloader = () => {
                loaded = true;
                clearInterval(progressInterval);
                if (progressBar) progressBar.style.width = '100%';

                setTimeout(() => {
                    if (typeof gsap === 'undefined') {
                        this.fallbackExit(loading);
                        return;
                    }

                    // Remove conflicting CSS transitions before GSAP takes over
                    loading.classList.remove('transition-all', 'duration-700');

                    const tl = gsap.timeline({
                        onComplete: () => {
                            loading.style.display = 'none';
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';
                            document.dispatchEvent(new CustomEvent('app-loaded'));
                            if (window.HeroModule && typeof window.HeroModule.initHeroAnimations === 'function') {
                                window.HeroModule.initHeroAnimations();
                            }
                        }
                    });

                    // GSAP Cinematic Wipe Choreography
                    tl.to(loading.querySelector('.text-center'), {
                        scale: 0.95,
                        y: -30,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.inOut'
                    })
                    .to(loading.querySelectorAll('.absolute.inset-0 > div, svg'), {
                        y: -50,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.05,
                        ease: 'power3.in'
                    }, "-=0.6")
                    .to(loading, {
                        yPercent: -100, // Smoothly moves the entire screen upwards
                        duration: 1.2,
                        ease: 'power4.inOut'
                    }, "-=0.4");
                }, 1500); // 1.5s delay to show 100% full bar
            };

            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }
        },

        fallbackExit: function(loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.dispatchEvent(new CustomEvent('app-loaded'));
                if (window.HeroModule && typeof window.HeroModule.initHeroAnimations === 'function') {
                    window.HeroModule.initHeroAnimations();
                }
            }, 750);
        },

        initCanvasParticles: function() {
            const canvas = document.getElementById('preloader-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resize);
            resize();

            let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
            document.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2.5 + 0.5;
                    this.baseX = this.x;
                    this.baseY = this.y;
                    this.density = (Math.random() * 30) + 1;
                    this.angle = Math.random() * 360;
                    this.velocity = Math.random() * 0.02 + 0.01;
                    this.color = `rgba(43, 61, 38, ${Math.random() * 0.5 + 0.2})`; // Forest green variants
                }
                update() {
                    this.angle += this.velocity;
                    // Wander organically
                    this.x += Math.sin(this.angle) * 1;
                    this.y += Math.cos(this.angle) * 1;
                    
                    // Mouse interaction: Particles repel away organically from the cursor
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = 150;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    
                    if (distance < maxDistance) {
                        this.x -= directionX;
                        this.y -= directionY;
                    }

                    // Wrap edges smoothly
                    if (this.x < 0) this.x = canvas.width;
                    if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height;
                    if (this.y > canvas.height) this.y = 0;
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            const initParticles = () => {
                particles = [];
                const numParticles = Math.min(120, window.innerWidth / 8); // Scale particle count by screen width
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle());
                }
            };

            let animationFrameId;
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
                animationFrameId = requestAnimationFrame(animate);
            };

            initParticles();
            animate();

            // Cleanup when preloader finishes to free GPU/CPU
            document.addEventListener('app-loaded', () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
            });
        }
    };
})();
