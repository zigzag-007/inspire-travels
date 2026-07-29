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
            });
        },

        switchTab: function(tabName, doScroll, scrollTargetId) {
            var tabs = ['overview', 'options', 'details'];

            tabs.forEach(function(tab) {
                var button = document.getElementById('tab-btn-' + tab);
                var panel = document.getElementById('tour-tab-panel-' + tab);
                var isActive = tab === tabName;

                if (button) {
                    button.classList.toggle('text-emerald-700', isActive);
                    button.classList.toggle('font-bold', isActive);
                    button.classList.toggle('border-emerald-700', isActive);
                    button.classList.toggle('text-slate-500', !isActive);
                    button.classList.toggle('font-semibold', !isActive);
                    button.classList.toggle('border-transparent', !isActive);
                }

                if (panel) panel.classList.toggle('hidden', !isActive);
            });

            if (doScroll) {
                var activePanel = document.getElementById(scrollTargetId) || document.getElementById('tour-tab-panel-' + tabName);
                if (activePanel) {
                    var y = activePanel.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        }
    };

})();
