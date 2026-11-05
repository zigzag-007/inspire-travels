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

    function formatDescription(value) {
        var description = String(value || '').replace(/\s+/g, ' ').trim();
        if (description.length <= 158) return description;
        var slice = description.slice(0, 155);
        var wordEnd = slice.lastIndexOf(' ');
        return slice.slice(0, wordEnd > 110 ? wordEnd : 155).replace(/[,:;\s]+$/, '') + '…';
    }

    function buildTourEntity(tour) {
        var url = origin + '/tours/' + encodeURIComponent(tour.slug) + '.html';
        return {
            '@type': 'TouristTrip',
            '@id': url + '#tour',
            url: url,
            name: tour.title,
            description: tour.description,
            image: new URL(tour.image, origin + '/').href,
            provider: { '@id': origin + '/#agency' },
            itinerary: {
                '@type': 'ItemList',
                itemListElement: (tour.days || []).map(function(day, index) {
                    return {
                        '@type': 'ListItem',
                        position: index + 1,
                        name: day.label + ': ' + day.title,
                        description: (day.activities || []).join(', ')
                    };
                })
            }
        };
    }

    function buildTourCollectionEntity(tours) {
        return {
            '@type': 'ItemList',
            itemListElement: tours.map(function(tour, index) {
                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    item: buildTourEntity(tour)
                };
            })
        };
    }

    function buildDestinationEntity(destination) {
        var url = origin + '/destinations/' + encodeURIComponent(destination.slug) + '.html';
        return {
            '@type': 'TouristDestination',
            '@id': url + '#destination',
            url: url,
            name: destination.name,
            description: destination.excerpt,
            image: new URL(destination.heroImage, origin + '/').href,
            containedInPlace: {
                '@type': 'Country',
                name: 'Sri Lanka'
            }
        };
    }

    function buildTourBreadcrumbs(tour, collection) {
        var collectionPath = collection
            ? '/tours/collection-' + encodeURIComponent(collection.slug) + '.html'
            : '/#tours';
        return [
            { label: 'Home', path: '/' },
            { label: collection ? collection.navLabel : 'Featured Tours', path: collectionPath },
            { label: tour.title, path: '/tours/' + encodeURIComponent(tour.slug) + '.html' }
        ];
    }

    function buildTourCollectionBreadcrumbs(collection) {
        var path = '/tours/collection-' + encodeURIComponent(collection.slug) + '.html';
        return [
            { label: 'Home', path: '/' },
            { label: 'Tours', path: '/#tours' },
            { label: collection.navLabel, path: path }
        ];
    }

    function buildDestinationBreadcrumbs(destination) {
        var path = '/destinations/' + encodeURIComponent(destination.slug) + '.html';
        return [
            { label: 'Home', path: '/' },
            { label: 'Destinations', path: '/#destinations' },
            { label: destination.name, path: path }
        ];
    }

    function buildSchema(page) {
        var url = origin + page.path;
        var image = new URL(page.image, origin + '/').href;
        var description = formatDescription(page.description);
        var entity = {
            '@type': page.type || 'WebPage',
            '@id': url + '#page',
            url: url,
            name: page.title,
            description: description,
            image: image,
            inLanguage: 'en',
            isPartOf: { '@id': origin + '/#website' }
        };
        if (page.mainEntity) entity.mainEntity = page.mainEntity;

        var breadcrumbs = page.breadcrumbs || [
            { label: 'Home', path: '/' },
            { label: page.label || page.title, path: page.path }
        ];

        return {
            '@context': 'https://schema.org',
            '@graph': [entity, {
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs.map(function(item, index) {
                    return {
                        '@type': 'ListItem',
                        position: index + 1,
                        name: item.label,
                        item: item.url || (item.path.indexOf('://') !== -1 ? item.path : origin + item.path)
                    };
                })
            }]
        };
    }

    function update(page) {
        var url = origin + page.path;
        var image = new URL(page.image, origin + '/').href;
        var description = formatDescription(page.description);
        document.title = page.title;
        meta('description', description);
        meta('og:title', page.title, true);
        meta('og:description', description, true);
        meta('og:url', url, true);
        meta('og:image', image, true);
        meta('og:type', 'website', true);
        meta('og:site_name', 'Inspire Travels & Tours', true);
        meta('twitter:card', 'summary_large_image');
        meta('twitter:title', page.title);
        meta('twitter:description', description);
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
        schema.textContent = JSON.stringify(buildSchema(page));
    }

    window.SearchMetadataModule = {
        update: update,
        buildSchema: buildSchema,
        formatDescription: formatDescription,
        buildTourEntity: buildTourEntity,
        buildTourCollectionEntity: buildTourCollectionEntity,
        buildDestinationEntity: buildDestinationEntity,
        buildTourBreadcrumbs: buildTourBreadcrumbs,
        buildTourCollectionBreadcrumbs: buildTourCollectionBreadcrumbs,
        buildDestinationBreadcrumbs: buildDestinationBreadcrumbs
    };
})();
