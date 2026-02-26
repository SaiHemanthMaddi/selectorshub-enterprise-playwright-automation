// ==============================
// 🧪 MOCK USERS API
// ==============================
export async function mockUsersApi(page) {
  await page.route('**/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Sai Hemanth', role: 'Admin' },
        { id: 2, name: 'Mock User', role: 'Tester' }
      ])
    });
  });
}

// ==============================
// 💥 FORCE SERVER ERROR
// ==============================
export async function mockServerError(page) {
  await page.route('**/users', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server crashed' })
    });
  });
}

// ==============================
// ⚡ SLOW API SIMULATION
// ==============================
export async function slowApi(page) {
  await page.route('**/users', async route => {
    await new Promise(r => setTimeout(r, 2000));
    await route.continue();
  });
}