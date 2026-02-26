import { test, expect } from '@playwright/test';
import { mockUsersApi, mockServerError, slowApi } from '../../modules/network/mock-api';
import { injectProduct } from '../../modules/network/intercept-api';
import { blockImages } from '../../modules/network/block-requests';
import { attachApiLogger } from '../../modules/network/api-logger';

test.describe('@network Network Module', () => {

    // ==============================
    // 📜 CONTRACT TESTS
    // ==============================
    test.describe('📜 Contract Validation', () => {

        test('@network Contract validation test', async ({ page }) => {
            await page.goto('/');

            const data = await page.evaluate(async () => {
                const res = await fetch('/users');
                return res.json();
            });

            expect(Array.isArray(data)).toBeTruthy();
            expect(data[0]).toHaveProperty('id');
            expect(data[0]).toHaveProperty('name');
            expect(data[0]).toHaveProperty('role');
        });

    });

    // ==============================
    // 🧪 API MOCKING
    // ==============================
    test.describe('🧪 Mocking Tests', () => {

        test('@network Mock API test', async ({ page }) => {
            await mockUsersApi(page);
            await page.goto('/');

            const data = await page.evaluate(async () => {
                const res = await fetch('/users');
                return res.json();
            });

            expect(data[0].name).toBe('Sai Hemanth');
        });

    });

    // ==============================
    // 🔁 RESPONSE MUTATION
    // ==============================
    test.describe('🔁 Response Mutation', () => {

        test('@network Injected product integrity', async ({ page }) => {
            await injectProduct(page);
            await page.goto('/');

            const data = await page.evaluate(async () => {
                const res = await fetch('/products');
                return res.json();
            });

            const injected = data.find(p => p.name === 'Injected Product');

            expect(injected).toBeDefined();
            expect(injected.id).toBe(999);
        });

    });

    // ==============================
    // 🛡 REQUEST INTERCEPTION
    // ==============================
    test.describe('🛡 Interception Tests', () => {

        test('@network Block images test', async ({ page }) => {
            await blockImages(page);
            await page.goto('/index.html');

            await expect(page.getByText('Mock App')).toBeVisible();
        });

        test('@network Block tracking domains', async ({ page }) => {
            const blockedRequests = [];

            await page.route(/analytics/i, route => {
                blockedRequests.push(route.request().url());
                route.abort();
            });

            await page.goto('/');

            await page.evaluate(() => {
                navigator.sendBeacon('/analytics-pixel');
            });

            await page.waitForTimeout(300);

            expect(blockedRequests.length).toBeGreaterThan(0);
        });
    });

    // ==============================
    // 📡 LOGGING TESTS
    // ==============================
    test.describe('📡 Network Logging', () => {

        test('@network API logger emits events', async ({ page }) => {
            let logged = false;

            page.on('response', res => {
                if (res.url().includes('/users')) logged = true;
            });

            await page.goto('/');
            await page.evaluate(() => fetch('/users'));

            expect(logged).toBeTruthy();
        });

    });

    // ==============================
    // 💥 FAILURE SIMULATION
    // ==============================
    test.describe('💥 Failure Simulations', () => {

        test('@network Server error handling', async ({ page }) => {
            await mockServerError(page);
            await page.goto('/');

            const status = await page.evaluate(async () => {
                const r = await fetch('/users');
                return r.status;
            });

            expect(status).toBe(500);
        });

    });

    // ==============================
    // ⚡ PERFORMANCE SIMULATION
    // ==============================
    test.describe('⚡ Performance Tests', () => {

        test('@network Slow API simulation', async ({ page }) => {
            await slowApi(page);
            await page.goto('/');

            const start = Date.now();
            await page.evaluate(() => fetch('/users'));
            const duration = Date.now() - start;

            expect(duration).toBeGreaterThan(2000);
        });

    });

});