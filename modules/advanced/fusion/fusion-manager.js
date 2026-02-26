import { createUsers, closeUsers } from '../../multi-user/multi-user-manager.js';

export async function createFusionUsers(browser) {
    const users = await createUsers(browser, ['admin', 'user']);
    return users;
}

export async function cleanupFusion(users) {
    await closeUsers(users);
}
