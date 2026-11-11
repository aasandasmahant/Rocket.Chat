# YasChat Stage 16 — Project entry-point and CI trigger alignment

**Date:** 2026-11-11  
**Branch:** `yaschat/phase-1-foundation`

## Completed in this stage

1. Replaced the upstream-only root README with a YasChat project overview.
   - States the product direction and the current implementation status.
   - Separates inherited Rocket.Chat capabilities from YasChat-specific features that are still pending.
   - Documents branch safety, licensing boundaries, secret-handling rules and the engineering command.
   - Retains explicit attribution to the upstream Rocket.Chat project.
2. Updated the YasChat GitHub Actions path filter so README changes trigger the engineering gate.
3. Re-checked the existing single-command script and workflow source on the YasChat branch.

## Commits created

- README update: `635743b78603f0225eb378805b2884d09c118081`
- CI path-filter update: `079c3eb35f85c9af5fba18d6990b8402d041982b`

## Verification

- GitHub accepted both file updates on `yaschat/phase-1-foundation`.
- Earlier branch comparison showed the YasChat branch was 27 commits ahead of `develop` and 0 behind. This comparison was made before the two Stage 16 commits.
- The workflow is configured to trigger for README changes and branch pushes matching its path filter.
- **No successful CI run, dependency install, lint, unit-test run or full build has been confirmed in this stage.** The available GitHub connector operations did not expose a repository-wide workflow-run listing or a workflow-dispatch action. Do not mark these checks as passed until the Actions run is inspected in GitHub.

## Still outstanding

- Full in-app branding, PNG fallbacks, favicon and Apple touch icon.
- Verified baseline install/lint/unit-test/build results.
- Focused chat regression tests.
- Product catalogue/provider adapters, affiliate attribution and commission ledger.
- Advertising campaign management, referrals, admin dashboards and payout controls.
- Integration/E2E, accessibility, security and deployment reviews.

## Safety

No changes were made to `develop`. No secrets, production user data or Enterprise Edition source were added. The README explicitly distinguishes plans from implemented features.
