#!/usr/bin/env bash
# Sauvegarde chiffrée de .env et auth/ (GPG symétrique).
# Usage : ./scripts/backup-secrets.sh
#         GPG_PASSPHRASE='…' ./scripts/backup-secrets.sh   # non interactif
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BASENAME="ovl-secrets-${STAMP}"
TAR_PATH="${BACKUP_DIR}/${BASENAME}.tar.gz"
GPG_PATH="${TAR_PATH}.gpg"

mkdir -p "$BACKUP_DIR"

items=()
[[ -f "$ROOT/.env" ]] && items+=(".env")
[[ -d "$ROOT/auth" ]] && items+=("auth")
[[ -f "$ROOT/config_env.json" ]] && items+=("config_env.json")

if [[ ${#items[@]} -eq 0 ]]; then
  echo "Rien à sauvegarder (.env, auth/, config_env.json absents)." >&2
  exit 1
fi

echo "Archive : ${items[*]}"
tar -czf "$TAR_PATH" -C "$ROOT" "${items[@]}"

if command -v gpg >/dev/null 2>&1; then
  if [[ -n "${GPG_PASSPHRASE:-}" ]]; then
    gpg --batch --yes --symmetric --cipher-algo AES256 \
      --passphrase "$GPG_PASSPHRASE" -o "$GPG_PATH" "$TAR_PATH"
  else
    gpg --symmetric --cipher-algo AES256 -o "$GPG_PATH" "$TAR_PATH"
  fi
  rm -f "$TAR_PATH"
  echo "Sauvegarde chiffrée : $GPG_PATH"
  echo "Restauration : gpg -d $GPG_PATH | tar -xzf - -C $ROOT"
else
  echo "gpg introuvable — archive non chiffrée laissée sur disque : $TAR_PATH" >&2
  echo "Installez gpg ou chiffrez manuellement avant stockage distant." >&2
  exit 2
fi
