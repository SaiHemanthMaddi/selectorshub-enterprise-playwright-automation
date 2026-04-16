import fs from 'node:fs/promises';
import path from 'node:path';

async function ensureHarFile(browser, harPath) {
    try {
        await fs.access(harPath);
        return;
    } catch {
        await fs.mkdir(path.dirname(harPath), { recursive: true });

        const seedContext = await browser.newContext({
            baseURL: 'http://localhost:3000',
            recordHar: {
                path: harPath,
                mode: 'minimal'
            },
            serviceWorkers: 'block'
        });

        const seedPage = await seedContext.newPage();
        await seedPage.goto('/', { waitUntil: 'domcontentloaded' });
        await seedContext.close();
    }
}

export async function createHarContext(browser, harPath = 'mock.har') {
    const browserName = browser.browserType().name();
    const parsedHarPath = path.parse(harPath);
    const browserHarFilename = `${parsedHarPath.name}.${browserName}${parsedHarPath.ext || '.har'}`;
    const resolvedHarPath = path.resolve(process.cwd(), parsedHarPath.dir, browserHarFilename);
    await ensureHarFile(browser, resolvedHarPath);

    const context = await browser.newContext({
        baseURL: 'http://localhost:3000',
        serviceWorkers: 'block'
    });

    await context.routeFromHAR(resolvedHarPath, {
        notFound: 'abort'
    });

    return context;
}
