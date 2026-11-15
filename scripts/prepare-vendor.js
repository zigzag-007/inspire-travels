'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const vendor = path.join(root, 'assets/vendor');

// Copy the locked distributions unchanged, keeping notices separate from site CSS.
function copy(packageName, source, destination) {
    const from = path.join(root, 'node_modules', packageName, source);
    const to = path.join(vendor, destination);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
}

for (const name of ['aos', 'photoswipe', 'swiper', '@phosphor-icons/web']) {
    const pkg = require(path.join(root, 'node_modules', name, 'package.json'));
    copy(name, 'LICENSE', `licenses/${name.replace('@', '').replace('/', '-')}-${pkg.version}.LICENSE`);
}
for (const file of ['aos.css', 'aos.js']) copy('aos', 'dist/' + file, 'aos/' + file);
for (const file of ['photoswipe.css', 'umd/photoswipe.umd.min.js', 'umd/photoswipe-lightbox.umd.min.js']) {
    copy('photoswipe', 'dist/' + file, 'photoswipe/' + path.basename(file));
}
for (const file of ['swiper-bundle.min.css', 'swiper-bundle.min.js']) copy('swiper', file, 'swiper/' + file);
for (const file of ['gsap.min.js', 'ScrollTrigger.min.js']) copy('gsap', 'dist/' + file, 'gsap/' + file);
copy('gsap', 'README.md', 'licenses/gsap-3.13.0.README');
for (const weight of ['regular', 'fill']) {
    for (const file of ['style.css', 'Phosphor.woff2', 'Phosphor.woff', 'Phosphor.ttf', 'Phosphor.svg']) {
        const name = weight === 'fill' && file !== 'style.css' ? file.replace('Phosphor', 'Phosphor-Fill') : file;
        copy('@phosphor-icons/web', `src/${weight}/${name}`, `phosphor/${weight}/${name}`);
    }
}
for (const family of ['geist', 'geist-mono', 'newsreader']) {
    const name = '@fontsource-variable/' + family;
    const files = fs.readdirSync(path.join(root, 'node_modules', name, 'files'))
        .filter(file => file.includes('-latin-') && file.includes(family === 'newsreader' ? '-standard-' : '-wght-'));
    for (const file of files) copy(name, 'files/' + file, 'fonts/' + file);
    copy(name, 'LICENSE', `licenses/${family}-5.3.0.LICENSE`);
}
console.log('Prepared pinned runtime distributions and font files.');
