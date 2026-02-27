import { test, expect } from '../fixtures/test-base.js';

/*test.skip(
  ({ browserName }) => browserName === 'firefox',
  'Firefox XPath instability',
);

test.skip(({ browserName }) => browserName === 'webkit', 
'WebKit XPath instability');*/

test.describe('@xpath Stable XPath Module', () => {
    test.skip(!!process.env.CI, 'External XPath practice site is unstable in CI');


    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('https://selectorshub.com/xpath-practice-page/');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
    });

    test('XPath text match', async ({ page }) => {
        const el = page.locator('//h3[contains(text(),"Lets test xpath skills")]');
        await expect(el).toBeVisible({ timeout: 10000 });
    });

    test('normalize-space XPath', async ({ page }) => {
        const el = page.locator('//a[normalize-space()="SelectorsHub Youtube Channel"]');
        await expect(el).toBeVisible({ timeout: 10000 });
    });

    test('contains() XPath', async ({ page }) => {
        const el = page.locator('//a[contains(text(),"small Donation")]');
        await expect(el).toBeVisible({ timeout: 10000 });
    });

    test('Table XPath - John Smith', async ({ page }) => {
        const el = page.locator('//td[contains(text(),"John Smith")]');
        await expect(el).toBeVisible({ timeout: 10000 });
    });

    test('Parent axis XPath', async ({ page }) => {
        const row = page.locator('//td[contains(text(),"Joe Root")]/parent::tr');
        await expect(row).toBeVisible({ timeout: 10000 });
    });

    test('Following axis XPath', async ({ page }) => {
        const cell = page.locator('//td[contains(text(),"Joe Root")]/following-sibling::td');
        await expect(cell.first()).toBeVisible({ timeout: 10000 });
    });

    test('XPath index usage', async ({ page }) => {
        const row = page.locator('(//table//tr)[3]');
        await expect(row).toBeVisible({ timeout: 10000 });
    });

    test('XPath count validation', async ({ page }) => {
        const rows = page.locator('//table//tr');
        const count = await rows.count();
        console.log(`Total table rows: ${count}`);
        expect(count).toBeGreaterThan(5);
    });
});


