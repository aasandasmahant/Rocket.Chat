# YasChat Stage 40 — Dedicated Product Moderation Permission

## Outcome

Implemented a dedicated Rocket.Chat permission for YasChat product moderation and applied it consistently to the moderation queue, review actions, and audit-history endpoint.

Permission ID: `yaschat-product-moderation`

Default role grant: `admin` only. Trusted moderator roles can be granted this permission explicitly from the existing Administration → Permissions interface. Ordinary `user`, `guest`, `owner`, and `moderator` roles do not receive it automatically.

## Files changed

- `apps/meteor/server/lib/authorization/constant/permissions.ts`
  - Added `yaschat-product-moderation` with the least-privilege default `roles: ['admin']`.
- `apps/meteor/server/api/v1/yaschat-admin-products.ts`
  - Queue read endpoint now requires the dedicated permission.
- `apps/meteor/server/api/v1/yaschat-admin-product-review.ts`
  - Approve and reject endpoints now require the dedicated permission.
- `apps/meteor/server/api/v1/yaschat-admin-product-history.ts`
  - Moderation history endpoint now requires the dedicated permission.
- `packages/i18n/src/locales/en.i18n.json`
  - Added English permission name and description.
- `packages/i18n/src/locales/hi.i18n.json`
  - Added Hindi permission name and description.

## Registration and upgrade behavior verified

- `apps/meteor/server/lib/authorization/upsertPermissions.ts` imports the canonical permission list and calls `Permissions.create(permission._id, permission.roles)`.
- `apps/meteor/server/startup/migrations/xrun.ts` calls `upsertPermissions()` from `onServerVersionChange`, so the new permission is seeded when this new server build starts with a changed commit hash.
- `Permissions.create` inserts the permission only when it does not already exist. Existing permission-role assignments are not overwritten by this seed operation.
- The existing Admin Permissions page lists permission records and supports granting/removing roles; the new localized key is displayed through the existing translation lookup.

## Security behavior

- All four moderation endpoints still require authentication.
- All four now require `yaschat-product-moderation`, not the broader `access-permissions` capability.
- The new permission is admin-only by default. To delegate moderation, an administrator must explicitly grant it to a trusted role using the existing Permissions screen.
- Permission revocation is handled by Rocket.Chat's existing permission-change notification/cache invalidation path; no YasChat-specific cache was added.

## Verification performed

- Re-fetched all changed backend files from `yaschat/phase-1-foundation`.
- Confirmed the permission registry contains the new permission with admin-only default.
- Confirmed the queue, history, approve, and reject endpoints use the dedicated permission and no longer use `access-permissions`.
- Confirmed both English and Hindi locale JSON files parse successfully after the new keys were inserted.
- Inspected the canonical seed path (`upsertPermissions`), server-version-change startup call, Admin Permissions UI, and permission-change notification path.

## Not run / remaining checks

- TypeScript build and lint were not run.
- Server/API integration tests and browser role-matrix tests were not run.
- A live database upgrade and moderator grant/revoke test were not run.
- No claim is made that CI or production runtime verification passed.

## Acceptance checks for deployment

1. Start the new build against a test database and verify `yaschat-product-moderation` appears in Administration → Permissions.
2. Verify an admin can open the queue and history and approve/reject products.
3. Verify a normal user without the permission receives 403 from all four endpoints.
4. Grant the permission to a dedicated YasChat moderator role and verify that role can perform moderation.
5. Revoke the permission and verify access is denied without a server restart.
