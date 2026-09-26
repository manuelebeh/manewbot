# Secrets dans l'historique Git

Un `.env.example` ne ferme pas les alertes GitHub Secret Scanning.
GitHub lit aussi tout l'historique des commits.

## Si une clé a fuité (TELEGRAM_BOT_TOKEN, AIza…, etc.)

1. Révoque la clé chez le fournisseur (BotFather → `/revoke`, console Google, …).
2. Mets la nouvelle valeur dans ton `.env` local. Ne committe jamais `.env`.
3. Purge l'historique avec [git-filter-repo](https://github.com/newren/git-filter-repo) :

```bash
# Fichier de remplacements (ne pas le committer) :
#   ANCIEN_SECRET==>REDACTED
pip install git-filter-repo   # ou: brew install git-filter-repo
git filter-repo --force --replace-text /chemin/vers/replacements.txt
```

4. Force-push seulement si tout le monde sur le repo est d'accord :

```bash
git push --force origin main
```

5. Sur GitHub → Security → Secret scanning, ferme les alertes
   (`Revoked` ou `Fixed`).

## Vérifications locales

```bash
npm run check:secrets
npm test
git check-ignore -v .env auth/
# Pas de token Telegram / clé Google en clair dans l'historique :
git rev-list --all | while read c; do
  git grep -E '[0-9]{8,12}:[A-Za-z0-9_-]{30,}|AIza[0-9A-Za-z_-]{35,}' "$c" -- '*.js' 2>/dev/null
done
```
