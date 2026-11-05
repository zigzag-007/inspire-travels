#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const outputRoot = path.resolve(process.argv[2] || projectRoot);
const siteOrigin = 'https://inspiretraveltours.com';

function readProjectFile(relativePath) {
    return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function loadBrowserData(relativePath, moduleName) {
    const context = { window: {}, URL: URL };
    vm.runInNewContext(readProjectFile(relativePath), context, { filename: relativePath });
    if (!context.window[moduleName]) {
        throw new Error('Could not load ' + moduleName + ' from ' + relativePath);
    }
    return context.window[moduleName];
}

const searchMetadata = loadBrowserData('assets/js/shared/search-metadata.js', 'SearchMetadataModule');

function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(character) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character];
    });
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceElementContent(html, id, content) {
    const escapedId = escapeRegExp(id);
    const openPattern = new RegExp("<([a-z][a-z0-9:-]*)\\b(?=[^>]*\\bid=[\"']" + escapedId + "[\"'])[^>]*>", 'i');
    const opening = openPattern.exec(html);
    if (!opening) throw new Error('Could not find element #' + id + ' in the page template');

    const tagName = opening[1];
    const contentStart = opening.index + opening[0].length;
    const sameTagPattern = new RegExp('<\\/?' + tagName + '\\b[^>]*>', 'ig');
    sameTagPattern.lastIndex = contentStart;

    let depth = 1;
    let token;
    while ((token = sameTagPattern.exec(html))) {
        if (/^<\//.test(token[0])) {
            depth -= 1;
        } else if (!/\/\s*>$/.test(token[0])) {
            depth += 1;
        }

        if (depth === 0) {
            return html.slice(0, contentStart) + content + html.slice(token.index);
        }
    }

    throw new Error('Could not find the closing tag for #' + id);
}

function removeElement(html, id) {
    const escapedId = escapeRegExp(id);
    const openPattern = new RegExp("<([a-z][a-z0-9:-]*)\\b(?=[^>]*\\bid=[\"']" + escapedId + "[\"'])[^>]*>", 'i');
    const opening = openPattern.exec(html);
    if (!opening) throw new Error('Could not find element #' + id + ' in the page template');

    const tagName = opening[1];
    const contentStart = opening.index + opening[0].length;
    const sameTagPattern = new RegExp('<\\/?' + tagName + '\\b[^>]*>', 'ig');
    sameTagPattern.lastIndex = contentStart;

    let depth = 1;
    let token;
    while ((token = sameTagPattern.exec(html))) {
        if (/^<\//.test(token[0])) {
            depth -= 1;
        } else if (!/\/\s*>$/.test(token[0])) {
            depth += 1;
        }

        if (depth === 0) {
            return html.slice(0, opening.index) + html.slice(sameTagPattern.lastIndex);
        }
    }

    throw new Error('Could not find the closing tag for #' + id);
}

function updateElementAttribute(html, id, attribute, value) {
    const escapedId = escapeRegExp(id);
    const openPattern = new RegExp("<([a-z][a-z0-9:-]*)\\b(?=[^>]*\\bid=[\"']" + escapedId + "[\"'])[^>]*>", 'i');
    return html.replace(openPattern, function(tag) {
        const escapedValue = escapeHtml(value);
        const attributePattern = new RegExp('\\b' + escapeRegExp(attribute) + '=("[^"]*"|\'[^\']*\')', 'i');
        const replacement = attribute + '="' + escapedValue + '"';
        return attributePattern.test(tag)
            ? tag.replace(attributePattern, replacement)
            : tag.replace(/\s*\/?\s*>$/, ' ' + replacement + '>');
    });
}

function updateMeta(html, attribute, key, value) {
    const tagPattern = new RegExp("<meta\\b(?=[^>]*\\b" + attribute + "=[\"']" + escapeRegExp(key) + "[\"'])[^>]*>", 'i');
    const match = tagPattern.exec(html);
    if (!match) throw new Error('Could not find meta ' + attribute + '="' + key + '" in the page template');
    const tag = match[0];
    const contentPattern = /\bcontent=("[^"]*"|'[^']*')/i;
    const replacement = 'content="' + escapeHtml(value) + '"';
    return html.slice(0, match.index) + tag.replace(contentPattern, replacement) + html.slice(match.index + tag.length);
}

