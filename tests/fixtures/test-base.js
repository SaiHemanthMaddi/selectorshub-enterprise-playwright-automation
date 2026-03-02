import { test as base, expect } from '@playwright/test';
import { saveDomSnapshot } from '../../utils/domSnapshot.js';

const test = base;

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const snapshotName = `${testInfo.project.name}_${testInfo.title}`;
    await saveDomSnapshot(page, snapshotName);
  }
});

export { test, expect };
