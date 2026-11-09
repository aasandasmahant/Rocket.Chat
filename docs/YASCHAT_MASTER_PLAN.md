# YasChat — Product and Engineering Master Plan

## Project objective

Build YasChat as a mobile-first global social communication and product-discovery platform using the Rocket.Chat Community Edition codebase as the messaging foundation. Preserve upstream functionality where practical; implement YasChat-specific capabilities as isolated, reviewable modules.

## Product principles

1. Ship a reliable, secure messaging product before expanding into commerce.
2. Keep the upstream `develop` branch untouched. All YasChat work starts on `yaschat/phase-1-foundation` and proceeds through reviewable commits and pull requests.
3. Prefer existing Rocket.Chat capabilities and APIs over rewriting authentication, messaging, presence, notifications, file handling, or permissions.
4. Keep product discovery, affiliate tracking, ad serving, translation, and referral logic modular and independently testable.
5. Do not commit credentials, private keys, API tokens, service-account files, or production user data.
6. Respect the repository's mixed licensing: root MIT notice excludes `apps/meteor/ee/` and `ee/`, which have a separate Enterprise Edition license. Audit every reused dependency and asset.
7. Do not delete upstream code merely to reduce repository size. Remove or replace only after dependency analysis, tests, and a documented reason.

## Product scope

### Core social communication
- Registration, login, account recovery, profiles, privacy settings.
- One-to-one conversations, groups, public communities/channels.
- Text, image, video, document, and voice messages where supported by the CE baseline.
- Message search, reactions, replies, notifications, block, report, mute, and moderation.
- Responsive web experience designed mobile-first.

### Globalisation
- User-selected interface language.
- Message translation with original text preserved and translation clearly labelled.
- Translation opt-in/opt-out and per-message controls.
- Launch with a small tested language set; expand only after quality, privacy, latency, and cost evaluation. Do not claim full 200+ language coverage until validated.

### Product discovery and affiliate commerce
- Search and category pages, product details, merchant/source attribution.
- Price, currency, image, availability, ratings/reviews, pros/cons, comparisons when verified source data exists.
- Clearly labelled affiliate links and sponsored placements.
- Affiliate click/conversion tracking subject to network terms and user privacy.
- No fabricated reviews, ratings, prices, stock status, or product images.

### Advertising and monetisation
- Persistent ad placement slots in the layout, with responsive placement rules.
- Product-feed banner slot and optional sponsored product cards.
- Admin-managed direct-sold campaigns and ad-network integration as separate providers.
- Campaign scheduling, targeting controls, impression/click reporting, frequency caps, consent controls, and invalid-traffic safeguards.
- A reserved slot does not guarantee an ad fill or revenue. Never show fake paid-ad claims.
- Ads must not obstruct message composition, obscure safety controls, or imitate chat messages.

### Trust, safety, and administration
- User reports, blocking, rate limits, anti-spam, abuse review queue.
- Admin roles with least privilege, audit log, moderation actions, ad/product management, and analytics.
- Privacy policy, terms, cookie/consent handling where applicable, data retention and deletion workflows.
- Security review before any public deployment.

## Proposed architecture

- **Web/client:** Existing Rocket.Chat client, progressively branded and adapted for YasChat.
- **Messaging backend:** Existing Rocket.Chat Meteor/Node.js services and supported MongoDB data layer.
- **YasChat modules:** Isolated application packages/services for product discovery, affiliate attribution, advertising, translation orchestration, and referrals.
- **Integrations:** Provider adapters for product feeds, affiliate networks, ad networks, translation providers, object storage, email and push notifications.
- **Operations:** Environment-based configuration, secret management, backups, monitoring, logs, rate limits, and CI checks.

Do not introduce a second database or a new backend framework unless a concrete requirement justifies it. Use existing platform services first; define service boundaries before adding infrastructure.

## Delivery phases

### Phase 0 — Repository and licensing audit
- Inventory top-level apps, packages, workspaces, build/test commands, and CE/EE boundaries.
- Identify current branding, navigation, settings, and supported extension points.
- Record baseline build/test status and known environment constraints.
- Produce a file-level change plan before editing application code.

