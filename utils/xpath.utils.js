// Validate locator exists
async function expectVisible(page, xpath) {
    const el = page.locator(xpath);
    await el.waitFor({ state: 'visible' });
    return el;
}

// Fill field safely
async function fillByXPath(page, xpath, value) {
    const el = page.locator(xpath);
    await el.fill(value);
    return el;
}

// Debug XPath matches
async function countMatches(page, xpath) {
    const count = await page.locator(xpath).count();
    console.log(`XPath "${xpath}" matches: ${count}`);
    return count;
}

module.exports = {
    expectVisible,
    fillByXPath,
    countMatches,
};