'use strict';

const {
  isRestrictedGroup,
  canUseRestrictedGroup,
} = require('./parse-env-lists');

function commandMatchesList(cmd, entries) {
  return entries.some(
    (entry) => entry.nom_cmd === cmd.nom_cmd || cmd.alias?.includes(entry.nom_cmd)
  );
}

/**
 * Pure ACL gate — returns true if the command may run.
 * DB access is injected via deps for testability.
 */
async function shouldAllowCommand({
  cmd,
  config,
  chatJid,
  senderJid,
  isGroup,
  isStaff,
  isAdmin,
  listCmd,
  isBanned,
  onlyAdminsFindOne,
}) {
  if (chatJid.endsWith('@newsletter')) {
    return true;
  }

  const privateCmds = await listCmd('private');
  const publicCmds = await listCmd('public');
  const isPrivateCmd = commandMatchesList(cmd, privateCmds);
  const isPublicCmd = commandMatchesList(cmd, publicCmds);

  if (config.MODE !== 'public' && !isStaff && !isPublicCmd) {
    return false;
  }
  if (config.MODE === 'public' && !isStaff && isPrivateCmd) {
    return false;
  }
  if (isRestrictedGroup(chatJid, config) && !canUseRestrictedGroup(senderJid, isStaff, config)) {
    return false;
  }
  if (!isStaff && (await isBanned('user', senderJid))) {
    return false;
  }
  if (!isStaff && isGroup && (await isBanned('group', chatJid))) {
    return false;
  }
  if (!isAdmin && isGroup && (await onlyAdminsFindOne(chatJid))) {
    return false;
  }

  return true;
}

async function runCommand({
  cmd,
  skipReact = false,
  config,
  chatJid,
  senderJid,
  isGroup,
  isStaff,
  isAdmin,
  sock,
  msg,
  owerlap,
  listCmd,
  isBanned,
  onlyAdminsFindOne,
  resolveCommandReactEnabled,
}) {
  const allowed = await shouldAllowCommand({
    cmd,
    config,
    chatJid,
    senderJid,
    isGroup,
    isStaff,
    isAdmin,
    listCmd,
    isBanned,
    onlyAdminsFindOne,
  });
  if (!allowed) {
    return;
  }

  if (!skipReact && resolveCommandReactEnabled(config)) {
    await sock.sendMessage(chatJid, {
      react: {
        text: cmd.react || '🪄',
        key: msg.key,
      },
    });
  }

  await cmd.fonction(chatJid, sock, owerlap);
}

module.exports = {
  commandMatchesList,
  shouldAllowCommand,
  runCommand,
};
