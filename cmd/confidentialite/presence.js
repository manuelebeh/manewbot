'use strict';

const {
  registerCommand,
  WA_CONF,
} = require('./_shared');

registerCommand({
  nom_cmd: "presence",
  classe: "confidentialité",
  react: "👤",
  desc: "Active ou configure la présence sur WhatsApp"
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
    const presenceByNumber = {
      "1": "enligne",
      "2": "enregistre",
      "3": "ecrit"
    };
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        presence: "non"
      }
    });
    if (mode === "off") {
      waConf.presence = "non";
      await waConf.save();
      return repondre("La présence est maintenant désactivée.");
    }
    if (presenceByNumber[mode]) {
      if (waConf.presence === presenceByNumber[mode]) {
        return repondre("La présence est déjà configurée sur " + presenceByNumber[mode]);
      }
      waConf.presence = presenceByNumber[mode];
      await waConf.save();
      return repondre("La présence est maintenant définie sur " + presenceByNumber[mode]);
    }
    return repondre("Utilisation :\npresence 1: Configurer la présence sur 'enligne'\npresence 2: Configurer la présence sur 'enregistre'\npresence 3: Configurer la présence sur 'ecrit'\npresence off: Désactiver la présence");
  } catch (err) {
    console.error("Erreur lors de la configuration de presence :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
