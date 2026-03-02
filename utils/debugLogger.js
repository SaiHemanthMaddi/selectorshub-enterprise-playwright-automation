const DEBUG_ENABLED =
  process.env.DEBUG_E2E === '1' || process.env.DEBUG_E2E === 'true';

export function debugLog(...args) {
  if (DEBUG_ENABLED) {
    console.log(...args);
  }
}
