// Floating controls
// Lets the WhatsApp bubble move, then docks it to the nearest safe edge.

(function () {
    'use strict';

    var STORAGE_KEY = 'inspire-whatsapp-position';
    var EDGE_CLASSES = ['is-docked-top', 'is-docked-right', 'is-docked-bottom', 'is-docked-left'];

    var FloatingControls = {
        bubble: null,
        drag: null,
        snapTimer: null,

        init: function () {
            this.bubble = document.querySelector('.whatsapp-float');
            if (!this.bubble) return;

            this.bubble.setAttribute('draggable', 'false');
            this.restorePosition();
            this.bindDrag();
            this.bubble.addEventListener('dblclick', this.resetPosition.bind(this));
            window.addEventListener('resize', this.restorePosition.bind(this), { passive: true });
        },

        bindDrag: function () {
            var self = this;

            this.bubble.addEventListener('dragstart', function (event) {
                event.preventDefault();
            });

            this.bubble.addEventListener('pointerdown', function (event) {
                if (event.button !== 0) return;

                var rect = self.bubble.getBoundingClientRect();
                self.drag = {
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY,
                    left: rect.left,
                    top: rect.top,
                    moved: false
                };

                self.bubble.classList.remove('is-snapping');
                self.bubble.classList.add('is-dragging');
                try {
                    self.bubble.setPointerCapture(event.pointerId);
                } catch (error) {
                    // Older browsers can still drag through the document listeners.
                }
            });

            document.addEventListener('pointermove', function (event) {
                if (!self.drag || event.pointerId !== self.drag.pointerId) return;

                var dx = event.clientX - self.drag.startX;
                var dy = event.clientY - self.drag.startY;
                if (!self.drag.moved && Math.hypot(dx, dy) < 7) return;

                self.drag.moved = true;
                event.preventDefault();
                self.place(self.drag.left + dx, self.drag.top + dy);
            });

            document.addEventListener('pointerup', function (event) {
                self.finishDrag(event.pointerId);
            });

            document.addEventListener('pointercancel', function (event) {
                self.finishDrag(event.pointerId);
            });

            this.bubble.addEventListener('click', function (event) {
                if (self.bubble.dataset.suppressClick === 'true') {
                    event.preventDefault();
                    event.stopPropagation();
                    delete self.bubble.dataset.suppressClick;
                }
            });
        },

        finishDrag: function (pointerId) {
            if (!this.drag || pointerId !== this.drag.pointerId) return;

            var moved = this.drag.moved;
            this.drag = null;
            this.bubble.classList.remove('is-dragging');

            if (moved) {
                this.snapToNearestEdge(true);
                this.bubble.dataset.suppressClick = 'true';
            }
        },

        getBounds: function () {
            var rect = this.bubble.getBoundingClientRect();
            var gutter = window.matchMedia('(max-width: 640px)').matches ? 16 : 20;
            var navbar = document.getElementById('navbar');
            var navbarRect = navbar ? navbar.getBoundingClientRect() : null;
            var topBar = document.querySelector('.top-contact-bar');
            var navbarPosition = navbar ? getComputedStyle(navbar).position : '';
            var stickyHeaderHeight = navbar && (navbarPosition === 'sticky' || navbarPosition === 'fixed')
                ? navbar.offsetHeight + (topBar ? topBar.offsetHeight : 0)
                : 0;
            var visibleNavbarBottom = navbarRect && navbarRect.bottom > 0 && navbarRect.top < window.innerHeight
                ? navbarRect.bottom
                : 0;
            var navbarBottom = Math.max(stickyHeaderHeight, visibleNavbarBottom) + gutter;
            var minTop = Math.max(gutter, navbarBottom);

            return {
                minLeft: gutter,
                maxLeft: Math.max(gutter, window.innerWidth - rect.width - gutter),
                minTop: minTop,
                maxTop: Math.max(minTop, window.innerHeight - rect.height - gutter),
                width: rect.width,
                height: rect.height,
                gutter: gutter
            };
        },

        place: function (left, top) {
            var bounds = this.getBounds();
            left = Math.min(Math.max(bounds.minLeft, left), bounds.maxLeft);
            top = Math.min(Math.max(bounds.minTop, top), bounds.maxTop);

            this.bubble.style.left = left + 'px';
            this.bubble.style.top = top + 'px';
            this.bubble.style.right = 'auto';
            this.bubble.style.bottom = 'auto';
        },

        snapToNearestEdge: function (animate) {
            var rect = this.bubble.getBoundingClientRect();
            var bounds = this.getBounds();
            var candidates = [
                { edge: 'left', left: bounds.minLeft, top: this.clamp(rect.top, bounds.minTop, bounds.maxTop) },
                { edge: 'right', left: bounds.maxLeft, top: this.clamp(rect.top, bounds.minTop, bounds.maxTop) },
                { edge: 'top', left: this.clamp(rect.left, bounds.minLeft, bounds.maxLeft), top: bounds.minTop },
                { edge: 'bottom', left: this.clamp(rect.left, bounds.minLeft, bounds.maxLeft), top: bounds.maxTop }
            ];

            candidates.forEach(function (candidate) {
                candidate.distance = Math.hypot(candidate.left - rect.left, candidate.top - rect.top);
            });
            candidates.sort(function (a, b) {
                return a.distance - b.distance;
            });

            var target = this.avoidBackToTop(candidates[0], bounds);
            this.setDockClass(target.edge);

            if (animate) {
                clearTimeout(this.snapTimer);
                this.bubble.classList.add('is-snapping');
                this.snapTimer = setTimeout(function () {
                    this.bubble.classList.remove('is-snapping');
                }.bind(this), 460);
            }

            this.place(target.left, target.top);
            this.savePosition(target.edge);
        },

        avoidBackToTop: function (target, bounds) {
            var backToTop = document.querySelector('.back-to-top');
            if (!backToTop) return target;

            var reserved = backToTop.getBoundingClientRect();
            var bubbleRect = {
                left: target.left,
                right: target.left + bounds.width,
                top: target.top,
                bottom: target.top + bounds.height
            };
            var overlaps = bubbleRect.left < reserved.right + bounds.gutter &&
                bubbleRect.right > reserved.left - bounds.gutter &&
                bubbleRect.top < reserved.bottom + bounds.gutter &&
                bubbleRect.bottom > reserved.top - bounds.gutter;

            if (!overlaps) return target;

            if (target.edge === 'left' || target.edge === 'right') {
                var above = reserved.top - bounds.height - bounds.gutter;
                var below = reserved.bottom + bounds.gutter;
                target.top = above >= bounds.minTop ? above : Math.min(below, bounds.maxTop);
            } else {
                var before = reserved.left - bounds.width - bounds.gutter;
                var after = reserved.right + bounds.gutter;
                target.left = before >= bounds.minLeft ? before : Math.min(after, bounds.maxLeft);
            }

            return target;
        },

        savePosition: function (edge) {
            var rect = this.bubble.getBoundingClientRect();
            var bounds = this.getBounds();
            var vertical = edge === 'left' || edge === 'right';
            var span = vertical
                ? Math.max(1, bounds.maxTop - bounds.minTop)
                : Math.max(1, bounds.maxLeft - bounds.minLeft);
            var offset = vertical
                ? (rect.top - bounds.minTop) / span
                : (rect.left - bounds.minLeft) / span;

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    edge: edge,
                    offset: this.clamp(offset, 0, 1)
                }));
            } catch (error) {
                // Storage can be blocked in private browsing. Docking still works.
            }
        },

        restorePosition: function () {
            if (!this.bubble) return;

            var saved = null;
            try {
                saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            } catch (error) {
                saved = null;
            }

            if (!saved) {
                this.setDockClass('right');
                this.bubble.removeAttribute('style');
                return;
            }

            var bounds = this.getBounds();
            if (typeof saved.edge === 'string' && typeof saved.offset === 'number') {
                var point = this.pointForEdge(saved.edge, this.clamp(saved.offset, 0, 1), bounds);
                point = this.avoidBackToTop(point, bounds);
                this.setDockClass(point.edge);
                this.place(point.left, point.top);
                return;
            }

            // Older saved free positions are moved to an edge once, then upgraded.
            if (typeof saved.x === 'number' && typeof saved.y === 'number') {
                this.place(
                    saved.x * Math.max(1, window.innerWidth - bounds.width),
                    saved.y * Math.max(1, window.innerHeight - bounds.height)
                );
                this.snapToNearestEdge(false);
            }
        },

        pointForEdge: function (edge, offset, bounds) {
            if (edge === 'left' || edge === 'right') {
                return {
                    edge: edge,
                    left: edge === 'left' ? bounds.minLeft : bounds.maxLeft,
                    top: bounds.minTop + ((bounds.maxTop - bounds.minTop) * offset)
                };
            }

            edge = edge === 'top' ? 'top' : 'bottom';
            return {
                edge: edge,
                left: bounds.minLeft + ((bounds.maxLeft - bounds.minLeft) * offset),
                top: edge === 'top' ? bounds.minTop : bounds.maxTop
            };
        },

        setDockClass: function (edge) {
            this.bubble.classList.remove.apply(this.bubble.classList, EDGE_CLASSES);
            this.bubble.classList.add('is-docked-' + edge);
        },

        clamp: function (value, min, max) {
            return Math.min(Math.max(min, value), max);
        },

        resetPosition: function (event) {
            if (event) event.preventDefault();
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                // Nothing else is needed if storage is unavailable.
            }
            this.setDockClass('right');
            this.bubble.removeAttribute('style');
        }
    };

    window.FloatingControlsModule = FloatingControls;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            FloatingControls.init();
        }, { once: true });
    } else {
        FloatingControls.init();
    }
})();
