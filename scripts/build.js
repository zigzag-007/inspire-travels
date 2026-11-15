#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
let tailwindCli;
try {
    tailwindCli = require.resolve('tailwindcss/lib/cli.js');
} catch (error) {
    tailwindCli = null;
}
const sourcePages = ['index.html', 'gallery.html', 'tours/index.html', 'destinations/index.html'];
const dynamicClasses = ['pt-2', 'pt-4', 'md:pl-6'];

function walk(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(function(entry) {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(entryPath) : [entryPath];
    });
}

function copyFile(relativePath, outputRoot) {
    const source = path.join(projectRoot, relativePath);
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) return;
    const destination = path.join(outputRoot, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

function resolveOutput(argument) {
    const requestedPath = argument || 'dist';
    const output = path.resolve(projectRoot, requestedPath);
    const relative = path.relative(projectRoot, output);
    const isDist = relative === 'dist';
    const isScratch = relative.startsWith('.zigzag-tmp' + path.sep);
    if (!isDist && !isScratch) {
        throw new Error('Build output must be dist or a child folder of .zigzag-tmp.');
    }

    let currentPath = projectRoot;
    for (const part of relative.split(path.sep)) {
        currentPath = path.join(currentPath, part);
        if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isSymbolicLink()) {
            throw new Error('Build output path cannot pass through a symbolic link.');
        }
    }
    return output;
}

function clearOutput(outputRoot) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    fs.mkdirSync(outputRoot, { recursive: true });
}

function copyPublicFiles(outputRoot) {
    sourcePages.forEach(function(file) { copyFile(file, outputRoot); });
    fs.readdirSync(projectRoot, { withFileTypes: true })
        .filter(function(entry) { return entry.isFile() && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.html$/i.test(entry.name); })
        .forEach(function(entry) { copyFile(entry.name, outputRoot); });
    ['offline.html', '_headers', '_redirects', 'robots.txt', 'sitemap.xml'].forEach(function(file) {
        copyFile(file, outputRoot);
    });
    walk(path.join(projectRoot, 'assets')).forEach(function(file) {
        const relativePath = path.relative(projectRoot, file);
        if (relativePath !== 'assets/js/shared/tailwind-config.js') copyFile(relativePath, outputRoot);
    });
}

function makeTailwindConfig(outputRoot, scratchRoot) {
    const tailwindSource = fs.readFileSync(path.join(projectRoot, 'assets/js/shared/tailwind-config.js'), 'utf8');
    const context = { tailwind: {} };
    vm.runInNewContext(tailwindSource, context, { filename: 'assets/js/shared/tailwind-config.js' });

    const content = sourcePages.map(function(file) { return path.join(projectRoot, file); });
    content.push(path.join(projectRoot, 'assets/js/**/*.js'));
    content.push(path.join(projectRoot, 'scripts/generate-search-pages.js'));
    content.push(path.join(outputRoot, '**/*.html'));

    const config = {
        content: content,
        safelist: dynamicClasses,
        theme: context.tailwind.config.theme
    };
    const configPath = path.join(scratchRoot, 'tailwind.config.cjs');
    fs.writeFileSync(configPath, 'module.exports = ' + JSON.stringify(config, null, 2) + ';\n');
    return configPath;
}

