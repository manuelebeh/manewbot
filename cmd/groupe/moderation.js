'use strict';

const { registerCommand } = require('../../lib/commands');
const { GroupSettings } = require('../../database/events');
const { setWarn, delWarn, getLimit, setLimit } = require('../../database/warn');
const { canModerateTarget } = require('../../lib/parse-env-lists');
const {
  groupReply,
  resolveModerationTarget,
  getAdminJids,
  filterKickableMembers,
  moderationDeniedText,
  requireGroup,
  requireGroupAdmin,
  requireBotAdmin,
  prepareKickall,
  canRunKickall,
} = require('../../lib/group-moderation');

registerCommand(
  {
    nom_cmd: 'kick',
    classe: 'Groupe',
    react: '🛑',
    desc: 'Supprime un membre du groupe.',
  },
  async (chatJid, sock, ctx) => {
    const { infos_Groupe, isSudo, verif_Admin, isOwner, ownerJid, sudoJids, ms } = ctx;
    if (!requireGroup(ctx, sock, chatJid, ms)) return;
    if (!isSudo && !verif_Admin) {
      return groupReply(sock, chatJid, ms, "Vous n'avez pas la permission d'utiliser cette commande.");
    }

    const participants = infos_Groupe.participants;
    const adminJids = getAdminJids(participants);
    const targetJid = await resolveModerationTarget(ctx, sock, chatJid);
    if (!requireBotAdmin(ctx, sock, chatJid, ms)) return;

    if (!targetJid || !participants.find((member) => member.jid === targetJid)) {
      return groupReply(sock, chatJid, ms, 'Membre introuvable dans ce groupe.');
    }
    if (adminJids.includes(targetJid)) {
      return groupReply(sock, chatJid, ms, "Impossible d'exclure un administrateur du groupe.");
    }
    if (!canModerateTarget(isOwner, targetJid, ownerJid, sudoJids)) {
      return groupReply(
        sock,
        chatJid,
        ms,
        moderationDeniedText(isOwner, targetJid, ownerJid, "d'exclure")
      );
    }

    try {
      await sock.groupParticipantsUpdate(chatJid, [targetJid], 'remove');
      groupReply(sock, chatJid, ms, '@' + targetJid.split('@')[0] + ' a été exclu.', {
        mentions: [targetJid],
      });
    } catch (err) {
      console.error('Erreur :', err);
      groupReply(sock, chatJid, ms, "Une erreur est survenue lors de l'exclusion.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'kickall',
    classe: 'Groupe',
    react: '🛑',
    desc: 'Supprime tous les membres non administrateurs du groupe.',
  },
  async (chatJid, sock, ctx) => {
    const { isOwner, ownerJid, sudoJids, ms, getJid } = ctx;
    const prep = await prepareKickall(ctx, sock, chatJid, ms, GroupSettings);
    if (!prep) return;

    const targets = filterKickableMembers(prep.participants, isOwner, ownerJid, sudoJids);
    if (targets.length === 0) {
      return groupReply(sock, chatJid, ms, 'Aucun membre non administrateur à exclure.');
    }

    await groupReply(
      sock,
      chatJid,
      ms,
      "⚠️ Kickall va commencer dans 5 secondes.\nEnvoyez 'stop' pour annuler."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));

    let cancelled = false;
    for (const targetJid of targets) {
      const replyMsg = await sock.recup_msg({ ms_org: chatJid, temps: 300000 });
      const replyText = (
        replyMsg?.message?.conversation ||
        replyMsg?.message?.extendedTextMessage?.text ||
        ''
      )
        .trim()
        .toLowerCase();
      const replyAuthor = replyMsg?.key?.participant || replyMsg?.key?.remoteJid;
      const replyJid = await getJid(replyAuthor, chatJid, sock);

      if (
        replyText === 'stop' &&
        canRunKickall(replyJid, prep.kickallAllowed, isOwner)
      ) {
        cancelled = true;
        await groupReply(sock, chatJid, ms, '⛔ Kickall annulé !');
        break;
      }

      try {
        await sock.groupParticipantsUpdate(chatJid, [targetJid], 'remove');
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Erreur exclusion ' + targetJid + ' :', err);
      }
    }

    if (!cancelled) {
      groupReply(sock, chatJid, ms, '✅ ' + targets.length + ' membre(s) ont été exclus.');
    }
  }
);

registerCommand(
  {
    nom_cmd: 'kickall2',
    classe: 'Groupe',
    react: '🚫',
    desc: 'Exclut tous les membres non administrateurs d’un coup.',
  },
  async (chatJid, sock, ctx) => {
    const { isOwner, ownerJid, sudoJids, ms } = ctx;
    const prep = await prepareKickall(ctx, sock, chatJid, ms, GroupSettings, {
      deniedMsg: '❌ Seul le superadmin ou le propriétaire du bot peut utiliser cette commande.',
      goodbyeMsg: '❗ Désactivez d’abord le message de départ (goodbye off).',
    });
    if (!prep) return;

    const targets = filterKickableMembers(prep.participants, isOwner, ownerJid, sudoJids);
    if (targets.length === 0) {
      return groupReply(sock, chatJid, ms, '✅ Aucun membre non administrateur à exclure.');
    }

    try {
      await sock.groupParticipantsUpdate(chatJid, targets, 'remove');
      groupReply(sock, chatJid, ms, '✅ ' + targets.length + ' membre(s) ont été exclus.');
    } catch (err) {
      console.error('❌ Erreur exclusion en masse :', err);
      groupReply(
        sock,
        chatJid,
        ms,
        '❌ Échec de l’exclusion en masse. Certains membres n’ont peut-être pas été retirés.'
      );
    }
  }
);

registerCommand(
  {
    nom_cmd: 'ckick',
    classe: 'Groupe',
    react: '🛑',
    desc: 'Supprime tous les membres non administrateurs dont le JID commence par un indicatif spécifique.',
  },
  async (chatJid, sock, ctx) => {
    const { arg, isOwner, ownerJid, sudoJids, ms } = ctx;
    const prep = await prepareKickall(ctx, sock, chatJid, ms, GroupSettings, {
      deniedMsg: '❌ Seul le superadmin ou le propriétaire du bot peut utiliser cette commande.',
    });
    if (!prep) return;

    if (!arg[0]) {
      return groupReply(sock, chatJid, ms, "Veuillez spécifier l'indicatif.");
    }

    const prefix = arg[0];
    const targets = filterKickableMembers(
      prep.participants,
      isOwner,
      ownerJid,
      sudoJids,
      prefix
    );
    if (targets.length === 0) {
      return groupReply(
        sock,
        chatJid,
        ms,
        "Aucun membre non admin avec l'indicatif " + prefix + '.'
      );
    }

    for (const targetJid of targets) {
      try {
        await sock.groupParticipantsUpdate(chatJid, [targetJid], 'remove');
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Erreur exclusion ' + targetJid + ' :', err);
      }
    }

    groupReply(
      sock,
      chatJid,
      ms,
      '✅ ' + targets.length + ' membre(s) avec l\'indicatif ' + prefix + ' ont été exclus.'
    );
  }
);

registerCommand(
  {
    nom_cmd: 'promote',
    classe: 'Groupe',
    react: '⬆️',
    desc: 'Promouvoir un membre comme administrateur.',
  },
  async (chatJid, sock, ctx) => {
    const { infos_Groupe, ms } = ctx;
    if (!requireGroup(ctx, sock, chatJid, ms)) return;
    if (!requireGroupAdmin(ctx, sock, chatJid, ms)) return;

    const participants = infos_Groupe.participants;
    const adminJids = getAdminJids(participants);
    const targetJid = await resolveModerationTarget(ctx, sock, chatJid);
    if (!requireBotAdmin(ctx, sock, chatJid, ms)) return;

    if (!targetJid) {
      return groupReply(sock, chatJid, ms, 'Veuillez mentionner un membre à promouvoir.');
    }
    if (!participants.find((member) => member.jid === targetJid)) {
      return groupReply(sock, chatJid, ms, 'Membre introuvable dans ce groupe.');
    }
    if (adminJids.includes(targetJid)) {
      return groupReply(sock, chatJid, ms, 'ce membre est déjà un administrateur du groupe.');
    }

    try {
      await sock.groupParticipantsUpdate(chatJid, [targetJid], 'promote');
      groupReply(
        sock,
        chatJid,
        ms,
        '@' + targetJid.split('@')[0] + ' a été promu administrateur.',
        { mentions: [targetJid] }
      );
    } catch (err) {
      console.error('Erreur :', err);
      groupReply(sock, chatJid, ms, 'Une erreur est survenue lors de la promotion.');
    }
  }
);

registerCommand(
  {
    nom_cmd: 'demote',
    classe: 'Groupe',
    react: '⬇️',
    desc: "Retirer le rôle d'administrateur à un membre.",
  },
  async (chatJid, sock, ctx) => {
    const { infos_Groupe, isOwner, ownerJid, sudoJids, ms } = ctx;
    if (!requireGroup(ctx, sock, chatJid, ms)) return;
    if (!requireGroupAdmin(ctx, sock, chatJid, ms)) return;

    const participants = infos_Groupe.participants;
    const adminJids = getAdminJids(participants);
    const targetJid = await resolveModerationTarget(ctx, sock, chatJid);
    if (!requireBotAdmin(ctx, sock, chatJid, ms)) return;

    if (!targetJid) {
      return groupReply(sock, chatJid, ms, 'Veuillez mentionner un membre à rétrograder.');
    }
    if (!participants.find((member) => member.jid === targetJid)) {
      return groupReply(sock, chatJid, ms, 'Membre introuvable dans ce groupe.');
    }
    if (!adminJids.includes(targetJid)) {
      return groupReply(sock, chatJid, ms, "ce membre n'est pas un administrateur du groupe.");
    }
    if (!canModerateTarget(isOwner, targetJid, ownerJid, sudoJids)) {
      return groupReply(
        sock,
        chatJid,
        ms,
        moderationDeniedText(isOwner, targetJid, ownerJid, 'de rétrograder')
      );
    }

    try {
      await sock.groupParticipantsUpdate(chatJid, [targetJid], 'demote');
      groupReply(sock, chatJid, ms, '@' + targetJid.split('@')[0] + ' a été rétrogradé.', {
        mentions: [targetJid],
      });
    } catch (err) {
      console.error('Erreur :', err);
      groupReply(sock, chatJid, ms, 'Une erreur est survenue lors de la rétrogradation.');
    }
  }
);

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