### Phase 1 — YasChat foundation and visual identity
- Establish this dedicated branch and product plan.
- Define design tokens, responsive layout, accessible navigation, and original fish-jump SVG mark.
- Apply branding only after locating the supported theme/branding implementation.
- Preserve upstream notices and third-party attributions.

### Phase 2 — Core chat experience
- Validate sign-up, login, DMs, groups, channels, media, notifications, search, privacy, and moderation.
- Fix only confirmed YasChat blockers; retain working upstream capabilities.

### Phase 3 — Translation
- Add a provider-neutral translation interface.
- Preserve original messages; store translated output separately with language/provider metadata.
- Add user controls, privacy safeguards, quotas, caching, and failure fallback.

### Phase 4 — Product discovery
- Define normalized product and merchant schemas.
- Integrate only permitted affiliate/product APIs and feeds.
- Add source freshness, currency normalization, deduplication, and clear sponsored/affiliate disclosures.

### Phase 5 — Advertising and earnings
- Implement ad-slot components and campaign management.
- Add direct-sold campaigns first behind admin controls; add network adapters only after policy review.
- Track eligible impressions/clicks with consent, fraud checks, and reporting.

### Phase 6 — Admin, referrals, and analytics
- Least-privilege roles, moderation queues, product/ad management, referral attribution, and audit logs.
- Never expose private chat content in commercial analytics.

### Phase 7 — Quality, security, and release
- Automated unit/integration/e2e tests, accessibility, mobile responsiveness, performance, backup/restore, security review, and deployment runbook.
- Release gradually with monitoring and rollback plan.

## Initial acceptance criteria

- Upstream `develop` remains unchanged by YasChat work.
- YasChat changes are isolated on the dedicated branch.
- No Enterprise-only code is copied into a distributable product without the required rights.
- No secrets are committed.
- The initial branded client passes the relevant lint/build/tests before it is considered complete.
- All ads and affiliate placements are clearly disclosed and do not disrupt core messaging.
- All external data shown to users has source attribution and freshness handling.

## Current status (2026-11-09)

- Dedicated branch: `yaschat/phase-1-foundation`; upstream `develop` remains separate.
- 14 YasChat commits are expected after the latest stage-14 audit; verify the branch head before relying on this count.
- Initial audit documents cover repository structure, authentication, client UI/localization, core messaging, direct messages/search/notifications/calls, reactions, registration, branding assets, architecture boundaries, initial license/PEM review, existing translation reuse, and product/affiliate/ads gaps.
- Stage 11 repository inventory and manifest-based test-command discovery are recorded. The repository has a large Yarn 4 monorepo structure; build/test commands are documented, but no install/build/lint/typecheck/unit/API/E2E command has been executed by this audit workflow.
- Existing message auto-translation was found in the upstream source, including Google, DeepL, LibreTranslate and Microsoft provider adapters, permission checks, per-room settings, client controls and E2E-room restrictions. YasChat should reuse it rather than add a duplicate engine.
- Existing application banners are announcement/dismissal functionality, not an ad network. No affiliate/commission/ClickBank/ShareASale implementation was found in the path scan. Product commerce and ad-serving therefore require new isolated modules.
- Initial root/Enterprise license boundary and PEM path/header classification were inspected. Full third-party dependency license inventory, history-aware secrets scan and legal review remain open.
- First limited application change has now been made: three original YasChat SVG brand assets were added and the two PWA manifest files were updated. This is not a complete in-app rebrand; existing PNG fallback assets, favicon, Apple touch icon and visible React logo components still need replacement and testing.
- **No server-side YasChat product/affiliate/ad feature has been implemented and no production-ready release is claimed.**
- Next engineering gate: establish a clean baseline in a compatible checkout (Node version accepted by the root engines and Yarn 4.18.1), run immutable install, then focused lint/typecheck/build/tests. Only after a passing baseline should the first application-code slice be implemented.
- Do not merge the YasChat branch into `develop` until source changes, license checks, tests and human review pass.
