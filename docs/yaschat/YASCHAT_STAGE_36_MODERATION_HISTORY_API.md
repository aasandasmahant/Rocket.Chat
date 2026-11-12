# YasChat Stage 36 — Protected Moderation History API

## Delivered

- Added `GET /api/v1/yaschat.admin.products.history?recordId=<id>`.
- Requires an authenticated user and the dedicated `yaschat-product-moderation` permission.
- Validates a required record ID (1–160 characters) and rejects additional query parameters.
- Applies a 30-requests-per-minute rate limit.
- Returns only the selected product's moderation history; it does not expose the full product document.
- Returns an empty history array when the record does not exist or has no recorded moderation events.
- Registered the endpoint in the central API index.
- The endpoint is read-only; it does not modify moderation state or audit history.

## Files

- `apps/meteor/server/api/v1/yaschat-admin-product-history.ts`
- `apps/meteor/server/api/index.ts`

## Authorization boundary

- Queue, approve, reject, and history endpoints all require authentication and `yaschat-product-moderation`.
- The permission is admin-only by default.
- A trusted moderator role can be granted the permission explicitly through Administration → Permissions.
- The client route and sidebar use the same permission for visibility and navigation, but backend authorization remains authoritative.

## Verification

- Both changed files and the central API registration were re-fetched from `yaschat/phase-1-foundation`.
- Source-level permission checks were confirmed.
- Automated authorization tests exist for unauthenticated, unauthorized, and authorized requests.
- The tests have not yet been confirmed green by the current branch CI run. Do not treat this stage as production-verified.

## Next

- Keep the audit-history viewer connected to this protected endpoint.
- Run the repository's supported quality gates and live API authorization tests.
