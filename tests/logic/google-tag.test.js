const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'assets/js/shared/google-tag.js'), 'utf8');

test('every public template loads one Google tag and the shared setup in its head', () => {
    for (const file of ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html']) {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
        assert.equal((html.match(/googletagmanager\.com\/gtag\/js/g) || []).length, 1, file);
        assert.equal((html.match(/shared\/google-tag\.js/g) || []).length, 1, file);
        assert.ok(head.includes('<script async src="https://www.googletagmanager.com/gtag/js?id=G-WJDJXSTTR4"></script>'), file);
        const base = file.includes('/') ? '../' : '';
        assert.ok(head.includes('<script src="' + base + 'assets/js/shared/google-tag.js?v=20261007-google-tag"></script>'), file);
        assert.ok(fs.existsSync(path.resolve(root, path.dirname(file), base + 'assets/js/shared/google-tag.js')), file);
    }
});

test('Analytics and Ads configure once without discarding queued events', () => {
    const earlierEvent = { event: 'existing_event' };
    const queue = [earlierEvent];
    const context = vm.createContext({ window: { dataLayer: queue } });
    vm.runInContext(source, context);
    context.window.GoogleTagModule.init();
    vm.runInContext(source, context);
    assert.equal(context.window.dataLayer, queue);
    assert.equal(queue[0], earlierEvent);
    assert.equal(queue.length, 4);
    assert.equal(queue[1][0], 'js');
    assert.deepEqual(Array.from(queue[2]), ['config', 'G-WJDJXSTTR4']);
    assert.deepEqual(Array.from(queue[3]), ['config', 'AW-18419592371']);
    assert.ok(!queue.some(event => event[0] === 'event' && event[1] === 'conversion'));
});

test('existing gtag remains available and a missing data layer is created', () => {
    const calls = [];
    const gtag = (...args) => calls.push(args);
    const context = vm.createContext({ window: { gtag } });
    vm.runInContext(source, context);
    assert.equal(context.window.gtag, gtag);
    assert.ok(Array.isArray(context.window.dataLayer));
    assert.equal(calls.length, 3);
});
