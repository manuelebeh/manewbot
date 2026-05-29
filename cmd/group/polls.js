'use strict';

const { registerCommand } = require('../../lib/commands');

registerCommand({
  nom_cmd: "poll",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(plusieurs votés autorisé)."
}, async (chatJid, sock, ctx) => {
  const { ms, repondre, arg, verif_Groupe, verif_Admin } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes.");
    }
    let [tmp, tmp2] = arg.join(" ").split(";");
    if (!tmp2) {
      return repondre("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let value = tmp2.split(",").map(tmp3 => tmp3.trim()).filter(tmp4 => tmp4.length > 0);
    if (value.length < 2) {
      return repondre("Le sondage doit contenir au moins deux options.");
    }
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        poll: {
          name: tmp,
          values: value
        }
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du sondage :", err);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
registerCommand({
  nom_cmd: "poll2",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(un seul vote autorisé)."
}, async (chatJid, sock, ctx) => {
  const { ms, repondre, arg, verif_Groupe, verif_Admin } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes.");
    }
    let [tmp, tmp2] = arg.join(" ").split(";");
    if (!tmp2) {
      return repondre("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let value = tmp2.split(",").map(tmp3 => tmp3.trim()).filter(tmp4 => tmp4.length > 0);
    if (value.length < 2) {
      return repondre("Le sondage doit contenir au moins deux options.");
    }
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        poll: {
          name: tmp,
          values: value,
          selectableCount: 1
        }
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du sondage :", err);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
