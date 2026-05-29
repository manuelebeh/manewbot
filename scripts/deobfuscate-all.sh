#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_BASE="/tmp/manewbot-deobfuscate"
SKIP=(
  "$ROOT/events/connection.js"
  "$ROOT/lib/commands.js"
  "$ROOT/events/index.js"
)

rm -rf "$OUT_BASE"
mkdir -p "$OUT_BASE"

ok=0
fail=0

while IFS= read -r file; do
  skip=0
  for s in "${SKIP[@]}"; do
    if [[ "$file" == "$s" ]]; then skip=1; break; fi
  done
  [[ $skip -eq 1 ]] && continue

  rel="${file#$ROOT/}"
  out_dir="$OUT_BASE/$(dirname "$rel")"
  rm -rf "$out_dir"
  mkdir -p "$out_dir"

  if npx --yes webcrack -f "$file" -o "$out_dir" 2>/dev/null; then
    deob="$out_dir/deobfuscated.js"
    if [[ -f "$deob" ]]; then
      cp "$deob" "$file"
      echo "OK  $rel"
      ok=$((ok + 1))
    else
      echo "MISS $rel"
      fail=$((fail + 1))
    fi
  else
    echo "FAIL $rel"
    fail=$((fail + 1))
  fi
done < <(find "$ROOT" -name '*.js' \
  -not -path '*/node_modules/*' \
  -not -path '*/packages/*' \
  -not -path '*/auth/*' \
  -not -path '*/scripts/*' \
  -exec sh -c 'head -c 60 "$1" | grep -q "_0x"' _ {} \; -print)

echo "--- done: $ok ok, $fail failed ---"
