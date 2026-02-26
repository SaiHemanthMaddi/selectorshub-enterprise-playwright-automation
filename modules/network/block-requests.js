export async function blockImages(page) {
    await page.route('**/*.{png,jpg,jpeg,gif}', route => route.abort());
}