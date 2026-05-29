'use strict';

const { registerCommand } = require('./register');
const { config, updateEnvFile, fs, path, ENV_FILE, CONFIG_ENV_FILE, formatConfigValue, isAllowedEnvKey, writeConfigEnv } = require('./deps');

registerCommand({
  nom_cmd: "setvar",
  classe: "Système",
  react: "⚙️",
  desc: "Définit ou modifie une variable d'environnement. Usage: setvar KEY = value"
}, async (jid, bot, {
  repondre,
  isOwner,
  arg
}) => {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    let [key, ...rest] = arg;
    key = key?.toUpperCase();
    if (!isAllowedEnvKey(key)) {
      return repondre("⛔ Variable non autorisée.");
    }
    if (!key || rest.length === 0 || rest[0] !== "=") {
      return repondre("Usage correct : setvar KEY = value\nExemple : setvar MODE = private");
    }
    const value = rest.slice(1).join(" ");
    updateEnvFile(ENV_FILE, key, value);
    let configEnv = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    configEnv[key] = value;
    writeConfigEnv(configEnv);
    config[key] = value;
    repondre("Variable mise à jour : " + key + " = " + formatConfigValue(key, value));
  } catch (err) {
    console.error(err);
    repondre("Une erreur est survenue lors de la mise à jour de la variable.");
  }
});
registerCommand({
  nom_cmd: "delvar",
  classe: "Système",
  react: "🗑️",
  desc: "Supprime une variable d'environnement. Usage: delvar KEY"
}, async (jid, bot, {
  repondre,
  isOwner,
  arg
}) => {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const key = arg[0]?.toUpperCase();
    if (!isAllowedEnvKey(key)) {
      return repondre("⛔ Variable non autorisée.");
    }
    if (!key) {
      return repondre("Usage correct : delvar KEY\nExemple : delvar MODE");
    }
    updateEnvFile(ENV_FILE, key, null);
    let configEnv = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    delete configEnv[key];
    writeConfigEnv(configEnv);
    delete config[key];
    repondre("Variable supprimée : " + key);
  } catch (err) {
    console.error(err);
    repondre("Une erreur est survenue lors de la suppression de la variable.");
  }
});
registerCommand({
  nom_cmd: "getvar",
  classe: "Système",
  react: "📄",
  desc: "Affiche la valeur d'une variable ou toutes les variables. Usage: getvar KEY ou getvar all"
}, async (jid, bot, {
  repondre,
  arg,
  isOwner
}) => {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const key = arg[0]?.toUpperCase();
    if (!key) {
      return repondre("Usage : getvar KEY ou getvar all");
    }
    if (key === "ALL") {
      const entries = Object.entries(config).filter(([name, val]) => val !== undefined);
      if (entries.length === 0) {
        return repondre("Aucune variable définie.");
      }
      const list = entries.map(([name, val]) => "• " + name + " = " + formatConfigValue(name, val)).join("\n");
      return repondre("Liste des variables :\n" + list);
    } else {
      if (config[key] === undefined) {
        return repondre("La variable " + key + " n'existe pas.");
      }
      return repondre(key + " = " + formatConfigValue(key, config[key]));
    }
  } catch (err) {
    repondre("Une erreur est survenue lors de la récupération de la variable.");
  }
});
