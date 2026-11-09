# YasChat Repository Audit — Initial Pass

Date: 2026-11-09
Repository: `aasandasmahant/Rocket.Chat`
Audited branch: `yaschat/phase-1-foundation`
Upstream baseline: `develop`
Scope: read-only source inspection; no application code changes and no runtime build/test execution.

## 1. Repository structure and architecture

- Root `package.json` identifies the project as a private Yarn workspace monorepo named `rocket.chat`, version `9.1.0-develop`.
- Workspaces include `apps/*`, `packages/*`, `ee/apps/*`, and `ee/packages/*`.
- Root scripts delegate build, development, lint, unit tests, and Storybook tasks through Turborepo.
- The main server application is `apps/meteor`, package name `@rocket.chat/meteor`.
- The Meteor application package identifies its client entry as `client/meteorShell.ts` and server entry as `server/main.ts`.
- `client/meteorShell.ts` is intentionally minimal: Meteor serves the page while the Vite-built web client is loaded from `public/bundle`. Therefore, the main YasChat UI should be located through the Vite/client source and shared UI packages, not by replacing the Meteor shell.
- `server/main.ts` wires configuration, services, startup, REST API, routes, publications, cron jobs, and the EE startup hook. Server customizations must preserve startup ordering and be checked against CE/EE boundaries.

## 2. Build and test system

- Root build: `turbo run build`.
- Root lint: `turbo run lint`.
- Root unit test task: `turbo run testunit`.
- Main Meteor package includes Vite client build, Meteor server build, unit tests, API tests, Playwright E2E tests, stylelint, Oxlint, and type-check scripts.
- `turbo.json` defines dependency-aware build/test tasks and disables caching for selected Meteor build/dev tasks.
- These commands were inspected but not executed during this audit pass. Build health and test baseline remain unverified.

## 3. Licensing and reuse boundary — important

- Root `LICENSE` contains the MIT license for content outside the explicitly excluded Enterprise directories and preserves third-party component licenses.
- Root license explicitly identifies `apps/meteor/ee/` and `ee/` as governed by their separate Enterprise license.
- `apps/meteor/ee/LICENSE` states that the separately licensed EE portion has production/subscription restrictions; it also clarifies that CE-distributed portions and specified client-served assets remain under MIT.
- Action: do not copy or distribute EE-only server functionality into YasChat without a specific rights review. Audit each reused path and every third-party dependency/asset before release. A repository-wide MIT badge is not sufficient proof that every file is MIT.

## 4. Initial YasChat customization direction

- Keep upstream messaging, authentication, presence, notifications, file handling, permissions, and existing APIs wherever practical.
- Find the supported client theme, logo, navigation, and localization extension points before changing branding.
- Implement translation, product discovery, affiliate attribution, advertising, and referrals as isolated modules/adapters with explicit privacy, consent, disclosure, and moderation controls.
- Preserve original message content when adding translations; label translated text and allow user controls.
- Do not claim 200+ language support until language-by-language quality and operational validation is complete.
- Do not fabricate product prices, reviews, ratings, inventory, or ad revenue.

## 5. Files inspected in this pass

- `docs/YASCHAT_MASTER_PLAN.md`
- `README.md`
- `package.json`
- `turbo.json`
- `LICENSE`
- `apps/meteor/package.json`
- `apps/meteor/client/meteorShell.ts`
- `apps/meteor/server/main.ts`
- `apps/meteor/ee/LICENSE`
- `yarn.lock` (file presence and blob metadata; lockfile content not reviewed)

## 6. Risks and open questions

1. Full top-level and nested file inventory is still pending.
2. Client app entry points, theme/branding settings, logo assets, navigation, and translation catalogs still need targeted inspection.
3. CE/EE references and package import boundaries need a broader path-level review, especially server imports and build packaging.
4. Dependency licenses and asset attributions have not yet been individually audited.
5. No install, build, lint, unit, API, or E2E tests have been run; baseline status is unknown.
6. No application source files have been modified in this pass.

## 7. Next audit sequence

1. Map client entry points and locate supported branding/theme/logo/navigation mechanisms.
2. Inventory relevant packages and identify which existing features can be reused without duplication.
3. Trace CE/EE imports and check distributable boundaries.
4. Review localization infrastructure and define a provider-neutral translation integration point.
5. Review test/build prerequisites and record reproducible baseline results when an appropriate environment is available.
6. Produce a file-level change plan before the first application-code edit.

## Status

This is an initial evidence-based audit report, not a completed exhaustive file-by-file audit. The dedicated YasChat branch and master plan are in place. The upstream `develop` branch remains untouched by this audit.
