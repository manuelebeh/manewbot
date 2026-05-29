'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget,
} = require('./_shared');

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

