# YasChat Stage 37 — Admin Moderation History Viewer

## Delivered

- Extended the existing Admin Product Review page instead of creating a duplicate dashboard.
- Added a per-product **View history / Hide history** control.
- Loads the selected product's audit events on demand from the protected Stage 36 endpoint.
- Encodes the record ID before placing it in the query string.
- Shows the action, administrator ID, event timestamp, optional rejection reason, and changed-field list.
- Shows loading, empty-history, and permission/error states.
- Caches a successfully loaded history for the current page session to avoid repeat requests.
- Keeps the review queue and existing approve/reject actions in place.

## Changed file

- `apps/meteor/client/views/admin/yaschat/YasChatProductReviewPage.tsx`

## Security status

- The Stage 36 history endpoint requires authentication and the dedicated `yaschat-product-moderation` permission.
- The route guard, sidebar item, queue API, approve/reject APIs, and history API now use the same dedicated permission.
- The permission is admin-only by default; trusted moderators require an explicit grant.
- Administrator IDs are displayed as IDs. A display-name lookup remains optional follow-up work.

## Verification status

- The page, route, and API endpoint were re-fetched from the target branch.
- The endpoint path matches the registered Stage 36 API route.
- No browser rendering or live API test result is claimed yet.
- The current lint fixes have been committed; the fresh branch CI run must complete before this stage is called build-verified.

## Next engineering work

- Add automated UI tests for history loading, empty history, forbidden access, and request failure.
- Run API integration tests and browser tests.
- Continue with the product-card-in-chat and community feed integration after the moderation gates pass.
