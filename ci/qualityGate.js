const fs = require('fs');

const data = JSON.parse(fs.readFileSync('test-results/results.json'));

let total = 0;
let passed = 0;

data.suites.forEach(suite => {
    suite.specs.forEach(spec => {
        spec.tests.forEach(test => {
            total++;
            if (test.results[0].status === 'passed') passed++;
        });
    });
});

const passRate = passed / total;
console.log(`Pass rate: ${passRate * 100}%`);

if (passRate < 0.95) {
    console.error('❌ Quality gate failed');
    process.exit(1);
}