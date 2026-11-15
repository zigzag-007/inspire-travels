const config = require('./playwright.config.js');

// Test real source files without a generated-page fallback or server rewrite.
module.exports = {
    ...config,
    webServer: {
        command: 'node helpers/static-server.js',
        cwd: __dirname,
        url: 'http://127.0.0.1:8094',
        env: { SITE_ROOT: '.', SITE_PORT: '8094' },
        timeout: 30000
    },
    use: { ...config.use, baseURL: 'http://127.0.0.1:8094' }
};
