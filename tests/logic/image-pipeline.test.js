'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { optimizeImages } = require('../build/prepare-images.js');

const projectRoot = path.resolve(__dirname, '../..');
const outputRoot = path.join(projectRoot, '.zigzag-tmp', 'image-pipeline-test');

// Check generated sizes, preserved originals, exclusions, and repeat builds.
test('image optimizer makes bounded WebP variants and keeps fallback files', async function(t) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    const imageRoot = path.join(outputRoot, 'assets', 'img');
    fs.mkdirSync(path.join(imageRoot, 'tours'), { recursive: true });
    fs.mkdirSync(path.join(imageRoot, 'promos'), { recursive: true });
    fs.mkdirSync(path.join(imageRoot, 'hotel-partners'), { recursive: true });
    fs.mkdirSync(path.join(imageRoot, 'icons'), { recursive: true });
    t.after(function() { fs.rmSync(outputRoot, { recursive: true, force: true }); });

    const photoPath = path.join(imageRoot, 'tours', 'scene.jpg');
    const flyerPath = path.join(imageRoot, 'promos', 'promo-flyer.png');
    const smallPath = path.join(imageRoot, 'tours', 'tiny.jpg');
    const partnerPath = path.join(imageRoot, 'hotel-partners', 'partner.png');
    const iconPath = path.join(imageRoot, 'icons', 'icon.png');
    await sharp({ create: { width: 2600, height: 1300, channels: 3, background: '#2c725e' } })
        .jpeg({ quality: 92 }).toFile(photoPath);
    await sharp({ create: { width: 1254, height: 1770, channels: 4, background: { r: 240, g: 220, b: 170, alpha: 0.4 } } })
        .png({ palette: true }).toFile(flyerPath);
    await sharp({ create: { width: 320, height: 320, channels: 3, background: '#222222' } })
        .jpeg().toFile(smallPath);
    await sharp({ create: { width: 1200, height: 800, channels: 4, background: '#ffffff' } }).png().toFile(partnerPath);
    await sharp({ create: { width: 1200, height: 800, channels: 4, background: '#ffffff' } }).png().toFile(iconPath);

    const originalBytes = fs.readFileSync(photoPath);
    const originalFlyerBytes = fs.statSync(flyerPath).size;
    const manifest = await optimizeImages(outputRoot);
    const photo = manifest.get('/assets/img/tours/scene.jpg');
    assert.ok(photo);
    assert.deepEqual([photo.width, photo.height], [2400, 1200]);
    assert.equal(photo.fallback, '/assets/img/tours/scene.jpg');
    assert.match(photo.srcset, /scene\.jpg-480\.webp 480w/);
    assert.match(photo.srcset, /scene\.jpg-960\.webp 960w/);
    assert.match(photo.srcset, /scene\.jpg-1600\.webp 1600w/);
    assert.match(photo.srcset, /scene\.jpg\.webp 2400w/);
    assert.ok(fs.statSync(photoPath).size < originalBytes.length);
    assert.deepEqual([(await sharp(photoPath).metadata()).width, (await sharp(photoPath).metadata()).height], [1600, 800]);
    assert.ok(fs.existsSync(path.join(imageRoot, 'tours', 'scene.jpg-480.webp')));

    const flyer = manifest.get('/assets/img/promos/promo-flyer.png');
    assert.ok(flyer);
    const flyerMetadata = await sharp(path.join(imageRoot, 'promos', 'promo-flyer.png.webp')).metadata();
    assert.equal(flyerMetadata.hasAlpha, true);
    assert.ok(fs.statSync(flyerPath).size <= originalFlyerBytes, 'fallback PNG must not grow');
    assert.deepEqual([flyer.width, flyer.height], [1254, 1770]);
    assert.equal(manifest.has('/assets/img/tours/tiny.jpg'), false);
    assert.equal(manifest.has('/assets/img/hotel-partners/partner.png'), false);
    assert.equal(manifest.has('/assets/img/icons/icon.png'), false);

    const variantPath = path.join(imageRoot, 'tours', 'scene.jpg-480.webp');
    const variantHash = crypto.createHash('sha256').update(fs.readFileSync(variantPath)).digest('hex');
    const repeated = await optimizeImages(outputRoot);
    assert.deepEqual(repeated.get('/assets/img/tours/scene.jpg'), photo);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(variantPath)).digest('hex'), variantHash);
});
