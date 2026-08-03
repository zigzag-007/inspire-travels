/* -----------------------------------------------------------------------------
   INSPIRE TRAVELS & TOURS - CARD SPOTLIGHT
   -----------------------------------------------------------------------------

   Author: Zig Zag AI
   Description: Makes cards light up softly where the mouse is hovering
   Purpose: Adds a small living detail so cards do not feel like flat boxes

   How it works: we save the mouse position on the card as CSS variables,
   and the CSS draws a soft glow at that spot. No layout is changed.

   -----------------------------------------------------------------------------
*/

(function () {
	'use strict';

	var CardSpotlight = {
		selector: '[data-spotlight]',
		observer: null,

		init: function () {
			// People who ask for less motion should not get this effect.
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				return;
			}

			// Touch screens have no hovering mouse, so skip the work there.
			if (!window.matchMedia('(hover: hover)').matches) {
				return;
			}

			this.scan(document);
			this.watchForNewCards();
		},

		scan: function (root) {
			var cards = root.querySelectorAll ? root.querySelectorAll(this.selector) : [];
			for (var i = 0; i < cards.length; i++) {
				this.attach(cards[i]);
			}
		},

		watchForNewCards: function () {
			if (!window.MutationObserver || this.observer) return;

			var self = this;
			this.observer = new MutationObserver(function (changes) {
				for (var i = 0; i < changes.length; i++) {
					for (var j = 0; j < changes[i].addedNodes.length; j++) {
						var node = changes[i].addedNodes[j];
						if (node.nodeType !== 1) continue;
						if (node.matches && node.matches(self.selector)) self.attach(node);
						self.scan(node);
					}
				}
			});

			this.observer.observe(document.body, { childList: true, subtree: true });
		},

		attach: function (card) {
			if (card.dataset.spotlightBound === 'true') return;
			card.dataset.spotlightBound = 'true';

			var pending = false;
			var lastX = 0;
			var lastY = 0;

			function paint() {
				pending = false;
				card.style.setProperty('--spot-x', lastX + '%');
				card.style.setProperty('--spot-y', lastY + '%');
			}

			card.addEventListener('pointermove', function (e) {
				var box = card.getBoundingClientRect();
				lastX = ((e.clientX - box.left) / box.width) * 100;
				lastY = ((e.clientY - box.top) / box.height) * 100;

				// Only paint once per frame, otherwise this gets expensive.
				if (!pending) {
					pending = true;
					window.requestAnimationFrame(paint);
				}
			});

			card.addEventListener('pointerleave', function () {
				card.style.removeProperty('--spot-x');
				card.style.removeProperty('--spot-y');
			});
		}
	};

	window.CardSpotlightModule = CardSpotlight;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			CardSpotlight.init();
		});
	} else {
		CardSpotlight.init();
	}
})();
