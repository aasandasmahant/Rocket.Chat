# YasChat Stage 28 — Admin Product Management Blueprint

Status: implementation blueprint committed. No live provider credentials are required or included.
Target branch: `yaschat/phase-1-foundation`

## Non-negotiable configuration decision

All external integration credentials remain absent/blank until the owner explicitly adds them later through a secure server-side secret manager or deployment environment. Do not create fake keys, sample-looking secrets, or commit `.env` values. The application must boot and its local tests must pass with every external provider disabled.

Suggested future server-side variable names (values intentionally omitted):
- `CLICKBANK_API_KEY=`
- `SHAREASALE_API_TOKEN=`
- `YOUTUBE_DATA_API_KEY=`
- Additional provider secrets only when that provider is approved and configured.

Never expose these variables through browser bundles, public API responses, client-side settings, logs, screenshots, or diagnostics.

## 1. Admin catalogue capabilities

Build a protected admin area with:
- Product list, search, filter, pagination, and detail view.
- Create/edit product records manually.
- Approve, reject, suspend, archive, and restore products.
- Review provider/source attribution and affiliate destination before approval.
- View moderation history and audit events.
- Bulk actions only after explicit confirmation and with per-record audit entries.

Public catalogue remains read-only and returns approved, active products only.

## 2. Canonical product data contract

Use the repository's existing product model if one exists; do not create a competing table or duplicate schema. The normalized contract should support these fields where compatible:
- internal product ID
- provider key and provider product ID (unique together)
- title, description, category
- merchant/brand and source attribution
- canonical destination URL and affiliate URL
- image URL only when source terms permit it
- price and currency only when verified from provider data
- status: pending, approved, rejected, suspended, archived
- created/updated timestamps and last-synced timestamp
- created-by / reviewed-by actor references
- moderation reason stored privately
- version or concurrency token if supported

Provider product identity must be unique on (provider, provider_product_id). Manual records must have a clear manual source marker. Do not infer missing facts.

## 3. Authorization

- Require the platform's existing server-side admin permission system; do not invent a parallel password or trust a client-supplied `isAdmin` flag.
- Deny by default.
- Enforce authorization in server handlers, not only in the UI.
- Public endpoints cannot mutate products or change moderation state.
- Protect state-changing requests using the platform's established CSRF/session protections.
- Return the platform's standard unauthorized/forbidden response format.

## 4. API route contract

Adapt names to existing Rocket.Chat/YasChat route conventions after inspecting the codebase. Candidate operations:
- `GET /api/v1/yaschat/admin/products` — admin list/search/filter.
- `POST /api/v1/yaschat/admin/products` — create draft/pending product.
- `PATCH /api/v1/yaschat/admin/products/:id` — update editable fields.
- `POST /api/v1/yaschat/admin/products/:id/approve`
- `POST /api/v1/yaschat/admin/products/:id/reject`
- `POST /api/v1/yaschat/admin/products/:id/suspend`
- `POST /api/v1/yaschat/admin/products/:id/archive`
- `GET /api/v1/yaschat/admin/products/:id/audit`

These are design targets, not claims that routes already exist. Reuse the established framework router, validation library, database model, and error envelope.

## 5. Audit requirements

For every create, edit, approval, rejection, suspension, archive, restore, and bulk action, record:
- actor ID from authenticated server context
- action and product ID
- timestamp
- changed field names and safe before/after values
- moderation reason where supplied

Never record API secrets, authentication tokens, full private provider payloads, or unnecessary personal data. Audit records are append-only for ordinary admins.

## 6. Validation and safe URL handling

- Validate required title/category and bounded text lengths.
- Accept only HTTP(S) destination/image URLs; reject javascript:, data:, file:, and malformed URLs.
- Prevent server-side request forgery: do not fetch arbitrary user-supplied URLs from the server without a strict allowlist and safe network policy.
- Escape rendered text; do not render provider descriptions as trusted HTML.
- Validate price as a non-negative decimal and currency as a supported ISO currency code when present.
- Do not require price, rating, review count, or image if the source does not supply them.

## 7. Required automated tests

- Anonymous/non-admin requests cannot access admin routes.
- Authenticated non-admin requests cannot access admin routes.
- Admin can create a pending product and approve/reject it.
- Public catalogue never returns pending/rejected/suspended/archived products.
- Audit event is created for every state transition and records the authenticated actor.
- Invalid URLs, unsupported schemes, oversized fields, malformed prices, and invalid statuses are rejected.
- Duplicate (provider, provider_product_id) records are rejected or safely upserted according to the repository's existing persistence strategy.
- Concurrent edits do not silently overwrite newer moderation decisions.
- API responses never include private moderation reasons, audit internals, provider credentials, or raw secrets.
- All tests run with provider credentials blank and outbound provider calls mocked/disabled.

## 8. Completion gate

Do not mark Stage 28 complete until:
1. Existing code and data model have been inspected.
2. Implementation reuses the repository's actual auth, router, persistence, and UI patterns.
3. Server-side permission checks and audit writes are implemented.
4. Automated tests are added and pass.
5. Lint/typecheck/build and relevant test commands pass in CI or a reproducible local run.
6. Public approved-only catalogue regression tests pass.

## 9. Integration order

Only after the admin workflow and moderation gate are tested:
- Stage 29: ClickBank adapter (credentials remain blank until owner configures them).
- Stage 30: ShareASale adapter.
- Stage 31: additional affiliate adapters.
- Stage 32: product cards and search UI.
- Stage 33: official YouTube Data API adapter (key remains blank).
- Stage 34: authorized forum/community sources.

The admin review queue is the safety boundary: imported products enter as pending and are not public until approved.
