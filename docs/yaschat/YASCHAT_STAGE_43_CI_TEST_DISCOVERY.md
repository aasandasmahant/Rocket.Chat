# YasChat Stage 43 — CI Test Discovery and Focused Regression Gate

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Findings

- The Meteor workspace exposes `.testunit:server` using Node's test runner with `--require tsx` and the `**/*.test.{ts,js}` test-file pattern.
- The Stage 42 permission regression test is located under `apps/meteor/server/lib/authorization/constant/` and matches that repository test-file convention.
- The root Turbo task `testunit` delegates to workspace `testunit` scripts, including the Meteor workspace.
- The branch CI workflow already runs lint, unit tests, and an optional full monorepo build. A dedicated focused regression command makes the permission test visible as its own CI gate before the broader lint and unit-test steps.

## Changes committed

1. Added Meteor workspace script `testunit:yaschat-permissions`, invoking the Node test runner with the same TypeScript loader and isolation setting used by the server unit-test runner.
2. Added a named GitHub Actions step, `YasChat moderation permission regression test`, running that focused script before lint and the full unit-test suite.

## Verification status

- Source, workflow, and package-script changes were committed to this branch.
- The focused test command has **not** been executed in this environment.
- No successful GitHub Actions run has yet been observed for these commits; workflow execution remains pending confirmation.
- Lint, full unit tests, typecheck, API 401/403 tests, role-matrix tests, and full monorepo build remain unverified.
- No merge to `develop` was performed.

## Next stage

Stage 44: inspect the CI run triggered by these commits, capture actual job results, and fix any reproducible failure before expanding moderation API authorization coverage.
