# YasChat Stage 34 — Atomic Admin Product Review

## Delivered

- Added `POST /api/v1/yaschat.admin.products.approve`.
- Added `POST /api/v1/yaschat.admin.products.reject`.
- Both routes require authentication and the existing `access-permissions` permission.
- Reject requests require a non-empty reason (maximum 1,000 characters); the reason is trimmed before persistence.
- Both requests require `recordId` and `expectedVersion`.
- The model only changes a record whose current moderation status is `pending-review` and whose version matches `expectedVersion`.
- The decision, reviewer ID, review timestamp, version increment, and audit-history append are performed in one MongoDB update. This prevents two concurrent admins from both successfully reviewing the same pending version.
- Audit events are stored in the product document's `moderationHistory` array with actor, action, timestamp, changed fields, and rejection reason where applicable.
- Registered the new route module in the server API index.
- Added the model interface contract and implementation.

## API behaviour

### Approve

Request body:
```json
{
  "recordId": "product-record-id",
  "expectedVersion": 1
}
```

### Reject

Request body:
```json
{
  "recordId": "product-record-id",
  "expectedVersion": 1,
  "reason": "Required explanation"
}
```

A response with `reviewed: false` means the record was not updated because it was not pending review or its version was stale. The client must refresh the queue and must not assume the decision succeeded.

## Security and integrity notes

- No client-supplied admin flag is trusted.
- Public catalogue routes remain read-only.
- Review writes are restricted to authenticated users with `access-permissions`.
- Audit history is append-only through these application routes; direct database operators can still alter database records and must be governed separately.
- This stage does not yet add the visual admin review interface.

## Verification status

- GitHub write operations completed on branch `yaschat/phase-1-foundation`.
- The implementation files must still pass repository TypeScript, lint, unit, and integration checks. Those commands were not executed in this connector session, so no build or test pass is claimed.
- The admin UI, review history viewer, and end-to-end browser tests remain outstanding.
