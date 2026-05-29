'use strict';

const { canModerateTarget } = require('./parse-env-lists');

function groupReply(sock, chatJid, ms, text, payload = {}) {
  return sock.sendMessage(chatJid, { text, ...payload }, { quoted: ms });
}

async function resolveModerationTarget(ctx, sock, chatJid, argIndex = 0) {
  const { getJid, auteur_Msg_Repondu, arg } = ctx;
  const raw =
    auteur_Msg_Repondu ||
    (arg[argIndex]?.includes('@') && arg[argIndex].replace('@', '') + '@lid');
  return getJid(raw, chatJid, sock);
}

function getAdminJids(participants) {
  return participants.filter((member) => member.admin).map((member) => member.jid);
}

function getSuperAdminJid(participants) {
  return participants.find((member) => member.admin === 'superadmin')?.jid || participants[0]?.jid;
}

function getKickallAllowed(participants, botJid, ownerJid) {
  return [getSuperAdminJid(participants), botJid, ownerJid].filter(Boolean);
}

function canRunKickall(actorJid, kickallAllowed, isOwner) {
  return kickallAllowed.includes(actorJid) || isOwner;
}

function filterKickableMembers(participants, isOwner, ownerJid, sudoJids, prefix = null) {
  return participants
    .filter(
      (member) =>
        (!prefix || member.jid.startsWith(prefix)) &&
        !member.admin &&
        canModerateTarget(isOwner, member.jid, ownerJid, sudoJids)
    )
    .map((member) => member.jid);
}

function moderationDeniedText(isOwner, targetJid, ownerJid, verb) {
  if (ownerJid && targetJid === ownerJid) {
    return `Impossible ${verb} le propriétaire du bot.`;
  }
  return `Seul le propriétaire du bot peut ${verb} un utilisateur sudo.`;
}

async function ensureGoodbyeDisabled(chatJid, GroupSettings, sock, ms, message) {
  const record = await GroupSettings.findOne({ where: { id: chatJid } });
  if (record?.goodbye === 'oui') {
    groupReply(sock, chatJid, ms, message);
    return false;
  }
  return true;
}

function requireGroup(ctx, sock, chatJid, ms) {
  if (!ctx.verif_Groupe) {
    groupReply(sock, chatJid, ms, 'Commande utilisable uniquement dans les groupes.');
    return false;
  }
  return true;
}

function requireGroupAdmin(ctx, sock, chatJid, ms) {
  if (!ctx.isSudo && !ctx.verif_Admin) {
    groupReply(sock, chatJid, ms, "Vous n'avez pas la permission d'utiliser cette commande.");
    return false;
  }
  return true;
}

function requireBotAdmin(ctx, sock, chatJid, ms) {
  if (!ctx.verif_Bot_Admin) {
    groupReply(sock, chatJid, ms, 'Je dois être administrateur pour effectuer cette action.');
    return false;
  }
  return true;
}

async function prepareKickall(ctx, sock, chatJid, ms, GroupSettings, options = {}) {
  if (!requireGroup(ctx, sock, chatJid, ms)) return null;

  const participants = ctx.infos_Groupe.participants;
  const kickallAllowed = getKickallAllowed(participants, ctx.id_Bot, ctx.ownerJid);

  if (!canRunKickall(ctx.auteur_Message, kickallAllowed, ctx.isOwner)) {
    groupReply(
      sock,
      chatJid,
      ms,
      options.deniedMsg ||
        'Seul le créateur du groupe ou le propriétaire du bot peut utiliser cette commande.'
    );
    return null;
  }

  if (!requireBotAdmin(ctx, sock, chatJid, ms)) return null;

  const goodbyeOk = await ensureGoodbyeDisabled(
    chatJid,
    GroupSettings,
    sock,
    ms,
    options.goodbyeMsg ||
      'Désactivez le goodbye message (goodbye off) avant de continuer.'
  );
  if (!goodbyeOk) return null;

  return { participants, kickallAllowed };
}

module.exports = {
  groupReply,
  resolveModerationTarget,
  getAdminJids,
  getKickallAllowed,
  canRunKickall,
  filterKickableMembers,
  moderationDeniedText,
  ensureGoodbyeDisabled,
  requireGroup,
  requireGroupAdmin,
  requireBotAdmin,
  prepareKickall,
};
