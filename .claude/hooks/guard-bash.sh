#!/usr/bin/env bash
# PreToolUse hook (Bash): block clearly destructive commands.
# Deterministic guardrail. Exit 2 blocks the tool call and returns the message.
set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | python3 -I -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)

block() {
  echo "BLOCKED by guard-bash: $1" >&2
  exit 2
}

case "$cmd" in
  *"rm -rf /"* | *"rm -rf ~"* | *"rm -rf /home"* | *":(){ :|:& };:"*)
    block "destructive filesystem command" ;;
esac

if printf '%s' "$cmd" | grep -Eq 'git +push.*(--force|-f)\b' \
  && printf '%s' "$cmd" | grep -Eq '(\bmain\b|\bmaster\b)'; then
  block "force-push to a protected branch (main/master)"
fi

if printf '%s' "$cmd" | grep -Eiq 'drop +database|drop +schema +public|truncate +.*cascade'; then
  block "destructive database command"
fi

exit 0
