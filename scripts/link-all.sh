#!/usr/bin/env bash
# One-shot orchestrator: build @augno/ui, publish via yalc, and link into both
# dashboard and public-docs consumers.
#
# Prerequisite: the augno/core monorepo is checked out with dashboard/ and
# public-docs/ as sibling directories of ui/.

set -e
UI_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MONOREPO_ROOT="$(cd "$UI_ROOT/.." && pwd)"
DASHBOARD_ROOT="$MONOREPO_ROOT/dashboard"
PUBLIC_DOCS_ROOT="$MONOREPO_ROOT/public-docs"

if [ ! -d "$DASHBOARD_ROOT" ]; then
  echo "Expected sibling directory not found: $DASHBOARD_ROOT" >&2
  exit 1
fi
if [ ! -d "$PUBLIC_DOCS_ROOT" ]; then
  echo "Expected sibling directory not found: $PUBLIC_DOCS_ROOT" >&2
  exit 1
fi

echo "[1/3] Building and publishing @augno/ui to yalc store..."
cd "$UI_ROOT" && bun run yalc:publish

echo "[2/3] Linking into dashboard/..."
"$DASHBOARD_ROOT/scripts/ui-link.sh"

echo "[3/3] Linking into public-docs/..."
"$PUBLIC_DOCS_ROOT/scripts/ui-link.sh"

echo ""
echo "@augno/ui is now yalc-linked in dashboard and public-docs."
echo "  Continuous rebuild: cd ui && bun run yalc:watch"
echo "  Teardown:           cd ui && bun run unlink:all"
