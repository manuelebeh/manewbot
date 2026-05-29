# Secrets dans l'historique Git

Si `.env`, `TELEGRAM_BOT_TOKEN` ou une clé API a été commitée un jour :

1. **Révoquer** la clé côté fournisseur (BotFather, console cloud, etc.).
2. **Remplacer** la valeur dans `.env` local (jamais committer).
3. **Purger l'historique** (exemple avec [git-filter-repo](https://github.com/newren/git-filter-repo)) :

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# ou remplacer une chaîne : git filter-repo --replace-text <(echo 'ANCIEN_TOKEN==>REDACTED')
```

4. **Force-push** uniquement après accord de l'équipe : `git push --force origin main`

Vérifications :

```bash
npm run check:secrets
npm test
git check-ignore -v .env auth/
```
