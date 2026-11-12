# YasChat Stage 39 — Permission Boundary Audit

## Scope

Audit the existing YasChat product moderation queue, approval, rejection, and history API authorization before changing any permission key.

## Findings verified in the branch

The following endpoints currently declare `authRequired: true` and `permissionsRequired: ['access-permissions']`:

- `GET /api/v1/yaschat.admin.products`
- `GET /api/v1/yaschat.admin.products.history`
- `POST /api/v1/yaschat.admin.products.approve`
- `POST /api/v1/yaschat.admin.products.reject`

This is an existing authorization gate, but it is not a purpose-built product-moderation permission. Rocket.Chat's public permission guide describes `access-permissions` as permission to create and edit roles and permissions, not as a product moderation capability. See https://docs.rocket.chat/docs/permissions and https://developer.rocket.chat/apidocs/add-permission-to-a-role.

## Decision

Do not replace `access-permissions` with a new permission string until the exact source revision's permission registration, role defaults, migrations/startup initialization, and permission administration UI are traced and tested. A route-only permission rename would likely deny every role because an unregistered permission may never be granted. Conversely, granting the new key broadly would not create least privilege.

## Security acceptance criteria for the implementation stage

1. Register a stable permission ID, e.g. `yaschat-product-moderation`, in the canonical permission catalogue used by this repository revision.
2. Define explicit default grants. The least-privilege default should be limited to the intended administrator/moderator roles; do not grant to ordinary users.
3. Ensure custom roles can be granted/revoked the permission through the normal Rocket.Chat Permissions screen/API.
4. Apply the permission consistently to queue, approve, reject, and history endpoints.
5. Add tests proving unauthenticated requests return 401, authenticated users without the permission return 403, and authorized moderators can read/review.
6. Verify revocation takes effect without requiring a process restart or stale role cache.
7. Run TypeScript, lint, relevant server/API tests, and a manual role-matrix test.

## Current verification

- Inspected the four YasChat endpoint source files on `yaschat/phase-1-foundation`; all four use the same existing permission gate.
- Inspected the product review UI's per-record history loading change from Stage 38; it was saved and source-level checks passed.
- The GitHub combined status endpoint returned no status checks for the Stage 38 commit. This is not a passing test result.
- No local TypeScript compilation, lint, unit/integration tests, or live role-matrix tests were run.

## Stage outcome

The permission-boundary audit and implementation acceptance criteria are documented. Dedicated permission implementation remains pending because the complete registration lifecycle could not be reliably located through the available repository inspection results. This is an explicit production-hardening blocker, not a claim that permission hardening is complete.
