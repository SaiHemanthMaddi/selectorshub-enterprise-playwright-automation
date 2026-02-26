export async function getFrameInsideShadow(page, shadowSelector) {
  const handle = await page.locator(shadowSelector).first().elementHandle();

  if (!handle) {
    throw new Error(`Unable to find iframe inside shadow using selector: ${shadowSelector}`);
  }

  const frame = await handle.contentFrame();

  if (!frame) {
    throw new Error(
      `Found iframe element but contentFrame() was null for selector: ${shadowSelector}`,
    );
  }

  return frame;
}

export async function waitForShadowVisible(page, selector) {
  await page.locator(selector).waitFor({ state: 'visible' });
}
