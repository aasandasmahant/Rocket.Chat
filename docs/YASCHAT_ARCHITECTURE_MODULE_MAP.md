# YasChat Architecture and Feature Module Map

**Date:** 2026-11-09  
**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Source-tree inspection and design of safe module boundaries. This is an architecture audit, not an implementation.

## 1. Confirmed repository structure

The root is a Yarn workspace monorepo. The inspected root workspace configuration includes:
- `apps/*`
- `packages/*`
- `ee/apps/*`
- `ee/packages/*`

The main application is `apps/meteor`. Its client source is under `apps/meteor/client`, server source under `apps/meteor/server`, and shared libraries/components are published as workspaces under `packages/`.

## 2. Existing extension areas

| YasChat capability | Existing foundation / candidate location | Recommended approach |
|---|---|---|
| Main web client and navigation | `apps/meteor/client/views`, `navbar`, `sidebar`, `router` | Adapt existing screens and route patterns; do not replace the Meteor/Vite shell |
| Room/chat experience | `apps/meteor/client/views/room` | Reuse existing message, permission, thread, upload and composer flows |
| Authentication UI | `packages/web-ui-registration` and app auth routes | Rebrand existing forms; preserve server validation and account security |
| Server APIs and methods | `apps/meteor/server/api`, `meteor-methods`, `publications`, `services` | Add validated server endpoints/services; never trust client-only checks |
| Shared UI and design system | `packages/fuselage*`, `packages/ui-*` | Reuse supported components and tokens; avoid forking the component system |
| Localization | `packages/i18n`, `apps/meteor/client/providers/TranslationProvider.tsx` | Add UI locale resources separately from message-translation provider |
| Product search/catalog | Potential new CE-safe workspace package plus server API adapter | Normalize external data; preserve source, timestamp, currency and disclosure |
| Affiliate attribution | Potential new isolated server service/package | Record click attribution only; do not expose private chat content to partners |
| Ad placements/campaigns | Potential new client slot components + server campaign service | Admin-managed, consent-aware, frequency-limited; ad fill is not guaranteed |
| AI message translation | Potential provider-neutral server service + client controls | Keep original message immutable; store translated result/metadata separately |
| Admin/moderation | Existing permissions/settings/admin patterns | Least privilege, audit trail, moderation queue and scoped analytics |

The proposed new package names and paths are placeholders. They must be checked against the existing workspace naming conventions before files are created.

## 3. Data and trust boundaries

1. Client UI must call authenticated application APIs; it must not write MongoDB records directly.
2. Server services must enforce user identity, room access, roles, rate limits, validation and audit requirements.
3. Translation providers receive only the minimum text required, after user/workspace policy and consent checks. Preserve source message and language metadata.
4. Product/merchant adapters must store source attribution, fetched time, currency, canonical product identity and data freshness. Never fabricate missing prices, ratings or availability.
5. Affiliate click tracking must be separated from chat content and must not transmit private conversation text.
6. Ad targeting and analytics must not use private messages or sensitive personal data. Keep sponsored content visibly labelled.
7. External provider keys belong in deployment secrets/environment configuration, never in source control or client bundles.
8. Do not import Enterprise-only code into the community/distributable feature path without a file-level rights review.

## 4. Recommended implementation order

**First vertical slice — branding and navigation**
- Confirm the supported brand settings and every logo use.
- Define YasChat design tokens and responsive navigation.
- Rebrand login, sidebar, room header and empty/loading states.
- Add screenshot/accessibility checks before merging.

**Second vertical slice — stable core messaging**
- Build and run the upstream baseline in a supported environment.
- Verify registration, DM, group, channel, attachments, threads, search and notification flows.
- Fix only demonstrated YasChat blockers.

**Third vertical slice — translation**
- Define provider interface, consent/configuration, quota, timeout, caching and fallback.
- Add explicit translate action and optional auto-translate setting.
- Preserve original message and test unsupported-language/provider failures.

**Fourth vertical slice — product discovery**
- Select permitted affiliate/product data sources and document terms.
- Implement normalized product schema and freshness/source labels.
- Add search/details/comparison UI only after API data is reliable.

**Fifth vertical slice — monetisation**
- Add ad slot framework and admin campaign controls.
- Add disclosure, consent, frequency caps, invalid-traffic protections and reporting.
- Add external ad network only after policy and integration review.

**Sixth vertical slice — release readiness**
- Add tests, observability, backups, security review, deployment and rollback runbooks.

## 5. What must be inspected before code changes

- Existing package conventions and root scripts for a new workspace.
- Server API route registration and service dependency patterns.
- Authorization and settings registration patterns.
- Mongo model/migration/index conventions.
- Existing admin UI and audit-log facilities.
- Test fixtures, API test harness and Playwright configuration.
- All relevant EE imports and dependency licenses.
- Deployment/runtime support for selected translation, product, ad and media providers.

## 6. Verification status

- Confirmed the root workspace patterns and main app client/server/package directories through repository source listings.
- Used existing audit reports for representative chat, auth, localization, search, notification and call flows.
- No new feature code, database schema, API endpoint or UI component was added.
- No build, lint, typecheck, unit, integration or E2E test was run.
- This map is a design guide; it is not evidence that the listed YasChat capabilities already exist.
