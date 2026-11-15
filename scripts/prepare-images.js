#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const crypto = require('node:crypto');

const responsiveWidths = [480, 960, 1600];
const maximumWidth = 2400;
const imageExtensions = new Set(['.jpg', '.jpeg', '.png']);

// Walk copied image files so the source tree stays untouched.
async function listImages(directory) {
    let entries;
    try {
        entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }

    const nested = await Promise.all(entries.map(async function(entry) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return listImages(entryPath);
        if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) return [entryPath];
        return [];
    }));
    return nested.flat();
}

// Keep identity assets unchanged because they need their original format.
function isExcluded(relativePath) {
    const parts = relativePath.split(path.sep).map(function(part) { return part.toLowerCase(); });
    const excludedFolders = new Set(['logo', 'logos', 'favicon', 'favicons', 'icon', 'icons', 'hotel-partners']);
    return parts.some(function(part) { return excludedFolders.has(part); })
        || /^favicon\./i.test(path.basename(relativePath))
        || /^logo(?:[-_.]|$)/i.test(path.basename(relativePath));
}

// Check the copied output before creating a generated image.
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
        throw error;
    }
}

// Use promo quality for flyers where small text needs extra detail.
function webpOptions(relativePath) {
    const isFlyer = /(?:^|[\\/])promos(?:[\\/]|$)/i.test(relativePath)
        || /(?:promo|flyer)/i.test(path.basename(relativePath));
    return { quality: isFlyer ? 90 : 85, effort: 3, smartSubsample: true };
}

// Create a variant only when it is missing, and report its real dimensions.
async function createVariant(sourcePath, outputPath, width, quality) {
    if (!await fileExists(outputPath)) {
        await sharp(sourcePath)
            .rotate()
            .resize({ width: width, withoutEnlargement: true })
            .webp(quality)
            .toFile(outputPath);
    }
    const metadata = await sharp(outputPath).metadata();
    return { width: metadata.width, height: metadata.height };
}

// Keep source aspect ratio while limiting the full image to 2400 pixels wide.
async function optimizeOne(sourcePath, imageRoot) {
    const relativePath = path.relative(imageRoot, sourcePath);
    if (isExcluded(relativePath)) return null;

    const sourceMetadata = await sharp(sourcePath).metadata();
    const turnsSideways = sourceMetadata.orientation >= 5 && sourceMetadata.orientation <= 8;
    const sourceWidth = turnsSideways ? sourceMetadata.height : sourceMetadata.width;
    const sourceHeight = turnsSideways ? sourceMetadata.width : sourceMetadata.height;
    if (!sourceWidth || !sourceHeight || (sourceWidth <= 480 && sourceHeight <= 480)) return null;

    const sourceExtension = path.extname(sourcePath);
    const outputStem = path.join(path.dirname(sourcePath), path.basename(sourcePath, sourceExtension) + sourceExtension);
    const mainPath = outputStem + '.webp';
    const quality = webpOptions(relativePath);
    let main;
    const alreadyOptimized = await fileExists(mainPath);

    if (alreadyOptimized) {
        const metadata = await sharp(mainPath).metadata();
        main = { width: metadata.width, height: metadata.height };
    } else {
        main = await sharp(sourcePath)
            .rotate()
            .resize({ width: maximumWidth, height: maximumWidth, fit: 'inside', withoutEnlargement: true })
            .webp(quality)
            .toFile(mainPath);
    }

    const sourceUrl = '/assets/img/' + relativePath.split(path.sep).join('/');
    const mainUrl = '/assets/img/' + path.relative(imageRoot, mainPath).split(path.sep).join('/');
    const candidates = [];
    for (const width of responsiveWidths) {
        if (width >= main.width) continue;
        const variantPath = outputStem + '-' + width + '.webp';
        const dimensions = await createVariant(sourcePath, variantPath, width, quality);
        candidates.push({ url: mainUrl.replace(/\.webp$/i, '-' + dimensions.width + '.webp'), width: dimensions.width });
    }
    candidates.push({ url: mainUrl, width: main.width });
    candidates.sort(function(left, right) { return left.width - right.width; });

    // The source checkout retains the masters; deploy a smaller format fallback.
    if (!alreadyOptimized) {
        let fallback = sharp(sourcePath).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
        fallback = sourceExtension.toLowerCase() === '.png'
            ? fallback.png({ compressionLevel: 9, palette: true, quality: 100 })
            : fallback.jpeg({ quality: 85, mozjpeg: true });
        const encoded = await fallback.toBuffer();
        const original = await fs.readFile(sourcePath);
        if (encoded.length < original.length) {
            await fs.writeFile(sourcePath, encoded);
        }
    }

    return [sourceUrl, {
        src: mainUrl,
        width: main.width,
        height: main.height,
        srcset: candidates.map(function(candidate) { return candidate.url + ' ' + candidate.width + 'w'; }).join(', '),
        fallback: sourceUrl
    }];
}

// Limit concurrent image work so the build stays bounded on small machines.
async function mapWithLimit(items, limit, callback) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await callback(items[index]);
        }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
}

// Build a stable source URL map for the HTML and script rewrite step.
async function optimizeImages(outputRoot) {
    const projectRoot = path.resolve(__dirname, '..');
    const relative = path.relative(projectRoot, path.resolve(outputRoot));
    if (relative !== 'dist' && !relative.startsWith('.zigzag-tmp' + path.sep)) {
        throw new Error('Optimize images only in dist or a .zigzag-tmp build folder.');
    }
    const imageRoot = path.join(outputRoot, 'assets', 'img');
    const images = await listImages(imageRoot);
    const optimized = await mapWithLimit(images, 3, async function(sourcePath) {
        if (isExcluded(path.relative(imageRoot, sourcePath))) return null;
        // Reuse identical encodes locally; fresh checkouts still generate everything.
        const key = crypto.createHash('sha256').update('webp-v3-palette-fallback').update(path.relative(imageRoot, sourcePath))
            .update(await fs.readFile(sourcePath)).digest('hex');
        const cache = path.join(projectRoot, 'tests/local/image-cache', key);
        const metadataPath = path.join(cache, 'record.json');
        if (await fileExists(metadataPath)) {
            const saved = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            for (const name of saved.files) await fs.copyFile(path.join(cache, name), path.join(path.dirname(sourcePath), name));
            return saved.record;
        }
        const record = await optimizeOne(sourcePath, imageRoot);
        if (!record) return null;
        const basename = path.basename(sourcePath);
        const files = (await fs.readdir(path.dirname(sourcePath))).filter(name => name === basename || name === basename + '.webp' || name.startsWith(basename + '-') && name.endsWith('.webp'));
        await fs.mkdir(cache, { recursive: true });
        for (const name of files) await fs.copyFile(path.join(path.dirname(sourcePath), name), path.join(cache, name));
        await fs.writeFile(metadataPath, JSON.stringify({ files: files, record: record }));
        return record;
    });
    return new Map(optimized.filter(Boolean));
}

module.exports = { optimizeImages };
