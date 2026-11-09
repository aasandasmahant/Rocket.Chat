# YasChat Stage 13 — Existing Translation Feature Reuse Audit

**Date:** 2026-11-09  
**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Source inspected:** `develop` branch source at the current audit snapshot. This report documents existing code; it does not claim the integration is enabled or tested in this workspace.

## 1. Important discovery

Rocket.Chat already contains a substantial message auto-translation implementation. YasChat should extend/configure this implementation rather than create a second translation engine.

## 2. Existing server-side implementation

- REST API: `apps/meteor/server/api/v1/autotranslate.ts`
  - provider metadata endpoint
  - supported-language endpoint
  - room translation settings endpoint
  - translate individual message endpoint
- Provider registry/base class: `apps/meteor/server/lib/autotranslate/autotranslate.ts`
- Provider registration: `apps/meteor/server/lib/autotranslate/index.ts`
- Existing provider adapters:
  - Google Cloud Translation: `googleTranslate.ts`
  - DeepL: `deeplTranslate.ts`
  - LibreTranslate: `libreTranslate.ts`
  - Microsoft Translator: `msTranslate.ts`
- Translation helper: `functions/translateMessage.ts`
- Supported-language permission/lookup: `functions/getSupportedLanguages.ts`
- Room preference persistence: `functions/saveSettings.ts`
- Permission creation: `permissions.ts`

## 3. Existing client implementation

- Translation state and API loading: `apps/meteor/client/lib/autotranslate/autotranslate.ts`
- Room translation controls: `apps/meteor/client/views/room/contextualBar/AutoTranslate/AutoTranslate.tsx`
- Message translation handling: `apps/meteor/client/views/room/MessageList/lib/autoTranslate.ts`
- Stream handler: `apps/meteor/client/startup/streamMessage/autotranslate.ts`
- Room action: `apps/meteor/client/hooks/roomActions/useAutotranslateRoomAction.ts`

## 4. Existing security and privacy controls observed

- REST endpoints require authentication.
- Message translation checks the message, room and user's room access.
- Supported languages and settings are permission-gated by `auto-translate`.
- Enabling automatic translation in end-to-end encrypted rooms is rejected by the settings service.
- Translation providers use server-side settings for API keys; provider secrets must not be exposed in browser code.
- Translation is a third-party data flow. YasChat must clearly explain that message text is sent to the configured translation provider when translation is requested/enabled, and must not silently send private content to an unrelated provider.

These controls were observed in source; they have not been re-tested in this environment.

## 5. Existing tests observed

- Registry unit test: `apps/meteor/server/lib/autotranslate/autotranslate.test.ts`
- Client translation unit tests:
  - `apps/meteor/client/lib/autotranslate/autotranslate.spec.ts`
  - `apps/meteor/client/views/room/MessageList/lib/autoTranslate.spec.ts`
- API end-to-end tests: `apps/meteor/tests/end-to-end/api/autotranslate.ts`

Test files exist, but no test command was executed in this audit.

## 6. What this means for the YasChat requirements

| Requirement | Current finding | YasChat action |
|---|---|---|
| Translate chat messages | Existing capability | Reuse and rebrand |
| Multiple translation providers | Four adapters are present | Keep provider selection configurable |
| Dynamic supported languages | Provider-dependent API | Measure provider language coverage; never promise 200+ without a live verified list |
| Per-room language preference | Existing subscription settings | Reuse, add user-experience improvements only after tests |
| Original message preservation | Existing translation metadata/tokenization flow | Regression-test before modifying |
| E2E encrypted chat | Translation is blocked when enabling it | Preserve this security behavior |
| Automatic translation consent | Existing enable setting and room control | Add clear privacy disclosure and explicit opt-in |
| Translation fallback/quota/cost | Provider-specific behavior requires further review | Add robust errors, timeout/rate-limit/quota UI after provider review |
| UI language translation | Separate i18n package and locale resources | Do not confuse UI localization with message translation |

## 7. Open checks before modifying translation code

1. Determine exact supported-language counts from each provider's live API using authorized test credentials; API keys are not present in this audit.
2. Review rate limits, billing, retention and privacy terms for each provider.
3. Inspect provider error behavior, timeouts, retries, cache lifetime and translation quotas.
4. Add UI disclosure and opt-in copy before enabling any automatic message transmission.
5. Add tests for unsupported locale fallback, provider outage, missing API key, rate limits, long messages, attachments, RTL text and E2E-encrypted room rejection.
6. Verify that translation never mutates the canonical original message.
7. Run the existing unit/API/E2E suites in a compatible environment before and after changes.

## 8. Completion status

**Completed:** source map for server registry, four providers, API endpoints, client controls/stream integration, permission flow, E2E restriction and existing tests.

**Not completed:** live provider language count, credential-backed integration tests, privacy/legal review of provider terms, quota/cost tests, accessibility/RTL review, and runtime test execution.

**Code changes:** none. Existing translation code should be reused; no duplicate translation implementation was added.
