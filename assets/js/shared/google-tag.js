// Shared Google Tag Module
// Sets up Analytics and Ads once for each page.

(function () {
    'use strict';

    if (window.GoogleTagModule) return;

    var initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', 'G-WJDJXSTTR4');
        window.gtag('config', 'AW-18419592371');
    }

    window.GoogleTagModule = { init: init };
    init();
})();
