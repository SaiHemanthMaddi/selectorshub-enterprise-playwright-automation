const fs = require('fs');

const data = JSON.parse(fs.readFileSync('test-results/results.json'));

const stats = {};

data.suites.forEach(suite => {
    suite.specs.forEach(spec => {
        spec.tests.forEach(test => {
            const name = test.title;
            stats[name] = stats[name] || { runs: 0, fails: 0 };

            stats[name].runs++;
            if (test.results[0].status === 'failed') stats[name].fails++;
        });
    });
});

const report = Object.entries(stats).map(([name, val]) => ({
    test: name,
    flakyScore: val.runs > 0 ? (val.fails / val.runs) * 100 : 0
}));

console.table(report);