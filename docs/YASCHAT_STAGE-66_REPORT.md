# YasChat Stage 66 — Global recipient-language translation audit

**Date:** 2026-11-13  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Source audit and translation product contract; no claim of completed end-user feature.

## User requirement

YasChat must let people from different countries communicate in their own chosen languages in the same conversation. A Hindi-speaking recipient should be able to read a sender's English message in Hindi; an English-speaking recipient should see that same message in English. Users may choose any supported language independently of their country. Country is not a reliable substitute for language preference.

## Existing implementation verified in source

1. `apps/meteor/server/lib/autotranslate/functions/saveSettings.ts` saves `autoTranslate` and `autoTranslateLanguage` on the current user's room subscription. This is per-user and per-room state.
2. `apps/meteor/server/lib/autotranslate/autotranslate.ts` obtains target languages from subscriptions in a room, excluding the sender, then calls the active translation provider and persists translations separately using `Messages.addTranslations`.
3. `apps/meteor/client/views/room/MessageList/hooks/useAutoTranslate.ts` reads the current subscription's target language and decides whether to show the matching translation for messages from other users.
4. `apps/meteor/server/lib/autotranslate/index.ts` registers Google Cloud, DeepL, LibreTranslate and Microsoft provider adapters. `TranslationProviderRegistry` selects one active configured provider and asks that provider for its supported languages.
5. `apps/meteor/client/providers/TranslationProvider.tsx` handles the application interface language. This is separate from the message-translation target language.

## Important distinction

The application UI language and the message-reading language are two different preferences. The UI can be English while the user wants chat messages translated into Hindi, or vice versa. Country selection must never automatically force a language; users can choose a language from any supported language list.

## Stage 67 implementation contract

- Make the preferred message language easy to set at account level, with per-conversation override retained.
- Keep automatic translation opt-in and independently switchable per conversation.
- Show the original message and a clearly labelled translation; allow the user to reveal the original at any time.
- Support a manual translate action even when automatic translation is off, subject to permissions and provider configuration.
- In a two-recipient test, one source message must be readable in each recipient's selected language without changing the original message.
- Do not infer language from country. Browser/account language may be a suggestion only, with explicit user choice.
- Obtain the language list from the active provider's capability endpoint. Do not claim 200+ language coverage until provider capability, locale codes, quality and end-to-end behavior are verified.
- Handle unsupported languages, provider timeouts/errors, rate limits, quotas and retries without blocking message delivery.
- Preserve mentions, links, code, emoji and formatting tokens during translation.
- Respect E2E encryption restrictions: never send E2E-encrypted content to an external translation provider.
- Document what message content is sent to a provider, retention/processing implications, and admin/user controls before enabling an external provider.
- Cache only by a safe key that includes message identity/version, source language, target language and provider; prevent cross-room or cross-user leakage.
- Add unit/integration tests for two different recipient languages, unsupported target language, provider failure, duplicate translation requests, edits/deletes and E2E rooms.

## Stage 66 source corrections

The Hindi locale JSON had a trailing comma after the final `You` key. It was removed and `JSON.parse` was run successfully before committing. Commit: `b14921ef6e72e976168020984ee20b620c296d3c`.

The preceding English and Hindi locale-order fixes are commits `af60bc0b4bba21e32f2b89aafa715c237325b460` and `aed51385523da65a27f108604bb5a33da290cdc3`; the subsequent JSON syntax correction is the final commit above.

## CI status at report creation

The YasChat engineering gate for commit `b14921ef6e72e976168020984ee20b620c296d3c` was in progress (run ID `43354334798`). No lint, unit-test or full-build success is claimed here. The full monorepo build remains a separate manual workflow run with `run_full_build=true`.

## Exit criteria

Stage 66 is an architecture/source audit and locale syntax correction. Stage 67 is not complete until its UI/backend behavior and focused tests are implemented, CI passes, and two-recipient language behavior is demonstrated. Full product release still requires the broader build, security, licensing and deployment gates.
