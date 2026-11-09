# YasChat Direct Messages, Search, Notifications and Calls Audit

**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Read-only inspection of direct messages, search, notification preferences and calls.

## 1. Direct and group messages

- `apps/meteor/client/navbar/NavBarPagesGroup/actions/CreateDirectMessage.tsx` opens a user selector and calls `POST /v1/dm.create`.
- The flow respects the configured maximum direct-message participants and navigates to the created room after success.
- Group/direct room creation should be extended through existing room creation endpoints and membership checks; never create room records directly from client code.

## 2. Search and AI search

- `apps/meteor/client/navbar/NavBarSearch/NavBarSearch.tsx` provides the primary search overlay, keyboard shortcuts (including Ctrl/Cmd+K), accessible listbox behavior and search suggestions.
- `apps/meteor/client/navbar/NavBarSearch/NavBarAISearch.tsx` and related hooks power the AI-search input.
- `apps/meteor/client/views/search/SearchPage.tsx` displays AI search results and generated answers. It checks feature-preview state, workspace license module and the `AI_Intelligent_Search_Enabled` setting before enabling AI search.
- Standard search and licensed/configured AI search are distinct. Do not promise that AI search is enabled for every self-hosted workspace or that it is an unrestricted general web search.

YasChat recommendation: keep standard in-app search available; add any external/global product discovery as a separate, consent-aware service with its own provider, indexing, rate limits, source attribution and moderation.

## 3. Notifications

- `apps/meteor/client/views/room/contextualBar/NotificationPreferences/` contains room-level notification preference UI and form.
- `apps/meteor/client/views/root/hooks/loggedIn/useNewMessageNotification.ts` selects the configured custom or default sound and respects the user's no-sound choice.
- Additional notification hooks exist for browser permission, desktop notifications and push notifications.

YasChat should provide clear per-room and per-device controls, quiet hours, sound preferences and privacy-safe notification previews. Browser push requires permission and appropriate server/browser infrastructure; UI alone cannot guarantee delivery.

## 4. Voice/video calls

- `apps/meteor/client/views/conference/ConferencePage.tsx` handles call deep-link entry and validates the call URL through the existing URL gate before opening.
- `apps/meteor/client/hooks/roomActions/useVideoCallRoomAction.ts` checks room type, subscription, permissions, muted state, archived/read-only state and configured room-type enablement before starting calls.
- Conference pages, providers and call UI live under `apps/meteor/client/views/conference/` and `apps/meteor/client/providers/VideoConfProvider.tsx`.

Call capability depends on the configured provider, server setup, browser/device permissions and network conditions. YasChat must not advertise universal free video calling until a provider and its operating costs/limits are selected.

## 5. Recommended YasChat product order

1. Rebrand direct-message creation, search and notification preference screens.
2. Keep standard internal search as the baseline.
3. Decide whether AI search is a licensed Rocket.Chat capability or a separately integrated YasChat service; do not conflate the two.
4. Select and configure a voice/video provider before promising call availability.
5. Add tests for room participant limits, search permissions, notification preferences, browser permissions and call authorization.

## 6. Verification status

- Representative source files and routes were fetched from the dedicated branch.
- This report is documentation only; no application source was changed and no tests/builds were run.
- Provider configuration, deployment readiness and end-to-end call tests remain to be checked before launch.
