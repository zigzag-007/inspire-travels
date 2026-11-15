const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const registration = 'Company Registration Number: PV-00379338';

test('every public footer includes the company registration, before and after rendering', () => {
    for (const file of ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html']) {
        const footer = read(file).match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
        assert.ok(footer?.includes(registration), file);
        assert.ok(footer.match(/About Inspire Travels[\s\S]*?<div class="footer-logo/)?.[0].includes(registration), file + ' About company details');
    }

    const shell = read('assets/js/shared/site-shell.js');
    const start = shell.indexOf('    function renderFooter()');
    const end = shell.indexOf('    function renderAmbient()', start);
    const footer = vm.runInNewContext(shell.slice(start, end) + '\nrenderFooter();', {
        pathTo: value => value,
        renderContact: () => '',
        renderFooterSlider: () => ''
    });
    assert.equal(footer.split(registration).length - 1, 1);
    assert.ok(footer.match(/About Inspire Travels[\s\S]*?<div class="footer-logo/)?.[0].includes(registration));
});

test('homepage partners use eight local logos with accessible names and reserved space', () => {
    const home = read('index.html');
    const section = home.match(/<section\b[^>]*id="hotel-partners"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, 'hotel partners section exists');
    assert.ok(home.indexOf(section) < home.indexOf('<footer'));
    assert.match(section, /Our Hotel Partners/);
    const brands = ['Cinnamon Hotels &amp; Resorts', 'Jetwing Hotels', 'Hilton', 'Shangri-La',
        'Aitken Spence Hotels', 'Uga Resorts', 'Browns Hotels &amp; Resorts', 'Resplendent Ceylon'];
    const images = [...section.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
    assert.equal(images.length, brands.length);
    for (const [index, image] of images.entries()) {
        assert.ok(image.includes('alt="' + brands[index] + '"'), brands[index]);
        assert.match(image, /width="\d+"/);
        assert.match(image, /height="\d+"/);
        assert.match(image, /loading="lazy"/);
        const src = image.match(/src="([^"]+)"/)[1];
        assert.ok(src.startsWith('assets/img/hotel-partners/'));
        assert.ok(fs.statSync(path.join(root, src)).size > 100, src);
        if (src.endsWith('.svg')) assert.match(read(src), /<svg\b/);
    }
});
