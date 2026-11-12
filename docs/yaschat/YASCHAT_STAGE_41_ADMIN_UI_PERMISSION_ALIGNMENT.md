# YasChat Stage 41 — Align Admin UI with Dedicated Moderation Permission

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Finding

Stage 40 introduced the dedicated `yaschat-product-moderation` permission for the moderation queue, approve/reject actions, and audit-history API. A follow-up source inspection found that the Admin sidebar item and the client route guard still checked the broader `access-permissions` permission.

This mismatch meant a trusted moderator granted only `yaschat-product-moderation` could be authorized by the server but blocked by the client UI.

## Changes committed

1. `apps/meteor/client/views/admin/sidebarItems.ts`
   - The YasChat Product Review sidebar item now checks `yaschat-product-moderation`.
2. `apps/meteor/client/views/admin/yaschat/YasChatProductReviewRoute.tsx`
   - The route guard now checks `yaschat-product-moderation`.
3. `apps/meteor/server/api/v1/yaschat-admin-products.ts`
   - Corrected the stale source comment to describe the protected queue and separately protected atomic review endpoints.

## Security boundary

- The dedicated permission remains admin-only by default in the canonical permission registry.
- A trusted moderator role must be explicitly granted the dedicated permission through Administration → Permissions.
- The client visibility/route guard now matches the backend permission used by the queue, review, and history endpoints.
- Backend authorization remains authoritative; hiding a navigation item is not treated as a security control.

## Source verification

The three changed source files were written to the target branch and are to be re-fetched to confirm their final contents. The previous Stage 40 source audit confirmed the four moderation API endpoints use the dedicated permission.

## Not run / not claimed

- TypeScript build, ESLint, unit tests, API integration tests, browser tests, and role-matrix tests have not been executed by this change.
- A successful CI run has not been confirmed.
- Production readiness is not claimed.

## Acceptance checks still required

1. Admin with the default permission can see and open the Product Review page.
2. A trusted moderator granted only `yaschat-product-moderation` can see and open the page and successfully use the permitted moderation API.
3. A user without the permission cannot see the item, cannot open the route, and receives HTTP 403 from protected APIs.
4. Revoking the permission removes access without a server restart.
5. TypeScript, lint, focused tests, and CI pass.

## Next stage

Stage 42: add focused automated tests for the dedicated moderation permission boundary and product review workflow, then run the repository's relevant quality gates. Do not merge into `develop` until those checks pass.
