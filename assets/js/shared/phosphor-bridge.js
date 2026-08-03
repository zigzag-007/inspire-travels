// Phosphor Icon Bridge
// Converts Lucide data-lucide tags to Phosphor CSS font icons at runtime.
// Exposes PhosphorBridge.reinit(container) for dynamic content.

(function () {
    'use strict';

    var NAME_MAP = {
        'arrow-left':     'arrow-left',
        'arrow-right':    'arrow-right',
        'award':          'trophy',
        'baby':           'baby',
        'bed':            'bed',
        'book-open':      'book-open',
        'briefcase':      'briefcase',
        'calendar':       'calendar-blank',
        'camera':         'camera',
        'car':            'car',
        'check':          'check',
        'check-circle':   'check-circle',
        'check-circle-2': 'check-circle',
        'chevron-down':   'caret-down',
        'chevron-right':  'caret-right',
        'clock':          'clock',
        'compass':        'compass',
        'droplet':        'drop',
        'file-text':      'file-text',
        'footprints':     'footprints',
        'heart':          'heart',
        'home':           'house',
        'image':          'image',
        'landmark':       'bank',
        'mail':           'envelope',
        'map':            'map-trifold',
        'map-pin':        'map-pin',
        'maximize-2':     'arrows-out',
        'menu':           'list',
        'message-circle': 'chat-circle',
        'mountain':       'mountains',
        'phone':          'phone',
        'play':           'play',
        'plus':           'plus',
        'repeat':         'repeat',
        'send':           'paper-plane-right',
        'shield':         'shield',
        'shield-check':   'shield-check',
        'sliders':        'sliders',
        'sparkles':       'sparkle',
        'star':           'star',
        'sun':            'sun',
        'tag':            'tag',
        'thumbs-up':      'thumbs-up',
        'trees':          'tree',
        'user-check':     'user-check',
        'users':          'users',
        'utensils':       'fork-knife',
        'wifi':           'wifi-high',
        'x':              'x'
    };

    // Icons that look better filled
    var FILL_ICONS = {
        'star': true,
        'play': true,
        'check-circle': true,
        'check-circle-2': true,
        'shield-check': true
    };

    // Tailwind w/h pairs to font size
    var SIZE_MAP = {
        'w-2 h-2':       'text-[8px]',
        'w-2.5 h-2.5':   'text-[10px]',
        'w-3 h-3':       'text-xs',
        'w-3.5 h-3.5':   'text-sm',
        'w-4 h-4':       'text-base',
        'w-4.5 h-4.5':   'text-lg',
        'w-5 h-5':       'text-xl',
        'w-6 h-6':       'text-2xl',
        'w-7 h-7':       'text-[28px]',
        'w-8 h-8':       'text-3xl',
        'w-10 h-10':     'text-4xl',
        'w-12 h-12':     'text-5xl'
    };

    // Matches w-X or h-X with optional responsive prefix
    var SIZE_RE = /^((?:sm:|md:|lg:|xl:)?)(w|h)-(\S+)$/;

    function convertElement(el) {
        var lucideName = el.getAttribute('data-lucide');
        if (!lucideName) return;

        var phosphorName = NAME_MAP[lucideName];
        if (!phosphorName) return;

        var classList = (el.className || '').toString();
        var useFill = FILL_ICONS[lucideName] === true;
        // Heart only uses fill weight when fill-current was explicitly set
        if (lucideName === 'heart') {
            useFill = classList.indexOf('fill-current') !== -1;
        }

        var baseWeight = useFill ? 'ph-fill' : 'ph';
        var iconClass  = 'ph-' + phosphorName;
        var result     = [baseWeight, iconClass];

        var parts = classList.split(/\s+/).filter(function (c) { return c; });
        var widths  = {};
        var heights = {};
        var keep    = [];

        for (var i = 0; i < parts.length; i++) {
            var c = parts[i];
            // Phosphor handles fill via weight, skip this SVG class
            if (c === 'fill-current') continue;

            var m = SIZE_RE.exec(c);
            if (m) {
                var prefix = m[1] || '';
                if (m[2] === 'w') { widths[prefix]  = m[3]; }
                else              { heights[prefix] = m[3]; }
                continue;
            }
            keep.push(c);
        }

        // Convert matched w/h pairs into text-size classes
        var allPrefixes = {};
        var pKey;
        for (pKey in widths)  allPrefixes[pKey] = true;
        for (pKey in heights) allPrefixes[pKey] = true;

        for (pKey in allPrefixes) {
            var w = widths[pKey];
            var h = heights[pKey];
            if (w && h) {
                var sizeKey = 'w-' + w + ' h-' + h;
                var mapped  = SIZE_MAP[sizeKey];
                if (mapped) {
                    result.push(pKey + mapped);
                }
            }
        }

        // Preserve all non-size, non-fill-current classes
        for (var j = 0; j < keep.length; j++) {
            result.push(keep[j]);
        }

        el.removeAttribute('data-lucide');
        el.className = result.join(' ');
        el.innerHTML = '';
    }

    // Process all remaining Lucide icons in a container or the whole page
    function reinit(container) {
        var root = container || document;
        var els = root.querySelectorAll('[data-lucide]');
        for (var k = 0; k < els.length; k++) {
            convertElement(els[k]);
        }
    }

    window.PhosphorBridge = { reinit: reinit, convert: convertElement };

    // Auto run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { reinit(); });
    } else {
        reinit();
    }
})();
