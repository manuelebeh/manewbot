#!/usr/bin/env bash
# Vérifie que les secrets ne sont pas suivis par git (CI / déploiement).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

for pattern in '.env' 'auth/' 'config_env.json' 'backups/'; do
  if ! git check-ignore -q "$pattern" 2>/dev/null; then
    echo "ERREUR : $pattern n'est pas ignoré par .gitignore" >&2
    fail=1
  fi
done

tracked="$(git ls-files '.env' 'auth' 'config_env.json' 'backups' 2>/dev/null || true)"
if [[ -n "$tracked" ]]; then
  echo "ERREUR : fichiers sensibles suivis par git :" >&2
  echo "$tracked" >&2
  fail=1
fi

# Working tree (tracked files only): no Telegram / Google API keys in cleartext
if tracked_hits="$(git grep -nE '[0-9]{8,12}:[A-Za-z0-9_-]{30,}|AIza[0-9A-Za-z_-]{35,}' -- '*.js' '*.json' '*.yml' '*.yaml' '*.md' '*.example' 2>/dev/null || true)" \
  && [[ -n "$tracked_hits" ]]; then
  echo "ERREUR : motif de secret détecté dans les fichiers suivis :" >&2
  echo "$tracked_hits" >&2
  fail=1
fi

if [[ $fail -ne 0 ]]; then
  exit 1
fi

echo "OK : .env, auth/, config_env.json et backups/ sont ignorés et non trackés ; pas de secret en clair tracké."
