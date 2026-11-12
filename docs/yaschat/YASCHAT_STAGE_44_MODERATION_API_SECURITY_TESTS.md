# YasChat Stage 44 — Moderation API Authorization Regression Coverage

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Scope

Added focused regression coverage for the approve/reject moderation API contracts. This is a source-contract test: it guards the route registration options and request-schema constraints. It does not replace live HTTP integration tests proving actual 401/403 responses.

## Changes committed

1. Added `apps/meteor/server/api/v1/yaschat-admin-product-review.test.ts`.
   - Checks that both approve and reject routes require authentication.
   - Checks that both routes require `yaschat-product-moderation`.
   - Checks that both routes declare 401 and 403 response validators.
   - Checks positive expected-version constraints and a non-empty rejection reason.
2. Extended `testunit:yaschat-permissions` to run both the Stage 42 permission-registry tests and the new API source-contract tests.
3. Corrected the audit-history route comment: access is granted to authenticated users with the dedicated permission, not only users whose role is literally administrator.

## Verification status

- Updated files were committed to the YasChat branch and re-fetched for source verification.
- The test suite has not been executed in this environment.
- No successful GitHub Actions run has been confirmed for this stage.
- These source-contract tests do not simulate HTTP requests and do not prove live 401/403 behavior. A running Meteor API integration environment and role-based requests are still required.
- No merge to `develop` was performed.

## Remaining security checks

- Live unauthenticated request returns 401 for queue, history, approve, and reject routes.
- Authenticated user without the dedicated permission receives 403.
- Admin and explicitly granted moderator can use permitted actions.
- Permission revocation takes effect without restarting the server.
- Lint, typecheck, unit tests, API integration tests, and full build pass.

## Next stage

Stage 45: inspect GitHub Actions execution and add live API authorization integration coverage using the repository's established API test harness.
