# YasChat Stage 27 — Product API Quality Gate and Integration Readiness

Status: implementation specification committed; automated execution is not claimed by this document.
Target branch: `yaschat/phase-1-foundation`

## Purpose

Before adding external providers, prove that the existing approved-only product catalogue and
`GET /api/v1/yaschat.products` endpoint behave safely and predictably. Keep all provider
credentials server-side and optional in development. Never commit real API keys.

## Stage 27 acceptance tests

1. **Visibility and moderation**
   - Public search returns only approved products.
   - Pending, rejected, suspended, and archived records never appear publicly.
   - Internal moderation notes, reviewer IDs, audit metadata, and private provider payloads are not serialized.
2. **Search and validation**
   - Search by name, description, and category.
   - Empty search, whitespace, Unicode, punctuation, long input, and invalid query types are handled consistently.
   - Results are capped at 50 and pagination cannot bypass the cap.
3. **Rate limiting**
   - The configured limit is 30 requests per minute per documented identity key.
   - Limit responses use the standard error envelope and include retry guidance where supported.
   - One user cannot consume another user's quota through an untrusted client-supplied identity.
4. **Authorization and data integrity**
   - Public callers cannot create, edit, approve, reject, or delete catalogue records.
   - Admin-only operations require server-verified authorization and create audit events.
   - Provider IDs are namespaced by provider; repeated syncs are idempotent.
5. **Reliability**
   - Database/provider failures return safe errors without leaking tokens, stack traces, or raw upstream responses.
   - Tests use fixtures/mocks; no live affiliate or YouTube credentials are required.
6. **CI**
   - Run the repository's established lint, typecheck, unit, and relevant API test commands.
   - Record exact commands and outcomes. A test is not considered passed until CI or a reproducible local run reports success.

## External provider architecture (next implementation stages)

Use a provider-adapter boundary; do not couple the catalogue or UI directly to any vendor SDK.

### Affiliate product providers
- ClickBank
- ShareASale
- Additional providers through the same adapter contract (for example Awin, CJ Affiliate, and Impact), subject to account/API access and each provider's current terms.

Each adapter must normalize products into the existing catalogue model and retain:
- provider name and provider product ID
- source/merchant attribution
- canonical product URL and approved affiliate tracking URL
- price and currency only when supplied by the source
- image URL only when permitted by the source
- last-synced timestamp and source payload reference
- availability/status and moderation state

Never fabricate prices, ratings, product images, reviews, or commission rates. Do not expose raw API credentials or private provider responses to clients. Store secrets in server environment/secret management, not source control.

### YouTube evidence provider
Use the official YouTube Data API for video search and public video metadata only. Store video ID, title, channel, thumbnail, publication date, and canonical watch URL when returned by the API. Respect quota, attribution, caching, deletion, and display requirements. Do not scrape YouTube pages or imply that a video endorses a product unless its content supports that claim.

### Forums and community evidence
Create a separate source adapter for approved forum/community sources (for example Reddit API or a self-hosted Discourse community where access is authorized). Store source URL, author/display name only where permitted, timestamp, excerpt within source terms, and moderation status. Do not scrape login-only/private communities. Community opinions must be labelled as opinions, not verified product facts.

## Security and privacy rules
- Credentials are server-only; redact secrets from logs and error messages.
- Use least-privilege scopes and provider-specific rate limits.
- Validate and normalize every upstream response before persistence.
- Apply moderation before public display.
- Respect provider terms, API quotas, user privacy, copyright, deletion, and attribution requirements.
- Affiliate links must be clearly disclosed to users; clicks and commission attribution must be auditable and resistant to self-referral/fraud.

## Delivery order after Stage 27
- Stage 28: admin catalogue CRUD, approval/rejection, and audit-backed endpoints.
- Stage 29: ClickBank adapter and credential/configuration validation.
- Stage 30: ShareASale adapter.
- Stage 31: generic additional-affiliate adapter registration and provider sync scheduler.
- Stage 32: product cards/search UI wired to the approved catalogue.
- Stage 33: YouTube evidence integration.
- Stage 34: forum/community evidence integration and source labelling.
- Later stages: user reviews, community posts/questions, global chat, translation, referral ledger, ads, security/performance, deployment.

## Explicitly not done by this specification
This file does not claim that automated tests have been added or passed, that any affiliate/YouTube/forum API is connected, that credentials exist, or that a live sync has run. Those require repository code inspection, provider access, secrets configured outside Git, and successful CI/runtime verification.
