import { test, expect } from '@playwright/test';

test('Open SelectorsHub page', async ({ page }) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/');
  await expect(page).toHaveTitle(/XPath Practice Page/);
});
