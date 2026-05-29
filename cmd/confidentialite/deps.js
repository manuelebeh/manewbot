'use strict';

const { registerCommand } = require('../../lib/commands');
const { WA_CONF } = require('../../database/wa_conf');

const privacyValues = {
  lastseen: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  online: [{
    key: "all",
    desc: "Visible pour tout le monde"
  }, {
    key: "match_last_seen",
    desc: "Même que votre visibilité de dernière vue"
  }],
  profile: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  status: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  read: [{
    key: "all",
    desc: "Activé (vous voyez qui a lu, et eux aussi)"
  }, {
    key: "none",
    desc: "Désactivé (vous ne verrez rien, eux non plus)"
  }],
  groupadd: [{
    key: "all",
    desc: "Tout le monde peut vous ajouter"
  }, {
    key: "contacts",
    desc: "Seuls vos contacts peuvent vous ajouter"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne ne peut vous ajouter"
  }]
};
async function handlePrivacyCommand({
  type,
  bot,
  repondre,
  arg,
  isOwner,
  updateFunction,
  label
}) {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  const options = privacyValues[type];
  let choice = arg[0];
  if (!choice || !isNaN(choice) && !options[Number(choice) - 1]) {
    const lines = ["🔐 *Options pour " + label + "* :"];
    options.forEach((opt, index) => {
      lines.push("*" + (index + 1) + ".* " + opt.key + " - _" + opt.desc + "_");
    });
    lines.push("\n*Exemple :* " + type + " 1");
    return repondre(lines.join("\n"));
  }
  let selectedKey;
  if (!isNaN(choice)) {
    const index = Number(choice) - 1;
    selectedKey = options[index]?.key;
  } else {
    selectedKey = options.find(opt => opt.key === choice)?.key;
  }
  if (!selectedKey) {
    return repondre("Option invalide. Veuillez choisir un numéro ou une valeur valide.");
  }
  try {
    await updateFunction(selectedKey);
    return repondre("✅ Confidentialité *" + label + "* mise à jour en *" + selectedKey + "*");
  } catch (err) {
    console.error(err);
    return repondre("Erreur lors de la mise à jour de *" + label + "*");
  }
}

module.exports = {
  registerCommand,
  WA_CONF,
  privacyValues,
  handlePrivacyCommand,
};
