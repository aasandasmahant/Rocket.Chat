# YasChat Stage 38 — History Loading Reliability and Permission Security Audit

## Completed in this stage

- Replaced the single moderation-history loading identifier with a per-record loading map.
- Prevented duplicate history requests for the same product while allowing different product histories to load independently.
- Cleared each record's loading state independently in the request finalizer, including error responses.
- Kept the existing request credentials, response validation, retry-on-error behavior, and accessible loading/error announcements.

## Source verification

The updated review page was fetched from branch `yaschat/phase-1-foundation` and checked for:
- per-record loading state;
- duplicate-request guard;
- per-record cleanup;
- removal of the former single-record loading state;
- continued use of the moderation-history endpoint.

These are source-level checks only. TypeScript compilation, ESLint, browser rendering, API integration tests, and live authorization tests were not run in this session.

## Security audit finding — production blocker

The product queue, approve, reject, and moderation-history endpoints currently use the generic `access-permissions` permission. This is broader than a dedicated product-moderation capability and does not provide least-privilege separation.

A dedicated permission must not be added only by changing the endpoint string. Rocket.Chat's permission catalogue, default role grants, migration/initialization path, and admin role-management UI must be located and verified first. Code search and likely permission-registration paths were not sufficient to establish that complete lifecycle in this audit. Therefore this stage deliberately does **not** replace the generic permission with an unregistered key, which could lock out legitimate administrators or create a false security boundary.

### Required before production

1. Trace the canonical permission registration and role-default mechanism in this exact Rocket.Chat revision.
2. Add a dedicated permission such as `yaschat-product-moderation` through that mechanism.
3. Grant it only to explicitly selected moderation roles; do not silently grant it to all users.
4. Apply it consistently to queue, approve, reject, and history endpoints.
5. Verify role assignment and 401/403 behavior with integration tests.
6. Run TypeScript, lint, and relevant API tests.

## Stage status

UI concurrency improvement: source change saved and source checks passed.
Dedicated permission hardening: not implemented; blocked pending verified permission lifecycle.
Build and automated tests: not run; no pass claim is made.
