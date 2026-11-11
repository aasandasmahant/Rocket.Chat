# YasChat Stage 30 — Shared Affiliate Provider Foundation

Status: executable provider foundation and unit-test source committed. Tests have not been executed in this environment.
Branch: `yaschat/phase-1-foundation`

## Repository inspection

The Rocket.Chat branch is a Yarn monorepo with a Meteor server application at `apps/meteor`. Its REST API modules are registered through `apps/meteor/server/api/index.ts`, and server services are registered in `apps/meteor/server/services/startup.ts`. The existing YasChat public product endpoint is registered in the API index and lives at `apps/meteor/server/api/v1/yaschat-products.ts`.

The existing product endpoint reads approved records from `YasChatProducts.findApprovedProducts`. No affiliate provider adapter runtime or provider-specific credentials were found in the inspected files.

## Files added

- `apps/meteor/server/services/yaschat/affiliate-provider.ts`
- `apps/meteor/server/services/yaschat/affiliate-provider.test.ts`

## Implemented in this stage

- Typed provider keys and health states for ClickBank and ShareASale.
- Registry for server-side provider adapters.
- Disabled-by-default configuration for both providers.
- Safe no-op behavior when a provider is disabled or has no ready adapter.
- Query length and result limit validation (1–50).
- Runtime normalization of untrusted provider candidate payloads.
- HTTP/HTTPS URL protocol validation.
- Non-negative finite price and ISO-style three-letter uppercase currency validation.
- Mandatory `pending_review` status for every normalized imported candidate.
- Unit-test source for disabled state, no outbound adapter call, missing adapter, normalization, unsafe URLs, invalid prices/currency, and search bounds.

## Credential policy

No credentials are defined or read by this module. No API keys, tokens, or secrets are included. Providers remain disabled by default. Later live integrations must use server-side secret storage and current official provider documentation.

## Important boundaries

- This foundation does not make network requests.
- ClickBank and ShareASale adapters are not implemented.
- No database writes or automatic product publishing are performed.
- The registry is not yet wired into Meteor startup or the admin UI.
- The test file is committed but has not been run; CI results are not claimed.
- The repository's complete typecheck, lint, and build have not been run.

## Acceptance checks for the next stage

1. Run the focused server unit test using the repository's supported test command.
2. Resolve any lint/type errors.
3. Wire the registry into a server-only integration point only after configuration and lifecycle conventions are verified.
4. Add persistent provider sync and admin review only after schema and permission paths are inspected.
