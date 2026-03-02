export async function startHarRecording(browser, path = 'network.har') {
    return await browser.newContext({
        recordHar: {
            path,
            mode: 'full'
        }
    });
}