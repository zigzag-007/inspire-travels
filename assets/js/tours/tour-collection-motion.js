// Tour Collection Motion Module
// Author: Zig Zag AI
// Description: Adds responsive motion and direct feedback to collection pages.

(function() {
    'use strict';

    var gsapContext = null;
    var cleanupTasks = [];

    function addCleanup(task) {
        cleanupTasks.push(task);
    }

    function listen(element, eventName, handler, options) {
        element.addEventListener(eventName, handler, options);
        addCleanup(function() {
            element.removeEventListener(eventName, handler, options);
        });
    }

    function initPressFeedback(root) {
        root.querySelectorAll('.tour-atlas-card, .tour-collection-primary-action, .tour-collection-dock-link, .tour-collection-link').forEach(function(element) {
            function press() {
                element.classList.add('is-pressed');
            }

            function release() {
                element.classList.remove('is-pressed');
            }

            listen(element, 'pointerdown', press);
            listen(element, 'pointerup', release);
            listen(element, 'pointercancel', release);
            listen(element, 'pointerleave', release);
        });
    }

    function initPointerMotion(root) {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        root.querySelectorAll('[data-collection-tilt]').forEach(function(card) {
            var moveX = window.gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
            var moveY = window.gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
            var image = card.querySelector('.tour-atlas-image img');
            var imageX = image ? window.gsap.quickTo(image, 'xPercent', { duration: 0.65, ease: 'power3.out' }) : null;
            var imageY = image ? window.gsap.quickTo(image, 'yPercent', { duration: 0.65, ease: 'power3.out' }) : null;

            window.gsap.set(card, {
                transformPerspective: 1100,
                transformOrigin: 'center center'
            });

            function move(event) {
                var bounds = card.getBoundingClientRect();
                var x = (event.clientX - bounds.left) / bounds.width - 0.5;
                var y = (event.clientY - bounds.top) / bounds.height - 0.5;

                moveX(x * 3.5);
                moveY(y * -3.5);
                if (imageX) imageX(x * -2.2);
                if (imageY) imageY(y * -2.2);
            }

            function reset() {
                moveX(0);
                moveY(0);
                if (imageX) imageX(0);
                if (imageY) imageY(0);
            }

            listen(card, 'pointermove', move);
            listen(card, 'pointerleave', reset);
        });

        var portrait = root.querySelector('[data-hero-portrait]');
        var hero = root.querySelector('[data-collection-hero]');
        if (!portrait || !hero) return;

        var portraitX = window.gsap.quickTo(portrait, 'x', { duration: 0.8, ease: 'power3.out' });
        var portraitY = window.gsap.quickTo(portrait, 'y', { duration: 0.8, ease: 'power3.out' });

        function movePortrait(event) {
            var bounds = hero.getBoundingClientRect();
            var x = (event.clientX - bounds.left) / bounds.width - 0.5;
            var y = (event.clientY - bounds.top) / bounds.height - 0.5;
            portraitX(x * 18);
            portraitY(y * 12);
        }

        function resetPortrait() {
            portraitX(0);
            portraitY(0);
        }

        listen(hero, 'pointermove', movePortrait);
        listen(hero, 'pointerleave', resetPortrait);
    }

    function initNativePointerMotion(root) {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        root.querySelectorAll('[data-collection-tilt]').forEach(function(card) {
            var image = card.querySelector('.tour-atlas-image img');
            var frame = null;

            function move(event) {
                var bounds = card.getBoundingClientRect();
                var x = (event.clientX - bounds.left) / bounds.width - 0.5;
                var y = (event.clientY - bounds.top) / bounds.height - 0.5;

                if (frame) window.cancelAnimationFrame(frame);
                frame = window.requestAnimationFrame(function() {
                    card.style.transform = 'perspective(1100px) rotateX(' + (y * -3.5) + 'deg) rotateY(' + (x * 3.5) + 'deg)';
                    if (image) image.style.transform = 'translate3d(' + (x * -2.2) + '%, ' + (y * -2.2) + '%, 0)';
                });
            }

            function reset() {
                if (frame) window.cancelAnimationFrame(frame);
                card.style.transform = '';
                if (image) image.style.transform = '';
            }

            listen(card, 'pointermove', move);
            listen(card, 'pointerleave', reset);
            addCleanup(function() {
                if (frame) window.cancelAnimationFrame(frame);
                reset();
            });
        });
    }

    function initStoryStack(root) {
        var section = root.querySelector('[data-story-section]');
        var stack = root.querySelector('[data-story-stack]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-story-card]'));
        var frame = null;
        var currentStep = 0;

        if (!section || !stack) return;

        function update() {
            var sectionBounds = section.getBoundingClientRect();
            var scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
            var progress = Math.max(0, Math.min(1, (112 - sectionBounds.top) / scrollDistance));
            var secondProgress = Math.max(0, Math.min(1, (progress - 0.18) / 0.24));
            var thirdProgress = Math.max(0, Math.min(1, (progress - 0.58) / 0.24));
            var rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
            var nextStep = thirdProgress > 0 ? 3 : secondProgress > 0 ? 2 : 1;

            frame = null;
            if (window.matchMedia('(max-width: 1023px)').matches) {
                cards.forEach(function(card) {
                    card.style.removeProperty('opacity');
                    card.style.removeProperty('visibility');
                    card.style.removeProperty('pointer-events');
                    card.style.removeProperty('transform');
                });
                nextStep = 3;
            } else {
                [secondProgress, thirdProgress].forEach(function(revealProgress, index) {
                    var card = cards[index + 1];
                    var cardOffset = (index + 1) * 0.7 * rootFontSize;
                    var hiddenDistance = Math.max(card.offsetHeight * 1.15, window.innerHeight - 48);
                    var translateY = cardOffset + ((1 - revealProgress) * hiddenDistance);

                    card.style.opacity = String(Math.min(1, revealProgress * 8));
                    card.style.visibility = revealProgress > 0.001 ? 'visible' : 'hidden';
                    card.style.pointerEvents = revealProgress >= 0.98 ? 'auto' : 'none';
                    card.style.transform = 'translate3d(0, ' + translateY.toFixed(2) + 'px, 0)';
                });
            }

            if (nextStep !== currentStep) {
                currentStep = nextStep;
                stack.setAttribute('data-story-step', String(nextStep));
            }
        }

        function requestUpdate() {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        }

        listen(window, 'scroll', requestUpdate, { passive: true });
        listen(window, 'resize', requestUpdate);
        requestUpdate();

        addCleanup(function() {
            if (frame) window.cancelAnimationFrame(frame);
            cards.forEach(function(card) {
                card.style.removeProperty('opacity');
                card.style.removeProperty('visibility');
                card.style.removeProperty('pointer-events');
                card.style.removeProperty('transform');
            });
        });
    }

    function initAmbientMotion(root) {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var ambient = root.querySelector('[data-collection-ambient]');
        var pieces = ambient ? Array.prototype.slice.call(ambient.querySelectorAll('[data-ambient-repel]')) : [];
        var states = pieces.map(function(piece) {
            return { piece: piece, x: 0, y: 0, velocityX: 0, velocityY: 0, targetX: 0, targetY: 0 };
        });
        var frame = null;

        if (!ambient || !pieces.length) return;

        function render() {
            var moving = false;

            states.forEach(function(state) {
                state.velocityX += (state.targetX - state.x) * 0.055;
                state.velocityY += (state.targetY - state.y) * 0.055;
                state.velocityX *= 0.78;
                state.velocityY *= 0.78;
                state.x += state.velocityX;
                state.y += state.velocityY;
                state.piece.style.transform = 'translate3d(' + state.x.toFixed(2) + 'px, ' + state.y.toFixed(2) + 'px, 0)';

                if (Math.abs(state.targetX - state.x) > 0.08 || Math.abs(state.targetY - state.y) > 0.08 || Math.abs(state.velocityX) > 0.08 || Math.abs(state.velocityY) > 0.08) {
                    moving = true;
                }
            });

            if (moving) {
                frame = window.requestAnimationFrame(render);
            } else {
                frame = null;
            }
        }

        function requestRender() {
            if (!frame) frame = window.requestAnimationFrame(render);
        }

        function move(event) {
            var ambientBounds = ambient.getBoundingClientRect();

            states.forEach(function(state) {
                var piece = state.piece;
                var centerX = ambientBounds.left + piece.offsetLeft + (piece.offsetWidth / 2);
                var centerY = ambientBounds.top + piece.offsetTop + (piece.offsetHeight / 2);
                var deltaX = centerX - event.clientX;
                var deltaY = centerY - event.clientY;
                var distance = Math.max(Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)), 1);
                var reach = 360;
                var strength = parseFloat(piece.getAttribute('data-ambient-repel')) || 1;
                var force = distance < reach ? Math.pow(1 - (distance / reach), 2) * 105 * strength : 0;

                state.targetX = (deltaX / distance) * force;
                state.targetY = (deltaY / distance) * force;
            });
            requestRender();
        }

        function reset() {
            states.forEach(function(state) {
                state.targetX = 0;
                state.targetY = 0;
            });
            requestRender();
        }

        listen(root, 'pointermove', move, { passive: true });
        listen(root, 'pointerleave', reset);
        addCleanup(function() {
            if (frame) window.cancelAnimationFrame(frame);
            pieces.forEach(function(piece) {
                piece.style.removeProperty('transform');
            });
        });
    }

    function initFallbackMotion(root) {
        root.classList.add('uses-native-motion');
        initNativePointerMotion(root);

        window.requestAnimationFrame(function() {
            root.querySelector('[data-collection-hero]').classList.add('is-revealed');
        });

        var revealElements = Array.prototype.slice.call(root.querySelectorAll('[data-collection-reveal]'));

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(function(element) {
                element.classList.add('is-revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.08
        });

        revealElements.forEach(function(element) {
            observer.observe(element);
        });
        addCleanup(function() {
            observer.disconnect();
        });
    }

    function initScrollMotion(root) {
        window.gsap.registerPlugin(window.ScrollTrigger);

        gsapContext = window.gsap.context(function() {
            var hero = root.querySelector('[data-collection-hero]');
            var heroBackground = hero.querySelector('.tour-collection-hero-background img');
            var heroWords = hero.querySelectorAll('.tour-hero-word > span');
            var heroDetails = hero.querySelectorAll('.tour-collection-eyebrow, .tour-collection-hero-copy > p, .tour-collection-primary-action');
            var portrait = hero.querySelector('[data-hero-portrait]');
            var dockLinks = hero.querySelectorAll('.tour-collection-dock-link');

            window.gsap.timeline({ defaults: { ease: 'power4.out' } })
                .from(heroWords, { yPercent: 115, opacity: 0, duration: 1.05, stagger: 0.055 })
                .from(heroDetails, { y: 24, opacity: 0, duration: 0.72, stagger: 0.08 }, '-=0.72')
                .from(portrait, { x: 70, rotation: 2.5, scale: 0.94, opacity: 0, duration: 1.05 }, '-=0.92')
                .from(dockLinks, { opacity: 0, duration: 0.7, stagger: 0.07 }, '-=0.68');

            window.gsap.to(heroBackground, {
                scale: 1.1,
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            root.querySelectorAll('[data-collection-reveal]').forEach(function(element) {
                window.gsap.from(element, {
                    y: 54,
                    opacity: 0,
                    duration: 0.95,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 88%',
                        once: true
                    }
                });
            });

        }, root);

        window.requestAnimationFrame(function() {
            window.ScrollTrigger.refresh();
        });
    }

    function destroy() {
        cleanupTasks.forEach(function(task) {
            task();
        });
        cleanupTasks = [];

        if (gsapContext) {
            gsapContext.revert();
            gsapContext = null;
        }
    }

    window.TourCollectionMotionModule = {
        init: function() {
            var root = document.getElementById('tour-collection');
            if (!root) return;

            destroy();
            initPressFeedback(root);
            initStoryStack(root);

            var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion) {
                root.classList.add('prefers-reduced-motion');
                root.classList.add('is-motion-ready');
                return;
            }

            initAmbientMotion(root);

            if (!window.gsap || !window.ScrollTrigger) {
                initFallbackMotion(root);
                root.classList.add('is-motion-ready');
                return;
            }

            initScrollMotion(root);
            initPointerMotion(root);
            root.classList.add('is-motion-ready');
        },

        destroy: destroy
    };
})();
