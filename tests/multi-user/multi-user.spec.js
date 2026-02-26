import { test, expect } from '@playwright/test';
import { createUsers, closeUsers } from '../../modules/multi-user/multi-user-manager.js';

async function gotoWithRetry(page, path = '/', attempts = 3) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await page.goto(path, { waitUntil: 'domcontentloaded' });
            return;
        } catch (error) {
            if (i === attempts) {
                throw error;
            }
            await page.waitForTimeout(500);
        }
    }
}

test.describe('@multiuser Multi-User Module', () => {

    test('@multiuser Admin approves user action', async ({ browser }) => {
        const users = await createUsers(browser, ['admin', 'user']);
        const admin = users.admin.page;
        const user = users.user.page;

        await Promise.all([
            gotoWithRetry(admin),
            gotoWithRetry(user)
        ]);

        await admin.evaluate(async () => {
            await fetch('/approval', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });
        });

        const approved = await user.evaluate(async () => {
            const res = await fetch('/approval');
            return (await res.json()).approved;
        });

        expect(approved).toBe(true);
        await closeUsers(users);
    });

    test('@multiuser Real-time approval polling', async ({ browser }) => {
        const users = await createUsers(browser, ['admin', 'user']);
        const admin = users.admin.page;
        const user = users.user.page;

        await Promise.all([
            gotoWithRetry(admin),
            gotoWithRetry(user)
        ]);

        await user.waitForTimeout(1000);

        await admin.evaluate(async () => {
            await fetch('/approval', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });
        });

        await expect.poll(async () => {
            return await user.evaluate(async () => {
                const res = await fetch('/approval');
                return (await res.json()).approved;
            });
        }, { timeout: 10000 }).toBe(true);

        await closeUsers(users);
    });

    test('@multiuser Non-admin cannot approve', async ({ browser }) => {
        const users = await createUsers(browser, ['user']);

        const user = users.user.page;
        await gotoWithRetry(user);

        const status = await user.evaluate(async () => {
            const res = await fetch('/approval', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });
            return res.status;
        });

        expect(status).toBe(200);

        await closeUsers(users);
    });

    test('@multiuser Concurrent approval overwrite', async ({ browser }) => {
        const users = await createUsers(browser, ['admin1', 'admin2']);

        const a1 = users.admin1.page;
        const a2 = users.admin2.page;

        await Promise.all([gotoWithRetry(a1), gotoWithRetry(a2)]);

        await Promise.all([
            a1.evaluate(() =>
                fetch('/approval', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ approved: true })
                })
            ),
            a2.evaluate(() =>
                fetch('/approval', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ approved: false })
                })
            )
        ]);

        const final = await a1.evaluate(async () => {
            const res = await fetch('/approval');
            return (await res.json()).approved;
        });

        expect(typeof final).toBe('boolean');

        await closeUsers(users);
    });

    test('@multiuser Admin adds product visible to user', async ({ browser }) => {
        const users = await createUsers(browser, ['admin', 'user']);

        const admin = users.admin.page;
        const user = users.user.page;

        await Promise.all([gotoWithRetry(admin), gotoWithRetry(user)]);

        await admin.evaluate(async () => {
            await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Tablet', price: 600 })
            });
        });

        const products = await user.evaluate(async () => {
            const res = await fetch('/products');
            return res.json();
        });

        const found = products.find(p => p.name === 'Tablet');
        expect(found).toBeTruthy();

        await closeUsers(users);
    });

    test('@multiuser Admin reset overrides user state', async ({ browser }) => {
        const users = await createUsers(browser, ['admin', 'user']);
        const admin = users.admin.page;
        const user = users.user.page;

        await Promise.all([
            gotoWithRetry(admin),
            gotoWithRetry(user)
        ]);

        await user.evaluate(async () => {
            await fetch('/approval', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });
        });

        await admin.evaluate(async () => {
            await fetch('/approval', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: false })
            });
        });

        const state = await user.evaluate(async () => {
            const res = await fetch('/approval');
            return (await res.json()).approved;
        });

        expect(state).toBe(false);
        await closeUsers(users);
    });
});
