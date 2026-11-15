const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './e2e',
    outputDir: './output/results',
    workers: 1,
    timeout: 360000,
    reporter: 'list',
    use: {
        baseURL: process.env.SITE_URL || 'http://127.0.0.1:8092',
        headless: true,
        browserName: 'chromium',
        serviceWorkers: 'block'
    }
});
