#!/usr/bin/env bash
# PreToolUse hook (Edit|Write|MultiEdit): advisory protection for acceptance
# tests and the guardrail scripts themselves.
#
# IMPORTANT LIMITATION: this is defense-in-depth, NOT real enforcement. A builder
# with unrestricted repo access can edit or disable this hook. Real protection is
# GitHub branch protection + required checks + CODEOWNERS on the protected paths.
# To intentionally edit a protected path, create the sentinel file first:
#   touch .claude/ALLOW_PROTECTED_EDITS   (git-ignored)
# make the reviewed change, then remove it.
set -euo pipefail

input=$(cat)
path=$(printf '%s' "$input" | python3 -I -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null || true)
[ -z "$path" ] && exit 0

case "$path" in
  */tests/acceptance/* | */e2e/acceptance/* | */.claude/hooks/*)
    if [ ! -f ".claude/ALLOW_PROTECTED_EDITS" ]; then
      echo "BLOCKED: '$path' is a protected acceptance/guardrail path." >&2
      echo "This is an advisory check (bypassable with repo access; real enforcement is GitHub branch protection + CODEOWNERS)." >&2
      echo "To edit intentionally: 'touch .claude/ALLOW_PROTECTED_EDITS', make the reviewed change, then remove the sentinel." >&2
      exit 2
    fi
    ;;
esac

exit 0
