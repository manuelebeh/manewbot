'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  Browsers,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require('@whiskeysockets/baileys');

const { getMessage } = require('./lib/store');
const { groupCache } = require('./lib/groupe_cache');
const { localAuthExists, ensureAuthDir } = require('./database/session');
const config = require('./set');
const {
  message_upsert,
  group_participants_update,
  group_update,
  connection_update,
  call,
  dl_save_media_ms,
  recup_msg,
} = require('./events');
const { getSecondAllSessions } = require('./database/connect');

const MAX_SESSIONS = 30;
const STARTUP_DELAY_MS = 45000;
const SECONDARY_POLL_MS = 10000;
const LOG_LEVEL = 'silent';
const PRINCIPAL_FOLDER = 'principale';

const sessionsActives = new Set();
const instancesSessions = new Map();
const sessionsSupprimees = new Set();
const reconnectingSessions = new Set();
const lastReconnectAt = new Map();
const sessionGeneration = new Map();
const INSTANCE_LOCK_FILE = path.join(__dirname, '.bot.pid');

const RECONNECTABLE_CODES = new Set([
  DisconnectReason.connectionClosed,
  DisconnectReason.connectionLost,
  DisconnectReason.timedOut,
  DisconnectReason.restartRequired,
  DisconnectReason.unavailableService,
]);

function acquireInstanceLock() {
  if (fs.existsSync(INSTANCE_LOCK_FILE)) {
    const oldPid = Number.parseInt(fs.readFileSync(INSTANCE_LOCK_FILE, 'utf8'), 10);
    if (oldPid && oldPid !== process.pid) {
      try {
        process.kill(oldPid, 0);
        console.error(
          'Une instance du bot tourne déjà (PID ' +
            oldPid +
            '). Arrêtez-la (Ctrl+C ou kill ' +
            oldPid +
            ') avant de relancer.'
        );
        process.exit(1);
      } catch (_) {
        /* lock orphelin */
      }
    }
  }

  fs.writeFileSync(INSTANCE_LOCK_FILE, String(process.pid));
  const releaseLock = () => {
    try {
      if (
        fs.existsSync(INSTANCE_LOCK_FILE) &&
        fs.readFileSync(INSTANCE_LOCK_FILE, 'utf8') === String(process.pid)
      ) {
        fs.unlinkSync(INSTANCE_LOCK_FILE);
      }
    } catch (_) {
      /* ignore */
    }
  };
  process.on('exit', releaseLock);
  process.on('SIGINT', () => {
    releaseLock();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    releaseLock();
    process.exit(0);
  });
}

function shouldReconnectAfter(code) {
  if (code === DisconnectReason.connectionReplaced) return false;
  if (code === DisconnectReason.loggedOut) return false;
  if (code === DisconnectReason.forbidden) return false;
  if (code === DisconnectReason.badSession) return false;
  if (code === DisconnectReason.multideviceMismatch) return false;
  if (code == null) return true;
  return RECONNECTABLE_CODES.has(code);
}

function isCurrentSocket(numero, sock, generation) {
  return (
    sessionGeneration.get(numero) === generation &&
    instancesSessions.get(numero) === sock
  );
}

function disconnectLabel(code) {
  if (code == null) return 'inconnu';
  return DisconnectReason[code] || String(code);
}

async function teardownSessionSocket(numero) {
  const sock = instancesSessions.get(numero);
  if (!sock) return;

  instancesSessions.delete(numero);
  sessionsActives.delete(numero);

  try {
    sock.ev.removeAllListeners();
  } catch (_) {
    /* ignore */
  }

  try {
    await sock.end(undefined);
  } catch (_) {
    /* ignore */
  }
}

async function reconnectSession({ numero, isPrincipale }) {
  if (sessionsSupprimees.has(numero) || reconnectingSessions.has(numero)) {
    return null;
  }

  const now = Date.now();
  const last = lastReconnectAt.get(numero) || 0;
  if (now - last < 5000) return null;

  reconnectingSessions.add(numero);
  lastReconnectAt.set(numero, now);

  try {
    await teardownSessionSocket(numero);
    await delay(3000);
    return startGenericSession({ numero, isPrincipale });
  } finally {
    reconnectingSessions.delete(numero);
  }
}

