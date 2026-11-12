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
- Add product recommendation cards to messages using a supported message/attachment extension point; do not fork the realtime messaging transport.

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

## Current status (2026-11-12)

### Repository and branch
- Active repository: `aasandasmahant/Rocket.Chat`.
- Active branch: `yaschat/phase-1-foundation`.
- The YasChat branch is separate from `develop`; the upstream branch has not been modified by this work.
- The branch contains the Stage 33–54 moderation, product catalogue, admin UI, permission, CI and timestamp work, plus YasChat branding assets.

### Implemented and source-checked
- Public approved-product catalogue API and responsive YasChat home catalogue page.
- Dedicated admin product moderation permission, protected queue/history/approve/reject APIs, and route/sidebar guards.
- Atomic optimistic-concurrency moderation decision with version increment, audit append, rejection reason validation, and `updatedAt` consistency.
- Admin product review dashboard with on-demand history viewer.
- Original jumping-fish logo, light/dark wordmarks, favicon, app icon, manifests and related branding integration.

### Engineering gates
- Historical push runs exposed lint errors in `packages/web-ui-registration` (Stage 33), `packages/core-typings` (Stage 34), and `packages/models` (admin-route-fix run).
- The known Stage 33 and Stage 34 lint findings have been corrected in the active branch; the four Stage 73 model lint findings are also corrected in the current model source.
- A fresh push-triggered YasChat engineering gate has been started after the lint repair commits. Its result must be checked before claiming CI is green.
- The push workflow runs documentation links, focused moderation permission tests, lint and unit tests. The full monorepo build is conditional on the manual `workflow_dispatch` input `run_full_build=true`; a push-triggered green run alone does not prove the full build.
- Typecheck, live API tests, browser/e2e tests, full monorepo build, deployment and production security review remain open.

### Product UI status and next work
- The current home page shows the product discovery catalogue and a community-feed placeholder.
- Rocket.Chat's existing real-time messaging foundation remains available, but YasChat product recommendation cards inside chat, the dedicated community feed, and the full Chat • Share • Earn interaction layer are not yet integrated.
- Affiliate provider live-data sync, referral attribution/payouts, ad serving/campaign management, message translation validation, full localization coverage, and deployment operations remain future work.
- Do not claim the whole YasChat product is complete or production-ready until these items and their tests are delivered.

## Current next engineering stage

**Stage 57 — Native composer product picker and typed message attachment contract.**

Stage 56 mapped the existing Rocket.Chat composer, message list, attachment renderer and authenticated `chat.postMessage` endpoint, then added a user-initiated catalogue-to-chat copy bridge. The next increment must add a room-context product picker and a typed product attachment sent through the native authenticated message path. It must preserve room permissions, E2EE restrictions, threads, federation and normal message behaviour.

Do not merge this branch into `develop` until the required tests, build, license checks and human review pass.
