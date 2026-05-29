<h1 align="center">Manewbot</h1>

<p align="center">
    Un bot WhatsApp multi-appareil. N'oubliez pas de laisser une star pour le projet.
</p>

<p align="center">
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="MIT License" />
    </a>
    <a href="https://github.com/WhiskeySockets/Baileys">
        <img src="https://img.shields.io/badge/Baileys-Web%20API-orange?style=flat-square" alt="Using Baileys Web API" />
    </a>
    <a href="https://github.com/manuelebeh/Manewbot/stargazers">
        <img src="https://img.shields.io/github/stars/manuelebeh/manewbot?style=flat-square" alt="Stars" />
    </a>
    <a href="https://github.com/manuelebeh/Manewbot/network/members">
        <img src="https://img.shields.io/github/forks/manuelebeh/manewbot?style=flat-square" alt="Forks" />
    </a>
</p>

---

<details>
  <summary>Déploiement de Manewbot</summary>

### Étape 1 : Fork du dépôt GitHub  
[![Fork GitHub](https://img.shields.io/badge/Fork%20le%20Repo-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/manuelebeh/manewbot/fork)

---

### Étape 2 : Appairage WhatsApp (session locale)

L'authentification se fait entièrement en local via un QR code Baileys :

1. Lancez le bot pour la première fois : `node bot.js`
2. Un QR code s'affiche dans le terminal
3. Sur WhatsApp > **Appareils connectés** > **Connecter un appareil**, scannez le QR
4. Les credentials sont sauvegardés dans `auth/principale/`

Au redémarrage suivant, le bot se reconnecte automatiquement sans QR.

---

### Étape 3 : Créer une base de données  (au choix)
[![Créer Base de Données](https://img.shields.io/badge/Supabase-Base%20de%20donn%C3%A9es-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

### Étape 4 : Méthodes de déploiement

#### <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" height="28" />
- Créez un compte : [Lien Heroku](https://signup.heroku.com/)
- Déploiement rapide : [Déployer sur Heroku](https://dashboard.heroku.com/new?template=https://github.com/manuelebeh/manewbot)

#### <img src="https://img.shields.io/badge/Render-12100E?style=for-the-badge&logo=render&logoColor=white" height="28" />
- Créez un compte : [Lien Render](https://dashboard.render.com/register)
- Déploiement rapide : [Déployer sur Render](https://dashboard.render.com/web/new)

#### <img src="https://img.shields.io/badge/Panel-grey?style=for-the-badge&logo=windows-terminal&logoColor=white" height="28" />
- Créez un serveur
- Ajoutez le fichier `index.js` ou `main.js`
- Démarrez le bot

#### <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" height="28" />
- Ajoutez un fichier `.env`
- Créez le fichier `.github/workflows/deploy.yml`

</details>

---

<details>
  <summary>Fichier index.js ou main.js pour déploiement sur panel</summary>

```js
const { spawnSync, spawn } = require('child_process');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

// Ajoutez ici vos variables d'environnement
const env_file = ``;

if (!env_file.trim()) {
  console.error("'env_file' est vide. Veuillez renseigner vos variables d'environnement avant de lancer le script.");
  process.exit(1);
}

let crashCount = 0;
const crashLimit = 5;
let lastCrashTime = Date.now();
const crashResetDelay = 30000;

function setupProject() {
  if (!existsSync('manewbot')) {
    const clone = spawnSync('git', ['clone', 'https://github.com/manuelebeh/manewbot', 'manewbot'], { stdio: 'inherit' });
    if (clone.status !== 0) process.exit(1);
  }

  if (!existsSync('manewbot/.env')) {
    mkdirSync('manewbot', { recursive: true });
    writeFileSync('manewbot/.env', env_file);
    console.log("Fichier .env créé avec succès.");
  }

  const install = spawnSync('npm', ['install'], { cwd: 'manewbot', stdio: 'inherit' });
  if (install.status !== 0) process.exit(1);
}

function validateSetup() {
  if (!existsSync('manewbot/package.json')) {
    process.exit(1);
  }

  const check = spawnSync('npm', ['ls'], { cwd: 'manewbot', stdio: 'ignore' });

  if (check.status !== 0) {
    const reinstall = spawnSync('npm', ['install'], { cwd: 'manewbot', stdio: 'inherit' });
    if (reinstall.status !== 0) {
      process.exit(1);
    }
  }
}

function launchApp() {
  const pm2 = spawn('npx', ['pm2', 'start', 'bot.js', '--name', 'manewbot', '--attach'], {
    cwd: 'manewbot',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let restartAttempts = 0;

  pm2.stdout?.on('data', (chunk) => {
    const output = chunk.toString();
    console.log(output);
    if (output.includes('Connexion') || output.includes('ready')) {
      restartAttempts = 0;
    }
  });

  pm2.stderr?.on('data', (chunk) => {
    const output = chunk.toString();
    if (output.includes('restart')) {
      restartAttempts++;
      if (restartAttempts > 3) {
        spawnSync('npx', ['pm2', 'delete', 'manewbot'], { cwd: 'manewbot', stdio: 'inherit' });
        startNodeFallback();
      }
    }
  });

  pm2.on('exit', () => {
    startNodeFallback();
  });

  pm2.on('error', () => {
    startNodeFallback();
  });
}

function startNodeFallback() {
  const child = spawn('node', ['bot.js'], { cwd: 'manewbot', stdio: 'inherit' });

  child.on('exit', (code) => {
    const now = Date.now();
    if (now - lastCrashTime > crashResetDelay) crashCount = 0;
    crashCount++;
    lastCrashTime = now;

    if (crashCount > crashLimit) {
      return;
    }

    startNodeFallback();
  });
}

setupProject();
validateSetup();
launchApp();
```

</details>

---

<details>
  <summary>Fichier .github/workflows/deploy.yml</summary>

```yaml
name: Manewbot CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 */5 * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: |
          sudo apt update
          sudo apt install -y ffmpeg
          npm i
      - run: npm test
      - run: npm run check:secrets
```

Le workflow `.github/workflows/ci.yml` du dépôt exécute les tests unitaires et la vérification des secrets à chaque push.

</details>

---

<details>
  <summary>Exemple de fichier .env</summary>

```env
PREFIXE=.
NOM_OWNER=Manewbie
NUMERO_OWNER=228xxxxxxxx
MODE=private
STICKER_PACK_NAME=Manewbot
STICKER_AUTHOR_NAME=Manewbie
NOM_BOT=Manewbot
```

</details>

---

<details>
  <summary>Multi-comptes (sessions secondaires)</summary>

Pour connecter un second numéro WhatsApp :

1. Créez le dossier `auth/<numero>/` (ex: `auth/22612345678/`)
2. Lancez temporairement Baileys avec `useMultiFileAuthState('auth/<numero>')` pour scanner le QR de ce compte (ou copiez un `creds.json` déjà apparié)
3. Utilisez la commande owner pour enregistrer le numéro : `<prefixe>connect 22612345678`
4. Le bot démarrera automatiquement la session secondaire au prochain cycle de vérification

Pour retirer un compte secondaire, utilisez la commande owner correspondante. Le dossier `auth/<numero>/` sera supprimé.

</details>

---

<details>
  <summary>Rôles : owner, sudo et modération</summary>

| Rôle | Configuration | Droits |
|------|----------------|--------|
| **Owner** | `NUMERO_OWNER` dans `.env` | Commandes système (`setvar`, `update`), config sensible, immunité totale |
| **Sudo** | Commande `setsudo` (table DB) | Staff : commandes en mode privé/public, modération groupe ; seul l'owner peut kick/ban un sudo |
| **Admin WA** | Admin du groupe WhatsApp | Commandes groupe selon `verif_Admin` |
| **Membre** | — | Selon `MODE`, bans, listes public/private |

**Groupes restreints** (`RESTRICTED_GROUPS`) : seuls l'owner, les sudo et les JID de `RESTRICTED_GROUP_ALLOWLIST` peuvent utiliser le bot et les handlers passifs dans ces groupes.

**Tests locaux** : `npm test` · **CI** : `npm run check:secrets` + tests unitaires (voir `.github/workflows/ci.yml`).

### Structure des commandes

Les gros modules sont découpés en sous-dossiers (chargés via `cmd/groupe.js`, `cmd/owner.js`, etc.) :

| Dossier | Rôle |
|---------|------|
| `cmd/owner/` | Commandes propriétaire (ban, sudo, sessions, …) |
| `cmd/groupe/` | Modération et réglages de groupe |
| `cmd/conversion/` | Stickers, média, ffmpeg (`upload`, `stickers`, `image-edit`, …) |
| `cmd/outils/` | Menus, ping, capture, tempmail, … |

</details>

---

<details>
  <summary>Sécurité (VPS / panel)</summary>

### Git : `.env` et `auth/` jamais commités

Ces chemins sont dans `.gitignore` :

- `.env`, `.env.*` (sauf `.env.example`)
- `auth/` (sessions Baileys / `creds.json`)
- `config_env.json` (sauf l’exemple versionné)
- `backups/` (archives locales)

Vérification locale ou CI :

```bash
npm run check:secrets
# ou : node --test test/gitignore-secrets.test.js
```

### Sauvegardes chiffrées

Ne stockez jamais `auth/` ou `.env` en clair sur un dépôt ou un cloud non chiffré.

```bash
chmod +x scripts/backup-secrets.sh
./scripts/backup-secrets.sh
# → backups/ovl-secrets-YYYYMMDD-HHMMSS.tar.gz.gpg
```

Restauration sur le serveur : `gpg -d backups/….tar.gz.gpg | tar -xzf - -C /chemin/vers/le/bot`

### Pare-feu : ne pas exposer le port 3000

Le bot peut démarrer un mini serveur HTTP pour le health check (Render, Heroku, etc.). **Par défaut**, il écoute sur `127.0.0.1` — pas accessible depuis Internet.

Sur un **VPS ou panel** (recommandé dans `.env.example`) :

- `ENABLE_HEALTH_CHECK=false` — pas de port HTTP du tout.
- Sinon : laisser `HEALTH_BIND_HOST=127.0.0.1` (défaut) et **ne pas** ouvrir le port 3000 (`HEALTH_PORT`) dans `ufw`, iptables ou le security group cloud.
- N'exposez `0.0.0.0` (`HEALTH_BIND_HOST=0.0.0.0`) **que** si votre hébergeur PaaS l'exige pour ses sondes internes.

### Compte WhatsApp dédié

Utilisez un **numéro réservé au bot**, pas votre ligne personnelle :

- Limite le risque en cas de bannissement ou de fuite du dossier `auth/`.
- Facilite la rotation : supprimez `auth/principale/` et rescannez un nouveau QR.
- `NUMERO_OWNER` dans `.env` doit correspondre au compte qui contrôle le bot (owner des commandes).

Protégez aussi `auth/` (déjà dans `.gitignore`) : permissions restrictives, sauvegardes chiffrées, jamais commitées.

### Checklist production (VPS / panel)

| Variable | Recommandation |
|----------|----------------|
| `NODE_ENV=production` | Pas de `npm install` automatique au reconnect ; logs messages **off** par défaut |
| `LOG_MESSAGES` | `off` ou `minimal` en prod (`full` uniquement pour le debug) |
| `ENABLE_HEALTH_CHECK` | `false` sur VPS sauf besoin local (sonde sur `127.0.0.1`) |
| Clés API / `*_API_BASE` | Renseigner dans `.env` (voir `.env.example`) — commandes concernées désactivées si vide |

**Après toute modification de `.env`** : redémarrer le processus (`node bot.js` ou votre service systemd/PM2). Le rechargement des commandes au reconnect WhatsApp ne recharge pas `dotenv`.

```bash
npm run check:secrets && npm test   # avant déploiement
./scripts/backup-secrets.sh         # sauvegarde auth/ + .env chiffrée
```

</details>

---

### Licence

Distribué sous la licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.
