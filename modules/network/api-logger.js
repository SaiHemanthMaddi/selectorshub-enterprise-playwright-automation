import { debugLog } from '../../utils/debugLogger.js';

export function attachApiLogger(page) {
    page.on('response', async response => {
        const url = response.url();

        if (url.includes('/api')) {
            try {
                const body = await response.json();
                debugLog(`API: ${url}`, body);
            } catch (error) {
                debugLog(`Failed to parse API response for URL: ${url}`, error);
            }
        }
    });
}
