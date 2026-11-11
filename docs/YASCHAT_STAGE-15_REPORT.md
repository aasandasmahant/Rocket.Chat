# YasChat Stage 15 — Single-command engineering foundation

Date: 2026-11-11
Branch: `yaschat/phase-1-foundation`

## Completed in this stage

1. Added `scripts/yaschat-one-command.sh`.
   - Refuses to run outside the YasChat branch.
   - Refuses to run with an uncommitted working tree.
   - Verifies the repository's Node and Yarn versions.
   - Uses `yarn install --immutable`.
   - Runs documentation link checks, lint, unit tests and (by default) the full monorepo build.
   - Does not delete files, force-push, merge branches or touch `develop`.

2. Added `.github/workflows/yaschat-ci.yml`.
   - Cloud runner uses Node 24.15.0 and Yarn 4.18.1.
   - Runs immutable install, documentation link check, lint, unit tests and optional full build.
   - Scoped to `yaschat/phase-1-foundation` and selected source/documentation paths.

3. Added `docs/YASCHAT_SINGLE_COMMAND_RUNBOOK.md`.
   - Documents the one-command entry point, cloud workflow, resource constraints and next implementation sequence.

## Git commits created

- Script: `896410d3280cac02eafdcb4c18241fa03d1b8491`
- Initial workflow: `8a3f3bb67d0bb79813464dcbef465efe829f1352`
- Runbook: `00b7db3bd942a45f6d916fa1ec73bc8fa181219e`
- Workflow push-trigger update: `9e32522f8f5150b47240efa35c1debef2f82096a`

## Verification status

The files were committed to the YasChat branch through GitHub. The build, lint and unit tests have **not** been executed by this editing operation. The workflow is configured to run on a matching branch push; inspect GitHub Actions for the actual run result before marking the gate passed.

## Remaining product implementation

This stage does not implement the complete YasChat product. Still required: verified core-chat regression, complete in-app rebrand, product catalogue/provider adapters, affiliate attribution and commission ledger, advertising/campaign management, admin dashboards, moderation workflows, payout controls, integration/E2E tests, security and deployment readiness.

## Safety and licensing

Keep `develop` untouched. Do not delete upstream files without dependency analysis and tests. Do not commit secrets or production user data. Respect the Enterprise Edition licensing boundary and third-party licenses.
