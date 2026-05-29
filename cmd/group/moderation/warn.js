'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget,
} = require('./deps');

registerCommand(
  {
    nom_cmd: 'warn',
    classe: 'Groupe',
    react: '⚠️',
    desc: 'Avertit un membre du groupe ou gère les avertissements.',
  },
  async (chatJid, sock, ctx) => {
    const {
      infos_Groupe,
      arg,
      isSudo,
      verif_Admin,
      isOwner,
      ownerJid,
      sudoJids,
      ms,
      auteur_Message,
      repondre,
    } = ctx;

    if (!requireGroup(ctx, sock, chatJid, ms)) {
      return repondre('Commande utilisable uniquement dans les groupes.');
    }

    const participants = infos_Groupe.participants;

    if (!arg[0] && !ctx.auteur_Msg_Repondu) {
      return repondre(
        "⚠️ *Utilisation de la commande warn*\n\n• `warn @utilisateur` ou warn en répondant à un de ses messages : Ajouter un avertissement.\n• `warn reset @utilisateur` ou warn reset en répondant à un de ses messages : Réinitialiser les avertissements.\n• `warn limit <nombre>` : Définir la limite d'avertissements."
      );
    }

    if (arg[0] === 'limit') {
      if (!isSudo && !verif_Admin) return repondre("Vous n'avez pas la permission.");
      const amount = parseInt(arg[1], 10);
      if (isNaN(amount) || amount < 1) {
        return repondre('Veuillez entrer une limite valide.');
      }
      await setLimit(amount);
      return repondre("✅ Limite d'avertissements définie à " + amount + '.');
    }

    if (arg[0] === 'reset') {
      if (!isSudo && !verif_Admin) return repondre("Vous n'avez pas la permission.");
      const targetJid = await resolveModerationTarget(ctx, sock, chatJid, 1);
      await delWarn(targetJid);
      return groupReply(
        sock,
        chatJid,
        ms,
        '✅ Les avertissements de @' + targetJid.split('@')[0] + ' ont été réinitialisés.',
        { mentions: [targetJid] }
      );
    }

    const targetJid = await resolveModerationTarget(ctx, sock, chatJid);
    if (!isSudo && !verif_Admin) return repondre("Vous n'avez pas la permission.");
    if (!requireBotAdmin(ctx, sock, chatJid, ms)) {
      return repondre('Je dois être administrateur pour effectuer cette action.');
    }
    const adminJids = getAdminJids(participants);
    if (adminJids.includes(targetJid)) {
      return repondre("Impossible d'avertir un administrateur.");
    }
    if (!canModerateTarget(isOwner, targetJid, ownerJid, sudoJids)) {
      return repondre(
        moderationDeniedText(isOwner, targetJid, ownerJid, "d'avertir")
      );
    }

    const limit = await getLimit();
    const warnRow = await setWarn(targetJid);
    const date = new Date().toLocaleString('fr-FR');

    await sock.sendMessage(
      chatJid,
      {
        text:
          '⚠️ **Avertissement** ⚠️\n\n👤 Utilisateur : @' +
          targetJid.split('@')[0] +
          '\n📌 Warn par : @' +
          auteur_Message.split('@')[0] +
          '\n📅 Date : ' +
          date +
          '\n📊 Total warns : ' +
          warnRow.count +
          '/' +
          limit,
        mentions: [targetJid, auteur_Message],
      },
      { quoted: ms }
    );

    if (warnRow.count >= limit) {
      try {
        await sock.groupParticipantsUpdate(chatJid, [targetJid], 'remove');
        groupReply(
          sock,
          chatJid,
          ms,
          '🚫 @' +
            targetJid.split('@')[0] +
            " a été exclu pour avoir atteint la limite d'avertissements.",
          { mentions: [targetJid] }
        );
        await delWarn(targetJid);
      } catch {
        repondre("Erreur lors de l'exclusion.");
      }
    }
  }
);
