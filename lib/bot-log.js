'use strict';

/**
 * Niveau de log des messages entrants en console.
 * - off : rien
 * - minimal : auteur, source, type (pas le texte)
 * - full : log détaillé avec texte
 * Défaut : off si NODE_ENV=production, sinon minimal.
 */
function resolveMessageLogMode() {
  const raw = String(process.env.LOG_MESSAGES || '').trim().toLowerCase();
  if (['off', 'false', '0', 'no', 'non'].includes(raw)) return 'off';
  if (['minimal', 'min'].includes(raw)) return 'minimal';
  if (['full', 'on', 'true', '1', 'yes', 'oui'].includes(raw)) return 'full';
  if (process.env.NODE_ENV === 'production') return 'off';
  return 'minimal';
}

function logIncomingMessage({
  pushName,
  senderJid,
  sourceLabel,
  contentType,
  viewOnce,
  messageText,
  quotedInfo,
  quotedAuthorJid,
}) {
  const mode = resolveMessageLogMode();
  if (mode === 'off') return;

  const logLines = [
    '',
    '━━━━━━━[ BOT-LOG ]━━━━━━',
    `👤 Auteur  : ${pushName} (${senderJid})`,
    `🏷️ Source  : ${sourceLabel}`,
    `📩 Type    : ${contentType}${viewOnce ? ' 👁️ (vue unique)' : ''}`,
  ];

  if (viewOnce) {
    logLines.push('👁️ Info    : Vue unique reçue');
  }

  if (mode === 'full') {
    if (messageText && messageText.trim() !== '') {
      logLines.push(`📝 Texte   : ${messageText}`);
    } else if (viewOnce) {
      logLines.push(`📎 Média   : contenu vue unique (${contentType})`);
    }
    if (quotedInfo) {
      const quotedAuthor = quotedAuthorJid
        ? `@${quotedAuthorJid.split('@')[0]}`
        : 'inconnu';
      logLines.push(
        `↩️ Réponse  : à ${quotedInfo.type}${
          quotedInfo.viewOnce ? ' 👁️ (vue unique)' : ''
        } de ${quotedAuthor}`
      );
    }
  }

  logLines.push('━━━━━━━━━━━━━━━━━━━━━━━', '');
  console.log(logLines.join('\n'));
}

module.exports = {
  resolveMessageLogMode,
  logIncomingMessage,
};
