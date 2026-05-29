'use strict';

const { jidDecode } = require('@whiskeysockets/baileys');

/** Normalise un JID Baileys (décode les formes device:id@…). */
function decodeJid(jid) {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {};
    return (
      (decoded.user && decoded.server && `${decoded.user}@${decoded.server}`) ||
      jid
    );
  }
  return jid;
}

module.exports = { decodeJid };
