# YasChat Stage 21 — Moderation Workflow Guard Contract

## Delivered in this increment

- Added `IProductAdminWorkflow.ts` with a runtime-validated moderation transition contract.
- Allowed transitions are explicit: draft to pending-review/archive; pending-review to draft/approved/rejected; approved to archived; rejected to draft/archived; archived to draft.
- Every transition requires a non-empty actor ID and a valid timestamp.
- Rejection requires a non-empty reason.
- Added focused unit tests for allowed transitions, forbidden transitions, rejection reasons, actor identity, and timestamps.
- Exported the workflow contract from the YasChat commerce package barrel.

## Important security boundary

This is a domain validation contract only. It does not authenticate an administrator, grant permissions, write MongoDB records, prevent concurrent updates, or persist audit events. Server handlers must independently enforce existing Rocket.Chat permissions, use the authenticated user ID rather than a client-supplied actor ID, perform version-checked atomic updates, and persist audit events with the catalogue change.

## Validation status

The files were committed and fetched back from the working branch for content verification. GitHub CI/unit-test execution has not been confirmed. Do not call this stage test-passing or production-ready until the package's unit tests, lint, and typecheck run successfully.

## Remaining Stage 21 work

1. Inspect the exact server model/service and permission patterns in this repository branch before adding runtime code.
2. Implement a dedicated catalogue collection and indexes using the repository's supported MongoDB conventions.
3. Implement authenticated, permission-guarded admin create/update/submit/approve/reject/archive operations.
4. Enforce atomic version checks and append-only audit persistence.
5. Add integration tests for permission denial, transition validation, concurrency, and audit persistence.
6. Add read-only public product search/detail endpoints with bounded query parsing and safe field projection.

No new database framework, parallel HTTP server, provider credentials, or live provider API calls should be introduced.
