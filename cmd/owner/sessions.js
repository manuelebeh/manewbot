'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner, ownerReply } = require('../../lib/require-owner');
const {
  saveSecondSession,
  getSecondAllSessions,
  deleteSecondSession,
} = require('../../database/connect');

registerCommand(
  {
    nom_cmd: 'connect',
    classe: 'Owner',
    desc: 'Connexion d\'un compte avec le bot via session_id',
  },
  async (chatJid, sock, ctx) => {
    try {
      const { arg, ms, repondre, auteur_Message } = ctx;
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, "🚫 Vous n'avez pas le droit d'exécuter cette commande."))) {
        return;
      }
      if (!arg || !arg[0]) {
        return ownerReply(sock, chatJid, ms, '❗ Exemple : .connect SESSION_ID');
      }

      const sessionId = arg[0].trim();
      console.log(
        `🌀 Tentative de connexion par ${auteur_Message} pour session_id: ${sessionId}`
      );

      const saved = await saveSecondSession(sessionId);
      if (!saved) {
        return repondre('❌ La session est invalide ou n\'a pas pu être enregistrée.');
      }

      return ownerReply(
        sock,
        chatJid,
        ms,
        `✅ Tentative de connexion enregistrée pour la session : ${sessionId}`
      );
    } catch (err) {
      return sock.sendMessage(chatJid, { text: '❌ Erreur : ' + err.message });
    }
  }
);

registerCommand(
  {
    nom_cmd: 'connect_session',
    classe: 'Owner',
    desc: 'Affiche la liste des numéros connectés',
  },
  async (chatJid, sock, ctx) => {
    try {
      const { ms } = ctx;
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, "Vous n'avez pas le droit d'exécuter cette commande."))) {
        return;
      }

      const sessions = await getSecondAllSessions();
      if (!sessions || sessions.length === 0) {
        return ownerReply(
          sock,
          chatJid,
          ms,
          '📭 Aucune session secondaire active pour le moment.'
        );
      }

      const jids = sessions.map((entry) => entry.numero + '@s.whatsapp.net');
      const text = jids.map((jid) => '@' + jid.split('@')[0]).join('\n');
      await sock.sendMessage(
        chatJid,
        {
          text: `📡 *Sessions secondaires connectées (${sessions.length})* :\n\n${text}`,
          mentions: jids,
        },
        { quoted: ms }
      );
    } catch (err) {
      return sock.sendMessage(chatJid, { text: '❌ Erreur : ' + err.message });
    }
  }
);

registerCommand(
  {
    nom_cmd: 'disconnect',
    classe: 'Owner',
    desc: 'Supprime une session connectée par session_id',
  },
  async (chatJid, sock, ctx) => {
    try {
      const { arg, ms } = ctx;
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, "Vous n'avez pas le droit d'exécuter cette commande."))) {
        return;
      }
      if (!arg || !arg[0]) {
        return ownerReply(
          sock,
          chatJid,
          ms,
          'Usage : .disconnect numero(sans le + et collé)'
        );
      }

      const digits = arg.join(' ').replace(/[^0-9]/g, '');
      const deleted = await deleteSecondSession(digits);
      if (deleted === 0) {
        return ownerReply(
          sock,
          chatJid,
          ms,
          `Aucune session trouvée pour le numéro : ${digits}`
        );
      }

      await ownerReply(
        sock,
        chatJid,
        ms,
        `✅ Session pour le numéro: ${digits} supprimée avec succès.`
      );
    } catch (err) {
      return sock.sendMessage(chatJid, { text: '❌ Erreur : ' + err.message });
    }
  }
);
