'use strict';

const { execSync } = require('child_process');
const { delay, DisconnectReason, jidDecode } = require('@whiskeysockets/baileys');
const pkg = require('../package.json');
const config = require('../set');
const { manage_env } = require('../lib/manage_env');
const { installpg, reloadCommands } = require('../lib/plugin');
const evt = require('../lib/commands');

const NEWSLETTER_JID = '120363371282577847@newsletter';

let restartCount = 0;
let wasOpen = false;

const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {};
    return (
      (decoded.user && decoded.server && decoded.user + '@' + decoded.server) ||
      jid
    );
  }
  return jid;
};

function buildStatusBanner() {
  const nomBot = config.NOM_BOT || 'Manewbot';
  const developpeur = config.NOM_OWNER || 'Manewbie';
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
    developpeur +
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

async function installMissingDependencies() {
  const rootPkg = require('../package.json');
  const allDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
  const missing = [];

  for (const name of Object.keys(allDeps || {})) {
    try {
      require.resolve(name);
    } catch {
      missing.push(name + '@' + allDeps[name]);
    }
  }

  if (!missing.length) return;

  console.log(
    '⚙️ Installation des dépendances manquantes : ' + missing.join(', ')
  );
  try {
    execSync('npm install ' + missing.join(' '), { stdio: 'inherit' });
    console.log('✅ Dépendances installées.');
  } catch (err) {
    console.error('❌ Erreur installation npm :', err.message);
  }
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
      await installpg();
      await installMissingDependencies();
      await reloadCommands();
      await delay(1000);

      if (!wasOpen) {
        const banner = buildStatusBanner();
        console.log(banner);
        const nomBot = config.NOM_BOT || 'Manewbot';
        await sock.sendMessage(decodeJid(sock.user.id), {
          text: banner,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: NEWSLETTER_JID,
              newsletterName: nomBot,
            },
          },
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

module.exports = connection_update;
