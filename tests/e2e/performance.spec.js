const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const routes = ['/', '/gallery.html', '/tours/collection-family.html',
    '/tours/highlights-escape.html', '/destinations/ella.html'];

// Use the same throttling and sample window before and after the migration.
for (const mobile of [true, false]) {
    test(`representative ${mobile ? 'phone' : 'desktop'} loads`, async ({ browser, baseURL }) => {
        const context = await browser.newContext({
            viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
            isMobile: mobile,
            deviceScaleFactor: mobile ? 2 : 1,
            hasTouch: mobile,
            serviceWorkers: 'block'
        });
        await context.addInitScript(() => {
            window.__pageMetrics = { lcp: 0, cls: 0, blockingMs: 0, longTasks: 0, events: [] };
            for (const type of ['largest-contentful-paint', 'layout-shift', 'longtask', 'event']) {
                new PerformanceObserver(list => {
                    for (const entry of list.getEntries()) {
                        if (type === 'largest-contentful-paint') {
                            window.__pageMetrics.lcp = entry.startTime;
                            window.__pageMetrics.lcpElement = entry.element?.id || entry.element?.tagName;
                            window.__pageMetrics.lcpUrl = entry.url;
                        }
                        if (type === 'layout-shift' && !entry.hadRecentInput) window.__pageMetrics.cls += entry.value;
                        if (type === 'longtask') {
                            window.__pageMetrics.longTasks++;
                            window.__pageMetrics.blockingMs += Math.max(0, entry.duration - 50);
                        }
                        if (type === 'event') window.__pageMetrics.events.push(entry.duration);
                    }
                }).observe({ type, buffered: true, durationThreshold: 16 });
            }
        });
        const results = [];
        for (const route of routes) {
            const page = await context.newPage();
            const client = await context.newCDPSession(page);
            await client.send('Network.enable');
            await client.send('Network.clearBrowserCache');
            await client.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 });
            await client.send('Network.emulateNetworkConditions', {
                offline: false, latency: mobile ? 150 : 20,
                downloadThroughput: mobile ? 200000 : 1250000,
                uploadThroughput: mobile ? 93750 : 625000,
                connectionType: mobile ? 'cellular4g' : 'wifi'
            });
            for (const load of ['cold', 'repeat']) {
                let transferredBytes = 0;
                let requests = 0;
                const finished = event => { transferredBytes += event.encodedDataLength; requests++; };
                client.on('Network.loadingFinished', finished);
                const response = load === 'cold'
                    ? await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' })
                    : await page.reload({ waitUntil: 'domcontentloaded' });
                expect(response.status()).toBe(200);
                await page.waitForTimeout(10000);
                const beforeScroll = await page.evaluate(() => ({ ...window.__pageMetrics,
                    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                    dcl: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
                    heading: document.querySelector('h1')?.textContent.trim()
                }));
                await page.mouse.wheel(0, 900);
                await page.waitForTimeout(750);
                await page.mouse.wheel(0, -900);
                await page.waitForTimeout(750);
                const afterScroll = await page.evaluate(() => window.__pageMetrics);
                results.push({ route, load, mobile, ...beforeScroll,
                    scrollBlockingMs: afterScroll.blockingMs - beforeScroll.blockingMs,
                    maxEventMs: Math.max(0, ...afterScroll.events), transferredBytes, requests });
                client.off('Network.loadingFinished', finished);
            }
            await page.close();
        }
        const output = path.resolve(__dirname, '../output');
        fs.mkdirSync(output, { recursive: true });
        fs.writeFileSync(path.join(output, `${process.env.PERF_LABEL || 'current'}-${mobile ? 'phone' : 'desktop'}.json`), JSON.stringify(results, null, 2));
        console.log(JSON.stringify(results));
        await context.close();
    });
}
