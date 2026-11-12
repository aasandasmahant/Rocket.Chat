# YasChat Stage 42 — Moderation Permission Regression Tests

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Scope

Add automated regression coverage for the dedicated `yaschat-product-moderation` permission introduced in Stage 40 and aligned with the Admin UI in Stage 41.

## Implemented

Added `apps/meteor/server/lib/authorization/constant/permissions.test.ts` using the repository's existing Node.js test conventions (`node:test` and `node:assert/strict`).

The tests assert:
1. The dedicated permission is registered exactly once.
2. Its default role grant is exactly `['admin']`.
3. Ordinary user, guest, and bot roles do not receive it by default.

This protects the least-privilege default while still allowing an administrator to explicitly grant the permission to a trusted moderator role through the platform's permission management UI.

## Security checks retained from prior stages

The Stage 41 implementation aligns the YasChat Admin sidebar and route guard with the same dedicated permission required by the server-side queue and moderation endpoints.

## Verification status

- Test source file committed to the target branch.
- Test has NOT yet been executed in a local or CI environment.
- TypeScript, lint, integration, API 401/403, browser role-matrix, and full build results are not yet confirmed.
- No production-readiness claim is made.

## Required follow-up checks

1. Run the focused Node test from the repository's supported test runner.
2. Confirm the permission test is discovered by the Meteor workspace test command.
3. Run lint and TypeScript checks.
4. Exercise API requests as admin, trusted moderator with explicit permission, and ordinary user without permission.
5. Confirm unauthorized API requests return 403 and unauthenticated requests return 401.
6. Confirm CI completes successfully on this branch.

## Next stage

Stage 43: validate test discovery and CI configuration, run focused lint/build checks, fix any failures, and record actual results. Do not merge into `develop` until all required gates pass.
