# YasChat Stage 19 — Product Discovery and Database Foundation

Status: canonical product and provider contracts exist; bounded query/sync validation and exports have been strengthened. Persistence, live adapters, read API, and executed CI tests remain pending.

## Goal

Add a provider-neutral product discovery foundation for YasChat without changing Rocket.Chat's existing chat, authentication, or room behavior. The first supported affiliate providers are ClickBank and ShareASale. Provider credentials are intentionally absent from source control and remain unconfigured until the owner supplies them through deployment secrets.

## Existing implementation inspected

The branch already contains:
- `packages/core-typings/src/yaschat-commerce/IProduct.ts` — normalized, source-attributed product schema with HTTPS URLs, explicit affiliate disclosure, optional price and review evidence;
- `IProductAdmin.ts` — catalogue moderation lifecycle, reviewer requirements, and audit-event contracts;
- `IProductProvider.ts` — provider interface and sync accounting.

This stage added runtime validation for bounded product queries (including a default page size of 20 and maximum of 50), provider/locale filters, cursor limits, and sync accounting consistency. It also exports the provider contracts from the commerce barrel. Focused tests were added for these rules.

## Scope boundary

Included in this stage:
- normalized product record and provider adapter contract;
- safe query validation and sync accounting;
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

The existing canonical product schema includes:
- provider source (`clickbank` or `shareasale`) and provider-side external ID;
- title, optional description, HTTPS product URL, optional HTTPS affiliate URL and image URL;
- optional finite non-negative price with uppercase three-letter currency;
- optional category, mandatory affiliate disclosure flag, and source-attributed review evidence;
- optional synchronization timestamp.

Do not store provider secrets, raw authorization headers, or user commission balances in this catalog record. Do not infer missing prices, ratings, review counts, or availability.

## Provider adapter contract

Each provider adapter must expose the same application-facing operations:
- validate configuration and fail closed when credentials are absent or invalid;
- fetch one bounded page from the provider's official API;
- normalize and validate provider data against the canonical product schema;
- return an opaque pagination cursor where supported;
- expose connection state without revealing credentials.

Adapters must use official documented APIs and their current terms. No HTML scraping, CAPTCHA bypass, access-control bypass, or invented API endpoints. Rate limits, retries with backoff, timeouts, and provider error classification are mandatory.

## Persistence design

Use a dedicated product catalog collection, isolated from Rocket.Chat messages, users, and rooms. Before implementation, inspect the repository's existing MongoDB collection and migration conventions and follow them rather than introducing a second database framework.

Required logical indexes:
- unique compound index on `provider + providerProductId`;
- index on moderation/availability state and update time;
- index on category and update time;
- text/search index appropriate to the repository's supported MongoDB version and search conventions.

Upserts must be idempotent. A provider refresh must not duplicate a product. Removed provider items should be marked unavailable or stale; do not silently delete records needed for auditability.

## Read API contract

- `GET /api/v1/yaschat/products?q=&category=&provider=&locale=&cursor=&limit=`
  - public catalog read only;
  - clamp limit to a server-defined maximum of 50;
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

1. Provider queries default to 20 results and reject limits outside 1–50.
2. Valid provider fixtures normalize to the canonical schema.
3. Invalid URLs, malformed prices, unknown currencies, and oversized fields are rejected safely.
4. Sync accounting rejects impossible fetched/accepted/rejected totals.
5. Repeated ingestion updates one record rather than creating duplicates.
6. Provider failures and rate limits do not erase previously valid catalog records.
7. Search filters, pagination bounds, and not-found behavior are tested.
8. Public responses never contain secrets, raw provider payloads, or internal fields.
9. SSRF, XSS, rate-limit, and authorization tests pass.
10. Existing Rocket.Chat authentication, rooms, messages, and registration tests remain unaffected.
11. Targeted lint, typecheck, unit tests, and the relevant application build pass in CI.

## Stage exit criteria

Stage 19 is complete only after the schema, adapters, persistence/indexes, read API, and automated tests are implemented in the repository and the required CI checks pass. The recent code changes strengthen the contract layer; they do not mean the runtime feature is already live.

## Next engineering stage

Stage 21: implement catalogue persistence and permission-guarded admin endpoints using the existing Rocket.Chat Meteor/MongoDB architecture and the Stage 20 moderation/audit contracts. Add integration tests for role enforcement, state transitions, and audit persistence. Build the admin UI only after the server contract is stable. Add ClickBank and ShareASale adapters only after their official API access, terms, and credentials are verified.
