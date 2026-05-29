'use strict';

const {
  registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget,
} = require('./_shared');

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

