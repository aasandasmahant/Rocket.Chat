# YasChat Stage 61 — Recover and fix the exact CI lint failure

**Date:** 2026-11-13  
**Branch:** `yaschat/phase-1-foundation`

## Audit finding

Inspected GitHub Actions engineering gate run #101 for commit `7c4db1f1fa63b66fef65aefa4f4b36280127cfdd`.

The run completed these steps successfully:
- Node.js 24.15.0 and Yarn 4.18.1 verification
- Immutable dependency installation
- Documentation-link check
- YasChat moderation-permission regression test

Lint failed in `@rocket.chat/ui-livekit#lint`, not `@rocket.chat/ui-contexts#lint` as the previous stage note had suspected. The exact Oxlint errors were:

- `src/LiveKitCallProvider.tsx:235:5` — Promises must be awaited, add void operator to ignore.
- `src/LiveKitCallProvider.tsx:238:5` — Promises must be awaited, add void operator to ignore.
- `src/LiveKitCallProvider.tsx:241:5` — Promises must be awaited, add void operator to ignore.

The flagged calls already had explicit rejection/error handlers. They are intentionally fire-and-forget UI actions, so the minimal correction is to mark the three handled promise chains with the `void` operator. No business behavior, device preference timing, or error handler was changed.

## Change committed

Updated only `packages/ui-livekit/src/LiveKitCallProvider.tsx`:
- Added `void` before `setMicrophoneEnabled(...).then(...)`.
- Added `void` before `setCameraEnabled(...).then(...)`.
- Added `void` before `setScreenShareEnabled(...).catch(...)`.

Commit: `f3d92b889d4a6373597858b0f1d8a0d45f549a01`

## Verification status

- GitHub accepted the source-file update on the YasChat branch.
- A push-triggered engineering-gate run is expected from this commit; its result has not yet been observed at the time this report was written.
- Run #101 had install, docs and focused moderation checks passing; lint failed, so unit tests and full build were skipped.
- Do not claim lint, unit tests, full build or production readiness as passed until the new run is inspected.

## Next stage

**Stage 62 — Inspect the fresh CI run after the ui-livekit lint correction.** Confirm whether lint now passes, capture any next exact diagnostic from logs, and fix only reproducible failures. If lint passes, continue to unit tests and separately run the manual full-build workflow with `run_full_build=true`.

## Safety

- Only the dedicated YasChat branch was changed.
- Upstream `develop` was not changed.
- No secrets, production user data, or Enterprise Edition code were added.
- Keep the existing licensing and attribution boundaries intact.
