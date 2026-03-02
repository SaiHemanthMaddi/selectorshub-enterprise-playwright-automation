import { test, expect } from '../fixtures/test-base.js';

test('Open local mock app', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/mock ui/i);
});

test('@flaky Open SelectorsHub page', async ({ page }) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page).toHaveTitle(/xpath practice page/i, { timeout: 30000 });
});


