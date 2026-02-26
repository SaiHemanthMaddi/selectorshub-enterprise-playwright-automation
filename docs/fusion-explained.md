# Fusion Explained

## What "Fusion" Means in This Project

Fusion is the advanced layer where one actor (typically admin) can influence API behavior seen by another actor (user), either at page scope or entire browser-context scope.

It combines:
- Multi-user browser contexts
- Playwright route interception
- Dynamic response mutation/blocking/latency

## Why Fusion Exists

Regular single-user tests do not capture distributed behavior. Fusion tests validate system behavior under coordinated, concurrent sessions.

Examples:
- Admin injects a product, user immediately sees it
- Admin blocks a users endpoint for another session
- Admin introduces latency to test timeout and resilience behavior

## Fusion Building Blocks

## 1) User Orchestration (`fusion-manager.js`)

- `createFusionUsers(browser)` creates role-based users via multi-user module.
- `cleanupFusion(users)` closes all contexts safely.

## 2) Page-Scoped Control (`fusion-interceptors.js`)

- `adminInjectProduct(page)` mutates `/products` response.
- `adminBlockUsers(page)` fulfills `/users` with `403`.
- `adminSlowProducts(page)` adds `~2000ms` delay to `/products`.

Scope: interception is attached to a specific page.

## 3) Context-Scoped Control (`browser-fusion.js`)

- `injectProductGlobally(context)` affects all pages in that context for `/products`.
- `blockUsersGlobally(context)` enforces context-wide `403` for `/users`.
- `slowProductsGlobally(context)` enforces context-wide delay for `/products`.

Scope: broader than page-level and better for true "environment-level" simulation.

## Execution Model

1. Create users (`admin`, `user`) in separate browser contexts.
2. Apply interception rule (page-level or context-level).
3. Navigate both sessions and trigger API calls.
4. Assert user-observed behavior:
   - injected payload exists
   - blocked endpoints return expected status
   - latency exceeds threshold
5. Clean up contexts.

## Page vs Context Interception

- Page-level interception
  - More precise and local
  - Useful for targeted mutation on one tab/session
- Context-level interception
  - Broader and closer to real shared environment manipulation
  - Useful for multi-tab/session consistency within a user context

## Typical Assertions Used in Fusion Specs

- Presence of injected entity (`Fusion Injected Product`, `Browser Fusion Product`)
- Status-code enforcement (`403` for blocked APIs)
- Performance threshold (`duration > 2000ms`)
- Polling-based eventual consistency using `expect.poll`

## Risk Areas and Best Practices

- Ensure cleanup runs after every test to avoid interceptor leakage.
- Keep route patterns strict (`**/users`, `**/products`) to reduce side effects.
- Prefer deterministic assertions over visual timing.
- Use context-level rules when testing environment-wide behavior.

## When to Use Fusion vs Standard Modules

Use standard modules when:
- A single user flow is enough
- Interception is isolated to one page/session

Use fusion when:
- Behavior must be validated across multiple active roles
- One actor should influence another actor's network reality
- You need browser-context level behavior simulation
