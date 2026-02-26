/**
 * Safely click an element after ensuring it's visible
 * @param {Locator} locator - Playwright locator
 */
export async function safeClick(locator) {
    if (!locator) {
        throw new Error('Locator is undefined in safeClick');
    }
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
}

/**
 * Safely type into an element after ensuring it's visible
 * @param {Locator} locator - Playwright locator
 * @param {string} text - Text to type
 */
export async function safeType(locator, text) {
    if (!locator) {
        throw new Error('Locator is undefined in safeType');
    }
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.fill(text);
}

/**
 * Wait for element to be visible
 * @param {Locator} locator - Playwright locator
 * @param {number} timeout - Timeout in milliseconds
 */
export async function waitForVisible(locator, timeout = 10000) {
    if (!locator) {
        throw new Error('Locator is undefined in waitForVisible');
    }
    await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element to be attached to DOM
 * @param {Locator} locator - Playwright locator
 * @param {number} timeout - Timeout in milliseconds
 */
export async function waitForAttached(locator, timeout = 10000) {
    if (!locator) {
        throw new Error('Locator is undefined in waitForAttached');
    }
    await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Scroll element into view and click
 * @param {Locator} locator - Playwright locator
 */
export async function scrollAndClick(locator) {
    if (!locator) {
        throw new Error('Locator is undefined in scrollAndClick');
    }
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
}

/**
 * Get text content of an element
 * @param {Locator} locator - Playwright locator
 * @returns {Promise<string>} Text content
 */
export async function getTextContent(locator) {
    if (!locator) {
        throw new Error('Locator is undefined in getTextContent');
    }
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    return await locator.textContent();
}

/**
 * Check if element is visible
 * @param {Locator} locator - Playwright locator
 * @returns {Promise<boolean>}
 */
export async function isVisible(locator) {
    if (!locator) {
        return false;
    }
    try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}