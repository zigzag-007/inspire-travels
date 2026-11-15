const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
global.window = {};
require('../../assets/js/tours/tour-data.js');
require('../../assets/js/tours/tour-collection-data.js');
require('../../assets/js/destinations/destinations-data.js');
const routes = [
    ...window.TourDataModule.tourData.map(t => ({ path: '/tours/' + t.slug + '.html', title: t.title, description: t.description, image: t.image })),
    ...window.TourCollectionDataModule.collections.map(t => ({ path: '/tours/collection-' + t.slug + '.html', title: t.navLabel, description: t.description, image: t.heroImage, type: 'CollectionPage' })),
    ...Object.values(window.DestinationsData.destinations).map(t => ({ path: '/destinations/' + t.slug + '.html', title: t.name, description: t.excerpt, image: t.heroImage }))
];

test('sitemap lists every public route with no invented extra routes', () => {
    const locations = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    const expected = ['/', '/gallery.html', ...routes.map(page => page.path)].map(p => 'https://inspiretraveltours.com' + p);
    assert.deepEqual(locations.sort(), expected.sort());
    assert.equal(new Set(locations).size, 31);
});

test('all static preview images exist and homepage business facts match the footer', () => {
    for (const file of ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html']) {
        const html = read(file);
        assert.ok(!html.includes('og-image.jpg'), file);
        const image = html.match(/property="og:image" content="https:\/\/inspiretraveltours.com\/([^"]+)"/);
        assert.ok(image, file);
        assert.ok(fs.existsSync(path.join(root, image[1])), file);
        for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    }
    const graph = JSON.parse(read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const agency = graph.find(entity => entity['@type'] === 'TravelAgency');
    assert.equal(agency.address.streetAddress, 'Bankada Road');
    assert.equal(agency.address.addressLocality, 'Katuneriya');
    assert.equal(agency.telephone, '+94785959333');
    assert.equal(agency.email, 'info@inspiretraveltours.com');
    assert.equal(agency.contactPoint.telephone, agency.telephone);
    assert.equal(agency.contactPoint.email, agency.email);
    const description = read('index.html').match(/name="description" content="([^"]+)"/)[1];
    assert.ok(description.includes('Sri Lanka'));
    assert.ok(description.length <= 160);
    assert.ok(read('index.html').includes('Bankada Road, Katuneriya, Sri Lanka'));
    assert.ok(read('index.html').includes('tel:+94785959333'));
    assert.ok(!graph.some(entity => entity['@type'] === 'FAQPage' || entity.offers));
    assert.ok(read('_redirects').includes('/favicon.ico /assets/img/favicon/favicon-64x64.png 301'));
});

test('switching all routes updates metadata without duplicate canonical or schema nodes', () => {
    const nodes = [];
    const makeNode = tag => ({ tag, attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, remove() { nodes.splice(nodes.indexOf(this), 1); } });
    const find = selector => {
        const m = selector.match(/^(meta|link)\[(name|property|rel)="([^"]+)"\]/);
        return m && nodes.find(node => node.tag === m[1] && node.attrs[m[2]] === m[3]);
    };
    const document = {
        head: { querySelector: find, querySelectorAll: () => [], appendChild: node => nodes.push(node) },
        createElement: makeNode,
        getElementById: id => nodes.find(node => node.id === id)
    };
    const context = vm.createContext({ window: {}, document, URL });
    vm.runInContext(read('assets/js/shared/search-metadata.js'), context);
    for (const page of routes) {
        assert.ok(fs.existsSync(path.join(root, page.image)), page.path);
        context.window.SearchMetadataModule.update({ ...page, label: page.title });
        const url = 'https://inspiretraveltours.com' + page.path;
        assert.equal(find('link[rel="canonical"]').attrs.href, url);
        assert.equal(find('meta[property="og:url"]').attrs.content, url);
        assert.equal(find('meta[name="description"]').attrs.content, context.window.SearchMetadataModule.formatDescription(page.description));
        assert.equal(find('meta[property="og:image"]').attrs.content, 'https://inspiretraveltours.com/' + page.image);
        const schema = JSON.parse(document.getElementById('page-search-data').textContent);
        assert.equal(schema['@graph'][0].url, url);
        assert.equal(schema['@graph'][0].description, context.window.SearchMetadataModule.formatDescription(page.description));
        assert.equal(schema['@graph'][1].itemListElement[1].item, url);
    }
    assert.equal(nodes.filter(node => node.attrs.rel === 'canonical').length, 1);
    assert.equal(nodes.filter(node => node.id === 'page-search-data').length, 1);
});

