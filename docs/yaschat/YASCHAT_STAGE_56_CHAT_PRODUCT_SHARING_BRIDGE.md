# YasChat Stage 56 — Chat Product Sharing Bridge

Date: 2026-11-12
Branch: `yaschat/phase-1-foundation`

## Goal

Start connecting the approved product catalogue to existing Rocket.Chat conversations without replacing the native message composer, realtime transport, permissions, or message renderer.

## Repository integration points inspected

- `apps/meteor/client/views/home/YasChatHomePage.tsx`: approved product catalogue and product cards.
- `apps/meteor/client/views/room/composer/messageBox/MessageBox.tsx`: native message composer and send lifecycle.
- `apps/meteor/client/views/room/MessageList/MessageList.tsx`: virtualized message list.
- `apps/meteor/client/components/message/variants/room/RoomMessageContent.tsx`: native message body and attachment rendering.
- `apps/meteor/client/components/message/content/Attachments.tsx` and `attachments/AttachmentsItem.tsx`: standard attachment rendering.
- `packages/core-typings/src/IMessage/MessageAttachment/MessageAttachmentDefault.ts`: supported generic attachment fields.
- `apps/meteor/server/api/v1/chat.ts`: existing authenticated `chat.postMessage` endpoint supports message attachments and existing room/message validation.
- `apps/meteor/client/lib/chats/ChatAPI.ts`: native composer and message send abstractions.

## Delivered in this increment

- Added a **Copy for chat** action to each approved product card on the YasChat home catalogue.
- Copies a plain-text product summary that can be pasted into any existing Rocket.Chat conversation.
- Includes the product title, available description/category/price, catalogue partner attribution, and the verified product destination URL.
- Includes a reminder to verify current price and details with the seller.
- Uses the browser clipboard API only after an explicit user click.
- Shows an accessible per-product success or failure status; does not claim a message was sent.
- Does not expose or fabricate an affiliate tracking URL, commission, rating, stock status, or revenue.
- Leaves native message sending and realtime behaviour unchanged.

## Why this is a bridge, not the final product-card integration

The repository already renders standard Rocket.Chat message attachments. However, the catalogue home page is outside the room's `ChatProvider`, so directly calling a room composer from that page would violate the existing architecture. A safe native card sender needs a room picker/current-room entry point and a typed product-to-attachment contract, then must use the authenticated message path and preserve room access checks.

The copy action is deliberately the first small integration step. It is not described as an interactive attachment card and does not send a message automatically.

## Remaining work for the next increment

1. Add a room-context product picker reachable from the native message composer.
2. Create a typed, versioned YasChat product attachment contract using only approved catalogue records.
3. Send the attachment through the existing authenticated message pipeline; do not bypass Rocket.Chat room permissions.
4. Render the card using the native attachment renderer, with safe HTTPS links, accessible image alt text, source attribution and affiliate disclosure where applicable.
5. Add unit tests for attachment construction/validation and client tests for selection, sending, and error states.
6. Verify normal text, files, threads, E2EE restrictions, federation, and message editing remain unchanged.
7. Run focused tests, lint, typecheck, and full build.

## Verification status

- Source integration points were re-fetched from the active branch.
- The clipboard share implementation was committed to `yaschat/phase-1-foundation`.
- No local browser test, unit test, lint, typecheck, or build result is claimed by this document.
- The latest branch GitHub Actions run must be checked after the commit before calling Stage 56 CI-verified.

## Next stage

**Stage 57 — Native composer product picker and typed message attachment contract.**
