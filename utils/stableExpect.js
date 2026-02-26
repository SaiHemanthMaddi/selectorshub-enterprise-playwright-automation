export async function expectEnabled(locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
}