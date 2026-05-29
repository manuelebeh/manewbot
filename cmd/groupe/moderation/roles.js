'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget,
} = require('./_shared');

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

