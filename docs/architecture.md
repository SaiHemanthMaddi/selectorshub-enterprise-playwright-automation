# Architecture

## Purpose

This framework is built as a layered Playwright architecture to keep tests maintainable as complexity grows (DOM depth, network behavior, and multi-user flows).

## Layered Design

```text
Tests (scenario intent)
  -> Page Objects (UI operations)
  -> Modules (capability layer)
  -> Utils (low-level helpers)
  -> Mock Backend + Static App
```

## Repository Topology

```text
selectorshub-playwright/
|-- modules/
|   |-- network/
|   |-- multi-user/
|   `-- advanced/
|       `-- fusion/
|-- pages/
|-- tests/
|   |-- smoke/
|   |-- dom/
|   |-- network/
|   |-- multi-user/
|   `-- fusion/
|-- utils/
|-- public/
|-- docs/
|-- playwright.config.js
`-- package.json
```

## Runtime Flow

1. `json-server` serves static assets from `public/` and API data from `mock-db.json`.
2. Playwright runs tests from `tests/` with configured projects (Chromium, Firefox, WebKit).
3. Tests call page objects and modules rather than duplicating protocol logic.
4. Reporters emit results to HTML and Allure outputs.

## Layer Responsibilities

### Tests

- Express expected behavior in business language.
- Compose modules to simulate real production conditions.
- Stay minimal: avoid embedding interception or context plumbing directly.

### Pages

- Store selectors and page-specific actions.
- Hide locator complexity from test files.
- Keep UI operations deterministic and reusable.

### Modules

- Encapsulate reusable capabilities:
  - `network/`: route mocking, blocking, mutation, delays
  - `multi-user/`: parallel role contexts and lifecycle cleanup
  - `advanced/fusion/`: cross-session and browser-context interception

### Utils

- Small helpers for waits, shadow/iframe access, and stable assertions.
- Shared building blocks used by pages and tests.

## Configuration Strategy

`playwright.config.js` is configured for:
- Parallel execution (`fullyParallel: true`)
- CI-safe behavior (`retries`, single worker in CI)
- Multi-reporter output (HTML, Allure, line, list)
- Local base URL (`http://localhost:3000`)

## Why This Architecture Works

- Scalable: new capabilities are added as modules, not repeated in tests.
- Readable: tests describe intent; implementation details stay in pages/modules.
- Portable: local mock backend makes runs reproducible across machines.
- Portfolio-ready: clear separation of concerns and advanced scenarios.
