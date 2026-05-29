'use strict';

const { delay, DisconnectReason } = require('@whiskeysockets/baileys');
const { decodeJid } = require('../lib/jid');
const pkg = require('../package.json');
const config = require('../set');
const { manage_env } = require('../lib/manage_env');
const { reloadCommands } = require('../lib/plugin');
const { installMissingDependencies } = require('../lib/install-missing-deps');
const evt = require('../lib/commands');

const { buildForwardContextInfo } = require('../lib/forward-context');

let restartCount = 0;
let wasOpen = false;

function buildStatusBanner() {
  const nomBot = config.NOM_BOT || 'Manewbot';
  const nomOwner = config.NOM_OWNER || 'Manewbie';
  const cmdCount = Array.isArray(evt.cmd) ? evt.cmd.length : 0;

  return (
    '╭───〔 🤖 ' +
    nomBot +
    ' 〕───⬣\n' +
    '│ ߷ *Etat*       ➜ Connecté ✅\n' +
    '│ ߷ *Préfixe*    ➜ ' +
    config.PREFIXE +
    '\n' +
    '│ ߷ *Mode*       ➜ ' +
    config.MODE +
    '\n' +
    '│ ߷ *Commandes*  ➜ ' +
    cmdCount +
    '\n' +
    '│ ߷ *Version*    ➜ ' +
    pkg.version +
    '\n' +
    '│ ߷ *Développeur*➜ ' +
    nomOwner +
    '\n' +
    '╰──────────────⬣'
  );
}

function buildOnlineBox() {
  const nomBot = config.NOM_BOT || 'Manewbot';
  return (
    '\n╭─────────────────╮\n' +
    '│                  \n' +
    '│   🎉 ' +
    nomBot.toUpperCase() +
    ' ONLINE 🎉  \n' +
    '│                  \n' +
    '╰─────────────────╯\n'
  );
}

async function connection_update(
  update,
  sock,
  onReconnect,
  onSecondaryReady = null
) {
  const { connection, lastDisconnect } = update;

  switch (connection) {
    case 'connecting':
      console.log('🌍 Connexion en cours...');
      break;

    case 'open':
      console.log(buildOnlineBox());
      console.log("🔄 Synchronisation des variables d'environnement...");
      await manage_env();
      console.log('✅ Variables synchronisées.');
      await installMissingDependencies();
      await reloadCommands();
      await delay(1000);

      if (!wasOpen) {
        const banner = buildStatusBanner();
        console.log(banner);
        const nomBot = config.NOM_BOT || 'Manewbot';
        await sock.sendMessage(decodeJid(sock.user.id), {
          text: banner,
          contextInfo: buildForwardContextInfo(),
        });
      }

      wasOpen = true;
      restartCount = 0;
      await delay(10000);
      if (onSecondaryReady) await onSecondaryReady();
      break;

    case 'close': {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code === DisconnectReason.loggedOut) {
        console.log('❌ Session déconnectée — scannez à nouveau le QR code.');
        return;
      }

      console.log('⚠️ Connexion perdue, reconnexion...');
      if (restartCount >= 3) return;

      restartCount++;
      await delay(5000);
      if (onReconnect) await onReconnect();
      break;
    }

    default:
      break;
  }
}

module.exports = { connection_update };