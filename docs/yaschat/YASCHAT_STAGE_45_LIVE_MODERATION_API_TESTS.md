# YasChat Stage 45 — Live Moderation API Authorization Coverage

## Objective
Add HTTP-level regression coverage for the YasChat product moderation endpoints using Rocket.Chat's established end-to-end API test harness.

## Implemented
- Added `tests/end-to-end/api/yaschat-product-moderation.ts`.
- Reuses the repository's API credentials, user creation/login helpers, and permission restoration helper.
- Covers the history, approve, and reject routes.
- Verifies unauthenticated requests are rejected with HTTP 401.
- Verifies an authenticated ordinary user without `yaschat-product-moderation` is rejected with HTTP 403 and `error-forbidden`.
- Verifies the administrator can read the moderation history using the default admin-only permission.
- Restores the permission to its declared default roles and deletes the temporary user during cleanup.
- Added the focused command `yarn workspace @rocket.chat/meteor testapi:yaschat-moderation`.

## Test scope and execution
This is an HTTP-level integration test authored for the existing `.testapi` harness. It requires a running Rocket.Chat test server and the normal end-to-end test environment. It was not executed in this GitHub-only editing session. Therefore no live 401/403 result, passing test result, or CI success is claimed.

The Stage 44 source-contract tests remain complementary checks; they do not replace this HTTP-level test.

## CI status
The current YasChat workflow does not start a Rocket.Chat server for API tests. The new command is exposed for the established API test environment but is intentionally not added to the unit-only workflow, avoiding a guaranteed failure from attempting to call an unavailable server.

## Files
- `apps/meteor/tests/end-to-end/api/yaschat-product-moderation.ts`
- `apps/meteor/package.json`

## Next
Run the focused API test in the repository's configured end-to-end environment, then add the command to a CI job that provisions and starts the test server. After that, extend live coverage to positive approve/reject state transitions with seeded pending-product records.
