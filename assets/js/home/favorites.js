// Tour Favorites Module
// Author: Zig Zag AI
// Description: Saves a visitor's preferred packages locally and reflects each state on its card.

(function() {
    'use strict';

    var storageKey = 'inspire-travels-favorite-tours';

    function getFavorites() {
        try {
            return JSON.parse(window.localStorage.getItem(storageKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveFavorites(favorites) {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(favorites));
        } catch (error) {
            // The visual state still works when browser storage is unavailable.
        }
    }

    function setButtonState(button, isFavorite) {
        var icon = button.querySelector('[data-lucide="heart"]');
        var label = button.dataset.favoriteTourName || 'this tour';

        button.setAttribute('aria-pressed', String(isFavorite));
        button.setAttribute('aria-label', isFavorite ? 'Remove ' + label + ' from favorites' : 'Add ' + label + ' to favorites');
        button.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
        button.classList.toggle('text-red-500', isFavorite);
        button.classList.toggle('bg-rose-50', isFavorite);
        button.classList.toggle('hover:text-red-500', !isFavorite);

        if (icon) icon.classList.toggle('fill-current', isFavorite);
    }

    window.FavoritesModule = {
        init: function() {
            var favorites = getFavorites();

            document.querySelectorAll('[data-favorite-tour]').forEach(function(button) {
                var slug = button.dataset.favoriteTour;
                if (!slug || button.dataset.favoriteBound === 'true') return;

                button.dataset.favoriteBound = 'true';
                setButtonState(button, favorites.includes(slug));

                button.addEventListener('click', function() {
                    var index = favorites.indexOf(slug);
                    var isFavorite = index === -1;

                    if (isFavorite) {
                        favorites.push(slug);
                    } else {
                        favorites.splice(index, 1);
                    }

                    saveFavorites(favorites);
                    setButtonState(button, isFavorite);
                });
            });
        }
    };
})();
