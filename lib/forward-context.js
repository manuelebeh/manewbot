'use strict';

const config = require('../set');

/** Optional WhatsApp channel forward metadata (empty JID = disabled). */
function buildForwardContextInfo(extra = {}) {
  const jid = String(config.WHATSAPP_NEWSLETTER_JID || '').trim();
  const name = String(
    config.WHATSAPP_NEWSLETTER_NAME || config.NOM_BOT || 'Manewbot'
  ).trim();

  if (!jid) {
    return { ...extra };
  }

  return {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: jid,
      newsletterName: name,
      ...(extra.forwardedNewsletterMessageInfo || {}),
    },
    ...extra,
  };
}

module.exports = { buildForwardContextInfo };
