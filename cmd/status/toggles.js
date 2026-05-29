'use strict';

const {
  registerCommand, WA_CONF, config,
} = require('./deps');

registerCommand({
  nom_cmd: "lecture_status",
  classe: "Status",
  react: "📖",
  desc: "Active ou désactive la lecture auto des status"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        lecture_status: "non"
      }
    });
    if (mode === "off") {
      waConf.lecture_status = "non";
      await waConf.save();
      return repondre("La lecture du statut est maintenant désactivée.");
    }
    if (mode === "on") {
      waConf.lecture_status = "oui";
      await waConf.save();
      return repondre("La lecture du statut est maintenant activée.");
    }
    return repondre("Utilisation :\nlecture_status on: Activer la lecture du statut\nlecture_status off: Désactiver la lecture du statut");
  } catch (err) {
    console.error("Erreur lors de la configuration de lecture_status :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "dl_status",
  classe: "Status",
  react: "📥",
  desc: "Active ou désactive le téléchargement auto des status"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        dl_status: "non"
      }
    });
    if (mode === "off") {
      waConf.dl_status = "non";
      await waConf.save();
      return repondre("Le téléchargement du statut est maintenant désactivé.");
    }
    if (mode === "on") {
      waConf.dl_status = "oui";
      await waConf.save();
      return repondre("Le téléchargement du statut est maintenant activé.");
    }
    return repondre("Utilisation :\ndl_status on: Activer le téléchargement du statut\ndl_status off: Désactiver le téléchargement du statut");
  } catch (err) {
    console.error("Erreur lors de la configuration de dl_status :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "likestatus",
  classe: "Status",
  react: "👍",
  desc: "Active ou désactive les likes automatiques sur les statuts"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("❌ Seuls les utilisateurs *sudo* peuvent utiliser cette commande.");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        like_status: "non"
      }
    });
    const showUsage = () => {
      return repondre("🔧 *Paramètres des Likes Auto sur Statuts :*\n\n" + ("• *" + config.PREFIXE + "likestatus <emojie>* : Active avec <emojie>\n") + ("• *" + config.PREFIXE + "likestatus off* : Désactive les likes automatiques\n\n") + ("📌 *Exemple :* " + config.PREFIXE + "likestatus 🤣\n") + ("📊 Statut actuel : *" + (waConf.like_status === "non" ? "Désactivé" : "Activé (" + waConf.like_status + ")") + "*"));
    };
    if (!mode || mode === "") {
      return showUsage();
    }
    if (mode === "off") {
      waConf.like_status = "non";
      await waConf.save();
      return repondre("👍 Les likes automatiques ont été *désactivés*.");
    }
    const emojiRegex = /^(?:\p{Emoji}(?:\p{Emoji_Modifier}?|\uFE0F)?(?:\u200D\p{Emoji})*)$/u;
    if (!emojiRegex.test(mode)) {
      return showUsage();
    }
    waConf.like_status = mode;
    await waConf.save();
    return repondre("✅ Les likes automatiques sont maintenant activés avec l'emoji " + mode);
  } catch (err) {
    console.error("❌ Erreur dans likestatus :", err);
    return repondre("❌ Une erreur s'est produite lors de la configuration.");
  }
});
