'use strict';

const DEFAULT_MSG = "❌ Vous n'avez pas la permission d'exécuter cette commande.";

/** @param {Function} onDenied called when ctx.isOwner is false */
function requireOwner(ctx, onDenied, message = DEFAULT_MSG) {
  if (!ctx.isOwner) {
    if (typeof onDenied === 'function') {
      onDenied(message);
    }
    return false;
  }
  return true;
}

function ownerReply(sock, chatJid, ms, text, payload = {}) {
  return sock.sendMessage(chatJid, { text, ...payload }, ms ? { quoted: ms } : undefined);
}

module.exports = { requireOwner, ownerReply, DEFAULT_MSG };