function compileTailwind(outputRoot, scratchRoot) {
    if (!tailwindCli) {
        throw new Error('Tailwind CLI is missing. Run npm ci before building.');
    }
    const inputPath = path.join(scratchRoot, 'tailwind.input.css');
    const configPath = makeTailwindConfig(outputRoot, scratchRoot);
    const cssPath = path.join(outputRoot, 'assets/css/generated/tailwind.css');
    fs.writeFileSync(inputPath, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });

    const result = spawnSync(process.execPath, [tailwindCli, '-i', inputPath, '-o', cssPath, '--config', configPath, '--minify'], {
        cwd: projectRoot,
        encoding: 'utf8'
    });
    if (result.status !== 0) {
        throw new Error('Tailwind compilation failed.\n' + (result.stderr || result.stdout || 'No compiler output.'));
    }

    // Utility image URLs resolve from this generated stylesheet, not the HTML page.
    const compiledCss = fs.readFileSync(cssPath, 'utf8')
        .replace(/url\((['"]?)(?:\.\/)?assets\//g, 'url($1/assets/');
    fs.writeFileSync(cssPath, compiledCss);

    walk(outputRoot).filter(function(file) { return file.endsWith('.html'); }).forEach(function(pagePath) {
        let html = fs.readFileSync(pagePath, 'utf8');
        html = html.replace(/<script\s+src=["'][^"']*cdn\.tailwindcss\.com[^"']*["'][^>]*><\/script>/i,
            '<link rel="stylesheet" href="' + path.relative(path.dirname(pagePath), cssPath).replace(/\\/g, '/') + '">');
        html = html.replace(/<script\s+src=["'][^"']*assets\/js\/shared\/tailwind-config\.js[^"']*["'][^>]*><\/script>/i, '');
        fs.writeFileSync(pagePath, html);
    });
}

function runRouteGenerator(outputRoot) {
    const result = spawnSync(process.execPath, [path.join(projectRoot, 'scripts/generate-search-pages.js'), outputRoot], {
        cwd: projectRoot,
        encoding: 'utf8'
    });
    if (result.status !== 0) {
        throw new Error('Route generation failed.\n' + (result.stderr || result.stdout || 'No generator output.'));
    }
    if (result.stdout) process.stdout.write(result.stdout);
}

function hashBuildFiles(outputRoot) {
    const hash = crypto.createHash('sha256');
    walk(outputRoot).sort().forEach(function(file) {
        hash.update(path.relative(outputRoot, file).replace(/\\/g, '/') + '\0');
        hash.update(fs.readFileSync(file));
        hash.update('\0');
    });
    return hash.digest('hex').slice(0, 16);
}

function addOfflineRegistration(outputRoot) {
    const offlineScript = path.join(outputRoot, 'assets/js/shared/offline.js');
    const workerTemplate = path.join(projectRoot, 'scripts/service-worker-template.js');
    if (!fs.existsSync(offlineScript) || !fs.existsSync(workerTemplate)) return;

    const version = hashBuildFiles(outputRoot);
    walk(outputRoot).filter(function(file) { return file.endsWith('.html'); }).forEach(function(pagePath) {
        let html = fs.readFileSync(pagePath, 'utf8');
        if (!/assets\/js\/shared\/offline\.js(?:["'?]|$)/.test(html)) {
            html = html.replace(/<\/body>/i, '<script defer src="/assets/js/shared/offline.js?v=' + version + '"></script>\n</body>');
        }
        fs.writeFileSync(pagePath, html);
    });

    const workerPath = path.join(outputRoot, 'sw.js');
    const workerSource = fs.readFileSync(workerTemplate, 'utf8');
    if (!workerSource.includes('__BUILD_VERSION__')) {
        throw new Error('Service worker template must include the __BUILD_VERSION__ placeholder.');
    }
    fs.writeFileSync(workerPath, workerSource.replaceAll('__BUILD_VERSION__', version));
}

function build(outputArgument) {
    const outputRoot = resolveOutput(outputArgument);
    const scratchRoot = path.join(projectRoot, '.zigzag-tmp', 'build');
    fs.rmSync(scratchRoot, { recursive: true, force: true });
    fs.mkdirSync(scratchRoot, { recursive: true });

    try {
        clearOutput(outputRoot);
        copyPublicFiles(outputRoot);
        runRouteGenerator(outputRoot);
        compileTailwind(outputRoot, scratchRoot);
        addOfflineRegistration(outputRoot);
        console.log('Built deployable site in ' + path.relative(projectRoot, outputRoot) + '.');
    } finally {
        fs.rmSync(scratchRoot, { recursive: true, force: true });
    }
}

try {
    build(process.argv[2]);
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
