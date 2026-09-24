# Secrets dans l'historique Git

Un fichier `.env.example` **ne suffit pas** à faire disparaître les alertes
GitHub Secret Scanning : GitHub scanne aussi **tout l'historique** des commits.

## Si une clé a fuité (TELEGRAM_BOT_TOKEN, AIza…, etc.)

1. **Révoquer** immédiatement la clé côté fournisseur
   (BotFather → `/revoke`, Google Cloud Console, etc.).
2. **Remplacer** la valeur dans `.env` local (jamais committer `.env`).
3. **Purger l'historique** avec [git-filter-repo](https://github.com/newren/git-filter-repo) :

```bash
# Créer un fichier de remplacements (ne pas le committer) :
#   ANCIEN_SECRET==>REDACTED
pip install git-filter-repo   # ou brew install git-filter-repo
git filter-repo --force --replace-text /chemin/vers/replacements.txt
```

4. **Force-push** uniquement après accord explicite :

```bash
git push --force origin main
```

5. Sur GitHub → Security → Secret scanning : fermer les alertes
   (`Revoked` / `Fixed` selon le cas).

## Vérifications locales

```bash
npm run check:secrets
npm test
git check-ignore -v .env auth/
# Aucun token Telegram / clé Google en clair dans l'historique :
git rev-list --all | while read c; do
  git grep -E '[0-9]{8,12}:[A-Za-z0-9_-]{30,}|AIza[0-9A-Za-z_-]{35,}' "$c" -- '*.js' 2>/dev/null
done
```
