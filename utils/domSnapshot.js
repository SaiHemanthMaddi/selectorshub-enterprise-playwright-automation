import fs from 'node:fs';
import path from 'node:path';

function sanitizeFileName(name) {
    return String(name).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

export async function saveDomSnapshot(page, testName) {
    const html = await page.content();
    const safeName = sanitizeFileName(testName);
    const file = path.join('artifacts', 'dom', `${safeName}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html, 'utf8');
    return file;
}
