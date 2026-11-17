// Navigation Menus Module
// Keeps desktop dropdowns and mobile submenus in one shared data source.

(function () {
    'use strict';

    var menus = {
        tours: {
            label: 'Tours',
            number: '02',
            icon: 'map',
            items: [
                { label: 'Featured Tours', meta: 'Six popular private routes', path: 'index.html#tours' },
                { label: 'Family Tours', meta: 'Four flexible journeys', path: 'tours/collection-family.html' },
                { label: 'Group Tours', meta: 'Three shared journeys', path: 'tours/collection-group.html' },
                { label: 'Northern Shores', meta: 'North and east coast route', path: 'tours/collection-northern-shores.html' },
                { label: 'Culture & Heritage', meta: 'Three heritage journeys', path: 'tours/collection-cultural-heritage.html' },
                { label: 'Adventure Tours', meta: 'Active island escapes', path: 'tours/collection-adventure.html' }
            ]
        },
        destinations: {
            label: 'Destinations',
            number: '03',
            icon: 'map-pin',
            items: [
                { label: 'Sigiriya', meta: 'Cultural Triangle', path: 'destinations/sigiriya.html' },
                { label: 'Ella', meta: 'Hill Country', path: 'destinations/ella.html' },
                { label: 'Kandy', meta: 'Royal Heritage', path: 'destinations/kandy.html' },
                { label: 'Colombo', meta: 'Commercial Capital', path: 'destinations/colombo.html' },
                { label: 'Trincomalee', meta: 'East Coast', path: 'destinations/trincomalee.html' },
                { label: 'Arugam Bay', meta: 'Surf Coast', path: 'destinations/arugambay.html' },
                { label: 'Bentota', meta: 'Southwest Coast', path: 'destinations/bentota.html' }
            ]
        },
        gallery: {
            label: 'Gallery',
            number: '05',
            icon: 'image',
            items: [
                { label: 'Featured Moments', meta: 'Homepage collection', path: 'index.html#gallery' },
                { label: 'Full Photo Archive', meta: '50+ real moments', path: 'gallery.html' }
            ]
        }
    };

    function getPath(path) {
        return (document.body.dataset.navBase || '') + path;
    }

    function renderDesktopMenu(container) {
        var menu = menus[container.dataset.desktopMenu];
        var panel = container.querySelector('[data-nav-panel]');
        if (!menu || !panel) return;

        if (menu.items.length > 4) panel.classList.add('is-wide');
        panel.innerHTML = '<div class="desktop-nav-dropdown-grid">' + menu.items.map(function (item) {
            return '<a href="' + getPath(item.path) + '" class="desktop-nav-dropdown-link">' +
                '<span class="desktop-nav-dropdown-label">' + item.label + '</span>' +
                '<span class="desktop-nav-dropdown-meta">' + item.meta + '</span>' +
            '</a>';
        }).join('') + '</div>';

        if (document.body.dataset.currentNav === container.dataset.desktopMenu) {
            var trigger = container.querySelector('.nav-link');
            if (trigger) trigger.classList.add('text-accent');
        }
        bindDesktopMenu(container, panel);
    }

    // Keep visual disclosure, keyboard access and the spoken state together.
    function bindDesktopMenu(container, panel) {
        var trigger = container.querySelector('.nav-link');
        if (!trigger) return;
        // Hidden panels stay outside keyboard navigation until they are opened.
        function setOpen(open) {
            container.classList.toggle('is-open', open);
            trigger.setAttribute('aria-expanded', String(open));
            panel.inert = !open;
        }
        setOpen(false);
        container.addEventListener('mouseenter', function() { setOpen(true); });
        container.addEventListener('mouseleave', function() {
            if (!container.contains(document.activeElement)) setOpen(false);
        });
        container.addEventListener('focusin', function() { setOpen(true); });
        container.addEventListener('focusout', function(event) {
            if (!container.contains(event.relatedTarget)) setOpen(false);
        });
        container.addEventListener('keydown', function(event) {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                trigger.focus();
                setOpen(false);
            } else if (event.key === 'ArrowDown' && event.target === trigger) {
                event.preventDefault();
                setOpen(true);
                panel.querySelector('a').focus();
            }
        });
    }

    function renderMobileMenu(container, index) {
        var key = container.dataset.mobileMenu;
        var menu = menus[key];
        if (!menu) return;

        var panelId = 'mobile-' + key + '-submenu-' + index;
        container.innerHTML =
            '<button type="button" class="mobile-menu-control mobile-submenu-toggle" data-section="' + key + '" aria-expanded="false" aria-controls="' + panelId + '">' +
                '<span class="secondary-mobile-nav-index">' + menu.number + '</span>' +
                '<span class="secondary-mobile-nav-icon"><i data-lucide="' + menu.icon + '"></i></span>' +
                '<span class="secondary-mobile-nav-label">' + menu.label + '</span>' +
                '<i data-lucide="chevron-down" class="mobile-submenu-chevron w-4 h-4"></i>' +
            '</button>' +
            '<div id="' + panelId + '" class="mobile-submenu hidden" aria-hidden="true">' +
                menu.items.map(function (item) {
                    return '<a href="' + getPath(item.path) + '" class="mobile-nav-link mobile-submenu-link">' +
                        '<span>' + item.label + '</span>' +
                        '<small>' + item.meta + '</small>' +
                    '</a>';
                }).join('') +
            '</div>';
    }

    window.NavigationMenusModule = {
        init: function () {
            document.querySelectorAll('[data-desktop-menu]').forEach(renderDesktopMenu);
            document.querySelectorAll('[data-mobile-menu]').forEach(renderMobileMenu);
        }
    };

    window.NavigationMenusModule.init();
})();
