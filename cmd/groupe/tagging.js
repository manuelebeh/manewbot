'use strict';

const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { registerCommand } = require('../../lib/commands');

registerCommand({
  nom_cmd: "tagall",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les membres d'un groupe"
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    mbre_membre,
    verif_Groupe,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    const text = arg && arg.length > 0 ? arg.join(" ") : "";
    let url = "╭───〔  TAG ALL 〕───⬣\n";
    url += "│👤 Auteur : *" + nom_Auteur_Message + "*\n";
    url += "│💬 Message : *" + text + "*\n│\n";
    mbre_membre.forEach(tmp => {
      url += "│◦❒ @" + tmp.id.split("@")[0] + "\n";
    });
    url += "╰═══════════════⬣\n";
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        text: url,
        mentions: mbre_membre.map(tmp2 => tmp2.id)
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message avec tagall :", err);
  }
});
registerCommand({
  nom_cmd: "tagadmin",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les administrateurs d'un groupe"
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    mbre_membre,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    const text = arg && arg.length > 0 ? arg.join(" ") : "";
    const value = mbre_membre.filter(tmp => tmp.admin).map(tmp2 => tmp2.id);
    if (value.length === 0) {
      return repondre("Aucun administrateur trouvé dans ce groupe.");
    }
    let url = "╭───〔  TAG ADMINS 〕───⬣\n";
    url += "│👤 Auteur : *" + nom_Auteur_Message + "*\n";
    url += "│💬 Message : *" + text + "*\n│\n";
    mbre_membre.forEach(tmp3 => {
      if (tmp3.admin) {
        url += "│◦❒ @" + tmp3.id.split("@")[0] + "\n";
      }
    });
    url += "╰═══════════════⬣\n";
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        text: url,
        mentions: value
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message avec tagadmins :", err);
  }
});
registerCommand({
  nom_cmd: "tag",
  classe: "Groupe",
  react: "💬",
  alias: ["htag", "hidetag"],
  desc: "partager un message à tous les membres d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    msg_Repondu,
    verif_Groupe,
    infos_Groupe,
    arg,
    verif_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    repondre("Cette commande ne fonctionne que dans les groupes");
    return;
  }
  if (verif_Admin) {
    const groupMeta = infos_Groupe;
    const mentionIds = groupMeta.participants.map(member => member.id);
    let payload;
    if (msg_Repondu) {
      if (msg_Repondu.imageMessage) {
        let mediaPath = await sock.dl_save_media_ms(msg_Repondu.imageMessage);
        payload = {
          image: {
            url: mediaPath
          },
          caption: msg_Repondu.imageMessage.caption,
          mentions: mentionIds
        };
      } else if (msg_Repondu.videoMessage) {
        let mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.videoMessage);
        payload = {
          video: {
            url: mediaPath2
          },
          caption: msg_Repondu.videoMessage.caption,
          mentions: mentionIds
        };
      } else if (msg_Repondu.audioMessage) {
        let mediaPath3 = await sock.dl_save_media_ms(msg_Repondu.audioMessage);
        payload = {
          audio: {
            url: mediaPath3
          },
          mimetype: "audio/mp4",
          mentions: mentionIds
        };
      } else if (msg_Repondu.stickerMessage) {
        let mediaPath4 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
        let sticker = new Sticker(mediaPath4, {
          pack: "Manewbot Hidtag",
          type: StickerTypes.FULL,
          quality: 80,
          background: "transparent"
        });
        const stickerBuffer = await sticker.toBuffer();
        payload = {
          sticker: stickerBuffer,
          mentions: mentionIds
        };
      } else {
        payload = {
          text: msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text,
          mentions: mentionIds
        };
      }
      sock.sendMessage(chatJid, payload, {
        quoted: ms
      });
    } else {
      if (!arg || !arg[0]) {
        repondre("Veuillez inclure ou mentionner un message à partager.");
        return;
      }
      sock.sendMessage(chatJid, {
        text: arg.join(" "),
        mentions: mentionIds
      }, {
        quoted: ms
      });
    }
  } else {
    repondre("Cette commande est réservée aux administrateurs du groupe");
  }
});
