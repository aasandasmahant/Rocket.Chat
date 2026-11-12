# YasChat Stage 57 — Native Composer Product Picker

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Goal

Make approved YasChat catalogue products available from inside the existing Rocket.Chat room composer, without creating a parallel chat system or bypassing native send permissions.

## Delivered

- Added `YasChatComposerProductPicker` beside the native composer actions.
- The picker requests the existing approved-product endpoint, `/api/v1/yaschat.products`, using same-origin credentials.
- It displays only records returned by that catalogue endpoint; no sample or unapproved products are fabricated.
- Selecting a product inserts a compact, editable product summary into the current composer at the cursor.
- The inserted summary includes the product title, available category and price, partner attribution, HTTPS destination URL, and a reminder to verify current seller details.
- The user remains in control: the selection does not send a message. The user can edit the text and use the ordinary Send action.
- The picker is disabled when the room cannot send, while recording, or while editing an existing message.
- The lookup has loading, empty, and error states and cancels its request when the picker is closed/unmounted.
- Product URLs are parsed and restricted to HTTPS before insertion.

## Architecture and safety decisions

- Reuses the existing `ComposerAPI.insertText()` and `ComposerAPI.focus()` methods.
- Reuses the native composer and authenticated Rocket.Chat message-send lifecycle.
- Does not call `chat.postMessage` directly and does not construct an `IMessage` client-side.
- Does not introduce custom attachment fields that the server validator, persistence layer, or renderer may not preserve.
- This stage intentionally inserts editable text, not a rich product attachment card. A versioned typed attachment requires a coordinated server-side allowlist/schema, message validation, normalization, rendering, and regression coverage before it can safely be enabled.

## Verification status

- Repository source was inspected before the change, including the room composer, composer API, catalogue home page, attachment typings, and authenticated chat API.
- Code and this stage report were committed to the active feature branch.
- No local lint, unit test, typecheck, browser test, or full build result is claimed.
- GitHub Actions must be checked against the latest commit before this stage can be called CI-verified.

## Next stage

**Stage 58 — Native product message card contract and server-side validation design**, including attachment allowlisting, safe URL/image handling, E2EE and federation behaviour, renderer fallback, and focused tests before enabling rich cards.
