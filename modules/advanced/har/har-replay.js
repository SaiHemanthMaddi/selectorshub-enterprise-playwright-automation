import path from 'node:path';

export async function createHarContext(browser, harPath = 'mock.har') {
    const context = await browser.newContext({
        baseURL: 'http://localhost:3000',
        serviceWorkers: 'block'
    });

    const resolvedHarPath = path.resolve(process.cwd(), harPath);

    await context.routeFromHAR(resolvedHarPath, {
        notFound: 'abort'
    });

    return context;
}
