#!/usr/bin/env bash
# SessionStart hook: surface current project status into context.
set -uo pipefail

echo "=== CivicTrail session context ==="
if [ -f docs/ai-log.md ]; then
  echo
  echo "## Recent decisions (docs/ai-log.md, last 30 lines)"
  tail -n 30 docs/ai-log.md
fi
if [ -f FEATURES.md ]; then
  echo
  echo "## Outstanding tasks (unchecked items in FEATURES.md)"
  grep -nE '^\s*- \[ \]' FEATURES.md | head -25 || echo "(none found)"
fi
exit 0
