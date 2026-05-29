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

if [[ $fail -ne 0 ]]; then
  exit 1
fi

echo "OK : .env, auth/, config_env.json et backups/ sont ignorés et non trackés."
