import { debugLog } from './debugLogger.js';

export async function logAllFrames(page) {
    page.frames().forEach(f => debugLog(f.url()));
}

export function getFrameByUrl(page, partialUrl) {
    return page.frames().find(f => f.url().includes(partialUrl));
}
