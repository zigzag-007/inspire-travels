// Liquid Glass Module
// Adds one shared SVG refraction filter for every page.

(function () {
    'use strict';

    var LiquidGlassModule = {
        init: function () {
            if (document.getElementById('container-glass')) return;

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '0');
            svg.setAttribute('height', '0');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
            svg.classList.add('liquid-glass-filter');
            svg.innerHTML =
                '<filter id="container-glass" x="0%" y="0%" width="100%" height="100%">' +
                    '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise"></feTurbulence>' +
                    '<feGaussianBlur in="noise" stdDeviation="0.02" result="blur"></feGaussianBlur>' +
                    '<feDisplacementMap in="SourceGraphic" in2="blur" scale="40" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>' +
                '</filter>';

            document.body.appendChild(svg);
        }
    };

    window.LiquidGlassModule = LiquidGlassModule;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            LiquidGlassModule.init();
        }, { once: true });
    } else {
        LiquidGlassModule.init();
    }
})();