console.info = function (...args) {
  const line = args.join(' ');
  if (line.includes('Closing session') || line.includes('SessionEntry')) return;
  console.log(...args);
};

console.warn = function (...args) {
  const line = args.join(' ');
  if (line.includes('Closing session') || line.includes('SessionEntry')) return;
  console.log(...args);
};

console.error = function (...args) {
  const line = args.join(' ');
  if (
    line.includes('Bad MAC') ||
    line.startsWith('Failed to decrypt') ||
    line.includes('No matching sessions')
  ) {
    return;
  }
  console.log(...args);
};

function authFolderFor({ numero, isPrincipale }) {
  return isPrincipale ? PRINCIPAL_FOLDER : numero;
}

async function startGenericSession({ numero, isPrincipale = false }) {
  if (sessionsSupprimees.has(numero)) {
    console.log('Session ' + numero + ' supprimée, ignorée.');
    return null;
  }

  if (instancesSessions.has(numero) && !reconnectingSessions.has(numero)) {
    console.log('Session ' + numero + ' déjà active, démarrage ignoré.');
    return instancesSessions.get(numero);
  }

  const generation = (sessionGeneration.get(numero) || 0) + 1;
  sessionGeneration.set(numero, generation);

  const authFolder = authFolderFor({ numero, isPrincipale });
  const isFirstRun = isPrincipale && !localAuthExists(authFolder);

  if (isFirstRun) {
    ensureAuthDir(authFolder);
    console.log(
      '┌─────────────────────────────────────────────────────┐\n' +
      '│  Premier lancement : scannez le QR code ci-dessous  │\n' +
      '│  avec WhatsApp > Appareils connectés > Connecter    │\n' +
      '└─────────────────────────────────────────────────────┘'
    );
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      path.join('./auth', authFolder)
    );
    const { version } = await fetchLatestBaileysVersion();

    const logger = pino({ level: LOG_LEVEL });
    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      logger,
      browser: Browsers.macOS('Desktop'),
      keepAliveIntervalMs: 10000,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: true,
      shouldSyncHistoryMessage: () => false,
      syncFullHistory: false,
      cachedGroupMetadata: async (jid) => groupCache.get(jid),
      getMessage: async (key) => {
        const stored = getMessage(key.id);
        return stored?.message || undefined;
      },
    });

    if (isFirstRun) {
      sock.ev.on('connection.update', ({ qr }) => {
        if (!qr) return;
        console.log('\nScannez ce QR code avec WhatsApp :\n');
        qrcode.generate(qr, { small: true });
        console.log('');
      });
    }

    sock.ev.on('messages.upsert', (event) => message_upsert(event, sock));
    sock.ev.on('group-participants.update', (event) =>
      group_participants_update(event, sock)
    );
    sock.ev.on('groups.update', (event) => group_update(event, sock));
    sock.ev.on('connection.update', (event) => {
      if (!isCurrentSocket(numero, sock, generation)) return;

      let disconnectCode;
      if (event.connection === 'close') {
        disconnectCode = event.lastDisconnect?.error?.output?.statusCode;
        console.log(
          'Déconnexion (' +
            disconnectLabel(disconnectCode) +
            ')' +
            (disconnectCode === DisconnectReason.loggedOut
              ? ' — scannez à nouveau le QR si besoin.'
              : disconnectCode === DisconnectReason.connectionReplaced
                ? ' — une autre connexion utilise cette session (autre processus ou WhatsApp Web).'
                : '')
        );

        if (disconnectCode === DisconnectReason.connectionReplaced) {
          if (isCurrentSocket(numero, sock, generation)) {
            teardownSessionSocket(numero).catch(() => {});
          }
          return;
        }
      }

      return connection_update(
        event,
        sock,
        () => {
          if (!isCurrentSocket(numero, sock, generation)) return null;
          if (!shouldReconnectAfter(disconnectCode)) return null;
          return reconnectSession({ numero, isPrincipale });
        },
        isPrincipale ? async () => startSecondarySessions() : undefined
      );
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('call', (event) => call(sock, event));

    sock.downloadMediaMessage = (
      message,
      fileName = '',
      asDocument = true,
      mimetype = 'application/octet-stream'
    ) => dl_save_media_ms(sock, message, fileName, asDocument, mimetype);

    sock.recup_msg = (payload) => recup_msg({ bot: sock, ...payload });

    instancesSessions.set(numero, sock);
    sessionsActives.add(numero);
    console.log(
      'Session ' +
        (isPrincipale ? 'principale' : 'secondaire ' + numero) +
        ' démarrée.'
    );

    return sock;
  } catch (error) {
    console.error(
      'Erreur démarrage session ' +
        (isPrincipale ? PRINCIPAL_FOLDER : numero) +
        ' :',
      error.message
    );
    return null;
  }
}

