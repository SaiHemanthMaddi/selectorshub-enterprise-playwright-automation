# SelectorsHub Enterprise Playwright Automation

Modular Playwright framework for UI, DOM, network, multi-user, chaos, and HAR replay testing.

## Overview

This project is organized into capability modules and scenario suites so tests stay maintainable and can scale across browsers.

## Core Capabilities

- DOM automation
  - Shadow DOM coverage
  - iFrame and nested iFrame handling
  - XPath-driven validation suite
- Network testing
  - API mocking and response mutation
  - Request blocking and latency simulation
  - API event logging utilities
- Multi-user testing
  - Parallel browser contexts for role-based workflows
  - Shared-state and concurrency scenarios
- Fusion module
  - Cross-user interception orchestration
  - Browser-context-level injection/block/latency behaviors
- Chaos module
  - Controlled random latency/failure injection
  - First-request failure and outage-recovery scenarios
- HAR module
  - HAR recording utility
  - HAR replay validation (single and multi-user contexts)
- Observability
  - HTML + Allure + JSON Playwright reports
  - Automatic DOM snapshot capture on failures

## Tech Stack

- `@playwright/test`
- Node.js (ESM project)
- `allure-playwright`
- `json-server`
- ESLint + Prettier

## Project Structure

```text
selectorshub-playwright/
|-- modules/
|   |-- network/
|   |-- multi-user/
|   `-- advanced/
|       |-- fusion/
|       |-- chaos/
|       `-- har/
|-- pages/
|-- tests/
|   |-- fixtures/
|   |-- smoke/
|   |-- dom/
|   |-- iframe/
|   |-- network/
|   |-- multi-user/
|   |-- fusion/
|   |-- xpath/
|   |-- complex/
|   |-- chaos.spec.js
|   `-- har.spec.js
|-- utils/
|   |-- domSnapshot.js
|   `-- networkLogger.js
|-- ci/
|   `-- qualityGate.js
|-- analytics/
|   `-- flaky-analysis.js
|-- docs/
|   |-- architecture.md
|   |-- modules.md
|   `-- fusion-explained.md
|-- .github/workflows/playwright.yml
|-- playwright.config.js
|-- mock-db.json
|-- mock.har
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
npx playwright install
```

## Local Mock Server

```bash
npm run mock:server
```

Configured base URL: `http://127.0.0.1:3000`

## Running Tests

Run full suite:

```bash
npm test
```

Useful variants:

```bash
npm run test:headed
npm run test:debug
npm run test:ui
```

Run tagged module examples:

```bash
npx playwright test --grep @network
npx playwright test --grep @multiuser
npx playwright test --grep @fusion
npx playwright test --grep @chaos
npx playwright test --grep @har
```

## Reporting and Artifacts

- Playwright reporters configured:
  - HTML
  - Allure
  - line
  - list
  - JSON (`test-results/results.json`)
- Failure DOM snapshots are stored in:
  - `artifacts/dom/`

Allure commands:

```bash
npm run allure:generate
npm run allure:open
npm run allure:report
```

## CI Behavior (GitHub Actions)

Workflow: `.github/workflows/playwright.yml`

- `push` / `pull_request`
  - Runs scoped tests based on changed modules/files
  - Skips non-impacting changes
  - Runs full regression only for core config/dependency changes
- `schedule` and `workflow_dispatch`
  - Runs full regression (`npx playwright test`)
- Uploads Playwright HTML artifact for executed runs

## Configuration Highlights

Current `playwright.config.js`:

- `testDir: ./tests`
- `fullyParallel: true`
- CI-aware retries/workers
- Browser projects:
  - Chromium
  - Firefox
  - WebKit
- Local web server:
  - `npm run mock:server`
  - `http://127.0.0.1:3000`

## Documentation

- `docs/architecture.md`
- `docs/modules.md`
- `docs/fusion-explained.md`

## License

ISC
