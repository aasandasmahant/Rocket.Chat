# YasChat — Client UI and Localization Audit Addendum

Date: 2026-11-09
Repository: aasandasmahant/Rocket.Chat
Branch: yaschat/phase-1-foundation
Scope: read-only inspection of client entry, navigation/layout, styling, and localization.

## 1. Confirmed client entry and build path
- apps/meteor/vite/index.html contains the client mount point #react-root and loads entry.ts.
- apps/meteor/vite/entry.ts imports client/styles/main.css and then client/main.
- apps/meteor/client/main.ts initializes Meteor client startup, login, and lazy-loads core views including admin, marketplace, and account.
- apps/meteor/client/meteorShell.ts is not the main React UI; it is intentionally an empty Meteor shell while Vite supplies the actual web client.
- YasChat branding must be designed around the Vite client and React layout, not by replacing the Meteor shell.

## 2. Existing UI extension points found
- Main application wrapper: apps/meteor/client/views/root/AppLayout.tsx.
- Main authenticated layout: apps/meteor/client/views/root/MainLayout/MainLayout.tsx.
- Sidebar layout: apps/meteor/client/views/root/MainLayout/LayoutWithSidebar.tsx.
- Top navigation: apps/meteor/client/navbar/NavBar.tsx.
- Sidebar: apps/meteor/client/sidebar/Sidebar.tsx.
- Theme wrapper: apps/meteor/client/components/AppLayoutThemeWrapper.tsx.
- Global CSS entry: apps/meteor/client/styles/main.css.
- Global CSS variables: apps/meteor/client/styles/imports/general/variables.css.

Recommendation: implement brand identity through existing theme tokens, supported settings, logo/asset locations, and navigation composition. Avoid rewriting the root app layout because it coordinates authentication, analytics, notifications, desktop integration, route loading, and other platform behavior.

## 3. Existing localization infrastructure
- Client localization is managed by apps/meteor/client/providers/TranslationProvider.tsx.
- It uses i18next and react-i18next, browser-language detection, server settings, a language list from @rocket.chat/i18n, and custom translation support.
- It sets document lang and dir attributes and includes RTL-script handling.
- Locale resources are loaded from the existing /i18n route and cached client-side.
- packages/i18n is a dedicated workspace package with language resources and scripts to build/check translation files.
- This supports interface localization; it is not an automatic user-message translation engine. Message translation needs a separate provider-neutral service, privacy/consent rules, quotas, caching, and a UI control that preserves the original message.

## 4. Relevant existing workspaces
- packages/fuselage-ui-kit
- packages/ui-kit
- packages/ui-client
- packages/ui-contexts
- packages/ui-account
- packages/ui-composer
- packages/ui-avatar
- packages/i18n

Reuse these where appropriate rather than introducing a duplicate component system.

## 5. Branding change plan — proposed, not applied
1. Inspect existing logo/favicon/manifest assets and all Rocket.Chat brand references.
2. Identify supported server branding settings and theme CSS variables.
3. Define YasChat design tokens for light/dark themes, responsive layout rules, and logo variants.
4. Replace brand assets and user-facing product labels only at approved extension points.
5. Adjust navigation labels/sections after mapping routes and permissions.
6. Add tests for layout, accessibility, mobile widths, and RTL behavior.
7. Run client lint/build and targeted tests before marking branding complete.

## 6. Translation architecture recommendation
- Keep interface localization (@rocket.chat/i18n) separate from user-generated message translation.
- Define a provider-neutral translateText interface with text, sourceLanguage, and targetLanguage inputs.
- Preserve original text; store or render translated output separately with language and provider metadata.
- Add per-user and per-message controls, opt-in/opt-out, rate limits, caching, failure fallback, and a clear translated label.
- Begin with a small quality-tested language set. Expand only after evaluation; do not claim 200+ working languages until verified.

## 7. Files/directories inspected
- apps/meteor/client/main.ts
- apps/meteor/client/README.md
- apps/meteor/vite/entry.ts
- apps/meteor/vite/index.html
- apps/meteor/vite/vite.config.mts
- apps/meteor/client/views/root/AppLayout.tsx
- apps/meteor/client/views/root/MainLayout/MainLayout.tsx
- apps/meteor/client/components/AppLayoutThemeWrapper.tsx
- apps/meteor/client/navbar/NavBar.tsx
- apps/meteor/client/sidebar/Sidebar.tsx
- apps/meteor/client/providers/TranslationProvider.tsx
- apps/meteor/client/styles/main.css
- apps/meteor/client/styles/imports/general/variables.css
- packages/i18n/package.json
- Directory listings for client views, navigation, sidebar, providers, styles, public assets, Vite files, and relevant UI packages.

## 8. Remaining audit tasks
- Inspect actual logo, favicon, manifest, and product-name references.
- Inspect theme settings and server-side theme.css generation/configuration.
- Map route/navigation registration and identify safe YasChat entry points.
- Check language resource count and translation contribution workflow.
- Continue CE/EE path checks and establish build/test baseline in a suitable environment.
- Produce a precise file-by-file change plan before editing application code.

## Status
The client UI entry path, key layout/navigation components, theme wrapper, CSS entry, and existing interface-localization infrastructure are identified. No application source code was modified and no build/test command was executed in this pass.