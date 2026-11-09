# YasChat Stage 12 — Initial License Boundary and PEM Fixture Review

**Date:** 2026-11-09  
**Repository:** `aasandasmahant/Rocket.Chat`  
**Branch:** `yaschat/phase-1-foundation`  
**Scope:** Read the repository's top-level license, Enterprise license, Livechat license, and classify tracked PEM file headers and paths. This is not a complete legal or dependency-license audit.

## 1. Top-level license boundary — verified

The root `LICENSE` states:
- Content under `apps/meteor/ee/` and `ee/` is governed by `apps/meteor/ee/LICENSE`, subject to the terms and exceptions in that license.
- Third-party components retain their original upstream licenses.
- Content outside the stated restricted directories/other restrictions is generally available under MIT Expat.

The Enterprise license states that the covered EE software has subscription restrictions for production and distribution, while also specifying exceptions for portions distributed as Community Edition or served client-side as specified in that license. This requires file-level interpretation; directory membership alone is not sufficient to determine the rights for every individual file.

The inspected `packages/livechat/LICENSE` is MIT. This does not establish that every dependency or every file used by Livechat is MIT.

## 2. PEM file classification — verified by path and PEM header only

Ten tracked PEM files were found:

### Federation Matrix local Docker/Traefik certificate set
- `ee/packages/federation-matrix/docker-compose/traefik/certs/element-key.pem`
- `ee/packages/federation-matrix/docker-compose/traefik/certs/element.pem`
- `ee/packages/federation-matrix/docker-compose/traefik/certs/hs1-key.pem`
- `ee/packages/federation-matrix/docker-compose/traefik/certs/hs1.pem`
- `ee/packages/federation-matrix/docker-compose/traefik/certs/rc1-key.pem`
- `ee/packages/federation-matrix/docker-compose/traefik/certs/rc1.pem`

### XMPP server test fixtures
- `ee/packages/xmpp-server/tests/fixtures/a.localhost.cert.pem`
- `ee/packages/xmpp-server/tests/fixtures/a.localhost.key.pem`
- `ee/packages/xmpp-server/tests/fixtures/b.localhost.cert.pem`
- `ee/packages/xmpp-server/tests/fixtures/b.localhost.key.pem`

Header inspection classified six files as private-key PEMs and four as certificate PEMs. The key material itself is intentionally not reproduced in this report.

**Risk interpretation:** these paths strongly suggest local demo/test certificate fixtures, not production credentials. That inference is not proof. They must never be copied into a production deployment or reused as YasChat secrets. Confirm the compose/test references and whether the keys are publicly documented fixtures before deciding whether to keep or replace them.

## 3. Actions taken

- Read the root MIT license text and Enterprise license text.
- Read the Livechat package license text.
- Identified all ten PEM paths and classified their PEM header type.
- Did not output or copy private-key material.
- Did not delete or modify any source, license or PEM file.

## 4. Still required

1. Inspect package manifests and dependency metadata for each exact package proposed for reuse.
2. Generate a full third-party dependency license inventory from the resolved Yarn lockfile / installed dependency tree.
3. Review all candidate imports against CE/EE boundaries and notices.
4. Confirm the PEM fixtures are only local/test fixtures and run a history-aware secret scan.
5. Review the full EE license and applicable third-party licenses with qualified legal review before commercial distribution.
6. Do not use EE-only code in the distributable YasChat product unless the applicable rights explicitly permit it.

## 5. Decision for YasChat

Use only verified MIT/appropriately licensed Community Edition code and original YasChat code for the distributable baseline. Prefer building new features in clearly separated community-safe modules. Do not copy EE-only implementation into those modules. Keep attribution and notices for all reused upstream and third-party components.

## 6. Completion status

Initial root/EE/Livechat license boundary review and PEM path/header classification are complete. Complete package/dependency licensing, legal review, compose/test reference confirmation and history-aware secret scanning remain open. No application source code was changed.
