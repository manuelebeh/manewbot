const { exec } = require("child_process");
const { ovlcmd } = require("../lib/ovlcmd");
const { Bans, OnlyAdmins } = require('../DataBase/ban');
const { Sudo } = require('../DataBase/sudo');
const config = require('../set');
const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const cheerio = require('cheerio');
const { WA_CONF, WA_CONF2 } = require('../DataBase/wa_conf');
const { ChatbotConf } = require('../DataBase/chatbot');
const path = require('path');
const fs = require("fs");
const { saveSecondSession, getSecondAllSessions, deleteSecondSession } = require("../DataBase/connect");
const  { setMention, delMention, getMention } = require("../DataBase/mention");
const { set_stick_cmd, del_stick_cmd, get_stick_cmd } = require("../DataBase/stick_cmd");
const { set_cmd, del_cmd, list_cmd } = require("../DataBase/public_private_cmd");
const { Plugin } = require('../DataBase/plugin');
const { extractNpmModules, installModules, reloadCommands } = require("../lib/plugin");
const { Levelup } = require('../DataBase/rank');

ovlcmd(
  {
    nom_cmd: "delete",
    classe: "Owner",
    react: "🗑️",
    desc: "Supprimer un message.",
    alias: ["del", "dlt"]
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu, ms, auteur_Msg_Repondu, mtype, verif_Admin, verif_Ovl_Admin, verif_Groupe, dev_num, dev_id, repondre, id_Bot, prenium_id } = cmd_options;

    if (!msg_Repondu) return repondre("Veuillez répondre à un message pour le supprimer.");

    if (dev_num.includes(auteur_Msg_Repondu) && !dev_id)
      return repondre("Vous ne pouvez pas supprimer le message d'un développeur.");

    if (verif_Groupe) {
      if (!verif_Admin) return repondre("Vous devez être administrateur pour supprimer un message dans le groupe.");
      if (!verif_Ovl_Admin) return repondre("Je dois être administrateur pour effectuer cette action.");
    } else {
      if (!prenium_id) return repondre("Seuls les utilisateurs premium peuvent utiliser cette commande en privé.");
    }

    try {
      const key = {
        remoteJid: ms_org,
        fromMe: auteur_Msg_Repondu == id_Bot,
        id: ms.message?.[mtype]?.contextInfo?.stanzaId,
        ...(verif_Groupe && { participant: auteur_Msg_Repondu })
      };

      if (!key.id) return repondre("Impossible de trouver l'ID du message à supprimer.");

      await ovl.sendMessage(ms_org, { delete: key });
    } catch (error) {
      repondre(`Erreur : ${error.message}`);
    }
  }
);

ovlcmd(
  {
    nom_cmd: "clear",
    classe: "Owner",
    react: "🧹",
    desc: "Supprime tous les messages dans cette discussion",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, ms, prenium_id } = cmd_options;

    try {
      if (!prenium_id) {
        return repondre("🔒 Vous n'avez pas le droit d'exécuter cette commande.");
      }

      await ovl.chatModify(
        {
          delete: true,
          lastMessages: [
            {
              key: ms.key,
              messageTimestamp: ms.messageTimestamp,
            },
          ],
        },
        ms_org
      );

      await repondre("🧹 Tous les messages ont été supprimés avec succès.");
    } catch (e) {
      console.error("Erreur lors de la suppression :", e);
      repondre("❌ Erreur lors de la suppression des messages.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "block",
    classe: "Owner",
    react: "⛔",
    desc: "Bloquer un utilisateur par son JID"
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, verif_Groupe, prenium_id } = cmd_options;
    
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!prenium_id) {
        return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
    }
    try {
      await ovl.updateBlockStatus(ms_org, "block");
      repondre(`✅ Utilisateur bloqué avec succès.`);
    } catch (error) {
      console.error("Erreur block:", error);
      repondre(`Impossible de bloquer l'utilisateur.`);
    }
  }
);

ovlcmd(
  {
    nom_cmd: "deblock",
    classe: "Owner",
    react: "✅",
    desc: "Débloquer un utilisateur par son JID"
  },
  async (ms_org, ovl, cmd_options) => {
    const { verif_Groupe, repondre, prenium_id } = cmd_options;
    
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!prenium_id) {
        return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
    }
    try {
      await ovl.updateBlockStatus(ms_org, "unblock");
      repondre(`✅ Utilisateur débloqué avec succès.`);
    } catch (error) {
      console.error("Erreur deblock:", error);
      repondre(`Impossible de débloquer l'utilisateur.`);
    }
  }
);

