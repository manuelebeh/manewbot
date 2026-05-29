'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget, GroupSettings,
} = require('./deps');

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

