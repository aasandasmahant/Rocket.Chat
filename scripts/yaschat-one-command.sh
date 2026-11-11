#!/usr/bin/env bash
set -Eeuo pipefail

# YasChat single-command engineering gate.
# Safe by default: never deletes files, never force-pushes, never touches develop.
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT" ]]; then
  echo "ERROR: Run this from inside the Rocket.Chat repository checkout." >&2
  exit 2
fi
cd "$ROOT"

EXPECTED_BRANCH="yaschat/phase-1-foundation"
CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]]; then
  echo "ERROR: Expected branch '$EXPECTED_BRANCH'; found '$CURRENT_BRANCH'. No changes made." >&2
  exit 2
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree is not clean. Commit or safely stash existing work first." >&2
  git status --short
  exit 2
fi

node --version
if ! node -e 'const [a,b,c]=process.versions.node.split(".").map(Number); const ok=(a===22 && (b>22 || (b===22 && c>=3))) || (a===24 && (b>15 || (b===15 && c>=0))); if(!ok){console.error("Node must satisfy >=22.22.3 <23 or >=24.15.0 <25");process.exit(1)}'; then
  exit 2
fi

corepack enable
yarn --version
if [[ "$(yarn --version)" != "4.18.1" ]]; then
  echo "ERROR: This repository requires Yarn 4.18.1." >&2
  exit 2
fi

echo "== YasChat Gate: immutable dependency install =="
yarn install --immutable

echo "== YasChat Gate: documentation link check =="
yarn docs:check-links

echo "== YasChat Gate: lint =="
yarn lint

echo "== YasChat Gate: unit tests =="
yarn testunit

if [[ "${YASCHAT_RUN_FULL_BUILD:-1}" == "1" ]]; then
  echo "== YasChat Gate: full monorepo build =="
  yarn build
else
  echo "Full build skipped because YASCHAT_RUN_FULL_BUILD is not 1."
fi

echo "== YasChat Gate: final repository status =="
git status --short
echo "PASS: all requested YasChat engineering gates completed."
