'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const pino = require('pino');
const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  Browsers,
  delay,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require('@whiskeysockets/baileys');

const { getMessage } = require('./lib/store');
const { groupCache } = require('./lib/groupeCache');
const { localAuthExists, ensureAuthDir } = require('./DataBase/session');
const config = require('./set');
const {
  message_upsert,
  group_participants_update,
  group_update,
  connection_update,
  call,
  dl_save_media_ms,
  recup_msg,
} = require('./Ovl_events');
const { getSecondAllSessions } = require('./DataBase/connect');

const MAX_SESSIONS = 30;
const STARTUP_DELAY_MS = 45000;
const SECONDARY_POLL_MS = 10000;
const LOG_LEVEL = 'silent';
const PRINCIPAL_FOLDER = 'principale';

const sessionsActives = new Set();
const instancesSessions = new Map();
const sessionsSupprimees = new Set();

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
      printQRInTerminal: isFirstRun,
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

    sock.ev.on('messages.upsert', (event) => message_upsert(event, sock));
    sock.ev.on('group-participants.update', (event) =>
      group_participants_update(event, sock)
    );
    sock.ev.on('groups.update', (event) => group_update(event, sock));
    sock.ev.on(
      'connection.update',
      (event) =>
        connection_update(
          event,
          sock,
          () => {
            if (!sessionsSupprimees.has(numero)) {
              return startGenericSession({ numero, isPrincipale });
            }
          },
          isPrincipale ? async () => startSecondarySessions() : undefined
        )
    );
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('call', (event) => call(sock, event));

    sock.downloadMediaMessage = (
      message,
      fileName = '',
      asDocument = true,
      mimetype = 'application/octet-stream'
    ) => dl_save_media_ms(sock, message, fileName, asDocument, mimetype);

    sock.recup_msg = (payload) => recup_msg({ ovl: sock, ...payload });

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

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log('HTTP health check sur le port ' + port);
});

process.on('uncaughtException', (error) => {
  console.log('uncaughtException :', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection :', error);
});

(async () => {
  await startPrincipalSession();
})();
