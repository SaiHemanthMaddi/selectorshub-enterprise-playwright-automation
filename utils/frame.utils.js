export async function logAllFrames(page) {
    page.frames().forEach(f => console.log(f.url()));
}

export function getFrameByUrl(page, partialUrl) {
    return page.frames().find(f => f.url().includes(partialUrl));
}