test('build creates crawlable route pages with unique metadata and itinerary content', () => {
    const os = require('node:os');
    const { spawnSync } = require('node:child_process');
    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'inspire-search-pages-'));
    try {
        const result = spawnSync(process.execPath, ['scripts/generate-search-pages.js', output], { cwd: root, encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr);

        const tour = fs.readFileSync(path.join(output, 'tours/highlights-escape.html'), 'utf8');
        assert.doesNotMatch(tour, /id="loading"/);
        assert.doesNotMatch(tour, /Route:\s+[A-Z]/);
        assert.match(tour, /<title>Sri Lanka Highlights Escape \| Inspire Travels &amp; Tours<\/title>/);
        assert.match(tour, /rel="canonical" href="https:\/\/inspiretraveltours\.com\/tours\/highlights-escape\.html"/);
        assert.doesNotMatch(tour, /property="og:image:(?:width|height)"/);
        assert.match(tour, /<nav class="text-sm text-emerald-800" aria-label="Breadcrumb"><a href="\.\.\/index\.html">Home<\/a> \/ <a href="collection-family\.html">Family Tours<\/a>/);
        assert.match(tour, /Day by day Sri Lanka tour itinerary/);
        assert.match(tour, /Kandy and Pinnawala/);
        assert.doesNotMatch(tour, /Loading tour details/);
        assert.doesNotMatch(tour, /Route:\s+[A-Z]/);
        const tourSchema = JSON.parse(tour.match(/<script id="page-search-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        assert.equal(tourSchema['@graph'][0].mainEntity['@type'], 'TouristTrip');
        assert.equal(tourSchema['@graph'][0].mainEntity.itinerary.itemListElement.length, 5);
        assert.deepEqual(tourSchema['@graph'][1].itemListElement.map(item => item.name), ['Home', 'Family Tours', 'Sri Lanka Highlights Escape']);

        const destination = fs.readFileSync(path.join(output, 'destinations/ella.html'), 'utf8');
        assert.doesNotMatch(destination, /id="loading"/);
        assert.match(destination, /<title>Ella Travel Guide \| Inspire Travels &amp; Tours<\/title>/);
        assert.doesNotMatch(destination, /property="og:image:(?:width|height)"/);
        assert.match(destination, /Central Highlands/);
        assert.match(destination, /Nine Arch Bridge/);
        assert.match(destination, /7 Min Read/);
        assert.match(destination, /Things to do in Ella/);

        const bentota = fs.readFileSync(path.join(output, 'destinations/bentota.html'), 'utf8');
        assert.match(bentota, /src="\.\.\/assets\/img\/main-gallery\/madu-river-safari\.jpg"/);
        assert.match(bentota, /alt="Travellers on a Sri Lankan mangrove river safari"/);

        const collection = fs.readFileSync(path.join(output, 'tours/collection-family.html'), 'utf8');
        assert.doesNotMatch(collection, /id="loading"/);
        assert.match(collection, /<title>Family Tours in Sri Lanka \| Inspire Travels &amp; Tours<\/title>/);
        assert.match(collection, /href="highlights-escape\.html"/);
        const collectionSchema = JSON.parse(collection.match(/<script id="page-search-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        assert.equal(collectionSchema['@graph'][0].mainEntity.itemListElement[0].item['@type'], 'TouristTrip');
        assert.deepEqual(collectionSchema['@graph'][1].itemListElement.map(item => item.name), ['Home', 'Tours', 'Family Tours']);

        const destinationSchema = JSON.parse(destination.match(/<script id="page-search-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        assert.equal(destinationSchema['@graph'][0].mainEntity['@type'], 'TouristDestination');
        assert.deepEqual(destinationSchema['@graph'][1].itemListElement.map(item => item.name), ['Home', 'Destinations', 'Ella']);
        assert.equal(destinationSchema['@graph'][0].description, destination.match(/<meta name="description" content="([^"]+)"/)[1].replaceAll('&amp;', '&').replaceAll('&#39;', "'"));

        const pages = [];
        const collect = directory => fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) collect(file);
            else if (entry.name.endsWith('.html')) pages.push(file);
        });
        collect(output);
        assert.equal(pages.length, 29);
        for (const file of pages) {
            const html = fs.readFileSync(file, 'utf8');
            assert.doesNotMatch(html, /id="loading"/, file);
            const structuredData = html.match(/<script id="page-search-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
            assert.ok(structuredData, file);
            assert.ok(JSON.parse(structuredData[1])['@graph'].length >= 2, file);
            assert.match(html, /rel="canonical"/);
        }
    } finally {
        fs.rmSync(output, { recursive: true, force: true });
    }
});

test('gallery and modal scrollbars use the same subtle transparent style', () => {
    const rootStyles = read('assets/css/02-base-reset.css');
    const modalStyles = read('assets/css/08-component-gallery-modal.css');
    const gallery = read('gallery.html');
    const galleryHero = read('assets/js/shared/secondary-hero.js');

    assert.match(rootStyles, /scrollbar-color:\s*rgba\(150, 169, 154, 0\.72\)\s+transparent/);
    assert.match(rootStyles, /html::-webkit-scrollbar-button[\s\S]*?display:\s*none/);
    assert.match(modalStyles, /\.custom-scrollbar\s*\{[^}]*scrollbar-color:\s*transparent transparent;[^}]*scrollbar-width:\s*thin;/);
    assert.match(modalStyles, /\.custom-scrollbar\.is-scrolling,\s*\.custom-scrollbar:hover\s*\{[^}]*scrollbar-color:/);
    assert.match(gallery, /50\+ moments/);
    assert.doesNotMatch(gallery, /60\+ moments/);
    assert.match(galleryHero, /note: '50\+ real travel moments'/);
    assert.doesNotMatch(galleryHero, /60\+ real travel moments/);
});

test('preloader releases the page when no overlay is present', () => {
    const dispatchedEvents = [];
    const makeClassList = () => ({ remove: () => {} });
    const document = {
        body: { classList: makeClassList(), style: {} },
        documentElement: { classList: makeClassList(), style: {} },
        dispatchEvent: event => dispatchedEvents.push(event.type),
        getElementById: () => null
    };
    const context = vm.createContext({
        CustomEvent: function(type) { this.type = type; },
        document,
        window: {}
    });

    vm.runInContext(read('assets/js/shared/preloader.js'), context);
    context.window.PreloaderModule.init();

    assert.deepEqual(dispatchedEvents, ['app-loaded']);
});
