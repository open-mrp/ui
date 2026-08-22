#!/usr/bin/env bash
# One-shot teardown: restore dashboard and public-docs @openmrp/ui deps to the
# latest published GitHub Packages version and remove all yalc artefacts.
#
# Run this before committing — ensures no file:.yalc/... refs or .yalc/ state
# leaks into either consumer.

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

echo "Unlinking @openmrp/ui from dashboard/..."
"$DASHBOARD_ROOT/scripts/ui-unlink.sh"

echo "Unlinking @openmrp/ui from public-docs/..."
"$PUBLIC_DOCS_ROOT/scripts/ui-unlink.sh"

echo ""
echo "@openmrp/ui yalc link removed from dashboard and public-docs."
