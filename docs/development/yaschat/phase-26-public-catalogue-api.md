# YasChat Stage 26 — Public catalogue API boundary

## Delivered

- Added `GET /api/v1/yaschat.products` in the existing Rocket.Chat REST API structure.
- Registered the endpoint through the central API import list.
- Endpoint returns records only through `YasChatProducts.findApprovedProducts`; callers cannot provide a MongoDB filter or moderation status.
- Added strict query validation: search max 120 characters, category max 100, limit 1–50, offset 0–10,000; unknown query fields are rejected.
- Added a per-route rate limit of 30 requests per minute.
- Response validation requires the deliberate public fields `_id`, `product`, `createdAt`, and `updatedAt`; moderation and creator metadata are not returned.
- The catalogue is readable without login. No write, import, moderation, or admin endpoint is exposed here.

## Security notes

This is a read-only public catalogue endpoint. The approved-only condition is enforced by the model query. Public response projection excludes internal moderation fields. Admin actions remain unimplemented and must use Rocket.Chat permission checks and the existing moderation transition contract. Rate limiting is a first layer, not a substitute for deployment-level abuse protection.

## Verification

- Changed API registration and endpoint source were committed to `yaschat/phase-1-foundation`.
- Source read-back, typecheck, lint, endpoint tests, integration tests, and browser tests remain to be confirmed.
- No API keys, external affiliate requests, or fabricated products were added.
- GitHub Actions may still be running; do not treat a queued or in-progress run as a pass.

## Next

Add focused endpoint tests for query validation, response projection, rate limiting, and the guarantee that non-approved records never appear. Then implement permission-protected admin create/update/moderation endpoints.
