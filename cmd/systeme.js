const {
  registerCommand
} = require("../lib/commands");
const config = require("../set");
const {
  updateEnvFile
} = require("../lib/manage_env");
const fs = require("fs");
const path = require("path");
const {
  exec
} = require("child_process");
const simpleGit = require("simple-git");
const git = simpleGit();
const ENV_FILE = path.join(process.cwd(), ".env");
const CONFIG_ENV_FILE = path.join(process.cwd(), "config_env.json");
registerCommand({
  nom_cmd: "setvar",
  classe: "Système",
  react: "⚙️",
  desc: "Définit ou modifie une variable d'environnement. Usage: setvar KEY = value"
}, async (jid, bot, {
  repondre,
  isSudo,
  arg
}) => {
  if (!isSudo) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    let [key, ...rest] = arg;
    key = key?.toUpperCase();
    if (!require("../lib/env-keys").isAllowedEnvKey(key)) {
      return repondre("⛔ Variable non autorisée.");
    }
    if (!key || rest.length === 0 || rest[0] !== "=") {
      return repondre("Usage correct : setvar KEY = value\nExemple : setvar MODE = private");
    }
    const value = rest.slice(1).join(" ");
    updateEnvFile(ENV_FILE, key, value);
    let configEnv = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    configEnv[key] = value;
    require("../lib/manage_env").writeConfigEnv(configEnv);
    config[key] = value;
    repondre("Variable mise à jour : " + key + " = " + value);
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
  isSudo,
  arg
}) => {
  if (!isSudo) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const key = arg[0]?.toUpperCase();
    if (!require("../lib/env-keys").isAllowedEnvKey(key)) {
      return repondre("⛔ Variable non autorisée.");
    }
    if (!key) {
      return repondre("Usage correct : delvar KEY\nExemple : delvar MODE");
    }
    updateEnvFile(ENV_FILE, key, null);
    let configEnv = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    delete configEnv[key];
    require("../lib/manage_env").writeConfigEnv(configEnv);
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
  isSudo
}) => {
  if (!isSudo) {
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
      const list = entries.map(([name, val]) => "• " + name + " = " + val).join("\n");
      return repondre("Liste des variables :\n" + list);
    } else {
      if (config[key] === undefined) {
        return repondre("La variable " + key + " n'existe pas.");
      }
      return repondre(key + " = " + config[key]);
    }
  } catch (err) {
    repondre("Une erreur est survenue lors de la récupération de la variable.");
  }
});
function formatDateGMTFr(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }) + " GMT";
}
registerCommand({
  nom_cmd: "checkupdate",
  classe: "Système",
  react: "🔍",
  desc: "Vérifie les mises à jour disponibles du bot."
}, async (jid, bot, {
  repondre,
  isSudo,
  ms
}) => {
  try {
    if (!isSudo) {
      return bot.sendMessage(jid, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    await git.init();
    const remotes = await git.getRemotes();
    if (!remotes.some(remote => remote.name === "origin")) {
      await git.addRemote("origin", "https://github.com/manuelebeh/manewbot");
    }
    await git.fetch();
    const remoteBranch = "origin/main";
    const branches = await git.branch(["-r"]);
    if (!branches.all.includes(remoteBranch)) {
      return repondre("❌ Branche distante introuvable.");
    }
    const log = await git.log({
      from: "main",
      to: remoteBranch
    });
    if (log.total > 0) {
      const commitList = log.all.map(commit => "🔹 " + commit.message + " — _" + formatDateGMTFr(commit.date) + "_").join("\n");
      const message = "✨🚀 *MISE À JOUR DISPONIBLE !* 🚀✨\n\n📣 *Détails des modifs :*\n\n" + commitList + "\n\n🔧 Pour appliquer la mise à jour, tape la commande :  \n➡️ *" + config.PREFIXE + "update*";
      return repondre(message);
    } else {
      return repondre("✅ Le bot est déjà à jour.");
    }
  } catch (err) {
    console.error(err);
    return repondre("❌ Erreur lors de la vérification des mises à jour.");
  }
});
registerCommand({
  nom_cmd: "update",
  classe: "Système",
  react: "♻️",
  desc: "Met à jour le bot automatiquement.",
  alias: ["maj"]
}, async (jid, bot, {
  repondre,
  isSudo,
  ms
}) => {
  try {
    if (!isSudo) {
      return bot.sendMessage(jid, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    const remotes = await git.getRemotes();
    if (!remotes.some(remote => remote.name === "origin")) {
      await git.addRemote("origin", "https://github.com/manuelebeh/manewbot.git");
    }
    await git.fetch();
    const branches = await git.branch(["-r"]);
    if (!branches.all.includes("origin/main")) {
      return repondre("❌ Branche distante introuvable.");
    }
    const status = await git.status();
    if (!status.behind && !status.modified.length && !status.created.length && !status.deleted.length) {
      return repondre("✅ Le bot est déjà à jour.");
    }
    await repondre("⏳ Téléchargement des dernières modifications...");
    await git.reset(["--hard"]);
    await git.pull("origin", "main");
    await repondre("✅ Mise à jour réussie. Redémarrage en cours...");
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error("❌ Erreur de mise à jour :", err);
    await repondre("❌ Mise à jour échouée.");
  }
});
