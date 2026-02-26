function normalizeFetchUrl(url) {
    return url.replace('://localhost:', '://127.0.0.1:');
}

export async function injectProduct(page) {
    await page.route('**/products', async route => {
        const response = await route.fetch({
            url: normalizeFetchUrl(route.request().url())
        });
        const json = await response.json();

        json.push({
            id: 999,
            name: 'Injected Product'
        });

        await route.fulfill({
            response,
            body: JSON.stringify(json)
        });
    });
}

export async function mockServerError(page) {
    await page.route('**/users', route =>
        route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Server crash' })
        })
    );
}

export async function slowApi(page) {
    await page.route('**/users', async route => {
        await new Promise(r => setTimeout(r, 2000));
        await route.continue();
    });
}
