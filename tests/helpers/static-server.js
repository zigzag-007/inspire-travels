'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..', process.env.SITE_ROOT || 'tests/local/dist');
const port = Number(process.env.SITE_PORT || 8093);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };

// Serve the real build, including the same legacy image redirects on either host.
const server = http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch (error) { response.writeHead(400).end(); return; }
    const redirects = JSON.parse(fs.readFileSync(path.join(__dirname, '../../vercel.json'), 'utf8')).redirects || [];
    for (const rule of redirects) {
        const prefix = rule.source.split(':path*')[0];
        if (rule.source.includes(':path*') ? pathname.startsWith(prefix) : pathname === prefix) {
            response.writeHead(301, { Location: rule.destination.replace(':path*', pathname.slice(prefix.length)) }).end();
            return;
        }
    }
    const file = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.stat(file, (error, stat) => {
        if (error || !stat.isFile()) { response.writeHead(404).end('Not found'); return; }
        const modified = stat.mtime.toUTCString();
        const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream',
            'Cache-Control': 'public, max-age=0, must-revalidate', 'Last-Modified': modified };
        if (request.headers['if-modified-since'] === modified) { response.writeHead(304, headers).end(); return; }
        response.writeHead(200, { ...headers, 'Content-Length': stat.size });
        if (request.method === 'HEAD') response.end();
        else fs.createReadStream(file).pipe(response);
    });
});
server.listen(port, '127.0.0.1', () => console.log('Serving ' + root + ' on ' + port));
process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());
