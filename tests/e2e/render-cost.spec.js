const { test } = require('@playwright/test');

// Compare the unchanged glass design with a temporary diagnostic override.
test('profile scrolling with and without visual filters', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await client.send('Performance.enable');
    await page.goto('/');
    const results = [];
    for (const filters of [true, false]) {
        if (!filters) await page.addStyleTag({ content: '*,*::before,*::after{filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important}' });
        await page.evaluate(() => scrollTo(0, 0));
        const before = await client.send('Performance.getMetrics');
        const intervals = await page.evaluate(() => new Promise(resolve => {
            const times = [];
            let previous;
            function frame(now) {
                if (previous) times.push(now - previous);
                previous = now;
                scrollTo(0, times.length * 12);
                if (times.length < 180) requestAnimationFrame(frame);
                else resolve(times);
            }
            requestAnimationFrame(frame);
        }));
        const after = await client.send('Performance.getMetrics');
        const metric = (list, name) => list.metrics.find(metric => metric.name === name).value;
        intervals.sort((a, b) => a - b);
        results.push({ filters, frameP95Ms: intervals[Math.floor(intervals.length * 0.95)],
            taskMs: (metric(after, 'TaskDuration') - metric(before, 'TaskDuration')) * 1000,
            layoutMs: (metric(after, 'LayoutDuration') - metric(before, 'LayoutDuration')) * 1000 });
    }
    console.log('Render diagnostic', JSON.stringify(results));
});
