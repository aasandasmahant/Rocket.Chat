# YasChat Stage 22 — Product persistence model contract

## Delivered

- Added `IYasChatProductsModel` to `packages/model-typings`.
- The model reuses the canonical moderated product record from `@rocket.chat/core-typings` and adds Rocket.Chat's string MongoDB `_id`.
- Exported the contract from the model-typings package entry point.
- Kept the interface on Rocket.Chat's existing `IBaseModel` contract so the later raw model can use the standard collection operations, pagination, indexes, and update methods.

## Repository conventions verified

- Raw MongoDB models live in `packages/models/src/models` and extend `BaseRaw`.
- Model interfaces live in `packages/model-typings/src/models` and extend `IBaseModel`.
- Model interfaces are exported from `packages/model-typings/src/index.ts`.
- Runtime model registration is centralised in `packages/models/src/index.ts`, with raw classes exported through `packages/models/src/modelClasses.ts`.

## Not claimed as complete

This stage adds a compile-time persistence contract only. It does not create a MongoDB collection, indexes, runtime model registration, permission checks, API endpoints, or audit persistence. Those must be added together with the corresponding service and integration tests. No provider credentials or sample catalogue records are included.

## Verification

- New interface and package export were written to the working branch.
- Repository paths and model conventions were read from the working branch before implementation.
- CI/test execution has not been reported as passing; a GitHub connector write is not a test run.