ovlcmd(
  {
    nom_cmd: "ban",
    classe: "Owner",
    react: "🚫",
    desc: "Bannir un utilisateur des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, ms, arg, getJid, auteur_Msg_Repondu, prenium_id, dev_num } = cmd_options;

    try {
      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
      }
      const cbl =
        auteur_Msg_Repondu || 
        (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@lid`);

      const cible = await getJid(cbl, jid, ovl);
      if (!cible) return repondre("Mentionnez un utilisateur valide à bannir.");

      if (dev_num.includes(cible)) {
      return ovl.sendMessage(jid, { text: "Vous ne pouvez pas bannir un développeur." }, { quoted: ms });
      }
      const [ban] = await Bans.findOrCreate({
        where: { id: cible },
        defaults: { id: cible, type: "user" },
      });

      if (!ban._options.isNewRecord) return repondre("Cet utilisateur est déjà banni !");
      return ovl.sendMessage(jid, { 
        text: `Utilisateur @${cible.split('@')[0]} banni avec succès.`, 
        mentions: [cible]
      }, { quoted: ms });
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande ban :", error);
      return repondre("Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "levelup",
    classe: "Owner",
    react: "⚙️",
    desc: "Activer ou désactiver le message de level up",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, ms, arg } = cmd_options;
    try {
      if (!arg[0]) return repondre("Veuillez préciser 'on' ou 'off'.");

      const choix = arg[0].toLowerCase();
      if (choix !== 'on' && choix !== 'off') {
        return repondre("Argument invalide, utilisez 'on' ou 'off'.");
      }

      const niveau = choix === 'on' ? 'oui' : 'non';

      let record = await Levelup.findOne({ where: { id: 1 } });
      if (!record) {
        record = await Levelup.create({ id: 1, levelup: niveau });
      } else {
        record.levelup = niveau;
        await record.save();
      }

      return ovl.sendMessage(jid, {
        text: `Le message de level up est maintenant ${niveau === 'oui' ? 'activé' : 'désactivé'}.`
      }, { quoted: ms });
    } catch (error) {
      console.error("Erreur commande levelup :", error);
      return repondre("Une erreur est survenue.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "anticall",
    classe: "Owner",
    react: "📵",
    desc: "Active ou désactive le blocage automatique des appels.",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, ms, arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(jid, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
    }

    const config = await WA_CONF2.findOne({ where: { id: "1" } });
    if (!arg[0]) {
      const status = config && config.anticall === "oui" ? "activé" : "désactivé";
      return ovl.sendMessage(jid, { text: `Etat actuel de anticall : ${status}\nUsage : anticall on/off` }, { quoted: ms });
    }

    const val = arg[0].toLowerCase();
    if (val !== "on" && val !== "off") {
      return repondre("Merci d'utiliser : anticall on ou anticall off");
    }

    if (!config) {
      await WA_CONF2.create({ id: "1", anticall: val === "on" ? "oui" : "non" });
      return ovl.sendMessage(jid, { text: `anticall est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    if ((val === "on" && config.anticall === "oui") || (val === "off" && config.anticall === "non")) {
      return ovl.sendMessage(jid, { text: `anticall est déjà ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    config.anticall = val === "on" ? "oui" : "non";
    await config.save();
    return ovl.sendMessage(jid, { text: `anticall est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
  }
);

ovlcmd(
  {
    nom_cmd: "lecture_msg",
    classe: "Owner",
    react: "📖",
    desc: "Active ou désactive la lecture automatique des messages.",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, ms, arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(jid, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
    }

    const config = await WA_CONF2.findOne({ where: { id: "1" } });
    if (!arg[0]) {
      const status = config && config.autoread_msg === "oui" ? "activé" : "désactivé";
      return ovl.sendMessage(jid, { text: `Etat actuel de lecture_msg : ${status}\nUsage : lecture_msg on/off` }, { quoted: ms });
    }

    const val = arg[0].toLowerCase();
    if (val !== "on" && val !== "off") {
      return repondre("Merci d'utiliser : lecture_msg on ou lecture_msg off");
    }

    if (!config) {
      await WA_CONF2.create({ id: "1", autoread_msg: val === "on" ? "oui" : "non" });
      return ovl.sendMessage(jid, { text: `lecture_msg est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    if ((val === "on" && config.autoread_msg === "oui") || (val === "off" && config.autoread_msg === "non")) {
      return ovl.sendMessage(jid, { text: `lecture_msg est déjà ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    config.autoread_msg = val === "on" ? "oui" : "non";
    await config.save();
    return ovl.sendMessage(jid, { text: `lecture_msg est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
  }
);

ovlcmd(
  {
    nom_cmd: "react_msg",
    classe: "Owner",
    react: "🤖",
    desc: "Active ou désactive la réaction automatique aux messages.",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, ms, arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(jid, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
    }

    const config = await WA_CONF2.findOne({ where: { id: "1" } });
    if (!arg[0]) {
      const status = config && config.autoreact_msg === "oui" ? "activé" : "désactivé";
      return ovl.sendMessage(jid, { text: `Etat actuel de react_msg : ${status}\nUsage : react_msg on/off` }, { quoted: ms });
    }

    const val = arg[0].toLowerCase();
    if (val !== "on" && val !== "off") {
      return repondre("Merci d'utiliser : react_msg on ou react_msg off");
    }

    if (!config) {
      await WA_CONF2.create({ id: "1", autoreact_msg: val === "on" ? "oui" : "non" });
      return ovl.sendMessage(jid, { text: `react_msg est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    if ((val === "on" && config.autoreact_msg === "oui") || (val === "off" && config.autoreact_msg === "non")) {
      return ovl.sendMessage(jid, { text: `react_msg est déjà ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
    }

    config.autoreact_msg = val === "on" ? "oui" : "non";
    await config.save();
    return ovl.sendMessage(jid, { text: `react_msg est maintenant ${val === "on" ? "activé" : "désactivé"}.` }, { quoted: ms });
  }
);

ovlcmd(
  {
    nom_cmd: "deban",
    classe: "Owner",
    react: "🚫",
    desc: "Débannir un utilisateur des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, arg, getJid, auteur_Msg_Repondu, prenium_id, ms } = cmd_options;

    try {
      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
      }
      const cbl =
        auteur_Msg_Repondu || 
        (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@lid`);
      
       const cible = await getJid(cbl, jid, ovl);
      if (!cible) return repondre("Mentionnez un utilisateur valide à débannir.");

      const suppression = await Bans.destroy({ where: { id: cible, type: "user" } });
      if (suppression === 0) return repondre("Cet utilisateur n'est pas banni.");
      return ovl.sendMessage(jid, { 
        text: `Utilisateur @${cible.split('@')[0]} débanni avec succès.`, 
        mentions: [cible]
      }, { quoted: ms });
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande debannir :", error);
      return repondre("Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "bangroup",
    classe: "Owner",
    react: "🚫",
    desc: "Bannir un groupe des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, arg, verif_Groupe, prenium_id, ms } = cmd_options;

    try {
      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
      }
      if (!verif_Groupe) return repondre("Cette commande fonctionne uniquement dans les groupes.");

      const cible = jid;

      if (!cible) return repondre("Impossible de récupérer l'identifiant du groupe.");

      const [ban] = await Bans.findOrCreate({
        where: { id: cible },
        defaults: { id: cible, type: "group" },
      });

      if (!ban._options.isNewRecord) return repondre("Ce groupe est déjà banni !");
      return repondre(`Groupe banni avec succès.`);
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande bangroup :", error);
      return repondre("Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "debangroup",
    classe: "Owner",
    react: "🚫",
    desc: "Débannir un groupe des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, arg, verif_Groupe, prenium_id, ms } = cmd_options;

    try {
      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
      }
      if (!verif_Groupe) return repondre("Cette commande fonctionne uniquement dans les groupes.");

      const cible = jid;

      if (!cible) return repondre("Impossible de récupérer l'identifiant du groupe.");

      const suppression = await Bans.destroy({ where: { id: cible, type: "group" } });
      if (suppression === 0) return repondre("Ce groupe n'est pas banni.");
      return repondre(`Groupe débanni avec succès.`);
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande debangroup :", error);
      return repondre("Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "onlyadmins",
    react: "🛡️",
    desc: "Activer ou désactiver le mode only-admins dans un groupe",
    classe: "Owner",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, arg, verif_Groupe, ms, prenium_id } = cmd_options;

    try {
      if (!verif_Groupe) return repondre("❌ Cette commande ne fonctionne que dans un groupe.");

      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "⛔ Vous n'avez pas l'autorisation d'exécuter cette commande." }, { quoted: ms });
      }

      const mode = arg[0]?.toLowerCase();

      if (!["add", "del"].includes(mode)) {
        return repondre("❓ Utilisation : `onlyadmins add` pour activer, `onlyadmins del` pour désactiver.");
      }

      const groupId = ms_org;
      const existing = await OnlyAdmins.findOne({ where: { id: groupId } });

      if (mode === "add") {
        if (existing) {
          return repondre("⚠️ Le mode only-admin est **déjà activé** pour ce groupe.");
        }

        await OnlyAdmins.create({ id: groupId });
        return repondre("✅ Mode only-admin **activé** pour ce groupe.");
      }

      if (mode === "del") {
        if (!existing) {
          return repondre("⚠️ Ce groupe **n'était pas en mode only-admin**.");
        }

        await OnlyAdmins.destroy({ where: { id: groupId } });
        return repondre("❌ Mode only-admin **désactivé** pour ce groupe.");
      }

    } catch (err) {
      console.error("Erreur onlyadmins:", err);
      return repondre("❌ Une erreur s'est produite. Veuillez réessayer.");
    }
  }
);

 ovlcmd(
  {
    nom_cmd: "setsudo",
    classe: "Owner",
    react: "🔒",
    desc: "Ajoute un utilisateur dans la liste des utilisateurs premium.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, arg, getJid, auteur_Msg_Repondu, prenium_id, ms } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
    }
    const cbl =
      auteur_Msg_Repondu ||
      (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@lid`);
 
    const cible = await getJid(cbl, ms_org, ovl);
    if (!cible) {
      return repondre("Veuillez mentionner un utilisateur valide pour l'ajouter en premium.");
    }

    try {
      const [user] = await Sudo.findOrCreate({
        where: { id: cible },
        defaults: { id: cible },
      });

      if (!user._options.isNewRecord) {
        return ovl.sendMessage(ms_org, { 
        text: `L'utilisateur @${cible.split('@')[0]} est déjà un utilisateur premium.`, 
        mentions: [cible]
      }, { quoted: ms });
      }

      return ovl.sendMessage(ms_org, { 
        text: `Utilisateur @${cible.split('@')[0]} ajouté avec succès en tant qu'utilisateur premium.`, 
        mentions: [cible]
      }, { quoted: ms });
      } catch (error) {
      console.error("Erreur lors de l'exécution de la commande setsudo :", error);
      return repondre("Une erreur est survenue lors de l'ajout de l'utilisateur en premium.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "sudolist",
    classe: "Owner",
    react: "📋",
    desc: "Affiche la liste des utilisateurs premium.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, prenium_id, ms } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(ms_org, { text: "Vous n'avez pas la permission d'exécuter cette commande." }, { quoted: ms });
    }

    try {
      const sudoUsers = await Sudo.findAll();

      if (!sudoUsers.length) {
        return repondre("Aucun utilisateur premium n'est actuellement enregistré.");
      }

      const userList = sudoUsers
        .map((user, index) => `🔹 *${index + 1}.* @${user.id.split('@')[0]}`)
        .join("\n");

      const message = `✨ *Liste des utilisateurs Premium* ✨\n\n*Total*: ${sudoUsers.length}\n\n${userList}`;

      return ovl.sendMessage(ms_org, { text: message, mentions: sudoUsers.map(user => user.id) }, { quoted: ms });
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande sudolist :", error);
      return repondre("Une erreur est survenue lors de l'affichage de la liste des utilisateurs premium.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "delsudo",
    classe: "Owner",
    react: "❌",
    desc: "Supprime un utilisateur de la liste des utilisateurs premium.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, getJid, arg, auteur_Msg_Repondu, prenium_id, ms } = cmd_options;
    
    if (!prenium_id) {
      return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
    }

    const cbl =
      auteur_Msg_Repondu ||
      (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@lid`);
    const cible = await getJid(cbl, ms_org, ovl);
    if (!cible) {
      return repondre("Veuillez mentionner un utilisateur");
    }

    try {
      const deletion = await Sudo.destroy({ where: { id: cible } });

      if (deletion === 0) {
        return ovl.sendMessage(ms_org, { 
        text: `L'utilisateur @${cible.split('@')[0]} n'est pas un utilisateur premium.`, 
        mentions: [cible]
      }, { quoted: ms });
      }

        return ovl.sendMessage(ms_org, { 
        text: `Utilisateur @${cible.split('@')[0]} supprimé avec succès de la liste premium.`, 
        mentions: [cible]
      }, { quoted: ms });
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande delsudo :", error);
      return repondre("Une erreur est survenue lors de la suppression de l'utilisateur de la liste premium.");
    }
  }
);

ovlcmd(
    {
        nom_cmd: "tgs",
        classe: "Owner",
        react: "🔍",
        desc: "Importe des stickers Telegram sur WhatsApp",
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, prenium_id, ms } = cmd_options;

        if (!prenium_id) {
            return ovl.sendMessage(ms_org, { text: "❌ Vous n'avez pas le droit d'exécuter cette commande." });
        }

        if (!arg[0]) {
            return repondre("Merci de fournir un lien de stickers Telegram valide.");
        }

        const lien = arg[0];
        const nomStickers = lien.split("/addstickers/")[1];

        if (!nomStickers) {
            return repondre("❌ Lien incorrect.");
        }

        const TELEGRAM_TOKEN = "REDACTED";
        const urlAPI = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getStickerSet?name=${nomStickers}`;

        try {
            const { data } = await axios.get(urlAPI);
            const stickers = data.result.stickers;

            if (!stickers || stickers.length === 0) {
                return repondre("Aucun sticker trouvé dans cet ensemble.");
            }

            repondre(`✅ Nom du pack: ${data.result.name}\nType : ${data.result.is_animated ? "animés" : "statiques"}\nTotal : ${stickers.length} stickers\n`);

            for (const stickerData of stickers) {
                const fileInfo = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${stickerData.file_id}`);
                const stickerBuffer = await axios({
                    method: "get",
                    url: `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileInfo.data.result.file_path}`,
                    responseType: "arraybuffer",
                });

                const sticker = new Sticker(stickerBuffer.data, {
                    pack: config.STICKER_PACK_NAME,
                    author: config.STICKER_AUTHOR_NAME,
                    type: StickerTypes.FULL,
                    quality: 10
                });

                await ovl.sendMessage(ms_org, {
                    sticker: await sticker.toBuffer(),
                }, { quoted: ms });
            }

            repondre("✅ Tous les stickers ont été envoyés.");
        } catch (error) {
            console.error(error);
            repondre("❌ Une erreur s'est produite lors du téléchargement des stickers.");
        }
    }
);

ovlcmd(
  {
    nom_cmd: "fetch_sc",
    classe: "Owner",
    react: "💻",
    desc: "Extrait les données d'une page web, y compris HTML, CSS, JavaScript et médias",
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, prenium_id, ms } = cmd_options;
    const lien = arg[0];
if (!prenium_id) {
      return ovl.sendMessage(ms_org, { text: "Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
}
    if (!lien) {
      return ovl.sendMessage(ms_org, { text: "Veuillez fournir un lien valide. Le bot extraira le HTML, CSS, JavaScript, et les médias de la page web." }, { quoted: ms });
    }

    if (!/^https?:\/\//i.test(lien)) {
      return ovl.sendMessage(ms_org, { text: "Veuillez fournir une URL valide commençant par http:// ou https://" }, { quoted: ms });
    }

    try {
      const response = await axios.get(lien);
      const html = response.data;
      const $ = cheerio.load(html);

      const fichiersMedia = [];
      $('img[src], video[src], audio[src]').each((i, element) => {
        let src = $(element).attr('src');
        if (src) fichiersMedia.push(src);
      });

      const fichiersCSS = [];
      $('link[rel="stylesheet"]').each((i, element) => {
        let href = $(element).attr('href');
        if (href) fichiersCSS.push(href);
      });

      const fichiersJS = [];
      $('script[src]').each((i, element) => {
        let src = $(element).attr('src');
        if (src) fichiersJS.push(src);
      });

      await ovl.sendMessage(ms_org, { text: `**Contenu HTML**:\n\n${html}` }, { quoted: ms });

      if (fichiersCSS.length > 0) {
        for (const fichierCSS of fichiersCSS) {
          const cssResponse = await axios.get(new URL(fichierCSS, lien));
          const cssContent = cssResponse.data;
          await ovl.sendMessage(ms_org, { text: `**Contenu du fichier CSS**:\n\n${cssContent}` }, { quoted: ms });
        }
      } else {
        await ovl.sendMessage(ms_org, { text: "Aucun fichier CSS externe trouvé." }, { quoted: ms });
      }

      if (fichiersJS.length > 0) {
        for (const fichierJS of fichiersJS) {
          const jsResponse = await axios.get(new URL(fichierJS, lien));
          const jsContent = jsResponse.data;
          await ovl.sendMessage(ms_org, { text: `**Contenu du fichier JavaScript**:\n\n${jsContent}` }, { quoted: ms });
        }
      } else {
        await ovl.sendMessage(ms_org, { text: "Aucun fichier JavaScript externe trouvé." }, { quoted: ms });
      }

      if (fichiersMedia.length > 0) {
        await ovl.sendMessage(ms_org, { text: `**Fichiers médias trouvés**:\n${fichiersMedia.join('\n')}` }, { quoted: ms });
      } else {
        await ovl.sendMessage(ms_org, { text: "Aucun fichier média (images, vidéos, audios) trouvé." }, { quoted: ms });
      }

    } catch (error) {
      console.error(error);
      return ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors de l'extraction du contenu de la page web." }, { quoted: ms });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "antidelete",
    classe: "Owner",
    react: "🔗",
    desc: "Configure ou désactive l'Antidelete",
  },
  async (jid, ovl, cmd_options) => {
    const { ms, repondre, arg, prenium_id } = cmd_options;

    try {
      if (!prenium_id) return repondre("🔒 Cette commande est réservée aux utilisateurs premium.");

      const sousCommande = arg[0]?.toLowerCase();
      const mode = arg[1]?.toLowerCase();

      const validTypes = {
        1: 'pm',
        2: 'gc',
        3: 'status',
        4: 'all',
        5: 'pm/gc',
        6: 'pm/status',
        7: 'gc/status'
      };

      const [settings] = await WA_CONF.findOrCreate({
        where: { id: '1' },
        defaults: { id: '1', antidelete: 'non' },
      });

      if (sousCommande === 'off') {
        if (settings.antidelete === 'non')
          return repondre("❌ L'antidelete est déjà désactivé.");
        settings.antidelete = 'non';
        await settings.save();
        return repondre("✅ Antidelete désactivé avec succès.");
      }

      if (['pv', 'org'].includes(sousCommande)) {
        return repondre("❌ Usage invalide.\nUtilisez : antidelete <numéro> [pv|org]\nExemple : antidelete 3 org");
      }

      const typeSelection = parseInt(sousCommande);
      if (!validTypes[typeSelection]) {
        return repondre(
          "📌 *Utilisation de la commande antidelete :*\n\n" +
          "🔹 antidelete off : Désactiver l'antidelete\n\n" +
          "🔹 antidelete 1 : Activer sur les messages privés (pm)\n" +
          "🔹 antidelete 2 : Activer sur les messages de groupe (gc)\n" +
          "🔹 antidelete 3 : Activer sur les statuts (status)\n" +
          "🔹 antidelete 4 : Activer sur tous les types (all)\n" +
          "🔹 antidelete 5 : Activer sur pm + gc\n" +
          "🔹 antidelete 6 : Activer sur pm + status\n" +
          "🔹 antidelete 7 : Activer sur gc + status\n\n" +
          "➕ Vous pouvez ajouter `pv` ou `org` après le numéro pour choisir où renvoyer le message supprimé.\n" +
          "   Exemple : `antidelete 3 org`\n\n" +
          "✳️ Par défaut, si rien n’est précisé, c’est `pv` (inbox) qui est utilisé."
        );
      }

      if (mode && !['pv', 'org'].includes(mode)) {
        return repondre("❌ Mode invalide. Utilisez soit 'pv' soit 'org' après le numéro.");
      }

      let finalSetting = validTypes[typeSelection];
      if (mode) finalSetting += `-${mode}`;
      else finalSetting += '-pv';

      if (settings.antidelete === finalSetting) {
        return repondre(`⚠️ L'antidelete est déjà configuré sur '${finalSetting}'.`);
      }

      settings.antidelete = finalSetting;
      await settings.save();
      return repondre(`✅ Antidelete configuré sur : *${finalSetting}*`);

    } catch (error) {
      console.error("Erreur antidelete :", error);
      repondre("❌ Une erreur s'est produite lors de la configuration de l'antidelete.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "jid",
    classe: "Owner",
    react: "🆔",
    desc: "Fournit le JID d'une personne ou d'un groupe",
  },
  async (ms_org, ovl, cmd_options) => {
    const { repondre, auteur_Msg_Repondu, prenium_id, msg_Repondu, arg, getJid } = cmd_options;

    if (!prenium_id) {
      return repondre("Seuls les utilisateurs prenium peuvent utiliser cette commande");
    }

    let cbl =
      auteur_Msg_Repondu ||
      (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@lid`);

    let jid;
    if (cbl) {
      jid = await getJid(cbl, ms_org, ovl);
    } else {
      jid = ms_org;
    }

    repondre(jid);
  }
);

ovlcmd(
  {
    nom_cmd: "restart",
    classe: "Owner",
    desc: "Redémarre le bot"
  },
  async (ms_org, ovl, opt) => {
    const { ms, prenium_id } = opt

    if (!prenium_id) {
      return ovl.sendMessage(
        ms_org,
        { text: "Vous n'avez pas la permission d'utiliser cette commande." },
        { quoted: ms }
      )
    }

    await ovl.sendMessage(
      ms_org,
      { text: "♻️ Redémarrage du bot en cours..." },
      { quoted: ms }
    )

    setTimeout(() => {
      process.exit(0)
    }, 1000)
  }
)

ovlcmd(
  {
    nom_cmd: "connect",
    classe: "Owner",
    desc: "Connexion d’un compte avec le bot via session_id",
  },
  async (ms_org, ovl, cmd_options) => {
    try {
      const { arg, ms, prenium_id, repondre } = cmd_options;

      if (!prenium_id) {
        return ovl.sendMessage(ms_org, { text: "🚫 Vous n'avez pas le droit d'exécuter cette commande." }, { quoted: ms });
      }

      if (!arg || !arg[0]) {
        return ovl.sendMessage(ms_org, { text: "❗ Exemple : .connect SESSION_ID" }, { quoted: ms });
      }

      const session_id = arg[0].trim();
      console.log(`🌀 Tentative de connexion par ${ms.sender} pour session_id: ${session_id}`);

      const result = await saveSecondSession(session_id);
      if (!result) {
        return repondre("❌ La session est invalide ou n’a pas pu être enregistrée.");
      }

      return ovl.sendMessage(ms_org, { text: `✅ Tentative de connexion enregistrée pour la session : ${session_id}` }, { quoted: ms });

    } catch (err) {
      return ovl.sendMessage(ms_org, { text: `❌ Erreur : ${err.message}` });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "connect_session",
    classe: "Owner",
    desc: "Affiche la liste des numéros connectés",
  },
  async (ms_org, ovl, cmd_options) => {
    try {
      const { ms, prenium_id } = cmd_options;

      if (!prenium_id) {
        return ovl.sendMessage(ms_org, {
          text: "Vous n'avez pas le droit d'exécuter cette commande.",
        }, { quoted: ms });
      }

      const sessions = await getSecondAllSessions();

      if (!sessions || sessions.length === 0) {
        return ovl.sendMessage(ms_org, {
          text: "📭 Aucune session secondaire active pour le moment.",
        }, { quoted: ms });
      }

      const jids = sessions.map(s => `${s.numero}@s.whatsapp.net`);
      const texte = jids.map(jid => `@${jid.split("@")[0]}`).join("\n");

      await ovl.sendMessage(ms_org, {
        text: `📡 *Sessions secondaires connectées (${sessions.length})* :\n\n${texte}`,
        mentions: jids,
      }, { quoted: ms });
    } catch (err) {
      return ovl.sendMessage(ms_org, { text: `❌ Erreur : ${err.message}` });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "disconnect",
    classe: "Owner",
    desc: "Supprime une session connectée par session_id",
  },
  async (ms_org, ovl, cmd_options) => {
    try {
      const { arg, ms, prenium_id } = cmd_options;

      if (!prenium_id) {
        return ovl.sendMessage(ms_org, {
          text: "Vous n'avez pas le droit d'exécuter cette commande.",
        }, { quoted: ms });
      }

      if (!arg || !arg[0]) {
        return ovl.sendMessage(ms_org, {
          text: "Usage : .disconnect numero(sans le + et collé)",
        }, { quoted: ms });
      }

      const number = arg.join(" ");
      const numero = number.replace(/[^0-9]/g,'');
      const result = await deleteSecondSession(numero);

      if (result === 0) {
        return ovl.sendMessage(ms_org, {
          text: `Aucune session trouvée pour le numéro : ${numero}`,
        }, { quoted: ms });
      }

      await ovl.sendMessage(ms_org, {
        text: `✅ Session pour le numéro: ${numero} supprimée avec succès.`,
      }, { quoted: ms });
    } catch (err) {
      return ovl.sendMessage(ms_org, { text: `❌ Erreur : ${err.message}` });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "setmention",
    classe: "Owner",
    react: "✅",
    desc: "Configurer le message d'antimention global",
  },
  async (jid, ovl, cmd_options) => {
    const { ms, repondre, arg, prenium_id } = cmd_options;

    if (!prenium_id) return repondre("❌ Seuls les utilisateurs premium peuvent utiliser cette commande.");

    try {
      const joined = arg.join(" ");
      if (!joined) {
        return repondre(
          `🛠️ Utilisation de la commande *setmention* :

1️⃣ Pour une image, vidéo, audio ou texte avec type spécifié :
> *setmention type=audio url=https://exemple.com/fichier.opus*
> *setmention type=video url=https://exemple.com/video.mp4 text=Votre_message_ici*
> *setmention type=texte text=Votre_message_ici*
> *setmention type=image url=https://exemple.com/image.jpg text=Votre_message_ici*

📌 Les types valides sont : audio, video, texte, image.`
        );
      }

      let url = "";
      let text = "";
      let type = "";

      const regex = /(type|url|text)=(.*?)(?=\s(?:type=|url=|text=)|$)/gis;
      let match;
      while ((match = regex.exec(joined)) !== null) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        if (key === "type") type = value.toLowerCase();
        else if (key === "url") url = value;
        else if (key === "text") text = value.replace(/_/g, " ");
      }

      if (!type) return repondre("❌ Vous devez préciser le type avec 'type=audio', 'type=video', 'type=texte' ou 'type=image'.");

      await setMention({ url, text, type, mode: "oui" });

      const msg = `✅ Mention de type '${type}' enregistrée avec succès.`;

      return repondre(msg);
    } catch (e) {
      console.error("Erreur dans setmention:", e);
      repondre("Une erreur s'est produite lors de la configuration.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "delmention",
    classe: "Owner",
    react: "🚫",
    desc: "Désactiver le système d'antimention",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, prenium_id } = cmd_options;

    if (!prenium_id) return repondre("Seuls les utilisateurs premium peuvent utiliser cette commande.");

    try {
      await delMention();
      return repondre("✅ mention désactivé.");
    } catch (e) {
      console.error("Erreur dans delmention:", e);
      repondre("Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "getmention",
    classe: "Owner",
    react: "📄",
    desc: "Afficher la configuration actuelle de l'antimention",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, prenium_id } = cmd_options;

    try {
      if (!prenium_id) return repondre("Seuls les utilisateurs premium peuvent utiliser cette commande.");

      const data = await getMention();

      if (!data || data.mode === "non") {
        return repondre("ℹ️ Antimention désactivé ou non configuré.");
      }

      const { mode, url, text, type } = data;

      if ((!url || url === "") && (!text || text === "")) {
        return repondre("ℹ️ Antimention activé mais aucun contenu défini.");
      }

      switch (type) {
        case "audio":
          if (!url) return repondre(text || "Aucun contenu audio défini.");
          return await ovl.sendMessage(jid, {
            audio: { url },
            mimetype: 'audio/mp4',
            ptt: true,
          }, { quoted: null });

        case "image":
          if (!url) return repondre(text || "Aucun contenu image défini.");
          return await ovl.sendMessage(jid, {
            image: { url },
            caption: text || undefined,
          }, { quoted: null });

        case "video":
          if (!url) return repondre(text || "Aucun contenu vidéo défini.");
          return await ovl.sendMessage(jid, {
            video: { url },
            caption: text || undefined,
          }, { quoted: null });

        case "texte":
          return repondre(text || "Aucun message texte défini.");

        default:
          return repondre("Le type de média est inconnu ou non pris en charge.");
      }

    } catch (e) {
      console.error("Erreur dans getmention:", e);
      repondre("Impossible d'afficher la configuration.");
    }
  }
);

ovlcmd({
  nom_cmd: "addstickcmd",
  classe: "Owner",
  react: "✨",
  alias: ["setstickcmd", "addcmd", "setcmd"],
  desc: "Associer une commande à un sticker (réponds à un sticker)",
}, async (ms_org, ovl, { repondre, msg_Repondu, arg, prenium_id }) => {
  if (!prenium_id) return repondre("Pas autorisé.");

  const name = arg[0];
  if (!name) return repondre("Tu dois donner un nom à la commande.\nExemple : \`addstickcmd test\`");

  if (!msg_Repondu || !msg_Repondu.stickerMessage || !msg_Repondu.stickerMessage.url)
    return repondre("Tu dois répondre à un *sticker* pour l'enregistrer.");

  const stick_hash = msg_Repondu.stickerMessage.fileSha256?.toString('base64');

  try {
    await set_stick_cmd(name.toLowerCase(), stick_hash);
    repondre(`✅ Le sticker a été associé à la commande *${name}*`);
  } catch (e) {
    console.error(e);
    repondre("Erreur lors de l'enregistrement.");
  }
});

ovlcmd({
  nom_cmd: "delstickcmd",
  classe: "Owner",
  react: "🗑️",
  alias: ["delcmd"],
  desc: "Supprimer une commande sticker",
}, async (ms_org, ovl, { repondre, arg, prenium_id }) => {
  if (!prenium_id) return repondre("Pas autorisé.");

  const name = arg[0];
  if (!name) return repondre("Exemple : \`delstickcmd test\`");

  const ok = await del_stick_cmd(name.toLowerCase());
  repondre(ok ? `🗑️ La commande *${name}* a été supprimée.` : `Aucune commande nommée *${name}* trouvée.`);
});

ovlcmd({
  nom_cmd: "getstickcmd",
  classe: "Owner",
  react: "📋",
  alias: ["getcmd"],
  desc: "Liste des commandes stickers",
}, async (ms_org, ovl, { repondre, prenium_id }) => {
  if (!prenium_id) return repondre("Pas autorisé.");

  const list = await get_stick_cmd();
  if (!list.length) return repondre("Aucune commande sticker trouvée.");

  let msg = "*📌 Liste des commandes stickers :*\n\n";
  for (const { no_cmd, stick_hash } of list) {
    msg += `• *${no_cmd}*\n`;
  }

  repondre(msg);
});

ovlcmd({
  nom_cmd: "setpublic_cmd",
  classe: "Owner",
  react: "✅",
  desc: "Ajoute une commande publique utilisable par tout le monde quand le bot est en mode privé",
}, async (ms_org, ovl, { arg, repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const nom_cmd = arg[0];
  if (!nom_cmd) return repondre("❌ Utilisation: setpublic_cmd nom_cmd");

  try {
    await set_cmd(nom_cmd, "public");
    repondre(`✅ Commande publique '${nom_cmd}' enregistrée.`);
  } catch {
    repondre("❌ Erreur lors de l'enregistrement.");
  }
});

ovlcmd({
  nom_cmd: "delpublic_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes publiques.",
}, async (ms_org, ovl, { arg, repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const nom_cmd = arg[0];
  if (!nom_cmd) return repondre("❌ Utilisation: delpublic_cmd nom_cmd");

  try {
    const deleted = await del_cmd(nom_cmd, "public");
    repondre(deleted ? `✅ Commande '${nom_cmd}' supprimée.` : `❌ Commande '${nom_cmd}' introuvable.`);
  } catch {
    repondre("❌ Erreur lors de la suppression.");
  }
});

ovlcmd({
  nom_cmd: "listpublic_cmd",
  classe: "Owner",
  react: "📜",
  desc: "Liste les commandes publiques utilisablent quand le bot est en mode privé",
}, async (ms_org, ovl, { repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const all = await list_cmd("public");
  if (!all.length) return repondre("❌ Aucune commande publique enregistrée.");

  const msg = all.map((c, i) => `🔹 *${i + 1}.* ${c.nom_cmd}`).join("\n");
  repondre(`📖 *Commandes publiques enregistrées :*\n\n${msg}`);
});

ovlcmd({
  nom_cmd: "setprivate_cmd",
  classe: "Owner",
  react: "🔒",
  desc: "Ajoute une commande privée utilisable par les utilisateurs premiums quand le bot est en mode public",
}, async (ms_org, ovl, { arg, repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const nom_cmd = arg[0];
  if (!nom_cmd) return repondre("❌ Utilisation: setprivate_cmd nom_cmd");

  try {
    await set_cmd(nom_cmd, "private");
    repondre(`🔐 Commande privée '${nom_cmd}' enregistrée.`);
  } catch {
    repondre("❌ Erreur lors de l'enregistrement.");
  }
});

ovlcmd({
  nom_cmd: "delprivate_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes privée"
}, async (ms_org, ovl, { arg, repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const nom_cmd = arg[0];
  if (!nom_cmd) return repondre("❌ Utilisation: delprivate_cmd nom_cmd");

  try {
    const deleted = await del_cmd(nom_cmd, "private");
    repondre(deleted ? `✅ Commande '${nom_cmd}' supprimée.` : `❌ Commande '${nom_cmd}' introuvable.`);
  } catch {
    repondre("❌ Erreur lors de la suppression.");
  }
});

ovlcmd({
  nom_cmd: "listprivate_cmd",
  classe: "Owner",
  react: "📃",
  desc: "Liste les commandes privées utilisablent par les utilisateurs premiums quand le bot est en mode public",
}, async (ms_org, ovl, { repondre, prenium_id }) => {
  if (!prenium_id) return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");

  const all = await list_cmd("private");
  if (!all.length) return repondre("❌ Aucune commande privée enregistrée.");

  const msg = all.map((c, i) => `🔹 *${i + 1}.* ${c.nom_cmd}`).join("\n");
  repondre(`🔒 *Commandes privées enregistrées :*\n\n${msg}`);
});


ovlcmd(
  {
    nom_cmd: "chatbot",
    classe: "Owner",
    react: "🤖",
    desc: "Active ou désactive le chatbot ici ou globalement.",
  },
  async (jid, ovl, cmd_options) => {
    const { ms, repondre, arg, verif_Groupe, prenium_id } = cmd_options;
    const sousCommande = arg[0]?.toLowerCase();

    if (!prenium_id) {
      repondre("❌ Pas autorisé.");
      return;
    }

    try {
      const [config] = await ChatbotConf.findOrCreate({
        where: { id: '1' },
        defaults: {
          chatbot_pm: 'non',
          chatbot_gc: 'non',
          enabled_ids: JSON.stringify([]),
        },
      });

      let ids = [];
      try {
        ids = JSON.parse(config.enabled_ids || '[]');
      } catch {
        ids = [];
      }

      if (sousCommande === 'on') {
        if (ids.includes(jid)) {
          repondre("🔁 Le chatbot est *déjà activé ici*.");
        } else {
          ids.push(jid);
          config.enabled_ids = JSON.stringify([...new Set(ids)]);
          config.chatbot_pm = 'non';
          config.chatbot_gc = 'non';
          await config.save();
          repondre("✅ Le chatbot est maintenant activé *dans cette discussion*.");
        }

      } else if (sousCommande === 'off') {
        config.chatbot_pm = 'non';
        config.chatbot_gc = 'non';
        config.enabled_ids = JSON.stringify([]);
        await config.save();
        repondre("⛔️ Le chatbot est maintenant désactivé *partout*.");

      } else if (['pm', 'gc', 'all'].includes(sousCommande)) {
        config.chatbot_pm = sousCommande === 'pm' || sousCommande === 'all' ? 'oui' : 'non';
        config.chatbot_gc = sousCommande === 'gc' || sousCommande === 'all' ? 'oui' : 'non';
        config.enabled_ids = JSON.stringify([]);
        await config.save();

        const messages = {
          pm: "✅ Le chatbot est maintenant activé *dans tous les chats privés*.",
          gc: "✅ Le chatbot est maintenant activé *dans tous les groupes*.",
          all: "✅ Le chatbot est maintenant activé *partout*.",
        };

        repondre(messages[sousCommande]);

      } else {
        repondre(
          "🤖 *Gestion du Chatbot*\n\n" +
          "`chatbot on` - Active ici uniquement\n" +
          "`chatbot off` - Désactive *partout*\n" +
          "`chatbot pm` - Active dans *tous les chats privés*\n" +
          "`chatbot gc` - Active dans *tous les groupes*\n" +
          "`chatbot all` - Active *partout*"
        );
      }

    } catch (err) {
      console.error("❌ Erreur dans la commande chatbot :", err);
      repondre("Une erreur est survenue.");
    }
  }
);

ovlcmd({
  nom_cmd: "pglist",
  classe: "Owner",
  react: "🧩",
  desc: "Affiche la liste des plugins disponibles avec statut d'installation.",
  alias: ["pgl", "plist"]
}, async (ms, ovl, { repondre }) => {
  try {
    const { data: plugins } = await axios.get('https://pastebin.com/raw/5UA0CYYR');
    const installs = await Plugin.findAll();
    const installedNames = installs.map(p => p.name.toLowerCase());

    let lignes = [];

    if (Array.isArray(plugins)) {
      lignes = plugins.map((plugin, index) => {
        const estInstalle = installedNames.includes(plugin.name.toLowerCase());
        const icone = estInstalle ? "✅" : "❌";
        return (
`*${icone} Plugin #${index + 1}*
🧩 *Nom:* ${plugin.name}
👤 *Auteur:* ${plugin.author}
📦 *Installé:* ${estInstalle ? "Oui ✅" : "Non ❌"}
🔗 *Lien:* ${plugin.url}
📝 *Description:* ${plugin.description || "Aucune description"}`
        );
      });
    }

    const pluginsPersonnalises = installs.filter(p => {
      return !plugins?.some(pl => pl.name.toLowerCase() === p.name.toLowerCase());
    });

    pluginsPersonnalises.forEach((plugin) => {
      lignes.push(`*✅ Plugin personnalisé*\n🧩 *Nom:* ${plugin.name}\n`);
    });

    const message = lignes.length > 0
      ? "📦 *Plugins disponibles :*\n\n" + lignes.join("\n\n")
      : "❌ Aucun plugin disponible.";

    await repondre(message);
  } catch (e) {
    console.error("Erreur pluginlist :", e);
    await repondre("❌ Une erreur est survenue lors du chargement des plugins.");
  }
});


ovlcmd({
  nom_cmd: "pgremove",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime un plugin installé par nom ou tape `remove all` pour tous.",
  alias: ["pgr"]
}, async (ms, ovl, { arg, repondre }) => {
  const input = arg[0];
  if (!input) return repondre("❌ Utilise `remove nom_plugin` ou `remove all`.");

  if (input === "all") {
    const plugins = await Plugin.findAll();

    for (const p of plugins) {
      const filePath = path.join(__dirname, "../plugins", `${p.name}.js`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await Plugin.destroy({ where: { name: p.name } });
    }

    await reloadCommands();
    return repondre("🗑️ Tous les plugins ont été supprimés.");
  }

  const plugin = await Plugin.findOne({ where: { name: input } });
  if (!plugin) return repondre("❌ Plugin non trouvé dans la base.");

  const filePath = path.join(__dirname, "../plugins", `${plugin.name}.js`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await Plugin.destroy({ where: { name: input } });

  await reloadCommands();
  return repondre(`🗑️ Plugin *${input}* supprimé.`);
});

ovlcmd({
  nom_cmd: "pginstall",
  classe: "Owner",
  react: "📥",
  desc: "Installe un plugin.",
  alias: ["pgi"]
}, async (ms, ovl, { arg, repondre }) => {
  const input = arg[0];
  if (!input) return repondre("❌ Donne un lien direct vers un plugin ou tape `pginstall all` pour tout installer.");

  const installOne = async (url, name) => {
    try {
      const exist = await Plugin.findOne({ where: { name } });
      if (exist) {
        await repondre(`⚠️ Plugin *${name}* déjà installé. Ignoré.`);
        return;
      }

      const res = await axios.get(url);
      const code = res.data;
      const filePath = path.join(__dirname, "../plugins", `${name}.js`);
      fs.writeFileSync(filePath, code);

      const modules = extractNpmModules(code);
      if (modules.length > 0) {
        await repondre(`⚙️ Installation des dépendances npm : ${modules.join(", ")}`);
        await installModules(modules);
      }

      await Plugin.findOrCreate({ where: { name }, defaults: { url } });
      await repondre(`✅ Plugin *${name}* installé avec succès.`);
      await reloadCommands();
    } catch (e) {
      await repondre(`❌ Erreur installation *${name}* : ${e.message}`);
    }
  };

  if (input === "all") {
    try {
      const { data: plugins } = await axios.get("https://pastebin.com/raw/5UA0CYYR");
       
      const installed = await Plugin.findAll();
      const installedNames = installed.map(p => p.name.toLowerCase());

      const pluginsToInstall = plugins.filter(p => !installedNames.includes(p.name.toLowerCase()));

      if (pluginsToInstall.length === 0) {
        return await repondre("✅ Tous les plugins sont déjà installés.");
      }

      for (const p of pluginsToInstall) {
        await installOne(p.url, p.name);
      }

      await repondre("✅ Installation terminée pour tous les plugins disponibles.");
    } catch (e) {
      await repondre(`❌ Erreur de récupération des plugins : ${e.message}`);
    }
  } else {
    const url = input;
    const name = path.basename(url).replace(".js", "");
    await installOne(url, name);
  }
});
