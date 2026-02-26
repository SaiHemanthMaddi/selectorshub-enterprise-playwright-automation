import { test, expect } from '@playwright/test';
import { ComplexPage } from '../../pages/complex.page';

test.skip(({ browserName }) => browserName === 'firefox', 'Firefox CSS selector instability');

test.describe('@complex Complex Elements Module', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
    });

    test('Validate SVG element exists', async ({ page }) => {
        const complexPage = new ComplexPage(page);
        await complexPage.open();

        await expect(complexPage.svgElement.first()).toBeVisible({ timeout: 10000 });
    });

    test('Validate multilingual text', async ({ page }) => {
        const complexPage = new ComplexPage(page);
        await complexPage.open();

        await expect(complexPage.multilingualText).toBeVisible({ timeout: 10000 });
    });

    test('Hidden textbox interaction', async ({ page }) => {
        const complexPage = new ComplexPage(page);
        await complexPage.open();

        await complexPage.hiddenTextbox.scrollIntoViewIfNeeded();
        await complexPage.hiddenTextbox.fill('Secret');
        await expect(complexPage.hiddenTextbox).toHaveValue('Secret');
    });

    test('Validate tricky button visible', async ({ page }) => {
        const complexPage = new ComplexPage(page);
        await complexPage.open();

        await expect(complexPage.trickyButton).toBeVisible({ timeout: 10000 });
    });
});