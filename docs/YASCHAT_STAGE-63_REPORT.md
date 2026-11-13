# YasChat Stage 63 — Remove obsolete lint suppression

**Date:** 2026-11-13  
**Branch:** `yaschat/phase-1-foundation`

## CI result inspected

Engineering Gate run #107 (run ID `43347603623`) checked commit `3cc6c10c0f98431c5d958f17ca46ca74d5f7524c`.

Passed:
- Toolchain verification
- Immutable dependency installation
- Documentation link validation
- YasChat moderation permission regression test

Lint then failed in `@rocket.chat/ui-contexts#lint`. The exact Oxlint error was:

`packages/ui-contexts/src/ActionManagerContext.ts:26:2: Unused oxlint-disable directive (no problems were reported).`

## Minimal fix committed

Removed only the obsolete `oxlint-disable-next-line @typescript-eslint/no-duplicate-type-constituents` directive from `packages/ui-contexts/src/ActionManagerContext.ts`. The interface declarations and runtime behavior were not changed.

Commit: `bc50b1532ea42973e34f0cb93bef855257edf99f`

## Verification status

- GitHub accepted the source update on the YasChat branch.
- A new push-triggered engineering gate is expected for this commit; its result must be inspected separately.
- Run #107 skipped unit tests and full build because lint failed first.
- The full monorepo build remains a separate manual workflow run using `run_full_build=true`.

## Next stage

**Stage 64 — Verify CI after removing the obsolete suppression.** Inspect the new run, verify lint, then unit tests if reached. For any further failure, inspect the exact log and make only a minimal, evidence-based fix.

## Scope and safety

- Only `yaschat/phase-1-foundation` was changed.
- Upstream `develop` was not changed.
- No secrets or production data were introduced.
- Preserve upstream licensing and attribution boundaries.
- YasChat is not production-ready until full tests, full build, security/licensing review, deployment and runtime validation are complete.
