import { test, expect } from '../fixtures/test-base.js';
import { createFusionUsers, cleanupFusion } from '../../modules/advanced/fusion/fusion-manager.js';
import { adminInjectProduct } from '../../modules/advanced/fusion/fusion-interceptors.js';
import { adminBlockUsers } from '../../modules/advanced/fusion/fusion-interceptors.js';
import { adminSlowProducts } from '../../modules/advanced/fusion/fusion-interceptors.js';
import { injectProductGlobally } from '../../modules/advanced/fusion/browser-fusion.js';
import { blockUsersGlobally } from '../../modules/advanced/fusion/browser-fusion.js';
import { slowProductsGlobally } from '../../modules/advanced/fusion/browser-fusion.js';

test.describe('@fusion Multi-User Network Fusion', () => {

    test('@fusion Admin injects product → user sees it', async ({ browser }) => {
        const users = await createFusionUsers(browser);
        const admin = users.admin.page;
        const user = users.user.page;

        // Admin installs interceptor
        await adminInjectProduct(user);

        await Promise.all([
            admin.goto('/'),
            user.goto('/')
        ]);

        const products = await user.evaluate(async () => {
            const res = await fetch('/products');
            return res.json();
        });

        const injected = products.find(p => p.name === 'Fusion Injected Product');
        expect(injected).toBeTruthy();

        await cleanupFusion(users);
    });

    test('@fusion Admin blocks users API', async ({ browser }) => {
        const users = await createFusionUsers(browser);
        const admin = users.admin.page;
        const user = users.user.page;

        await adminBlockUsers(user);

        await Promise.all([
            admin.goto('/'),
            user.goto('/')
        ]);

        const status = await user.evaluate(async () => {
            const res = await fetch('/users');
            return res.status;
        });

        expect(status).toBe(403);

        await cleanupFusion(users);
    });

    test('@fusion Admin slows API → user feels delay', async ({ browser }) => {
        const users = await createFusionUsers(browser);
        const admin = users.admin.page;
        const user = users.user.page;

        await adminSlowProducts(user);

        await Promise.all([
            admin.goto('/'),
            user.goto('/')
        ]);

        const start = Date.now();

        await user.evaluate(() => fetch('/products'));

        const duration = Date.now() - start;
        expect(duration).toBeGreaterThan(2000);

        await cleanupFusion(users);
    });

    test('@fusion Live admin mutation visible to user', async ({ browser }) => {
        const users = await createFusionUsers(browser);
        const admin = users.admin.page;
        const user = users.user.page;

        await Promise.all([
            admin.goto('/'),
            user.goto('/')
        ]);

        // Admin installs interceptor dynamically
        await adminInjectProduct(user);
        await user.reload({ waitUntil: 'domcontentloaded' });

        await expect.poll(async () => {
            const products = await user.evaluate(async () => {
                const res = await fetch('/products');
                return res.json();
            });
            return products.some(p => p.name === 'Fusion Injected Product');
        }, { timeout: 20000 }).toBe(true);

        await cleanupFusion(users);
    });

    test('@fusion Browser-level injection', async ({ browser }) => {
        const users = await createFusionUsers(browser);

        const adminCtx = users.admin.context;
        const userCtx = users.user.context;

        const admin = users.admin.page;
        const user = users.user.page;

        // Admin installs GLOBAL rule on user context
        await injectProductGlobally(userCtx);

        await Promise.all([
            admin.goto('/'),
            user.goto('/')
        ]);

        const products = await user.evaluate(async () => {
            const res = await fetch('/products');
            return res.json();
        });

        const injected = products.find(p => p.name === 'Browser Fusion Product');
        expect(injected).toBeTruthy();

        await cleanupFusion(users);
    });

    test('@fusion Global API block', async ({ browser }) => {
        const users = await createFusionUsers(browser);

        const userCtx = users.user.context;
        const user = users.user.page;

        await blockUsersGlobally(userCtx);

        await user.goto('/');

        const status = await user.evaluate(async () => {
            const res = await fetch('/users');
            return res.status;
        });

        expect(status).toBe(403);

        await cleanupFusion(users);
    });

    test('@fusion Global latency simulation', async ({ browser }) => {
        const users = await createFusionUsers(browser);

        const userCtx = users.user.context;
        const user = users.user.page;

        await slowProductsGlobally(userCtx);
        await user.goto('/');

        const start = Date.now();
        await user.evaluate(() => fetch('/products'));
        const duration = Date.now() - start;

        expect(duration).toBeGreaterThan(2000);

        await cleanupFusion(users);
    });
});


