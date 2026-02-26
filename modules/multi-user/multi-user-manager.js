export async function createUsers(browser, roles = ['admin', 'user']) {
    const contexts = {};

    for (const role of roles) {
        const context = await browser.newContext();
        const page = await context.newPage();

        contexts[role] = { context, page };
    }

    return contexts;
}

export async function closeUsers(users) {
    for (const role of Object.keys(users)) {
        await users[role].context.close();
    }
}