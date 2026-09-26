<h1 align="center">Manewbot</h1>

<p align="center">
    WhatsApp multi-device bot, built with Baileys.
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
  <summary>Deploying Manewbot</summary>

### Step 1: Fork the GitHub repository
[![Fork GitHub](https://img.shields.io/badge/Fork%20the%20Repo-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/manuelebeh/manewbot/fork)

---

### Step 2: Pair WhatsApp (local session)

Pairing uses a local Baileys QR code:

1. Run `node bot.js`
2. Scan the QR shown in the terminal (WhatsApp → Linked devices → Link a device)
3. Session files land in `auth/principale/`

Later starts reuse that session; no new QR unless you wipe `auth/`.

---

### Step 3: Create a database (optional)
[![Create Database](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

### Step 4: Deployment options

#### <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" height="28" />
- Create an account: [Heroku signup](https://signup.heroku.com/)
- Quick deploy: [Deploy on Heroku](https://dashboard.heroku.com/new?template=https://github.com/manuelebeh/manewbot)

#### <img src="https://img.shields.io/badge/Panel-grey?style=for-the-badge&logo=windows-terminal&logoColor=white" height="28" />
- Set up a server (Node.js 22+)
- Entry point: `bot.js` (or use the panel script below to clone the repo and run `bot.js`)
- Run `npm install` then `node bot.js` or `npm start` (PM2)

#### <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" height="28" />
- Add a `.env` file
- CI is already defined in `.github/workflows/ci.yml` (see below)

#### <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" height="28" />

Prerequisites: Docker, Node **22** (for local dev only), file `.env` (copy from `.env.example`).

```bash
cp .env.example .env
# Edit .env (NOM_OWNER, NUMERO_OWNER, …)

# Build and run in background
docker compose up -d --build

# First WhatsApp pairing (QR in terminal)
docker compose run --rm -it manewbot

# Logs
docker compose logs -f manewbot
```

**Persisted data** (via `docker-compose.yml`):

| Mount | Role |
|-------|------|
| `./auth` | Baileys sessions (required) |
| `./.env` | Config + `setvar` / `delvar` |
| Volume `manewbot-db` | SQLite `database.db` when `DATABASE` is unset |

After changing `.env` on the host, recreate the container (a simple `restart` does not reload `--env-file`):

```bash
docker compose up -d --force-recreate
```

Without Compose:

```bash
docker build -t manewbot .
docker run -d --restart unless-stopped --name manewbot \
  --env-file .env \
  -v "$(pwd)/auth:/app/auth" \
  -v "$(pwd)/.env:/app/.env" \
  -v manewbot-db:/app/database.db \
  manewbot
```

PaaS health check: set `ENABLE_HEALTH_CHECK=true`, `HEALTH_BIND_HOST=0.0.0.0`, publish port `3000` (uncomment `ports` in `docker-compose.yml`).

Run one container per `auth/` and DB volume. Sharing them trips the `.bot.pid` lock.

</details>

---

<details>
  <summary>Panel script (clone + PM2 / node bot.js)</summary>

```js
const { spawnSync, spawn } = require('child_process');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

// Paste your environment variables here
const env_file = ``;

if (!env_file.trim()) {
  console.error("'env_file' is empty. Set your environment variables before running this script.");
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
    console.log('.env file created successfully.');
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
  <summary>GitHub CI (`.github/workflows/ci.yml`)</summary>

On every push / PR to `main` or `master`:

1. `npm ci`
2. `npm run check:secrets`
3. `npm run check:syntax`
4. `npm test`
5. `npm run lint`

**Local prerequisites** (ffmpeg for some audio/video commands):

```bash
npm install
npm run check:secrets && npm run check:syntax && npm test && npm run lint
node bot.js
```

</details>

---

<details>
  <summary>Example `.env` file</summary>

Copy `.env.example` to `.env` and set at least:

```env
PREFIXE=.
NOM_OWNER=Manewbie
NUMERO_OWNER=228xxxxxxxx
MODE=private
NOM_BOT=Manewbot
STICKER_PACK_NAME=Manewbot
STICKER_AUTHOR_NAME=Manewbie
```

Optional knobs (`COMMAND_REACT`, `RESTRICTED_GROUPS`, API bases, …) are listed in [`.env.example`](./.env.example).

</details>

---

<details>
  <summary>Multi-account (secondary sessions)</summary>

To connect a second WhatsApp number:

1. Create the folder `auth/<number>/` (e.g. `auth/22612345678/`)
2. Temporarily run Baileys with `useMultiFileAuthState('auth/<number>')` to scan that account’s QR (or copy an already paired `creds.json`)
3. Register the number with an owner command: `<prefix>connect 22612345678`
4. The bot will start the secondary session on the next check cycle

To remove a secondary account, use the matching owner command. The `auth/<number>/` folder will be deleted.

</details>

---

<details>
  <summary>Roles: owner, sudo, and moderation</summary>

| Role | Configuration | Permissions |
|------|----------------|-------------|
| **Owner** | `NUMERO_OWNER` in `.env` | `classe: Owner` commands (blocked at router if not owner), `setvar`, `update`, sensitive config, full immunity |
| **Sudo** | `setsudo` command (DB table) | Staff: private/public mode commands, group moderation; only the owner can kick/ban a sudo |
| **WA admin** | WhatsApp group admin | Group commands per `verif_Admin` |
| **Member** | (none) | Depends on `MODE`, bans, and public/private command lists |

In groups listed in `RESTRICTED_GROUPS`, only the owner, sudo users, and JIDs in `RESTRICTED_GROUP_ALLOWLIST` can talk to the bot (including passive handlers).

Local checks: `npm test`, `npm run check:syntax`, `npm run lint`. CI runs those plus `check:secrets` (see `.github/workflows/ci.yml`).

### Command structure

Each category is a folder under `cmd/<category>/` with a barrel `index.js`, loaded by `lib/plugin.js` (17 categories, ~330 commands).

| Directory | Purpose |
|-----------|---------|
| `cmd/owner/` | Owner (ban, sudo, sessions, …) · `owner/ban/` |
| `cmd/group/` | Tagging, polls, welcome, antimodules · `group/moderation/`, `group/settings/` |
| `cmd/conversion/` | Stickers, image-edit, ffmpeg, video-quote, TTS (`lib/google-tts.js`) |
| `cmd/download/` | YouTube, TikTok, Instagram, Facebook, Twitter, APK |
| `cmd/tools/` | capture, tempmail, devtools, menus · `tools/menus/` |
| `cmd/games/` | tictactoe, anime-quizz, dmots · `games/wcg/` |
| `cmd/search/` | img, web, entertainment, shazam |
| `cmd/economy/` | wallet, banking, economy mini-games, admin |
| `cmd/fun/` | text, quotes, ranks, fake |
| `cmd/ai/` | gpt, dalle, gemini, llama, claude, copilot, … |
| `cmd/privacy/` | presence, bio, WhatsApp privacy settings |
| `cmd/status/` | save, sendme, status toggles |
| `cmd/system/` | setvar, checkupdate, update |
| `cmd/logo/` | ephoto360 text effects (`logovintage`, `logospace`, …) |
| `cmd/reaction/` | GIF reactions (waifu.pics) · `captions.js` |
| `cmd/image_edits/` | Image effects via OVL API |
| `cmd/fx_audio/` | ffmpeg audio filters |

**Shared modules**

| Path | Purpose |
|------|---------|
| `cmd/<cat>/register.js` | `registerCommand` (lightweight) |
| `cmd/<cat>/deps.js` or `media.js` | Heavy category dependencies |
| `lib/dl/` | Social media download scrapers |
| `lib/message-upsert/` | Message / view-once context |
| `lib/run-command.js` | ACL (public/private mode, bans, onlyadmins) |
| `packages/baileys-cjs/` | Baileys (local CJS dependency) |
| `events/group_participants/` | Welcome/goodbye, promote/demote |

Each command file imports only what it needs (`register` + `deps`, or named modules like `textpro.js`, `audio-fx.js`, …). `lib/style.js` re-exports `style-apply.js` and `style-maps.js`.

</details>

---

<details>
  <summary>Security (VPS / panel)</summary>

### Git: keep `.env` and `auth/` out of commits

Already listed in `.gitignore`:

- `.env`, `.env.*` (except `.env.example`)
- `auth/` (Baileys sessions / `creds.json`)
- `config_env.json` (except the versioned example)
- `backups/` (local archives)

Check locally or in CI:

```bash
npm run check:secrets
# or: node --test test/gitignore-secrets.test.js
```

### Encrypted backups

Do not leave `auth/` or `.env` in plain text on a remote repo or unencrypted cloud.

```bash
chmod +x scripts/backup-secrets.sh
./scripts/backup-secrets.sh
# → backups/ovl-secrets-YYYYMMDD-HHMMSS.tar.gz.gpg
```

Restore on the server: `gpg -d backups/….tar.gz.gpg | tar -xzf - -C /path/to/bot`

### Firewall: do not expose port 3000

Health checks can open a tiny HTTP server (Render, Heroku, …). Default bind is `127.0.0.1`, so nothing answers from the public internet.

On a VPS or panel (see `.env.example`):

- `ENABLE_HEALTH_CHECK=false`: no HTTP port.
- Or keep `HEALTH_BIND_HOST=127.0.0.1` and leave port 3000 (`HEALTH_PORT`) closed in `ufw` / your cloud security group.
- Bind `0.0.0.0` only when the host needs it for internal probes.

### Dedicated WhatsApp account

Prefer a number used only for the bot:

- Less damage if WhatsApp bans it or `auth/` leaks.
- Easy reset: delete `auth/principale/` and scan again.
- `NUMERO_OWNER` must be the number that owns the bot.

Keep `auth/` out of git (already ignored), with tight file permissions and encrypted backups.

### Production checklist (VPS / panel)

| Variable | Recommendation |
|----------|----------------|
| `NODE_ENV=production` | No automatic `npm install` of deps on reconnect; message logs **off** by default |
| `AUTO_INSTALL_MISSING_DEPS=false` | Optional in prod (explicit; default off when `NODE_ENV=production`) |
| `COMMAND_REACT` | `on` / `off`: react with an emoji when a command runs |
| `LOG_MESSAGES` | `off` or `minimal` in prod (`full` only while debugging) |
| `ENABLE_HEALTH_CHECK` | `false` on VPS unless you want a local probe on `127.0.0.1` |
| API keys / `*_API_BASE` | From `.env` (see `.env.example`); empty means those commands stay off |
| `TELEGRAM_BOT_TOKEN` | Needed for `tgs` (owner). Never commit it; revoke on BotFather if it leaked |
| `CHATBOT_API_BASE` | Chatbot GET URL (`?user_id=&text=`). Empty skips external calls |
| `WAIFU_PICS_API_BASE`, `EPHOTO360_BASE`, `CATBOX_UPLOAD_URL`, … | Media URL overrides in `.env.example` |

### Git history and secrets

Deleting a key from current files does not erase it from old commits.

1. Revoke or rotate it with the provider (BotFather, Google Cloud, …).
2. Rewrite history with [git-filter-repo](https://github.com/newren/git-filter-repo) or BFG, then `git push --force` (agree with anyone else on the repo first).
3. Check with `npm run check:secrets` and `git log -p -- .env` (should show no secrets).

### Sensitive commands

- `vv` / `vv2` / `capture`: owner or sudo (`isStaff`) only.
- `fetch_sc`: owner only, and only validated public URLs (blocks private-network SSRF).
- `update`: `git stash` then `pull --ff-only` (no `reset --hard`).

After editing `.env`, restart the process (`node bot.js`, systemd, or PM2). A WhatsApp reconnect reloads commands but not `dotenv`.

```bash
npm run check:secrets && npm run check:syntax && npm test && npm run lint   # before deploy
./scripts/backup-secrets.sh         # encrypted backup of auth/ + .env
```

</details>

---

### License

MIT. Details in [LICENSE](./LICENSE).
