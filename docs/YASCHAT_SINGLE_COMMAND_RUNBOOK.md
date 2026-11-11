# YasChat — Single-command continuation

## What is already present
- Work is isolated on `yaschat/phase-1-foundation`; keep `develop` untouched.
- Product and architecture requirements are documented in `docs/YASCHAT_MASTER_PLAN.md`.
- Initial YasChat SVG marks and PWA manifest updates are recorded in that plan.
- Existing Rocket.Chat messaging and translation capabilities are to be reused, not rewritten.
- Product catalogue, affiliate attribution, ad serving and revenue-sharing are not yet implemented.

## One-command quality gate
Run from the repository root, on a clean checkout of `yaschat/phase-1-foundation`, using Node 24.15.0 and Corepack/Yarn 4.18.1:

```bash
bash scripts/yaschat-one-command.sh
```

The command checks the branch and clean working tree, verifies the toolchain, installs dependencies immutably, checks documentation links, runs lint and unit tests, and runs the full monorepo build. It does not delete files, rewrite history, push commits, or merge branches.

To skip only the full build while diagnosing lint/unit-test failures:

```bash
YASCHAT_RUN_FULL_BUILD=0 bash scripts/yaschat-one-command.sh
```

## Cloud execution
GitHub Actions workflow: `.github/workflows/yaschat-ci.yml`. Open the repository's Actions tab, select **YasChat engineering gate**, choose **Run workflow**, and run it on `yaschat/phase-1-foundation`. The full build can be toggled.

## Resource and safety notes
- Do not run the full Rocket.Chat monorepo install/build on a 4 GB Android phone; use a cloud runner.
- A passing quality gate proves only the commands that actually completed. It does not prove production readiness, legal compliance, payment processing, network approval, or deployment safety.
- Never commit API keys, affiliate credentials, ad-network secrets, private keys, service-account JSON, or real user data.
- Keep Enterprise Edition code and assets out of redistributed YasChat builds unless the required rights are confirmed.
- Never remove upstream files simply to make the repository smaller. Any deletion requires dependency analysis and tests.

## Next implementation sequence
1. Establish the clean cloud baseline and fix only reproducible blockers.
2. Complete the YasChat visual identity using the supported branding/theme extension points.
3. Verify core auth, DMs, groups, channels, media, search, notifications, privacy and moderation.
4. Reuse the existing translation providers; add YasChat-specific UX and privacy controls only where missing.
5. Add product catalogue/provider adapters and source-freshness metadata.
6. Add affiliate click attribution and a transparent 30% eligible-commission ledger, subject to network terms.
7. Add admin-managed ad inventory, disclosure, consent, frequency caps and reporting.
8. Add referral, creator earnings, payout review, audit logs and abuse controls.
9. Add integration/E2E, accessibility, performance, security, backup/restore and release gates.

**Important:** this is the one-command setup and quality-gate foundation, not a claim that all commerce, ads, payouts or production features are already implemented.
