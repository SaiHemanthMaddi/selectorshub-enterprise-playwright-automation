import { test, expect } from '../fixtures/test-base.js';

test('Open SelectorsHub page', async ({ page }) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/');
  await expect(page).toHaveTitle(/xpath practice page/i);
});


