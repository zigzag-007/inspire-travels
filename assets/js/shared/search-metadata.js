// Shared Search Metadata Module
// Keeps each rendered guide and tour matched to its search details.

(function () {
    'use strict';

    var origin = 'https://inspiretraveltours.com';

    function meta(key, content, property) {
        var attribute = property ? 'property' : 'name';
        var element = document.head.querySelector('meta[' + attribute + '="' + key + '"]');
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, key);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    }

    function update(page) {
        var url = origin + page.path;
        var image = new URL(page.image, origin + '/').href;
        document.title = page.title;
        meta('description', page.description);
        meta('og:title', page.title, true);
        meta('og:description', page.description, true);
        meta('og:url', url, true);
        meta('og:image', image, true);
        meta('og:type', 'website', true);
        meta('og:site_name', 'Inspire Travels & Tours', true);
        meta('twitter:card', 'summary_large_image');
        meta('twitter:title', page.title);
        meta('twitter:description', page.description);
        meta('twitter:url', url);
        meta('twitter:image', image);

        var canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);
        document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (link) {
            link.setAttribute('href', url);
        });
        // Image dimensions vary with the selected route photo.
        document.head.querySelectorAll('meta[property="og:image:width"], meta[property="og:image:height"]').forEach(function (element) {
            element.remove();
        });

        var schema = document.getElementById('page-search-data');
        if (!schema) {
            schema = document.createElement('script');
            schema.id = 'page-search-data';
            schema.type = 'application/ld+json';
            document.head.appendChild(schema);
        }
        var entity = {
            '@type': page.type || 'WebPage',
            '@id': url + '#page',
            url: url,
            name: page.title,
            description: page.description,
            image: image,
            isPartOf: { '@id': origin + '/#website' }
        };
        schema.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [entity, {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
                    { '@type': 'ListItem', position: 2, name: page.label, item: url }
                ]
            }]
        });
    }

    window.SearchMetadataModule = { update: update };
})();
