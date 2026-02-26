export function attachApiLogger(page) {
    page.on('response', async response => {
        const url = response.url();

        if (url.includes('/api')) {
            try {
                const body = await response.json();
                console.log(`API: ${url}`, body);
            } catch (error) {
                console.log(`Failed to parse API response for URL: ${url}`, error);
            }
        }
    });
}