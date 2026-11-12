# YasChat Branding Implementation and Verification

**Date:** 2026-11-12  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Replace user-facing Rocket.Chat logo identity with YasChat's original jumping-fish identity while preserving Rocket.Chat application code and behaviour.

## 1. Canonical YasChat identity

- Primary wordmark: `apps/meteor/public/images/yaschat/logo.svg`
- Dark-background wordmark: `apps/meteor/public/images/yaschat/logo-dark.svg`
- App icon: `apps/meteor/public/images/yaschat/icon.svg`
- Browser favicon: `apps/meteor/public/images/yaschat/favicon.svg`
- React logo component: `packages/logo/src/YasChatLogo/YasChatLogo.tsx`

The mark is an original blue fish leaping above a water splash, with a blue/cyan body and orange accent. The same fish mark is used in the app icon and favicon.

## 2. User-facing branding changes applied

- Updated the YasChat React logo component to use the jumping fish and YasChat wordmark.
- Changed the legacy `RocketChatLogo` compatibility component to render the YasChat logo. Existing imports continue to work, but no longer render the Rocket.Chat wordmark.
- Updated the logo compatibility tests to expect the accessible YasChat logo.
- Replaced the YasChat public logo, dark logo and app icon SVG assets.
- Added the dedicated YasChat SVG favicon.
- Updated both PWA/web app manifests to use YasChat name, description, theme colours and fish icon.
- Updated Vite's HTML title, application name, theme colour, favicon and manifest references.
- Updated the runtime browser favicon and desktop-shell favicon to the YasChat SVG.
- Changed the default `Site_Name` setting and desktop title fallback to YasChat.
- Changed the default sidebar footer logo paths to the YasChat light/dark wordmarks.
- Enabled the default hide-powered-by setting where that branded login setting is supported.

## 3. Rocket.Chat code preservation

This work changes the rendered brand identity, not the underlying chat platform. It does not remove Rocket.Chat messaging, rooms, channels, authentication, notifications, permissions, or other core application modules. Existing logo component import names are retained as compatibility exports so existing callers do not need to be rewritten immediately.

## 4. Remaining compatibility assets and deployment note

- The old `apps/meteor/public/favicon.ico` file was removed so the legacy Rocket.Chat icon is not served from the root favicon path.
- The old upstream asset directory under `apps/meteor/public/images/logo/` remains in the repository for compatibility with any remaining upstream/static references. The YasChat manifests, runtime favicon, logo component and default sidebar footer now point to YasChat-owned assets. A full rendered-page audit is still required before claiming every historical static reference has been eliminated.
- On an already-running database, an existing saved `Site_Name` value can override the new default. Set that value to `YasChat` in the server's General settings after deployment if it was previously saved as Rocket.Chat.
- The Vite HTML title is a development/build entry point; the runtime document title continues to use the configurable `Site_Name` setting.

## 5. Verification status

- All changed text files were fetched again from the target branch after commits and their expected YasChat content was confirmed.
- The branch comparison against `develop` was checked after the branding commits.
- The React logo tests were updated but **not executed** in this session.
- No lint, typecheck, browser visual regression, PWA installation, or full application build was run. No CI success is claimed.