async function stopSession(numero) {
  if (!instancesSessions.has(numero)) return;

  sessionsSupprimees.add(numero);
  const sock = instancesSessions.get(numero);

  try {
    await sock.logout();
    const authPath = path.join(__dirname, './auth', numero);
    if (fs.existsSync(authPath)) {
      await fs.promises.rm(authPath, { recursive: true, force: true });
    }
    console.log('Session ' + numero + ' arrêtée.');
    console.log('Dossier auth/' + numero + ' supprimé.');
  } catch (error) {
    console.error('Erreur arrêt session ' + numero + ' :', error.message);
  }

  instancesSessions.delete(numero);
  sessionsActives.delete(numero);
}

async function startSecondarySessions() {
  const registered = await getSecondAllSessions();
  const registeredNumbers = new Set(registered.map((row) => row.numero));

  for (const active of sessionsActives) {
    if (active === PRINCIPAL_FOLDER) continue;
    if (!registeredNumbers.has(active)) {
      console.log('Arrêt session secondaire orpheline : ' + active);
      await stopSession(active);
    }
  }

  for (const { numero } of registered) {
    if (sessionsActives.size >= MAX_SESSIONS) break;

    if (sessionsSupprimees.has(numero)) {
      sessionsSupprimees.delete(numero);
    }

    if (!sessionsActives.has(numero)) {
      if (!localAuthExists(numero)) {
        continue;
      }
      try {
        await startGenericSession({ numero, isPrincipale: false });
      } catch (error) {
        console.error(
          'Erreur session secondaire ' + numero + ' :',
          error.message
        );
      }
    }
  }
}

function surveillerNouvellesSessions() {
  setInterval(async () => {
    try {
      await startSecondarySessions();
    } catch (error) {
      console.error('Erreur surveillance sessions :', error.message);
    }
  }, SECONDARY_POLL_MS);
}

async function startPrincipalSession() {
  await delay(STARTUP_DELAY_MS);

  await startGenericSession({
    numero: PRINCIPAL_FOLDER,
    isPrincipale: true,
  });

  surveillerNouvellesSessions();
}

function startHealthCheck() {
  if (process.env.ENABLE_HEALTH_CHECK === 'false') return;

  const port = Number(process.env.HEALTH_PORT || process.env.PORT || 3000);
  const host =
    process.env.HEALTH_BIND_HOST ||
    (process.env.HEALTH_BIND_ALL === 'true' ? '0.0.0.0' : '127.0.0.1');

  const app = express();
  app.get('/', (_req, res) => {
    res.send('OK');
  });

  app.listen(port, host, () => {
    console.log('HTTP health check sur ' + host + ':' + port);
    if (host === '0.0.0.0') {
      console.log(
        'Attention : le port est exposé sur toutes les interfaces. ' +
          'Préférez 127.0.0.1 (défaut) ou un pare-feu strict sur un VPS.'
      );
    }
  });
}

acquireInstanceLock();
startHealthCheck();

process.on('uncaughtException', (error) => {
  console.log('uncaughtException :', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection :', error);
});

(async () => {
  await startPrincipalSession();
})();
