import { debugLog } from './debugLogger.js';

// Validate locator exists
export async function expectVisible(page, xpath) {
    const el = page.locator(xpath);
    await el.waitFor({ state: 'visible' });
    return el;
}

// Fill field safely
export async function fillByXPath(page, xpath, value) {
    const el = page.locator(xpath);
    await el.fill(value);
    return el;
}

// Debug XPath matches
export async function countMatches(page, xpath) {
    const count = await page.locator(xpath).count();
    debugLog(`XPath "${xpath}" matches: ${count}`);
    return count;
}
