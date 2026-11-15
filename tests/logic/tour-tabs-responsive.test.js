const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '../..');
const template = fs.readFileSync(
    path.join(projectRoot, 'assets/js/tours/tour-content-template.js'),
    'utf8'
);
const styles = fs.readFileSync(
    path.join(projectRoot, 'assets/css/14-component-secondary-theme.css'),
    'utf8'
);

assert.ok(
    template.includes('tour-detail-main-column'),
    'tour content should mark the grid column that must be allowed to shrink'
);
assert.ok(
    template.includes('tour-detail-tabs-list'),
    'tour tabs should expose a responsive list hook'
);
assert.match(
    styles,
    /\.tour-detail-main-column\s*\{[^}]*min-width:\s*0;/s,
    'tour content column should not preserve a wider min content size'
);
assert.match(
    styles,
    /@media \(max-width: 767px\)[\s\S]*\.tour-detail-tabs-list\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/,
    'phone tabs should use three equal columns'
);
assert.match(
    styles,
    /@media \(max-width: 359px\)[\s\S]*\.tour-detail-tabs-list \.tour-tab-btn i\s*\{[^}]*font-size:\s*0\.75rem\s*!important;/,
    'very narrow phones should keep smaller tab icons'
);
assert.doesNotMatch(
    styles,
    /\.tour-detail-tabs-list \.tour-tab-btn i\s*\{[^}]*display:\s*none;/,
    'all three tab icons should remain visible at every width'
);

console.log('Tour detail tabs keep a responsive three cell layout.');
