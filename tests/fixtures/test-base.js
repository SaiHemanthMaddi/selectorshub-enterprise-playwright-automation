import { test as base, expect } from '@playwright/test';
import { saveDomSnapshot } from '../../utils/domSnapshot.js';
export { test, expect };
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const snapshotName = `${testInfo.project.name}_${testInfo.title}`;
    await saveDomSnapshot(page, snapshotName);
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
      await saveDomSnapshot(page, snapshotName);
    } catch (error) {
      // Snapshot capture is best-effort and must not mask the original test failure.
      console.warn(`DOM snapshot skipped: ${error.message}`);
    }
  }
});
