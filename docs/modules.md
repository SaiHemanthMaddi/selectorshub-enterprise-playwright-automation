# Modules

## Design Principles

- Single responsibility per module
- Thin test files, rich reusable capabilities
- Explicit setup/teardown for deterministic runs

## Module Catalog

## 1) DOM and Interaction Modules

Primary goal: reliable interaction with complex DOM structures.

Related components:
- Page objects in `pages/` (`shadow.page.js`, `iframe.page.js`, `xpath.page.js`, `complex.page.js`)
- Helpers in `utils/` (`shadow.utils.js`, `frame.utils.js`, `xpath.utils.js`)

Typical scenarios:
- Open + nested Shadow DOM operations
- iFrame switching and element targeting inside frames
- XPath-based strategies for dynamic elements

## 2) Network Module (`modules/network`)

Purpose: control and observe network behavior under test.

Available utilities:
- `mock-api.js`
  - `mockUsersApi(page)`
  - `mockServerError(page)`
  - `slowApi(page)`
- `intercept-api.js`
  - `injectProduct(page)`
- `block-requests.js`
  - `blockImages(page)`
- `api-logger.js`
  - `attachApiLogger(page)`

Use cases:
- Contract checks for response shape
- Chaos/failure simulation (500 responses, latency)
- Payload mutation for business-rule validation
- Resource blocking for performance-sensitive tests

## 3) Multi-User Module (`modules/multi-user`)

Purpose: run parallel user roles in isolated contexts.

Available utilities:
- `createUsers(browser, roles)`
- `closeUsers(users)`

What it enables:
- Admin/User synchronization scenarios
- Shared backend state validation across sessions
- Concurrent update and overwrite behavior testing

## 4) Fusion Module (`modules/advanced/fusion`)

Purpose: advanced cross-session and browser-level network control.

Available utilities:
- `fusion-manager.js`
  - `createFusionUsers(browser)`
  - `cleanupFusion(users)`
- `fusion-interceptors.js`
  - `adminInjectProduct(page)`
  - `adminBlockUsers(page)`
  - `adminSlowProducts(page)`
- `browser-fusion.js`
  - `injectProductGlobally(context)`
  - `blockUsersGlobally(context)`
  - `slowProductsGlobally(context)`

Why it matters:
- Simulates production-grade behavior changes across user sessions
- Demonstrates interception scope differences (page vs context)
- Enables "admin controls environment seen by users" workflows

## Mapping to Test Suites

- `tests/dom/` -> DOM/page-utils coverage
- `tests/network/` -> network controls and API behavior
- `tests/multi-user/` -> concurrency and role-based contexts
- `tests/fusion/` -> advanced distributed interception scenarios
- `tests/smoke/` -> sanity checks

## Extension Pattern

When adding a new capability:
1. Create a focused module under `modules/`.
2. Expose a small API surface (setup/action/cleanup).
3. Add or update page object wrappers if UI interaction is involved.
4. Add targeted specs in the corresponding `tests/<category>/` folder.
5. Document the module contract and intended usage here.
