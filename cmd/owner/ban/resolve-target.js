'use strict';

async function resolveTarget(ctx, sock, chatJid) {
  const { getJid, auteur_Msg_Repondu, arg } = ctx;
  const raw =
    auteur_Msg_Repondu || (arg[0]?.includes('@') && arg[0].replace('@', '') + '@lid');
  return getJid(raw, chatJid, sock);
}

module.exports = { resolveTarget };
