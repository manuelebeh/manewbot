<h1 align="center">OVL-MD-V2</h1>

<p align="center">
    <img alt="OVL" src="https://files.catbox.moe/gxcb9p.jpg">
</p>

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
    <a href="https://github.com/Ainz-devs/OVL-MD-V2/stargazers">
        <img src="https://img.shields.io/github/stars/Ainz-devs/OVL-MD-V2?style=flat-square" alt="Stars" />
    </a>
    <a href="https://github.com/Ainz-devs/OVL-MD-V2/network/members">
        <img src="https://img.shields.io/github/forks/Ainz-devs/OVL-MD-V2?style=flat-square" alt="Forks" />
    </a>
</p>

---

<details>
  <summary>Déploiement de OVL-MD-V2</summary>

### Étape 1 : Fork du dépôt GitHub  
[![Fork GitHub](https://img.shields.io/badge/Fork%20le%20Repo-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ainz-devs/OVL-MD-V2/fork)

---

### Étape 2 : Appairage WhatsApp (session locale)

L'authentification se fait entièrement en local via un QR code Baileys :

1. Lancez le bot pour la première fois : `node Ovl.js`
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
- Déploiement rapide : [Déployer sur Heroku](https://dashboard.heroku.com/new?template=https://github.com/Ainz-devs/OVL-MD-V2)

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
  if (!existsSync('ovl')) {
    const clone = spawnSync('git', ['clone', 'https://github.com/Ainz-devs/OVL-MD-V2', 'ovl'], { stdio: 'inherit' });
    if (clone.status !== 0) process.exit(1);
  }

  if (!existsSync('ovl/.env')) {
    mkdirSync('ovl', { recursive: true });
    writeFileSync('ovl/.env', env_file);
    console.log("Fichier .env créé avec succès.");
  }

  const install = spawnSync('npm', ['install'], { cwd: 'ovl', stdio: 'inherit' });
  if (install.status !== 0) process.exit(1);
}

function validateSetup() {
  if (!existsSync('ovl/package.json')) {
    process.exit(1);
  }

  const check = spawnSync('npm', ['ls'], { cwd: 'ovl', stdio: 'ignore' });

  if (check.status !== 0) {
    const reinstall = spawnSync('npm', ['install'], { cwd: 'ovl', stdio: 'inherit' });
    if (reinstall.status !== 0) {
      process.exit(1);
    }
  }
}

function launchApp() {
  const pm2 = spawn('npx', ['pm2', 'start', 'Ovl.js', '--name', 'ovl-md', '--attach'], {
    cwd: 'ovl',
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
        spawnSync('npx', ['pm2', 'delete', 'ovl-md'], { cwd: 'ovl', stdio: 'inherit' });
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
  const child = spawn('node', ['Ovl.js'], { cwd: 'ovl', stdio: 'inherit' });

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
name: OVL-MD Bot CI

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
      - run: timeout 18300s npm run Ovl
```

</details>

---

<details>
  <summary>Exemple de fichier .env</summary>

```env
PREFIXE=.
NOM_OWNER=Ainz
NUMERO_OWNER=226xxxxxxxx
MODE=public
STICKER_PACK_NAME=OVL-MD-V2
STICKER_AUTHOR_NAME=Ainz
NOM_BOT=OVL-MD BOT V2
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
  <summary>Sécurité (VPS / panel)</summary>

### Pare-feu : ne pas exposer le port 3000

Le bot démarre un mini serveur HTTP pour le health check (Render, Heroku, etc.). **Par défaut**, il écoute uniquement sur `127.0.0.1` — pas accessible depuis Internet.

Sur un **VPS ou panel** :

- Ne ouvrez **pas** le port 3000 (ni `HEALTH_PORT`) dans le pare-feu public (`ufw`, security group cloud, etc.).
- Pour désactiver complètement le health check : `ENABLE_HEALTH_CHECK=false` dans `.env`.
- N'exposez `0.0.0.0` (`HEALTH_BIND_HOST=0.0.0.0`) **que** si votre hébergeur PaaS l'exige pour ses sondes internes.

### Compte WhatsApp dédié

Utilisez un **numéro réservé au bot**, pas votre ligne personnelle :

- Limite le risque en cas de bannissement ou de fuite du dossier `auth/`.
- Facilite la rotation : supprimez `auth/principale/` et rescannez un nouveau QR.
- `NUMERO_OWNER` dans `.env` doit correspondre au compte qui contrôle le bot (owner des commandes).

Protégez aussi `auth/` (déjà dans `.gitignore`) : permissions restrictives, sauvegardes chiffrées, jamais commitées.

</details>

---

### Licence

Distribué sous la licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.
