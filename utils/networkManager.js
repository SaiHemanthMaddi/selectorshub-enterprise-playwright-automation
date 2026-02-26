export async function enableFastMode(page) {
    await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
}