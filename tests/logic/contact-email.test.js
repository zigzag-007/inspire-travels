const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const email = 'info@inspiretraveltours.com';
const pages = ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html'];
const shell = fs.readFileSync(path.join(root, 'assets/js/shared/site-shell.js'), 'utf8');

test('public page contacts and fallback footers use the business mailbox', () => {
    for (const file of pages) {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        const links = [...html.matchAll(/href="(mailto:[^"]+)"/g)].map(match => match[1]);
        assert.equal(links.length, 2, file);
        assert.ok(links.every(link => link === 'mailto:' + email), file);
        assert.ok(html.includes('>' + email + '<') || html.includes('\n' + email), file);
        if (file !== 'index.html') {
            assert.ok(html.includes('Email Inspire Travels at ' + email), file);
            assert.ok(html.includes('data-contact-tooltip="Email ' + email + '"'), file);
            assert.ok(html.includes('site-shell.js?v=20261115-company-registration'), file);
        }
    }
});

test('the generated footer keeps its visible address and both email links aligned', () => {
    const contact = shell.slice(shell.indexOf('    function renderContact('), shell.indexOf('        var sliderPhotos'));
    const footer = shell.slice(shell.indexOf('    function renderFooter()'), shell.indexOf('    function ', shell.indexOf('    function renderFooter()') + 10));
    const html = vm.runInNewContext(contact + footer + '\nrenderFooter();', {
        pathTo: value => value,
        renderFooterSlider: () => ''
    });
    assert.equal((html.match(/href="mailto:info@inspiretraveltours.com"/g) || []).length, 2);
    assert.ok(html.includes('>' + email + '</a>'));
});

test('no other contact mailbox remains in public source or the README', () => {
    function audit(file) {
        // Vendor copyright contacts are separate from our business mailbox.
        if (file === path.join(root, 'assets/vendor')) return;
        if (fs.statSync(file).isDirectory()) {
            fs.readdirSync(file).forEach(name => audit(path.join(file, name)));
        } else if (/\.(?:html|js|json|xml|txt|md)$/i.test(file)) {
            const emails = fs.readFileSync(file, 'utf8').match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];
            assert.ok(emails.every(address => address === email), path.relative(root, file));
        }
    }
    [...pages, 'assets', 'README.md'].forEach(file => audit(path.join(root, file)));
});
