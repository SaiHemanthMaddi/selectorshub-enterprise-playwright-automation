function normalizeFetchUrl(url) {
    return url.replace('://localhost:', '://127.0.0.1:');
}

// Admin injects fake product
export async function adminInjectProduct(page) {
    await page.route('**/products', async route => {
        const response = await route.fetch({
            url: normalizeFetchUrl(route.request().url())
        });
        const data = await response.json();

        data.push({
            id: 9999,
            name: 'Fusion Injected Product',
            price: 0
        });

        await route.fulfill({
            response,
            body: JSON.stringify(data)
        });
    });
}

// Admin blocks users API
export async function adminBlockUsers(page) {
    await page.route('**/users', route => {
        route.fulfill({
            status: 403,
            body: JSON.stringify({ error: 'Blocked by admin' })
        });
    });
}

// Admin simulates latency
export async function adminSlowProducts(page) {
    await page.route('**/products', async route => {
        await new Promise(r => setTimeout(r, 2000));
        await route.continue();
    });
}
