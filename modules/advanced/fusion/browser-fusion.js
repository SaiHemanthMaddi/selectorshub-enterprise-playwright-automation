function normalizeFetchUrl(url) {
    return url.replace('://localhost:', '://127.0.0.1:');
}

// GLOBAL product injection
export async function injectProductGlobally(context) {
    await context.route('**/products', async route => {
        const response = await route.fetch({
            url: normalizeFetchUrl(route.request().url())
        });
        const data = await response.json();

        data.push({
            id: 7777,
            name: 'Browser Fusion Product',
            price: 0
        });

        await route.fulfill({
            response,
            body: JSON.stringify(data)
        });
    });
}

// GLOBAL API block
export async function blockUsersGlobally(context) {
    await context.route('**/users', route => {
        route.fulfill({
            status: 403,
            body: JSON.stringify({ error: 'Globally blocked' })
        });
    });
}

// GLOBAL latency
export async function slowProductsGlobally(context) {
    await context.route('**/products', async route => {
        await new Promise(r => setTimeout(r, 2000));
        await route.continue();
    });
}
