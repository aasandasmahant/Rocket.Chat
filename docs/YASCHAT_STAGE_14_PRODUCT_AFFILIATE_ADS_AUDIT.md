# YasChat Stage 14 — Product Discovery, Affiliate and Advertising Gap Audit

**Date:** 2026-11-09  
**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Source inspected:** recursive source tree and Community/Enterprise path samples from the `develop` snapshot.

## 1. Findings

The inspected repository contains:
- A banner service and authenticated banner APIs for showing/dismissing application banners.
- Banner client components and banner-management UI.
- An Enterprise MCP catalog implementation under `apps/meteor/ee/server/api/mcp/catalog.ts`.
- No tracked paths matching `affiliate`, `commission`, `clickbank`, or `shareasale`.
- No clear product-shopping/catalog feature in the Community Edition source tree based on the filename/path scan.
- No clear ad-network campaign/placement integration in the scanned paths.

A path scan cannot prove that a feature does not exist under a different name, but no existing affiliate-shopping platform should be assumed.

## 2. Important distinction: existing banners are not an ad network

The current banner API:
- Authenticates the user.
- Retrieves application banners by platform/ID.
- Allows a user to dismiss a banner.

This is useful for product announcements and application notices. It is not evidence of:
- Third-party ad network serving.
- Advertiser campaign management.
- CPC/CPM billing.
- Affiliate conversion tracking.
- Revenue attribution or creator commission settlement.

Do not repurpose security/system banners as advertising. Keep product notices and paid sponsored ads separate.

## 3. Recommended YasChat modules

These are proposed modules, not existing code paths. Confirm workspace naming and dependency direction before creating packages.

### Product discovery
- Product search API adapter layer.
- Normalized product records: provider, external ID, title, description, image, current price, currency, destination URL, availability timestamp and disclosure.
- Search result freshness and source attribution.
- Product detail, comparison, user reviews and report/flag controls.
- Cache and rate-limit layer to avoid hammering affiliate APIs.

### Affiliate attribution
- Click redirect endpoint with signed, opaque tracking IDs.
- Click event and conversion event records separated from chat messages.
- Provider-specific postback/webhook validation.
- Deduplication, fraud checks, refund/reversal handling and reconciliation.
- Commission ledger with immutable entries and auditable adjustments.
- Creator share calculation only from cleared/received commissions, not gross product price or unconfirmed clicks.
- Payout eligibility, identity/tax compliance and payment provider integration are separate later stages.

### Sponsored advertising
- Separate campaign, advertiser, creative, placement and impression/click records.
- Admin approval, budget/cap, schedule, geography, frequency cap and reporting.
- Visible "Sponsored" label and destination disclosure.
- Consent/privacy controls and contextual-only targeting; never target ads using private message contents.
- Do not claim ad revenue or fill until an actual ad provider/advertiser integration is active.

## 4. Data and privacy boundaries

1. Never send private chat content to affiliate providers, advertisers, or product-review sources.
2. Do not collect or infer sensitive traits for ad targeting.
3. Affiliate click identifiers must be pseudonymous, short-lived where possible and purpose-limited.
4. Keep product content source and last-updated timestamp visible.
5. Treat imported product reviews and external content as untrusted; sanitize all HTML/URLs.
6. Keep provider API keys server-side and out of client bundles.
7. Show affiliate disclosures near product links and paid sponsorship labels on ads.
8. Implement user consent, deletion/retention controls and an audit trail before production launch.

## 5. Data-source feasibility checks before code

For each intended provider, verify:
- API access is available for the account and target country.
- Terms allow product display, price/image caching, review excerpts and deep links.
- Rate limits, attribution window, conversion reporting and postback signatures.
- Whether the provider supports sub-ID/sub-publisher tracking for creator attribution.
- Brand/trademark, privacy and disclosure requirements.

No API key, provider account, live catalog response, advertiser agreement or conversion postback has been verified in this audit. Do not hardcode provider assumptions or promise live inventory.

## 6. Proposed implementation order

1. Define the provider-neutral product and affiliate data contracts.
2. Implement a read-only product catalog adapter with mocked provider responses and unit tests.
3. Add safe search/detail UI with source, currency and freshness labels.
4. Implement signed click tracking without handling payouts.
5. Add conversion postback validation and reconciliation.
6. Add commission ledger and creator dashboard after legal/accounting review.
7. Add campaign/ad placement admin only after an ad supply source is confirmed.
8. Add integration, abuse, privacy and end-to-end tests before launch.

## 7. Completion status

**Completed:** source-tree gap scan; existing banner API distinction; identification of Enterprise catalog path; proposed CE-safe architecture and privacy boundaries.

**Not completed:** live affiliate API integration, provider terms verification, product data model, search UI, click tracking, conversion postbacks, commission ledger, ad network, advertiser dashboard, payments, or tests.

**Code changes:** none. This stage is an architecture/gap audit, not an implementation.
