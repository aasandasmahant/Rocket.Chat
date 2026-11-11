# YasChat Stage 25 — Approved product catalogue persistence queries

## Scope

This stage turns the existing YasChat MongoDB model from an index-only shell into a bounded query surface for the product catalogue. It does not add HTTP endpoints, API credentials, imported products, sample products, or UI cards.

## Changes

- Extended `IYasChatProductsModel` with explicit approved-catalogue and moderation-status query methods.
- Added `findApprovedProducts`, which always includes `moderation.status: approved`; callers cannot pass an arbitrary MongoDB filter that removes this condition.
- Public results are projected to `_id`, `product`, `createdAt`, and `updatedAt`, excluding moderation metadata and internal creator fields.
- Search text is trimmed, capped at 120 characters, and escaped before use in case-insensitive title, description, and category matching.
- Category is trimmed and capped at 100 characters.
- Public page size is bounded to 1–50 (default 20); offset is clamped to zero or greater.
- Added a bounded moderation-status query for later admin services (maximum 100; default 50).
- Existing unique source/external-ID and moderation/category indexes remain unchanged.

## Security boundary

The model query is a defence-in-depth data-access constraint, not a replacement for service/API authorization. Admin listing and moderation transitions must still be permission-checked in a service layer. Public endpoints must validate request input, rate-limit requests, and map records to a deliberate response DTO. No endpoint is exposed in this stage.

## Verification

- Source changes were committed to `yaschat/phase-1-foundation` and were read back from GitHub and the approved-only filter, response projection, and bounded pagination were confirmed in the committed source.
- Build, TypeScript typecheck, lint, automated tests, MongoDB integration tests, and browser tests have **not** been run in this stage. No passing CI result is claimed.
- No ClickBank or ShareASale credentials were added. No product records or fabricated catalogue data were inserted.

## Next stage

Implement the permission-checked service/API boundary around these model methods, with tests proving public queries cannot return draft, pending-review, rejected, or archived records and admin queries require the appropriate Rocket.Chat permission.
