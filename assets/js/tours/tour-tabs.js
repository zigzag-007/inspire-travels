// Tour Tabs Module
// Author: Zig Zag AI
// Description: Controls the overview, options, and details panels.

(function() {
    'use strict';

    window.TourTabsModule = {
        init: function() {
            document.querySelectorAll('[data-tour-tab]').forEach(function(trigger) {
                trigger.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.TourTabsModule.switchTab(
                        trigger.dataset.tourTab,
                        trigger.dataset.tourScroll === 'true',
                        trigger.dataset.tourScrollTarget
                    );
                });

                trigger.addEventListener('keydown', function(event) {
                    var tabButtons = Array.from(document.querySelectorAll('[role="tablist"] [role="tab"]'));
                    if (!tabButtons.length) return;
                    var currentIndex = tabButtons.indexOf(trigger);
                    if (currentIndex < 0) return;
                    var nextIndex;

                    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                    else if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabButtons.length;
                    else if (event.key === 'Home') nextIndex = 0;
                    else if (event.key === 'End') nextIndex = tabButtons.length - 1;
                    else return;

                    event.preventDefault();
                    tabButtons[nextIndex].focus();
                    window.TourTabsModule.switchTab(tabButtons[nextIndex].dataset.tourTab);
                });
            });
        },

        switchTab: function(tabName, doScroll, scrollTargetId) {
            var tabs = ['overview', 'options', 'details'];

            tabs.forEach(function(tab) {
                var button = document.getElementById('tab-btn-' + tab);
                var panel = document.getElementById('tour-tab-panel-' + tab);
                var isActive = tab === tabName;

                if (button) {
                    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
                    button.setAttribute('tabindex', isActive ? '0' : '-1');
                    button.classList.toggle('text-emerald-700', isActive);
                    button.classList.toggle('font-bold', isActive);
                    button.classList.toggle('border-emerald-700', isActive);
                    button.classList.toggle('text-slate-500', !isActive);
                    button.classList.toggle('font-semibold', !isActive);
                    button.classList.toggle('border-transparent', !isActive);
                }

                if (panel) {
                    panel.classList.toggle('hidden', !isActive);
                    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                }
            });

            if (doScroll) {
                var activePanel = document.getElementById(scrollTargetId) || document.getElementById('tour-tab-panel-' + tabName);
                if (activePanel) {
                    if (window.NavigationModule && typeof window.NavigationModule.smoothScrollTo === 'function') {
                        var y = window.NavigationModule.getScrollTargetY
                            ? window.NavigationModule.getScrollTargetY(activePanel)
                            : Math.max(0, activePanel.getBoundingClientRect().top + window.pageYOffset - 100);
                        window.NavigationModule.smoothScrollTo(y, 1000);
                    } else {
                        var y = Math.max(0, activePanel.getBoundingClientRect().top + window.pageYOffset - 100);
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }
            }
        }
    };

})();
