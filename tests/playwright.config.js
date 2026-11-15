const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './e2e',
    outputDir: './output/results',
    workers: 1,
    timeout: 360000,
    reporter: 'list',
    webServer: process.env.SITE_URL ? undefined : {
        command: 'node helpers/static-server.js',
        cwd: __dirname,
        url: 'http://127.0.0.1:8093',
        reuseExistingServer: true,
        timeout: 30000
    },
    use: {
        baseURL: process.env.SITE_URL || 'http://127.0.0.1:8093',
        headless: true,
        browserName: 'chromium',
        actionTimeout: 15000,
        serviceWorkers: 'block'
    }
});