function setCanonical(html, url) {
    const canonicalPattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i;
    const existing = canonicalPattern.exec(html);
    if (existing) {
        const updated = existing[0].replace(/\bhref=("[^"]*"|'[^']*')/i, 'href="' + escapeHtml(url) + '"');
        return html.slice(0, existing.index) + updated + html.slice(existing.index + existing[0].length);
    }

    const canonical = '<link id="canonical-link" rel="canonical" href="' + escapeHtml(url) + '">';
    const descriptionPattern = /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i;
    return html.replace(descriptionPattern, function(tag) { return tag + '\n\t\t' + canonical; });
}

function setHeadMetadata(html, page) {
    const description = searchMetadata.formatDescription(page.description);
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escapeHtml(page.title) + '</title>');
    html = updateMeta(html, 'name', 'description', description);
    html = updateMeta(html, 'property', 'og:type', 'website');
    html = updateMeta(html, 'property', 'og:url', page.url);
    html = updateMeta(html, 'property', 'og:title', page.title);
    html = updateMeta(html, 'property', 'og:description', description);
    html = updateMeta(html, 'property', 'og:image', page.image);
    html = updateMeta(html, 'name', 'twitter:url', page.url);
    html = updateMeta(html, 'name', 'twitter:title', page.title);
    html = updateMeta(html, 'name', 'twitter:description', description);
    html = updateMeta(html, 'name', 'twitter:image', page.image);
    html = html.replace(/<meta\b(?=[^>]*\bproperty=["']og:image:(?:width|height)["'])[^>]*>\s*/gi, '');
    return setCanonical(html, page.url);
}

function setStructuredData(html, page) {
    const json = JSON.stringify(searchMetadata.buildSchema(page), null, 2).replace(/</g, '\\u003c');
    return replaceElementContent(html, 'page-search-data', '\n' + json + '\n\t\t');
}

function renderDay(day) {
    const activities = (day.activities || []).map(function(activity) {
        return '<li>' + escapeHtml(activity) + '</li>';
    }).join('');
    const overnight = day.overnight ? '<p class="mt-3 text-sm text-slate-600"><strong>Overnight:</strong> ' + escapeHtml(day.overnight) + '</p>' : '';

    return '<li class="border-t border-emerald-900/15 py-7">' +
        '<h3 class="font-display text-2xl font-semibold text-slate-950">' + escapeHtml(day.label) + ': ' + escapeHtml(day.title) + '</h3>' +
        (activities ? '<ul class="mt-4 grid gap-2 text-slate-700 sm:grid-cols-2">' + activities + '</ul>' : '') +
        overnight +
    '</li>';
}

function renderTourPage(tour, collectionData) {
    const url = siteOrigin + '/tours/' + tour.slug + '.html';
    const image = new URL(tour.image, siteOrigin + '/').href;
    const title = tour.title + ' | Inspire Travels & Tours';
    const description = searchMetadata.formatDescription(tour.description);
    const days = (tour.days || []).map(renderDay).join('');
    const collection = tour.collections[0] ? collectionData.getBySlug(tour.collections[0]) : null;
    const collectionLabel = collection ? collection.navLabel : 'Featured Tours';
    const collectionHref = collection ? 'collection-' + collection.slug + '.html' : '../index.html#tours';
    let html = readProjectFile('tours/index.html');

    html = setHeadMetadata(html, { title: title, description: description, url: url, image: image });
    html = updateElementAttribute(html, 'tour-content', 'class', 'min-h-screen px-5 pb-20 pt-28 sm:px-8');
    html = setStructuredData(html, {
        title: title,
        label: tour.title,
        description: description,
        path: '/tours/' + tour.slug + '.html',
        image: tour.image,
        breadcrumbs: searchMetadata.buildTourBreadcrumbs(tour, collection),
        mainEntity: searchMetadata.buildTourEntity(tour)
    });

    const body = '<main id="tour-content" class="min-h-screen px-5 pb-20 pt-28 sm:px-8">' +
        '<article class="mx-auto max-w-5xl rounded-3xl bg-white/90 p-6 shadow-xl sm:p-10">' +
            '<nav class="text-sm text-emerald-800" aria-label="Breadcrumb"><a href="../index.html">Home</a> / <a href="' + escapeHtml(collectionHref) + '">' + escapeHtml(collectionLabel) + '</a> / <span aria-current="page">' + escapeHtml(tour.title) + '</span></nav>' +
            '<div class="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)] md:items-center">' +
                '<div><p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">' + escapeHtml(tour.duration || 'Sri Lanka tour') + (tour.nights ? ' · ' + escapeHtml(tour.nights) : '') + '</p>' +
                    '<h1 class="mt-3 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">' + escapeHtml(tour.title) + '</h1>' +
                    '<p class="mt-5 text-lg leading-relaxed text-slate-700">' + escapeHtml(description) + '</p>' +
                '</div><img class="aspect-[4/3] w-full rounded-2xl object-cover" src="../' + escapeHtml(tour.image) + '" alt="' + escapeHtml(tour.title) + ' in Sri Lanka" fetchpriority="high">' +
            '</div>' +
            '<section class="mt-12" aria-labelledby="static-tour-itinerary"><h2 id="static-tour-itinerary" class="font-display text-3xl font-semibold text-slate-950">Day by day Sri Lanka tour itinerary</h2>' +
                '<ol class="mt-6">' + days + '</ol></section>' +
            '<p class="mt-10 rounded-2xl bg-emerald-50 p-5 text-slate-700">Ask Inspire Travels & Tours to tailor this route, travel dates, and pace to your plans.</p>' +
            '<a class="mt-7 inline-flex rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white" href="https://api.whatsapp.com/send?phone=94785959333&amp;text=' + encodeURIComponent('Hello, I would like to ask about ' + tour.title + '.') + '">Ask about this Sri Lanka tour</a>' +
        '</article></main>';
    html = replaceElementContent(html, 'tour-content', body.replace(/^<main[^>]*>|<\/main>$/g, ''));
    return html;
}

function renderCollectionPage(collection, tours) {
    const slug = 'collection-' + collection.slug;
    const url = siteOrigin + '/tours/' + slug + '.html';
    const image = new URL(collection.heroImage, siteOrigin + '/').href;
    const title = collection.navLabel + ' in Sri Lanka | Inspire Travels & Tours';
    const description = searchMetadata.formatDescription(collection.description);
    const tourLinks = tours.map(function(tour) {
        const firstDay = tour.days && tour.days[0];
        const lastDay = tour.days && tour.days[tour.days.length - 1];
        const route = firstDay && lastDay ? '<p class="mt-3 text-sm text-slate-600">' + escapeHtml(firstDay.title) + ' to ' + escapeHtml(lastDay.title) + '</p>' : '';
        return '<article class="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-lg">' +
            '<img class="aspect-[16/9] w-full object-cover" src="../' + escapeHtml(tour.image) + '" alt="' + escapeHtml(tour.title) + ' in Sri Lanka" loading="lazy">' +
            '<div class="p-5"><p class="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">' + escapeHtml(tour.duration || 'Sri Lanka tour') + '</p>' +
                '<h2 class="mt-2 font-display text-2xl font-semibold text-slate-950"><a href="' + escapeHtml(tour.slug) + '.html">' + escapeHtml(tour.title) + '</a></h2>' +
                '<p class="mt-3 text-slate-700">' + escapeHtml(searchMetadata.formatDescription(tour.description)) + '</p>' + route +
                '<a class="mt-5 inline-flex font-semibold text-emerald-800 underline" href="' + escapeHtml(tour.slug) + '.html">View itinerary</a>' +
            '</div></article>';
    }).join('');
    let html = readProjectFile('tours/index.html');

    html = setHeadMetadata(html, { title: title, description: description, url: url, image: image });
    html = updateElementAttribute(html, 'tour-content', 'class', 'min-h-screen px-5 pb-20 pt-28 sm:px-8');
    html = setStructuredData(html, {
        title: title,
        label: collection.navLabel,
        description: description,
        path: '/tours/' + slug + '.html',
        image: collection.heroImage,
        type: 'CollectionPage',
        breadcrumbs: searchMetadata.buildTourCollectionBreadcrumbs(collection),
        mainEntity: searchMetadata.buildTourCollectionEntity(tours)
    });

    const body = '<main id="tour-content" class="min-h-screen px-5 pb-20 pt-28 sm:px-8">' +
        '<section class="mx-auto max-w-6xl" aria-labelledby="static-collection-title">' +
            '<nav class="text-sm text-emerald-800" aria-label="Breadcrumb"><a href="../index.html">Home</a> / <a href="../index.html#tours">Tours</a> / <span aria-current="page">' + escapeHtml(collection.navLabel) + '</span></nav>' +
            '<header class="mt-8 grid gap-8 rounded-3xl bg-slate-950 p-7 text-white sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.65fr)] md:items-center">' +
                '<div><p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">' + escapeHtml(collection.eyebrow) + '</p>' +
                    '<h1 id="static-collection-title" class="mt-3 font-display text-4xl font-semibold sm:text-5xl">' + escapeHtml(collection.title) + '</h1>' +
                    '<p class="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">' + escapeHtml(description) + '</p></div>' +
                '<img class="aspect-[4/3] w-full rounded-2xl object-cover" src="../' + escapeHtml(collection.heroImage) + '" alt="' + escapeHtml(collection.heroImageAlt || collection.navLabel + ' in Sri Lanka') + '" fetchpriority="high">' +
            '</header>' +
            '<section class="mt-12" aria-label="' + escapeHtml(collection.navLabel) + ' itineraries"><div class="grid gap-6 md:grid-cols-2">' + tourLinks + '</div></section>' +
        '</section></main>';
    return replaceElementContent(html, 'tour-content', body.replace(/^<main[^>]*>|<\/main>$/g, ''));
}

function renderDestinationContents(data) {
    const article = data.article || {};
    const paragraphs = function(items, firstClass) {
        return (items || []).map(function(paragraph, index) {
            const classes = index === 0 && firstClass
                ? 'text-slate-700 text-lg sm:text-xl leading-relaxed mb-5 first-letter:text-5xl first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-emerald-700 font-display'
                : 'text-slate-700 text-base sm:text-lg leading-relaxed mb-4';
            return '<p class="' + classes + '">' + escapeHtml(paragraph) + '</p>';
        }).join('');
    };

    return {
        'dest-exp-count': 'Things to do in ' + escapeHtml(data.name),
        'dest-exp-subtitle': 'Explore ' + (data.activities || []).length + ' local sights and experiences in ' + escapeHtml(data.name) + ', Sri Lanka.',
        'dest-intro-title': escapeHtml(article.introTitle || ('Discovering ' + data.name)),
        'dest-intro-text': paragraphs(article.introParagraphs, true),
        'dest-history-title': escapeHtml(article.historyTitle || 'History & Cultural Heritage'),
        'dest-history-text': paragraphs(article.historyParagraphs, false),
        'dest-tips-title': escapeHtml(article.tipsTitle || ('Insider Travel Tips for ' + data.name)),
        'dest-tips-list': (article.tips || []).map(function(tip, index) {
            const number = String(index + 1).padStart(2, '0');
            return '<li class="destination-tip-item"><span class="destination-tip-number">' + number + '</span><span>' + escapeHtml(tip) + '</span></li>';
        }).join(''),
        'dest-food-title': escapeHtml(article.foodTitle || ('Local Cuisine & Culinary Highlights in ' + data.name)),
        'dest-food-text': escapeHtml(article.foodParagraph || 'Enjoy local dishes prepared in nearby traditional eateries.'),
        'dest-food-dishes': (article.foodDishes || []).map(function(dish) {
            const name = typeof dish === 'string' ? dish : dish.name;
            const description = typeof dish === 'object' && dish.description
                ? '<p class="destination-food-description">' + escapeHtml(dish.description) + '</p>' : '';
            return '<article class="destination-food-item"><h4 class="destination-food-title text-lg text-slate-950">' + escapeHtml(name) + '</h4>' + description + '</article>';
        }).join(''),
        'dest-activities-container': (data.activities || []).map(function(activity, index) {
            const number = String(index + 1).padStart(2, '0');
            return '<article class="destination-activity group"><div class="destination-activity-copy"><span class="destination-activity-number">' + number + '</span><div>' +
                '<h4 class="destination-activity-title text-2xl leading-tight text-slate-950 sm:text-3xl">' + escapeHtml(activity.title) + '</h4>' +
                '<p class="destination-activity-description">' + escapeHtml(activity.description) + '</p>' +
                '<span class="destination-activity-meta">' + escapeHtml(activity.category || 'Highlight') + '</span></div></div>' +
                '<div class="overflow-hidden"><img src="../' + escapeHtml(activity.image) + '" alt="' + escapeHtml(activity.title) + '" class="destination-activity-image" loading="lazy"></div></article>';
        }).join(''),
        'dest-itinerary-container': (data.itinerary || []).map(function(item) {
            return '<article class="destination-itinerary-item"><span class="destination-itinerary-day">' + escapeHtml(item.day) + '</span><div>' +
                '<h4 class="destination-itinerary-title text-2xl leading-tight text-slate-950">' + escapeHtml(item.title) + '</h4>' +
                '<p class="destination-itinerary-description">' + escapeHtml(item.description) + '</p></div></article>';
        }).join('')
    };
}

function renderDestinationPage(data) {
    const url = siteOrigin + '/destinations/' + data.slug + '.html';
    const image = new URL(data.heroImage, siteOrigin + '/').href;
    const title = data.name + ' Travel Guide | Inspire Travels & Tours';
    const description = searchMetadata.formatDescription(data.excerpt);
    let html = readProjectFile('destinations/index.html');

    html = setHeadMetadata(html, { title: title, description: description, url: url, image: image });
    html = updateElementAttribute(html, 'dest-hero-bg-img', 'src', '../' + data.heroImage);
    html = updateElementAttribute(html, 'dest-hero-bg-img', 'alt', data.heroImageAlt || data.name + ' landscape in Sri Lanka');
    html = replaceElementContent(html, 'dest-title', escapeHtml(data.name));
    html = replaceElementContent(html, 'dest-tagline', escapeHtml(data.name + ' Travel Guide'));
    html = replaceElementContent(html, 'dest-readtime', escapeHtml(data.readTime || '6 Min Read'));
    html = html.replace('Sri Lanka destination guide', escapeHtml((data.region || 'Sri Lanka') + ' destination guide'));
    html = replaceElementContent(html, 'dest-excerpt', escapeHtml(data.tagline + '. ' + data.excerpt));
    html = replaceElementContent(html, 'dest-spec-season', '<i data-lucide="sun" class="w-5 h-5"></i> ' + escapeHtml(data.bestSeason));
    html = replaceElementContent(html, 'dest-spec-duration', '<i data-lucide="clock" class="w-5 h-5"></i> ' + escapeHtml(data.idealDuration));
    html = replaceElementContent(html, 'dest-spec-vibe', '<i data-lucide="compass" class="w-5 h-5"></i> ' + escapeHtml(data.vibe));

    const content = renderDestinationContents(data);
    Object.keys(content).forEach(function(id) {
        html = replaceElementContent(html, id, content[id]);
    });

    const descriptionText = description;
    html = setStructuredData(html, {
        title: title,
        label: data.name,
        description: descriptionText,
        path: '/destinations/' + data.slug + '.html',
        image: data.heroImage,
        breadcrumbs: searchMetadata.buildDestinationBreadcrumbs(data),
        mainEntity: searchMetadata.buildDestinationEntity(data)
    });

    return html;
}

function writeRoute(relativePath, html) {
    const filePath = path.resolve(outputRoot, relativePath);
    if (!filePath.startsWith(outputRoot + path.sep)) throw new Error('Invalid generated route path: ' + relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, removeElement(html, 'loading'));
}

function requireSlug(slug, label) {
    if (!/^[a-z0-9-]+$/.test(slug || '')) throw new Error('Invalid ' + label + ' slug: ' + slug);
}

function main() {
    const tours = loadBrowserData('assets/js/tours/tour-data.js', 'TourDataModule').tourData;
    const collectionData = loadBrowserData('assets/js/tours/tour-collection-data.js', 'TourCollectionDataModule');
    const destinations = loadBrowserData('assets/js/destinations/destinations-data.js', 'DestinationsData').destinations;

    let tourCount = 0;
    tours.forEach(function(tour) {
        requireSlug(tour.slug, 'tour');
        writeRoute(path.join('tours', tour.slug + '.html'), renderTourPage(tour, collectionData));
        tourCount += 1;
    });

    let collectionCount = 0;
    collectionData.collections.forEach(function(collection) {
        requireSlug(collection.slug, 'collection');
        const relatedTours = tours.filter(function(tour) {
            return (tour.collections || []).indexOf(collection.slug) !== -1;
        });
        if (!relatedTours.length) throw new Error('Collection has no tour routes: ' + collection.slug);
        writeRoute(path.join('tours', 'collection-' + collection.slug + '.html'), renderCollectionPage(collection, relatedTours));
        collectionCount += 1;
    });

    let destinationCount = 0;
    Object.keys(destinations).forEach(function(slug) {
        const destination = destinations[slug];
        requireSlug(destination.slug, 'destination');
        if (slug !== destination.slug) throw new Error('Destination data key does not match its slug: ' + slug);
        writeRoute(path.join('destinations', destination.slug + '.html'), renderDestinationPage(destination));
        destinationCount += 1;
    });

    console.log('Generated ' + tourCount + ' tour pages, ' + collectionCount + ' tour collections, and ' + destinationCount + ' destination guides.');
}

main();
