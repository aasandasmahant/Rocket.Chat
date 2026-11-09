# YasChat Core Chat and Messaging Audit

**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Read-only source inspection of chat composition, message delivery, uploads, audio/video capture, threads and translation.

## 1. Main chat screen

Verified client areas:
- `apps/meteor/client/views/room/Room.tsx` and `RoomRoute.tsx`: room entry and routing.
- `apps/meteor/client/views/room/Header/`: room title, controls, member context and room actions.
- `apps/meteor/client/views/room/MessageList/`: message timeline, rendering, pagination, highlight and message hooks.
- `apps/meteor/client/views/room/body/`: message body, scroll behavior, upload progress and drop-target handling.
- `apps/meteor/client/views/room/composer/`: message composition and send actions.

Recommendation: rebrand the room layout and component styling without replacing room permissions, subscription state, message pagination or accessibility behavior.

## 2. Text composer and sending

- `ComposerContainer.tsx` selects a composer state based on room access: air-gapped restriction, omnichannel, federation, anonymous, read-only, archived, ABAC locked, password-protected join, blocked, message selection or normal message.
- `ComposerMessage.tsx` chooses legacy `MessageBox` or `RichTextMessageBox` using the `realtimeMessageComposer` feature preview.
- `messageBox/MessageBoxActionsToolbar/` provides action hooks and controls.
- `apps/meteor/server/meteor-methods/messages/sendMessage.ts` validates thread parent IDs, message size, user identity, room send permissions, encryption policy and timestamp before delegating to the message service.

Do not bypass server validation or send directly from a new UI component. Use existing client action and server API patterns.

## 3. Attachments and uploads

Verified client files:
- `body/hooks/useFileUpload.ts`
- `body/hooks/useFileUploadDropTarget.ts`
- `composer/messageBox/MessageBoxActionsToolbar/hooks/useFileUploadAction.ts`
- `composer/messageBox/MessageComposerFiles.tsx`
- `composer/messageBox/MessageComposerImageFile.tsx`
- `modals/FileUploadModal/`
- `contextualBar/RoomFiles/`

Server paths:
- `apps/meteor/server/api/v1/uploads.ts`
- `apps/meteor/server/api/lib/MultipartUploadHandler.ts`
- `apps/meteor/server/meteor-methods/messages/sendFileMessage.ts`

The file-message path checks that an upload belongs to the user and room, updates safe metadata, creates file/image/audio/video attachment representations and then uses the normal message-send flow. The upload deletion API checks authorization before deleting.

YasChat should preserve upload limits, allowed/blocked MIME types, room membership checks, file ownership, delete permissions, thumbnails and preview handling. Add virus/malware scanning and storage retention policy only as a separately designed server-side feature; do not claim existing scanning unless verified.

## 4. Audio and video messages

- `useAudioMessageAction.ts` uses the browser microphone, permission state, upload setting and audio-recorder setting.
- `useVideoMessageAction.ts` uses camera/media-recorder support and upload MIME policy.
- The existing audio/video recording options are feature- and browser-dependent; they are not a guarantee that every device/browser supports them.

For YasChat, keep recording opt-in with a clear permission prompt and visible recording state. Do not start microphone/camera capture automatically.

## 5. Threads and replies

- `apps/meteor/client/views/room/contextualBar/Threads/` contains thread list, thread chat, thread message list and query hooks.
- `composer/messageBox/MessageBoxReplies.tsx` and `MessageBoxReply.tsx` support reply context.
- `sendMessage.ts` validates thread IDs and normalizes parent message relationships; nested thread behavior is constrained server-side and the Threads setting is checked.

Keep thread membership, parent-message checks and unread/reply state intact when changing the UI.

## 6. Reactions

- `apps/meteor/client/views/room/modals/ReactionListModal/` contains the reaction list modal and reaction-user display.
- The recursive source tree search did not establish the complete reaction mutation path in this pass. Before implementing custom reaction behavior, trace the message action/menu and server mutation/API end-to-end. Do not infer that the reaction list modal itself performs reaction writes.

## 7. Translation

- `MessageList/hooks/useAutoTranslate.ts` reads the `AutoTranslate_Enabled` setting and per-room language/auto-translate configuration.
- `MessageList/lib/autoTranslate.ts` checks translated message and attachment data.
- The client only displays a translation when translation metadata for the selected language is present; this audit does not identify a new YasChat translation provider or prove that 200+ language translation is already available.

YasChat AI translation needs a separate provider/service design: supported language detection, source/translated text separation, user consent, privacy/data-retention rules, quotas, abuse controls, cache, error fallback and a provider abstraction. Keep the original message unchanged and label translations clearly.

## 8. YasChat change plan

1. Rebrand room header, sidebar/contextual bar and message visual styles using existing theme tokens.
2. Customize composer toolbar and message bubble presentation while preserving feature-flag and room-state behavior.
3. Design attachment/voice/video UX on top of existing upload and recorder flows.
4. Trace and test reactions end-to-end before changing them.
5. Add YasChat translation as an isolated service and client action; do not rewrite core sendMessage.
6. Add integration/E2E coverage for text, threads, uploads, audio/video permissions, permissions errors, encrypted rooms and translation fallback.

## 9. Verification status

- The paths and representative source files above were fetched from `yaschat/phase-1-foundation`.
- This report adds documentation only. No application source code or chat behavior was changed.
- No build, lint, typecheck, unit or E2E tests were run.
- Reaction write path and complete translation-provider path remain explicit follow-up audit items.
