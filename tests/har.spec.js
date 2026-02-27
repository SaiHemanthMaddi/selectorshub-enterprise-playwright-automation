import { test, expect } from './fixtures/test-base.js';
import { createHarContext } from '../modules/advanced/har/har-replay.js';

test.describe('@har HAR Replay Module', () => {

    test('@har Offline replay works', async ({ browser }) => {
        const context = await createHarContext(browser, 'mock.har');
        const page = await context.newPage();

        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { name: 'Mock App' })).toBeVisible();

        await context.close();
    });

    test('@har Multi-user HAR replay', async ({ browser }) => {
        const context1 = await createHarContext(browser, 'mock.har');
        const context2 = await createHarContext(browser, 'mock.har');

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        await Promise.all([
            page1.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' }),
            page2.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
        ]);

        await expect(page1.getByRole('heading', { name: 'Mock App' })).toBeVisible();
        await expect(page2.getByRole('heading', { name: 'Mock App' })).toBeVisible();

        await context1.close();
        await context2.close();
    });
});


