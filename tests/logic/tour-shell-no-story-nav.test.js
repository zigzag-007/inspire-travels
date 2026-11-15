const assert = require('node:assert/strict');

let heroConfig;
global.window = {
    SecondaryHeroModule: {
        render: function(config) {
            heroConfig = config;
            return '<header class="secondary-editorial-hero"></header>';
        }
    }
};

require('../../assets/js/tours/tour-shell-template.js');

const html = window.TourShellTemplateModule.render({
    title: 'Test Package',
    description: 'A test route.',
    duration: '7 days',
    nights: '6 nights',
    location: 'Sri Lanka',
    image: 'assets/img/tours/test.jpg',
    travelMode: 'private',
    collections: ['family']
});

assert.ok(html.includes('secondary-facts-dock'), 'quick facts should remain');
assert.equal(heroConfig.showNoteDetail, false, 'tour locations should not render as a small hero label');
assert.ok(!html.includes('destination-story-nav'), 'package story navigation should be removed');
assert.ok(!html.includes('Overview and Route'), 'package story navigation links should be removed');

console.log('Tour package shell renders without the story navigation bar.');
