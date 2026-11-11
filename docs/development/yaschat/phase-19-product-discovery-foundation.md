# YasChat Stage 19 — Product Discovery and Database Foundation

Status: architecture contract prepared; runtime implementation and tests remain pending.

## Goal

Add a provider-neutral product discovery foundation for YasChat without changing Rocket.Chat's existing chat, authentication, or room behavior. The first supported affiliate providers are ClickBank and ShareASale. Provider credentials are intentionally absent from source control and remain unconfigured until the owner supplies them through deployment secrets.

## Scope boundary

Included in this stage:
- normalized product record and provider adapter contract;
- safe ingestion, validation, deduplication, and search requirements;
- database collection/index design;
- API contract for product search and product detail;
- security, privacy, observability, and acceptance-test requirements.

Not included yet:
- live provider API calls or scraping;
- production database migrations or indexes;
- user-facing product pages;
- review/rating generation;
- affiliate redirect tracking, referral sharing, commission splitting, or ads;
- credentials, API keys, or production deployment.

These exclusions prevent placeholder data from being mistaken for live affiliate inventory or earnings.

## Normalized product record

The application-level product record should contain:

| Field | Type | Rule |
|---|---|---|
| id | string | Stable internal identifier |
| provider | enum | `clickbank` or `shareasale` |
| providerProductId | string | Required provider-side identifier |
| title | string | Required, trimmed, length-limited |
| description | string | Optional plain text; sanitize before rendering |
| merchantName | string | Optional display name |
| categoryIds | string[] | Internal controlled taxonomy |
| imageUrl | string | Optional HTTPS URL from an approved provider/CDN |
| destinationUrl | string | Canonical merchant destination; validate host |
| affiliateUrl | string | Optional provider-generated tracking URL; never synthesize |
| priceAmount | number | Optional finite non-negative value |
| currency | string | ISO 4217 code when price exists |
| locale | string | BCP 47 locale when known |
| availability | enum | `available`, `unavailable`, `unknown` |
| sourceUpdatedAt | date | Provider timestamp when supplied |
| createdAt / updatedAt | date | Server-controlled timestamps |

Do not store provider secrets, raw authorization headers, or user commission balances in this catalog record. Do not infer missing prices, ratings, review counts, or availability.

## Provider adapter contract

Each provider adapter must expose the same application-facing operations:
- `validateConfiguration()` — fail closed when credentials are absent or invalid;
- `fetchProducts(cursor, filters)` — fetch one bounded page from the provider's official API;
- `normalize(rawRecord)` — validate and map provider data to the normalized record;
- `getNextCursor(response)` — return an opaque cursor or null.

Adapters must use official documented APIs and their current terms. No HTML scraping, CAPTCHA bypass, access-control bypass, or invented API endpoints. Rate limits, retries with backoff, timeouts, and provider error classification are mandatory.

## Persistence design

Use a dedicated product catalog collection, isolated from Rocket.Chat messages, users, and rooms. Before implementation, inspect the repository's existing MongoDB collection and migration conventions and follow them rather than introducing a second database framework.

Required logical indexes:
- unique compound index on `provider + providerProductId`;
- index on `availability + updatedAt`;
- index on `categoryIds + updatedAt`;
- text/search index appropriate to the repository's supported MongoDB version and search conventions.

Upserts must be idempotent. A provider refresh must not duplicate a product. Removed provider items should be marked unavailable or stale; do not silently delete records needed for auditability.

## Read API contract

- `GET /api/v1/yaschat/products?q=&category=&provider=&locale=&cursor=&limit=`
  - public catalog read only;
  - clamp limit to a small server-defined maximum;
  - validate all filters and cursor values;
  - return normalized, approved display fields only;
  - never expose credentials, raw provider payloads, or internal moderation fields.
- `GET /api/v1/yaschat/products/:id`
  - return one visible product or a not-found response;
  - do not redirect automatically from a detail read.

The final route registration must use the repository's existing Meteor/API conventions and its authentication/rate-limiting middleware where appropriate. Do not add a parallel HTTP server.

## Security and privacy requirements

- Read secrets only from deployment secret configuration; never commit them or return them to clients.
- Allowlist provider API hosts and approved image hosts; require HTTPS.
- Prevent SSRF: do not fetch arbitrary user-supplied URLs on the server.
- Validate URLs, payload sizes, text lengths, numeric values, currencies, and pagination.
- Sanitize descriptions and escape output in the UI.
- Apply request rate limits and bounded provider concurrency.
- Keep product catalog data separate from personal user data.
- Record provider sync outcomes without logging secrets or full sensitive payloads.
- Treat affiliate links as untrusted external destinations and apply safe external-link behavior.

## Search and ranking rules

Initial ranking must be deterministic and explainable: text relevance, category match, availability, and freshness. Sponsored placement must be a separate, explicitly labeled feature and must never silently affect organic ranking. Do not fabricate reviews, ratings, popularity, or purchase recommendations.

## Acceptance tests required before calling this stage implemented

1. Both adapters reject missing credentials without network access.
2. Valid provider fixtures normalize to the same schema.
3. Invalid URLs, malformed prices, unknown currencies, and oversized fields are rejected safely.
4. Repeated ingestion updates one record rather than creating duplicates.
5. Provider failures and rate limits do not erase previously valid catalog records.
6. Search filters, pagination bounds, and not-found behavior are tested.
7. Public responses never contain secrets, raw provider payloads, or internal fields.
8. SSRF, XSS, rate-limit, and authorization tests pass.
9. Existing Rocket.Chat authentication, rooms, messages, and registration tests remain unaffected.
10. Targeted lint, typecheck, unit tests, and the relevant application build pass in CI.

## Stage exit criteria

Stage 19 is complete only after the schema, adapters, persistence/indexes, read API, and automated tests are implemented in the repository and the required CI checks pass. This document is the approved implementation contract, not evidence that the runtime feature is already live.

## Next stage

Stage 20: implement the catalog backend in the existing Meteor architecture, beginning with the normalized model and safe read-only fixtures; add provider adapters only after their official API contracts and credentials are available. Admin controls, ads, referrals, commissions, and analytics follow after the catalog is stable.
