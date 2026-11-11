# YasChat

**A global community for conversations and discovery.**

YasChat is being developed on the Rocket.Chat Community Edition codebase. The goal is to combine reliable real-time communication with multilingual communities and evidence-based product discovery, while keeping commerce, advertising and referral features separate from the messaging core.

> **Development status:** This repository is an active engineering branch, not a production-ready YasChat release. Core Rocket.Chat functionality is inherited from the upstream codebase; YasChat-specific commerce, affiliate, advertising and referral services are not yet implemented.

## Product direction

- **Conversations:** direct messages, groups, channels, media sharing, search, reactions, notifications and moderation, reusing the upstream platform wherever possible.
- **Global communication:** user-selected interface language and clearly labelled message translation that preserves the original message.
- **Product discovery:** sourced product information, merchant attribution, freshness indicators and evidence-backed comparisons.
- **Affiliate transparency:** clearly disclosed affiliate links and auditable attribution; commission rules must follow each network's terms.
- **Advertising:** separately labelled placements, admin-managed campaigns, frequency and consent controls; an ad slot does not guarantee paid inventory or revenue.
- **Trust and safety:** privacy controls, least-privilege administration, reporting, abuse prevention and auditable moderation.
- **Mobile-first experience:** responsive layouts and performance-conscious delivery for lower-powered devices and slower connections.

## Current implementation status

Implemented on `yaschat/phase-1-foundation` so far:

- Initial repository, architecture, licensing-boundary and feature-gap audits.
- Original YasChat SVG logo, dark logo and app icon assets.
- Initial PWA manifest metadata updates.
- A single-command engineering gate script.
- A GitHub Actions workflow for immutable install, documentation-link checks, lint, unit tests and optional full build.
- Engineering runbooks and stage reports.

Still in progress:

- Full in-app rebrand, including PNG fallbacks, favicon, Apple touch icon and visible client logo references.
- Baseline CI execution and verified build/test results.
- Focused core-chat regression coverage.
- New product catalogue and affiliate-provider adapters.
- Affiliate click/conversion attribution, commission ledger and payout controls.
- Ad campaign management, moderation/admin workflows and integration/E2E coverage.
- Security, accessibility, performance and deployment reviews.

Do not interpret a planned feature or an audit document as an implemented feature. Check the stage reports and GitHub Actions results before treating any gate as passed.

## Development branch and safety

- Active YasChat work belongs on `yaschat/phase-1-foundation`.
- Keep upstream `develop` separate until changes have passed review and required checks.
- Do not commit API keys, private keys, service-account files or production user data.
- Do not remove upstream code without dependency analysis, tests and a documented reason.
- Respect the repository's mixed licensing. The root MIT notice does not grant rights to Enterprise Edition code under `ee/` or `apps/meteor/ee/`, or to third-party assets and dependencies.

## Engineering checks

From a compatible checkout, run:

```bash
bash scripts/yaschat-one-command.sh
```

The script expects the YasChat branch, a clean working tree, a supported Node.js version and Yarn 4.18.1. It performs an immutable dependency install, documentation-link checks, lint, unit tests and (by default) the full monorepo build. A 4 GB Android device is not a suitable environment for the full monorepo build; use the configured GitHub Actions runner instead.

See:

- [YasChat master plan](docs/YASCHAT_MASTER_PLAN.md)
- [Single-command runbook](docs/YASCHAT_SINGLE_COMMAND_RUNBOOK.md)
- [Stage 15 report](docs/YASCHAT_STAGE-15_REPORT.md)
- [Stage 16 report](docs/YASCHAT_STAGE-16_REPORT.md)

## Upstream foundation

YasChat builds on the [Rocket.Chat project](https://github.com/RocketChat/Rocket.Chat). Refer to the upstream project and the repository's applicable license and third-party notices for attribution and usage terms.
