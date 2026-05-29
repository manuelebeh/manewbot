'use strict';

const {
  registerCommand,
  cmd,
  fs,
  path,
  os,
  axios,
  config,
  translate,
  prefixe,
  WA_CONF,
  TempMail,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
} = require('./_shared');

registerCommand({
  nom_cmd: "tempmail",
  classe: "Outils",
  react: "📧",
  desc: "Crée un email temporaire."
}, async (chatJid, sock, ctx) => {
  const {
    ms
  } = ctx;
  try {
    const tempMail = new TempMail();
    const value = await tempMail.createInbox();
    const url = "Voici votre adresse email temporaire : " + value.address + "\n\nVotre token est : " + value.token + "\n\nPour récupérer vos messages, utilisez <tempinbox votre-token>.";
    await sock.sendMessage(chatJid, {
      text: url
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur s'est produite lors de la création de l'email temporaire."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "tempinbox",
  classe: "Outils",
  react: "📩",
  desc: "Récupère les messages d'un email temporaire."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Pour récupérer les messages de votre email temporaire, fournissez le token qui a été émis."
    });
  }
  try {
    const tempMail = new TempMail();
    const inbox = await tempMail.checkInbox(arg[0]);
    if (!inbox || inbox.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucun message trouvé pour ce token."
      }, {
        quoted: ms
      });
    }
    for (let index = 0; index < inbox.length; index++) {
      const value = inbox[index];
      const value2 = value.sender;
      const value3 = value.subject;
      const value4 = new Date(value.date).toLocaleString();
      const value5 = value.body;
      const url = "👥 Expéditeur : " + value2 + "\n📝 Sujet : " + value3 + "\n🕜 Date : " + value4 + "\n📩 Message : " + value5;
      await sock.sendMessage(chatJid, {
        text: url
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error(err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la récupération des messages de l'email temporaire."
    }, {
      quoted: ms
    });
  }
});
