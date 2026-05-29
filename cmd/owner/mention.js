'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner } = require('../../lib/require-owner');
const { setMention, delMention, getMention } = require('../../database/mention');

const SUDO_ONLY = '❌ Seuls les utilisateurs sudo peuvent utiliser cette commande.';

registerCommand(
  {
    nom_cmd: 'setmention',
    classe: 'Owner',
    react: '✅',
    desc: "Configurer le message d'antimention global",
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg } = ctx;
    if (!requireOwner(ctx, () => repondre(SUDO_ONLY))) return;

    try {
      const text = arg.join(' ');
      if (!text) {
        return repondre(
          "🛠️ Utilisation de la commande *setmention* :\n\n1️⃣ Pour une image, vidéo, audio ou texte avec type spécifié :\n> *setmention type=audio url=https://exemple.com/fichier.opus*\n> *setmention type=video url=https://exemple.com/video.mp4 text=Votre_message_ici*\n> *setmention type=texte text=Votre_message_ici*\n> *setmention type=image url=https://exemple.com/image.jpg text=Votre_message_ici*\n\n📌 Les types valides sont : audio, video, texte, image."
        );
      }

      let url = '';
      let messageText = '';
      let mediaType = '';
      const pattern = /(type|url|text)=(.*?)(?=\s(?:type=|url=|text=)|$)/gis;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const key = match[1].toLowerCase();
        const val = match[2].trim();
        if (key === 'type') mediaType = val.toLowerCase();
        else if (key === 'url') url = val;
        else if (key === 'text') messageText = val.replace(/_/g, ' ');
      }

      if (!mediaType) {
        return repondre(
          "❌ Vous devez préciser le type avec 'type=audio', 'type=video', 'type=texte' ou 'type=image'."
        );
      }

      await setMention({ url, text: messageText, type: mediaType, mode: 'oui' });
      return repondre("✅ Mention de type '" + mediaType + "' enregistrée avec succès.");
    } catch (err) {
      console.error('Erreur dans setmention:', err);
      repondre("Une erreur s'est produite lors de la configuration.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'delmention',
    classe: 'Owner',
    react: '🚫',
    desc: "Désactiver le système d'antimention",
  },
  async (chatJid, sock, ctx) => {
    const { repondre } = ctx;
    if (!requireOwner(ctx, () => repondre('Seuls les utilisateurs sudo peuvent utiliser cette commande.'))) {
      return;
    }
    try {
      await delMention();
      return repondre('✅ mention désactivé.');
    } catch (err) {
      console.error('Erreur dans delmention:', err);
      repondre("Une erreur s'est produite.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'getmention',
    classe: 'Owner',
    react: '📄',
    desc: "Afficher la configuration actuelle de l'antimention",
  },
  async (chatJid, sock, ctx) => {
    const { repondre } = ctx;
    try {
      if (!requireOwner(ctx, () => repondre('Seuls les utilisateurs sudo peuvent utiliser cette commande.'))) {
        return;
      }

      const row = await getMention();
      if (!row || row.mode === 'non') {
        return repondre('ℹ️ Antimention désactivé ou non configuré.');
      }

      const { url, text, type } = row;
      if ((!url || url === '') && (!text || text === '')) {
        return repondre('ℹ️ Antimention activé mais aucun contenu défini.');
      }

      switch (type) {
        case 'audio':
          if (!url) return repondre(text || 'Aucun contenu audio défini.');
          return sock.sendMessage(
            chatJid,
            { audio: { url }, mimetype: 'audio/mp4', ptt: true },
            { quoted: null }
          );
        case 'image':
          if (!url) return repondre(text || 'Aucun contenu image défini.');
          return sock.sendMessage(
            chatJid,
            { image: { url }, caption: text || undefined },
            { quoted: null }
          );
        case 'video':
          if (!url) return repondre(text || 'Aucun contenu vidéo défini.');
          return sock.sendMessage(
            chatJid,
            { video: { url }, caption: text || undefined },
            { quoted: null }
          );
        case 'texte':
          return repondre(text || 'Aucun message texte défini.');
        default:
          return repondre('Le type de média est inconnu ou non pris en charge.');
      }
    } catch (err) {
      console.error('Erreur dans getmention:', err);
      repondre("Impossible d'afficher la configuration.");
    }
  }
);
