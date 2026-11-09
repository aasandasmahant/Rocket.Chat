# YasChat Authentication and Account Flow Audit

**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Read-only inspection of sign-in, registration, email verification, password recovery and related tests.

## 1. Sign-in screen

- `apps/meteor/client/views/root/MainLayout/LoginPage.tsx` renders `RegistrationRoute` from `@rocket.chat/web-ui-registration`.
- It supports an optional forced-logout banner and iframe-based login handoff.
- The actual sign-in/register/forgot-password forms are therefore primarily in the shared `@rocket.chat/web-ui-registration` package, not implemented directly in `LoginPage.tsx`.
- `apps/meteor/client/lib/loginServices.ts` loads enabled external login providers from `/v1/service.configurations`; known provider presentation includes Apple, Google, GitHub, GitLab and Nextcloud.
- `apps/meteor/client/meteor/login/password.ts` handles password login and TOTP-aware login override.
- `apps/meteor/client/meteor/login/index.ts` registers CAS, LDAP, password and SAML client login handlers.

## 2. Registration and username setup

- `apps/meteor/server/meteor-methods/users/registerUser.ts` is the server-side registration method.
- It checks whether registration is disabled, public or secret-URL-only; validates invite/secret URL, password policy and email domain; creates the user and attempts to send a verification email.
- `apps/meteor/client/views/root/MainLayout/RegisterUsername.tsx` is a post-login username/custom-fields step. It is not the complete public sign-up form.
- `apps/meteor/tests/e2e/register.spec.ts` exercises required fields, password confirmation, successful registration, manual approval and disabled registration.

## 3. Password recovery and email verification

- `apps/meteor/server/meteor-methods/auth/sendForgotPasswordEmail.ts` normalizes email, looks up the account and handles OAuth-only accounts according to the password-change setting before requesting a reset email.
- `apps/meteor/client/meteor/startup/accounts.ts` handles email-verification links and displays success/error notifications.
- `apps/meteor/tests/e2e/forgot-password.spec.ts` covers empty/invalid email validation and successful recovery callout.
- The repository also contains `apps/meteor/tests/e2e/reset-password.spec.ts`; inspect this during implementation before changing reset flow.

## 4. Session and security behavior

- `apps/meteor/client/meteor/accounts.ts` manages login lifecycle, stored session tokens, token expiry, reconnect and logout behavior.
- `apps/meteor/client/views/account/security/AccountSecurityRoute.tsx` gates security settings based on two-factor, end-to-end encryption and password-change settings.
- `apps/meteor/client/views/root/SAMLLoginRoute.tsx` performs one-time SAML token handoff, including desktop/mobile deep-link support.
- `apps/meteor/client/views/root/LoginTokenRoute.tsx` handles token-based login routing.
- Existing authentication modes and session protections must be preserved unless there is an explicit product decision to remove one.

## 5. YasChat implementation recommendations

1. Rebrand the shared registration package through its supported theme, logo, background and translation interfaces; do not duplicate or fork the whole authentication system without need.
2. Apply YasChat name, logo, colors, typography and privacy/terms links consistently to sign-in, sign-up, forgot-password, reset-password and verification states.
3. Keep registration policy configurable: public, invite/secret URL or disabled; do not hard-code open registration.
4. Preserve password policy, email-domain validation, email verification, manual approval, rate limiting, TOTP/2FA, OAuth/SSO and secure token expiry.
5. Add YasChat-specific onboarding fields only after defining data minimization, consent and server validation.
6. Add tests for all registration modes, verification/reset links, provider login, 2FA, session expiry and accessibility.

## 6. Open implementation dependency

The actual form components are imported from `@rocket.chat/web-ui-registration`. Before making UI changes, inspect that package and its license/ownership boundaries, plus the server settings and tests that govern account registration. This audit has identified the integration point but is not yet a complete component-level audit of that package.

## 7. Verification status

- Source files and E2E test paths listed above were fetched from the dedicated branch.
- This report is documentation only; no application source or auth behavior was modified.
- No build, lint, typecheck or E2E tests were run.
