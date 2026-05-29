'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget,
} = require('./_shared');

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

