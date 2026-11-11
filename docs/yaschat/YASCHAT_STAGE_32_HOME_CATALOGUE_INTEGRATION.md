# YasChat Stage 32 — Home Screen and Approved Catalogue Integration

## Status

Implementation committed to `yaschat/phase-1-foundation`. This stage connects the existing YasChat home page to the existing public approved-products endpoint. It does not claim production readiness.

## Delivered

- Replaced the static catalogue placeholder with a client-side request to `GET /api/v1/yaschat.products`.
- Uses the endpoint's existing search, limit, and offset query parameters.
- Requests one extra record to determine whether a next page exists, while rendering at most 12 products.
- Adds controlled search submission and previous/next pagination.
- Adds loading, request-error, empty-catalogue, and no-search-results states.
- Displays available approved product metadata: image, title, description, category, price/currency, partner source, and the canonical product URL.
- Uses the public endpoint, whose model query enforces `moderation.status: approved`; the client cannot request draft, pending-review, rejected, or archived products.
- Aborts stale requests on unmount or when the search/page changes.
- Keeps community feed content clearly marked as not yet connected; no fabricated posts, prices, or ratings are introduced.

## Files changed

- `apps/meteor/client/views/home/YasChatHomePage.tsx`

## Safety and scope

- The browser displays the product's canonical `productUrl`; it does not expose affiliate credentials or invent affiliate tracking links.
- No API keys or secrets were added.
- No product records, prices, ratings, reviews, or partner data were fabricated.
- Existing Rocket.Chat home-page routing and the public API/model implementation were not modified.

## Verification

- GitHub fetch confirmed the updated component was saved on the target branch.
- The endpoint and model implementation were inspected before wiring the page.
- A local monorepo build, TypeScript check, lint run, browser test, and CI run were **not executed or verified** in this session. The change must pass those gates before production use.

## Next engineering stage

Stage 33 should implement the administrator-side product review lifecycle (list pending submissions, approve/reject with required reason and audit event) using Rocket.Chat's existing permission conventions. Do not expose write operations publicly.
