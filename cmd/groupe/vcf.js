'use strict';

const fs = require('fs');
const { Ranks } = require('../../database/rank');
const { registerCommand } = require('../../lib/commands');

registerCommand({
  nom_cmd: "vcf",
  classe: "Groupe",
  react: "📇",
  desc: "Enregistre les contacts de tous les membres du groupe dans un fichier VCF"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    infos_Groupe,
    isOwner,
    ms
  } = ctx;
  try {
    if (!verif_Groupe) {
      return sock.sendMessage(chatJid, {
        text: "Cette commande doit être utilisée dans un groupe."
      }, {
        quoted: ms
      });
    }
    if (!isOwner) {
      return sock.sendMessage(chatJid, {
        text: "Seul le propriétaire du bot peut utiliser cette commande."
      }, {
        quoted: ms
      });
    }
    const groupJid = infos_Groupe;
    if (!groupJid || !groupJid.participants) {
      return sock.sendMessage(chatJid, {
        text: "Échec de la récupération des métadonnées du groupe ou de la liste des participants."
      }, {
        quoted: ms
      });
    }
    const value = groupJid.participants;
    const list = [];
    for (const tmp of value) {
      const value2 = tmp.jid;
      const value3 = value2.split("@")[0];
      let groupJid2 = value3;
      try {
        const record = await Ranks.findOne({
          where: {
            id: value2
          }
        }).catch(() => null);
        if (record && record.name) {
          groupJid2 = record.name;
        } else if (tmp.notify) {
          groupJid2 = tmp.notify;
        }
      } catch {
        groupJid2 = value3;
      }
      list.push("BEGIN:VCARD\nVERSION:3.0\nFN:" + groupJid2 + "\nTEL;TYPE=CELL:" + value3 + "\nEND:VCARD");
    }
    const value4 = groupJid.subject || "Groupe_" + chatJid.replace(/[@.]/g, "_");
    const url = "contacts_groupe_" + value4 + ".vcf";
    const url2 = "./" + url;
    fs.writeFileSync(url2, list.join("\n"));
    const url3 = "*TOUS LES CONTACTS DES MEMBRES ENREGISTRÉS*\nGroupe : *" + value4 + "*\nContacts : *" + value.length + "*";
    await sock.sendMessage(chatJid, {
      document: fs.readFileSync(url2),
      mimetype: "text/vcard",
      filename: url,
      caption: url3
    }, {
      quoted: ms
    });
    fs.unlinkSync(url2);
  } catch (err) {
    console.error("Erreur lors du traitement de la commande vcf:", err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors du traitement de la commande vcf."
    }, {
      quoted: ms
    });
  }
});
