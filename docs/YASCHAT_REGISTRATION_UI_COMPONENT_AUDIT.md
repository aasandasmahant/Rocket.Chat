# YasChat Registration UI Component Audit

**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Shared web registration UI package; read-only source inspection.

## 1. Main integration

The application login page at `apps/meteor/client/views/root/MainLayout/LoginPage.tsx` mounts `RegistrationRoute` from `@rocket.chat/web-ui-registration`. The package is a private workspace package at `packages/web-ui-registration`, with its own TypeScript build, lint and typecheck scripts.

## 2. Screen routing

`packages/web-ui-registration/src/RegistrationPageRouter.tsx` routes between guest access, login, reset-password, secret/public/invite registration and anonymous content. It wraps screens in `RegisterTemplate`, which selects the configured horizontal or vertical template.

## 3. Components confirmed

- `LoginForm.tsx`: username/email and password login, error presentation, reset-password navigation and login provider component.
- `RegisterForm.tsx`: name, email, username, password and optional password confirmation; uses password validation, account custom fields and registration hook.
- `ResetPasswordForm.tsx`: email validation and forgot-password instruction request.
- `EmailConfirmationForm.tsx`: resend email-verification instructions.
- `LoginServices.tsx` and `LoginServicesButton.tsx`: external login providers, respecting enabled service configuration.
- `RegisterTemplate.tsx`, `template/HorizontalTemplate.tsx`, `template/VerticalTemplate.tsx`: shared layout and presentation.
- `components/LoginTerms.tsx`: terms content comes from a setting and is sanitized with DOMPurify.
- `ResetPassword/ResetPasswordPage.tsx` and `ResetPasswordForm.tsx`: reset-password experience.

## 4. Safe YasChat customization points

1. Use existing layout settings and template components for the first visual rebrand.
2. Replace logo/background through the supported asset settings rather than embedding Rocket.Chat assets in form components.
3. Update translation resources for product naming and all visible auth labels; do not hard-code strings in JSX.
4. Keep registration modes, password rules, email confirmation, manual approval and OAuth/SSO provider behavior server-configurable.
5. Keep terms/privacy content sanitized; add YasChat legal links only after the actual policy URLs and text are supplied/approved.
6. Add brand-specific onboarding as separate components or optional custom fields with server validation and privacy review.

## 5. License and build boundary

The package metadata marks it private and workspace-managed; this alone does not establish the license for distribution. Review root and package-specific notices and dependencies before releasing modified binaries. The package scripts expose build, lint and typecheck tasks, but none were executed in this audit.

## 6. Verification status

- Representative source components were fetched from `yaschat/phase-1-foundation`.
- No package source files were changed.
- No build, lint, typecheck, unit or browser tests were run.
