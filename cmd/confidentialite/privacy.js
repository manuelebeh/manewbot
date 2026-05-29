'use strict';

const {
  registerCommand, handlePrivacyCommand,
} = require('./_shared');

registerCommand({
  nom_cmd: "lastseen",
  classe: "confidentialité",
  react: "⏳",
  desc: "Modifier la confidentialité de la dernière vue"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "lastseen",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateLastSeenPrivacy,
    label: "dernière vue"
  });
});
registerCommand({
  nom_cmd: "online",
  classe: "confidentialité",
  react: "🟢",
  desc: "Modifier la confidentialité en ligne"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "online",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateOnlinePrivacy,
    label: "en ligne"
  });
});
registerCommand({
  nom_cmd: "mypp",
  classe: "confidentialité",
  react: "🖼️",
  desc: "Modifier la confidentialité de la photo de profil"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "profile",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateProfilePicturePrivacy,
    label: "photo de profil"
  });
});
registerCommand({
  nom_cmd: "mystatus",
  classe: "confidentialité",
  react: "📃",
  desc: "Modifier la confidentialité du statut"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "status",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateStatusPrivacy,
    label: "statut"
  });
});
registerCommand({
  nom_cmd: "read",
  classe: "confidentialité",
  react: "📖",
  desc: "Modifier la confidentialité des confirmations de lecture"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "read",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateReadReceiptsPrivacy,
    label: "confirmation de lecture"
  });
});
registerCommand({
  nom_cmd: "groupadd",
  classe: "confidentialité",
  react: "➕",
  desc: "Modifier la confidentialité d'ajout en groupe"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "groupadd",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateGroupsAddPrivacy,
    label: "ajout en groupe"
  });
});

