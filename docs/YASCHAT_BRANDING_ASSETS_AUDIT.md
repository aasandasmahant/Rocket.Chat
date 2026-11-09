# YasChat Branding and Asset Audit

**Date:** 2026-11-09  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Read-only inspection of brand assets, manifests, logo components and theme CSS.

## 1. Confirmed brand asset locations

- `apps/meteor/public/images/logo/` contains `logo.svg`, `logo_dark.svg`, `icon.svg`, PNG logo, favicon sizes, Android icons, Apple touch icons, Microsoft tiles and Safari pinned-tab icon.
- `apps/meteor/public/favicon.ico` is a separate favicon entry.
- `apps/meteor/public/images/manifest.json` currently identifies the product as Rocket.Chat and references PWA icons.
- `apps/meteor/public/manifest.webapp` contains the current product name, description and developer identity.
- `packages/logo/` exports `RocketChatLogo` and `TaggedRocketChatLogo` React components. The package README describes them as Rocket.Chat-specific logo components.

## 2. Theme and styling locations

- Global CSS entry: `apps/meteor/client/styles/main.css`.
- Existing global variables: `apps/meteor/client/styles/imports/general/variables.css`.
- Theme wrapper: `apps/meteor/client/components/AppLayoutThemeWrapper.tsx`.
- The theme wrapper applies Fuselage light/dark palette tokens. YasChat styling should use this architecture rather than replacing the design system wholesale.

The inspected legacy CSS variables include Rocket.Chat red/yellow/green values and layout sizing variables. The application also uses Fuselage tokens, so a brand palette must be mapped carefully to both current and legacy styling.

## 3. Safe branding implementation plan — not yet applied

1. Create original YasChat logo assets in SVG and PNG; do not simply recolor or redistribute the Rocket.Chat logo as the new brand.
2. Prepare light/dark logo variants, app icon, favicon, Android/PWA icons, Apple touch icon and Safari pinned-tab asset.
3. Update product name, short name, description and icon paths in both manifests only after the new assets and served URLs are verified.
4. Inspect every logo component usage before replacing or wrapping `@rocket.chat/logo`; keep upstream behavior where needed by integrations.
5. Define YasChat light/dark tokens through existing Fuselage palette and CSS variable architecture.
6. Rebrand login, registration, sidebar, top navigation, room header and empty/loading/error states consistently.
7. Preserve accessible names, contrast, RTL layout and reduced-motion behavior.

## 4. Risks and checks still required

- A complete search of user-visible Rocket.Chat product-name references has not yet been completed.
- Dynamic server branding settings and generated theme CSS still require inspection.
- Logo package usage across all workspaces needs a complete reference map.
- PWA icon paths need verification against build output.
- No visual regression, accessibility or browser tests have been run.
- No upstream asset has been replaced in this audit.

## 5. Verification status

This report records source-path and manifest inspection only. No application source, logo, manifest or CSS file was modified. No build, lint, typecheck or test command was executed.
