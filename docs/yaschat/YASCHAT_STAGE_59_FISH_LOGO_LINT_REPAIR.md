# YasChat Stage 59 — Fish logo lint formatting repair

## Verified CI finding
The engineering gate for commit `b8d9b3c2a89ebd05f0db92a0e93b760687433ad9` passed documentation-link validation and the YasChat moderation permission regression test, but failed the lint stage in `packages/logo`.

The reported errors were formatting violations in `packages/logo/src/YasChatLogo/YasChatLogo.tsx` (SVG path and text JSX attributes). The CI output reported 8 formatting errors in that file. The previous unused Oxlint directive in `packages/apps/base-runtime/src/lib/jsonrpc.ts` no longer produced an error; its lint result reported zero errors.

## Change made
Reformatted the fish mark's SVG path attributes and YasChat wordmark text elements across multiple lines. Kept the existing SVG path data, colours, dimensions, labels, gradients, and component behavior unchanged.

## Verification
A new engineering gate was triggered by the formatting commit. Do not claim lint, unit tests, or the full monorepo build have passed until the new run completes.

## Product status
This is a CI repair stage, not the rich product-card feature. The composer product picker still inserts an editable product summary. A typed product message requires a verified API response schema and coordinated server validation, message persistence, rendering, E2EE/federation review, and tests.
