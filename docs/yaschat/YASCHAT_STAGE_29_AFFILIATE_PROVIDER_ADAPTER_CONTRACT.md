# YasChat Stage 29 — Affiliate Provider Adapter Contract

Status: architecture contract committed; provider runtime code and live API integration are not implemented in this stage.
Target branch: `yaschat/phase-1-foundation`

## 1. Credential decision

All provider credentials remain absent until the owner adds them later through a secure server-side secret manager or deployment environment. No API keys, tokens, passwords, or sample secrets are included here.

The application must start with every provider disabled and unconfigured. Missing credentials must produce a safe `not_configured` state, not a crash and not an outbound request.

Future variable names only (values intentionally absent):
- `CLICKBANK_API_KEY=`
- `SHAREASALE_API_TOKEN=`
- `SHAREASALE_API_SECRET=`

Do not commit a populated `.env` file. Do not expose secrets to browser bundles, public APIs, logs, error messages, analytics, or admin list responses.

## 2. Purpose

Define one provider-neutral contract so ClickBank, ShareASale, and future affiliate networks can be added without coupling catalogue logic to a single vendor.

This file is a design contract, not a claim that provider endpoints, credentials, or live integrations already exist. Before implementing a vendor adapter, verify its current official API documentation, account permissions, terms, rate limits, and permitted fields.

## 3. Adapter contract

Proposed server-side interface (TypeScript-like pseudocode; adapt to the repository's actual module conventions after locating the correct integration point):

```ts
type ProviderKey = 'clickbank' | 'shareasale' | string;

type ProviderStatus =
  | 'disabled'
  | 'not_configured'
  | 'ready'
  | 'degraded';

interface AffiliateProviderAdapter {
  readonly key: ProviderKey;
  getStatus(): ProviderStatus;
  searchCandidates(input: {
    query: string;
    limit: number;
    cursor?: string;
  }): Promise<ProviderPage>;
  normalizeCandidate(raw: unknown): NormalizedProductCandidate;
  healthCheck(): Promise<ProviderHealth>;
}
```

The real implementation must validate unknown provider payloads at runtime. Never trust TypeScript types as validation of external data.

## 4. Normalized candidate contract

Required fields:
- `provider`: stable provider key.
- `providerProductId`: stable vendor-side identifier.
- `title`: trimmed, bounded plain text.
- `status`: always `pending_review` when first imported.
- `sourceFetchedAt`: server-generated timestamp.

Optional fields, only when returned by the provider and permitted for use:
- description, category, merchant name, price, currency, image URL, destination URL, commission metadata.

Do not invent missing price, currency, ratings, images, availability, or commission values. Preserve source attribution and enough provenance to audit where each field came from.

## 5. Catalogue and publishing rules

1. Deduplicate by the compound key `(provider, providerProductId)`.
2. Re-import updates the existing candidate; it must not create duplicate catalogue entries.
3. Provider imports never publish directly.
4. New and changed candidates remain pending until an authorized admin reviews them.
5. Public catalogue APIs return approved records only.
6. Rejected, suspended, archived, and pending records remain hidden from public search.
7. Affiliate links must be validated and associated with the correct provider; never accept arbitrary executable schemes.
8. Preserve affiliate disclosure requirements wherever affiliate links or recommendations are shown.

## 6. Reliability and security

- Enforce provider-specific timeouts, bounded retries, backoff, and rate limits.
- Do not retry permanent authorization or validation failures indefinitely.
- Redact credentials and sensitive headers from all logs.
- Validate URLs and block localhost, private-network, link-local, and unsupported schemes where server-side URL fetching is involved.
- Treat provider text, HTML, images, and URLs as untrusted input; sanitize before display.
- Keep provider network calls server-side only.
- Record import outcome counts and safe error codes, not raw secret-bearing responses.
- Make sync idempotent and prevent overlapping jobs for the same provider.
- Provide a kill switch to disable each provider independently.

## 7. Configuration shape

Configuration is intentionally disabled by default:

```ts
const providerConfig = {
  clickbank: { enabled: false },
  shareasale: { enabled: false },
};
```

When enabled in a future deployment, configuration must be read only on the server. A provider is ready only when it is explicitly enabled and all required credentials and account permissions are verified. A missing value means `not_configured`; it must not trigger a live call.

## 8. Tests required before calling the adapter implemented

- App starts with all provider credentials absent.
- Disabled and not-configured adapters make zero outbound requests.
- Malformed provider payloads are rejected safely.
- Required fields and field length limits are enforced.
- Duplicate imports update rather than duplicate records.
- First import always creates a pending-review candidate.
- Public search never exposes pending/rejected/suspended/archived records.
- Provider errors are redacted and bounded retries behave as designed.
- URL validation rejects unsafe schemes and private-network targets.
- Admin approval is required before publication.

These are acceptance criteria only; no automated tests are claimed as run by this documentation commit.

## 9. Implementation sequence

1. Inspect the Rocket.Chat monorepo's server module, database, permission, test, and migration conventions.
2. Implement the shared provider contract and disabled-by-default registry in the correct server package.
3. Add deterministic unit tests using local fixtures only; no API keys needed.
4. Implement ClickBank only after its current official API contract and account access are verified.
5. Add ShareASale using the same normalized contract.
6. Add scheduled sync, admin review integration, observability, and operational controls.

## 10. Stage completion boundary

Completed here: repository-specific architecture notes, credential policy, normalization rules, security rules, and acceptance checklist.

Not completed here: executable adapter code, provider API calls, database migrations, admin UI, automated test execution, live sync, and CI verification.
