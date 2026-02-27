import { test, expect } from '@playwright/test';
import { injectRandomLatency } from '../modules/advanced/chaos/chaos-network.js';
import { injectRandomFailures } from '../modules/advanced/chaos/chaos-network.js';
import { degradeAssets } from '../modules/advanced/chaos/chaos-network.js';
import { failFirstRequest } from '../modules/advanced/chaos/chaos-network.js';
import { temporaryNetworkOutage } from '../modules/advanced/chaos/chaos-network.js';


test.describe('@chaos Network Chaos Module', () => {

    test('@chaos Random latency tolerance', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await injectRandomLatency(context, 1200, '**/users');

        await page.goto('/');
        const start = Date.now();
        const status = await page.evaluate(async () => {
            const res = await fetch('/users');
            return res.status;
        });
        const duration = Date.now() - start;

        await expect(page.getByText('Mock App')).toBeVisible();
        expect(status).toBe(200);
        expect(duration).toBeGreaterThan(100);

        await context.close();
    });

    test('@chaos API resilience under failures', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await injectRandomFailures(context, 0.5, '**/users');
        await page.goto('/');

        const status = await page.evaluate(async () => {
            const res = await fetch('/users');
            return res.status;
        });

        expect([200, 500]).toContain(status);

        await context.close();
    });

    test('@chaos Degraded asset loading', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await degradeAssets(context);
        await page.goto('/');

        await expect(page.getByText('Mock App')).toBeVisible();

        await context.close();
    });

    test('@chaos Retry succeeds after failure', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await failFirstRequest(context, '**/users');
        await page.goto('/');

        // First call fails
        const first = await page.evaluate(() => fetch('/users').then(r => r.status));
        // Second call succeeds
        const second = await page.evaluate(() => fetch('/users').then(r => r.status));

        expect(first).toBe(500);
        expect(second).toBe(200);

        await context.close();
    });

    test('@chaos Network recovers after outage', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/');
        await temporaryNetworkOutage(context, 1500, '**/users');

        const duringOutage = await page.evaluate(async () => {
            try {
                await fetch('/users');
                return true;
            } catch {
                return false;
            }
        });
        expect(duringOutage).toBe(false);

        // Wait for recovery
        await page.waitForTimeout(2000);

        const status = await page.evaluate(() => fetch('/users').then(r => r.status));

        expect(status).toBe(200);

        await context.close();
    });
});
