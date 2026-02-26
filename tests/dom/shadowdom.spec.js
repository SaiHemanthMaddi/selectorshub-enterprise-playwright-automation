import { test, expect } from '@playwright/test';
import { ShadowPage } from '../../pages/shadow.page';
import { getFrameInsideShadow } from '../../utils/shadow.utils';

test.skip(
  ({ browserName }) => browserName === 'firefox',
  'Firefox has unstable Shadow DOM support',
);

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit Shadow DOM instability');

test.describe('@shadow Shadow DOM Module', () => {
  test('Open Shadow DOM input', async ({ page }) => {
    const shadow = new ShadowPage(page);
    await shadow.open();

    await shadow.fillOpenShadowInput('Playwright Shadow');

    await expect(page.locator(shadow.openShadowInput)).toHaveValue('Playwright Shadow');
  });

  test('Nested Shadow DOM input', async ({ page }) => {
    const shadow = new ShadowPage(page);
    await shadow.open();

    await shadow.fillNestedShadowInput('Paneer Pizza');

    await expect(page.locator(shadow.nestedShadowInput)).toHaveValue('Paneer Pizza');
  });

  test('SVG inside Shadow DOM', async ({ page }) => {
    const shadow = new ShadowPage(page);
    await shadow.open();

    await expect(page.locator(shadow.svgInsideShadow)).toBeVisible();
  });

  test('iframe inside Shadow DOM', async ({ page }) => {
    const shadow = new ShadowPage(page);
    await shadow.openIframeInsideShadowPage();

    const frame = await getFrameInsideShadow(page, shadow.iframeInsideShadow);
    const crushInput = frame.locator('#jex');

    await crushInput.fill('shadowframe@test.com');
    await expect(crushInput).toHaveValue('shadowframe@test.com');
  });

  test('Shadow DOM inside iframe', async ({ page }) => {
    const shadow = new ShadowPage(page);
    await shadow.openShadowInsideIframePage();

    const frame = page.frameLocator('iframe[src*="shadow-dom-closed-shadowdom"]').first();
    const teaInput = frame.locator('#snacktime >> #tea');
    const pizzaInput = frame.locator('#snacktime >> #app2 >> #pizza');

    await teaInput.fill('Masala chai');
    await pizzaInput.fill('Paneer pizza');

    await expect(teaInput).toHaveValue('Masala chai');
    await expect(pizzaInput).toHaveValue('Paneer pizza');
  });

  test('Closed Shadow DOM limitation', async () => {
    console.log(`
      Closed shadow roots cannot be accessed by Playwright or Selenium.
      Reason: shadowRoot.mode = "closed"
      Only browser DevTools hacks exist (not real automation).
    `);
  });
});
