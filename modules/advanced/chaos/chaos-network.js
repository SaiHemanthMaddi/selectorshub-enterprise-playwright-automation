// Random latency injector
export async function injectRandomLatency(context, maxMs = 3000, urlPattern = '**/users') {
    await context.route(urlPattern, async route => {
        const delay = Math.random() * maxMs;
        await new Promise(r => setTimeout(r, delay));
        await route.continue();
    });
}

// Random API failures
export async function injectRandomFailures(context, failureRate = 0.3, urlPattern = '**/users') {
    await context.route(urlPattern, route => {
        if (Math.random() < failureRate) {
            route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'Chaos failure' })
            });
        } else {
            route.continue();
        }
    });
}

// Drop images/fonts (simulate poor network)
export async function degradeAssets(context) {
    await context.route('**/*.{png,jpg,jpeg,svg,woff,woff2}', route => {
        route.abort();
    });
}

// Fail first request only
export async function failFirstRequest(context, urlPattern) {
    let failed = false;

    await context.route(urlPattern, route => {
        if (!failed) {
            failed = true;
            route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'First request failed' })
            });
        } else {
            route.continue();
        }
    });
}

export async function temporaryNetworkOutage(context, durationMs = 2000, urlPattern = '**/users') {
    let outage = true;

    setTimeout(() => {
        outage = false;
    }, durationMs);

    await context.route(urlPattern, route => {
        if (outage) {
            route.abort();
        } else {
            route.continue();
        }
    });
}
