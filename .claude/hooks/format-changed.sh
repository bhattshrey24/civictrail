#!/usr/bin/env bash
# PostToolUse hook (Edit|Write|MultiEdit): run Prettier on the changed file only.
# Targeted (not a full test suite) so it stays cheap. Never fails the tool call.
set -uo pipefail

input=$(cat)
path=$(printf '%s' "$input" | python3 -I -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null || true)
[ -z "$path" ] && exit 0
[ -f "$path" ] || exit 0

case "$path" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.css | *.json | *.md)
    export PATH="$HOME/.local/bin:$PATH"
    if command -v pnpm >/dev/null 2>&1; then
      pnpm exec prettier --write "$path" >/dev/null 2>&1 || true
    fi
    ;;
esac

exit 0
