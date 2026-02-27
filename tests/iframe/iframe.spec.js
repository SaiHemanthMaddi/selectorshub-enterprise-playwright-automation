import { test, expect } from '../fixtures/test-base.js';

async function waitForFrame(page, predicate, timeout = 15000) {
    await expect
        .poll(() => {
            const frame = page.frames().find(predicate);
            return frame ? frame.url() : null;
        }, { timeout })
        .not.toBeNull();

    return page.frames().find(predicate);
}

test.describe('@iframe Iframe Scenario - Core Tests', () => {
    const URL = 'https://selectorshub.com/iframe-scenario/';

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
    });

    test('Verify page loads successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Automation Challenge/);
        expect(page.url()).toContain('iframe-scenario');
    });

    test('Validate frame count', async ({ page }) => {
        await expect.poll(() => page.frames().length, { timeout: 15000 }).toBeGreaterThan(1);

        const frames = page.frames();
        console.log(`Total frames: ${frames.length}`);
    });

    test('Access Level 1 iframe - pact1', async ({ page }) => {
        const pact1Frame = await waitForFrame(page, f =>
            f.url().includes('iframe-and-nested-iframe')
        );

        expect(pact1Frame).toBeDefined();

        await expect.poll(async () => pact1Frame.title(), { timeout: 15000 }).toContain('SelectorsHub');
    });

    test('Access Level 2 nested iframe - pact1 > pact2', async ({ page }) => {
        const pact2Frame = await waitForFrame(
            page,
            f => f.url().includes('/input-box/') && !f.url().includes('copy')
        );

        expect(pact2Frame).toBeDefined();

        await expect.poll(async () => pact2Frame.title(), { timeout: 15000 }).toContain('SelectorsHub');
    });

    test('Access Level 3 nested iframe - pact1 > pact2 > pact3', async ({ page }) => {
        const pact3Frame = await waitForFrame(page, f => f.url().includes('input-box-copy'));

        expect(pact3Frame).toBeDefined();

        await expect.poll(async () => pact3Frame.title(), { timeout: 15000 }).toContain('SelectorsHub');
    });
});


