// Navigation Menus Module
// Keeps desktop dropdowns and mobile submenus in one shared data source.

(function () {
    'use strict';

    var menus = {
        tours: {
            label: 'Tours',
            icon: 'map',
            items: [
                { label: 'Sri Lanka Highlights Escape', meta: '5 days', path: 'tours/?tour=highlights-escape' },
                { label: 'Hills to Beach Escape', meta: '7 days', path: 'tours/?tour=hills-to-beach' },
                { label: 'Golden Triangle & Beyond', meta: '7 days', path: 'tours/?tour=golden-triangle' },
                { label: 'Ramayanaya Tour', meta: '8 days', path: 'tours/?tour=ramayanaya-tour' },
                { label: 'Pearl Of Asia Tour', meta: '10 days', path: 'tours/?tour=pearl-of-asia' },
                { label: 'Sri Lanka Grand Tour', meta: '14 days', path: 'tours/?tour=grand-tour' }
            ]
        },
        destinations: {
            label: 'Destinations',
            icon: 'map-pin',
            items: [
                { label: 'Sigiriya', meta: 'Cultural Triangle', path: 'destinations/?destination=sigiriya' },
                { label: 'Ella', meta: 'Hill Country', path: 'destinations/?destination=ella' },
                { label: 'Kandy', meta: 'Royal Heritage', path: 'destinations/?destination=kandy' },
                { label: 'Colombo', meta: 'Capital City', path: 'destinations/?destination=colombo' },
                { label: 'Trincomalee', meta: 'East Coast', path: 'destinations/?destination=trincomalee' },
                { label: 'Arugam Bay', meta: 'Surf Coast', path: 'destinations/?destination=arugambay' },
                { label: 'Bentota', meta: 'Southwest Coast', path: 'destinations/?destination=bentota' }
            ]
        },
        gallery: {
            label: 'Gallery',
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
    }

    function renderMobileMenu(container, index) {
        var key = container.dataset.mobileMenu;
        var menu = menus[key];
        if (!menu) return;

        var panelId = 'mobile-' + key + '-submenu-' + index;
        container.innerHTML =
            '<button type="button" class="mobile-menu-control mobile-submenu-toggle" data-section="' + key + '" aria-expanded="false" aria-controls="' + panelId + '">' +
                '<i data-lucide="' + menu.icon + '" class="w-4 h-4 sm:w-5 sm:h-5"></i>' +
                '<span>' + menu.label + '</span>' +
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
