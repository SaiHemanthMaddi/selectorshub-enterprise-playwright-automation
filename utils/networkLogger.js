function attachNetworkLogger(page, logs = []) {
    page.on('request', req => {
        logs.push({ type: 'request', url: req.url(), method: req.method() });
    });

    page.on('response', res => {
        logs.push({ type: 'response', url: res.url(), status: res.status() });
    });

    return logs;
}

module.exports = { attachNetworkLogger };