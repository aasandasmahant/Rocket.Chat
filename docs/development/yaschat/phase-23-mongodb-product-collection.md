# YasChat Stage 23 — MongoDB product collection registration

## Delivered

- Added `YasChatProductsRaw`, following Rocket.Chat's existing `BaseRaw` model pattern.
- Uses the collection name `rocketchat_yaschat_products` through the repository's standard collection-name prefix.
- Added a unique compound index for provider source + provider external product ID, preventing duplicate imports from the same provider.
- Added indexes for moderation queue ordering, category/status filtering, and newest-created records.
- Exported the raw model from `modelClasses.ts`.
- Registered `IYasChatProductsModel` with the existing model registry and exposed the proxified `YasChatProducts` model.
- Explicitly implements the model-typings interface.

## Safety and scope

- No product records are inserted.
- No ClickBank or ShareASale credentials are configured.
- No user-facing endpoint or admin permission is added in this stage.
- Moderation transition and permission enforcement remain service-layer responsibilities; the database model alone must never authorize an action.

## Verification

- Re-read the raw model, model export, model registry, and model interface from the working branch after writes.
- Confirmed the raw model is imported, exported, proxified, and registered.
- Confirmed `BaseRaw.modelIndexes()` is the repository's supported index hook.
- GitHub connector does not execute the repository's typecheck, lint, or MongoDB tests. CI results must be checked separately; no passing test claim is made here.
