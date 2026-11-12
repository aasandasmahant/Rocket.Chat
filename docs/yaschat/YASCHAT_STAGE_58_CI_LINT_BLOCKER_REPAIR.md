# YasChat Stage 58 — CI lint blocker repair and gate recovery

## Goal
Recover the engineering gate after the native composer product picker work, without masking lint diagnostics or weakening CI.

## Verified baseline
- The YasChat engineering gate for commit `fb2d0ad8f0bbc7edb034f1c74738d88e4d2b49c1` failed.
- Documentation link validation and the YasChat moderation permission regression test passed.
- The lint job failed in `@rocket.chat/apps` at `packages/apps/base-runtime/src/lib/jsonrpc.ts:8:1`.
- Oxlint reported one error: an unused `oxlint-disable-next-line import/export` directive.
- Unit tests and the full monorepo build were skipped because lint failed.
- Code scanning completed successfully.

## Change made
Removed only the unused suppression directive from `packages/apps/base-runtime/src/lib/jsonrpc.ts`. No lint rule was disabled, no rule was relaxed, and no application runtime behavior was intentionally changed.

## Verification status
This commit triggers a fresh engineering-gate run. Do not treat the stage as fully validated until lint, unit tests, and the monorepo build have completed successfully. If a real import/export lint error appears after removing the stale directive, fix the underlying rule or use a narrowly justified suppression only when the diagnostic is reproduced.

## Remaining product work
The Stage 57 composer picker still inserts editable text rather than a typed product attachment. A rich product card remains blocked on a verified catalogue response contract and coordinated message validation, persistence, rendering, E2EE, federation, and regression tests.
