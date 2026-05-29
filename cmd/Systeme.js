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
}, async (_0xca395c, _0x102f4f, {
  repondre: _0x223b3d,
  prenium_id: _0x45dc51,
  arg: _0x5278f2
}) => {
  if (!_0x45dc51) {
    return _0x223b3d("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    let [_0xce237e, ..._0x18a8ff] = _0x5278f2;
    _0xce237e = _0xce237e?.toUpperCase();
    if (!require("../lib/env-keys").isAllowedEnvKey(_0xce237e)) {
      return _0x223b3d("⛔ Variable non autorisée.");
    }
    if (!_0xce237e || _0x18a8ff.length === 0 || _0x18a8ff[0] !== "=") {
      return _0x223b3d("Usage correct : setvar KEY = value\nExemple : setvar MODE = private");
    }
    const _0x4deaa2 = _0x18a8ff.slice(1).join(" ");
    updateEnvFile(ENV_FILE, _0xce237e, _0x4deaa2);
    let _0x233cb9 = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    _0x233cb9[_0xce237e] = _0x4deaa2;
    require("../lib/manage_env").writeConfigEnv(_0x233cb9);
    config[_0xce237e] = _0x4deaa2;
    _0x223b3d("Variable mise à jour : " + _0xce237e + " = " + _0x4deaa2);
  } catch (_0xf0000a) {
    console.error(_0xf0000a);
    _0x223b3d("Une erreur est survenue lors de la mise à jour de la variable.");
  }
});
registerCommand({
  nom_cmd: "delvar",
  classe: "Système",
  react: "🗑️",
  desc: "Supprime une variable d'environnement. Usage: delvar KEY"
}, async (_0x19a080, _0x43a0cd, {
  repondre: _0x1ebcea,
  prenium_id: _0x5361ac,
  arg: _0xd6294
}) => {
  if (!_0x5361ac) {
    return _0x1ebcea("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const _0x13c02a = _0xd6294[0]?.toUpperCase();
    if (!require("../lib/env-keys").isAllowedEnvKey(_0x13c02a)) {
      return _0x1ebcea("⛔ Variable non autorisée.");
    }
    if (!_0x13c02a) {
      return _0x1ebcea("Usage correct : delvar KEY\nExemple : delvar MODE");
    }
    updateEnvFile(ENV_FILE, _0x13c02a, null);
    let _0x32dae3 = fs.existsSync(CONFIG_ENV_FILE) ? JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, "utf8")) : {};
    delete _0x32dae3[_0x13c02a];
    require("../lib/manage_env").writeConfigEnv(_0x32dae3);
    delete config[_0x13c02a];
    _0x1ebcea("Variable supprimée : " + _0x13c02a);
  } catch (_0xb60d50) {
    console.error(_0xb60d50);
    _0x1ebcea("Une erreur est survenue lors de la suppression de la variable.");
  }
});
registerCommand({
  nom_cmd: "getvar",
  classe: "Système",
  react: "📄",
  desc: "Affiche la valeur d'une variable ou toutes les variables. Usage: getvar KEY ou getvar all"
}, async (_0x9f1c81, _0x15b156, {
  repondre: _0x3bad25,
  arg: _0x159b13,
  prenium_id: _0x2485ec
}) => {
  if (!_0x2485ec) {
    return _0x3bad25("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const _0x14cdbf = _0x159b13[0]?.toUpperCase();
    if (!_0x14cdbf) {
      return _0x3bad25("Usage : getvar KEY ou getvar all");
    }
    if (_0x14cdbf === "ALL") {
      const _0x1cd217 = Object.entries(config).filter(([_0x49ff2c, _0x5a6dd5]) => _0x5a6dd5 !== undefined);
      if (_0x1cd217.length === 0) {
        return _0x3bad25("Aucune variable définie.");
      }
      const _0x2e9fe6 = _0x1cd217.map(([_0x4f3f81, _0x39f49a]) => "• " + _0x4f3f81 + " = " + _0x39f49a).join("\n");
      return _0x3bad25("Liste des variables :\n" + _0x2e9fe6);
    } else {
      if (config[_0x14cdbf] === undefined) {
        return _0x3bad25("La variable " + _0x14cdbf + " n'existe pas.");
      }
      return _0x3bad25(_0x14cdbf + " = " + config[_0x14cdbf]);
    }
  } catch (_0x20d614) {
    _0x3bad25("Une erreur est survenue lors de la récupération de la variable.");
  }
});
function formatDateGMTFr(_0x1de94a) {
  const _0x3388c9 = new Date(_0x1de94a);
  return _0x3388c9.toLocaleString("fr-FR", {
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
}, async (_0x85bfe9, _0x1bbf3, {
  repondre: _0x3a6ece,
  prenium_id: _0x493451
}) => {
  try {
    if (!_0x493451) {
      return _0x1bbf3.sendMessage(_0x85bfe9, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    await git.init();
    const _0x2db1c2 = await git.getRemotes();
    if (!_0x2db1c2.some(_0x1ec332 => _0x1ec332.name === "origin")) {
      await git.addRemote("origin", "https://github.com/manuelebeh/manewbot");
    }
    await git.fetch();
    const _0x33ba75 = "origin/main";
    const _0x2dd5bf = await git.branch(["-r"]);
    if (!_0x2dd5bf.all.includes(_0x33ba75)) {
      return _0x3a6ece("❌ Branche distante introuvable.");
    }
    const _0x602985 = await git.log({
      from: "main",
      to: _0x33ba75
    });
    if (_0x602985.total > 0) {
      const _0xaebf95 = _0x602985.all.map(_0x447c61 => "🔹 " + _0x447c61.message + " — _" + formatDateGMTFr(_0x447c61.date) + "_").join("\n");
      const _0x1b10c8 = "✨🚀 *MISE À JOUR DISPONIBLE !* 🚀✨\n\n📣 *Détails des modifs :*\n\n" + _0xaebf95 + "\n\n🔧 Pour appliquer la mise à jour, tape la commande :  \n➡️ *" + config.PREFIXE + "update*";
      return _0x3a6ece(_0x1b10c8);
    } else {
      return _0x3a6ece("✅ Le bot est déjà à jour.");
    }
  } catch (_0x58b0f1) {
    console.error(_0x58b0f1);
    return _0x3a6ece("❌ Erreur lors de la vérification des mises à jour.");
  }
});
registerCommand({
  nom_cmd: "update",
  classe: "Système",
  react: "♻️",
  desc: "Met à jour le bot automatiquement.",
  alias: ["maj"]
}, async (_0x206e00, _0x270f19, {
  repondre: _0x531754,
  prenium_id: _0x46e791,
  ms: _0x29c831
}) => {
  try {
    if (!_0x46e791) {
      return _0x270f19.sendMessage(_0x206e00, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x29c831
      });
    }
    const _0x4d5c86 = await git.getRemotes();
    if (!_0x4d5c86.some(_0x4c36cf => _0x4c36cf.name === "origin")) {
      await git.addRemote("origin", "https://github.com/manuelebeh/manewbot.git");
    }
    await git.fetch();
    const _0x5a0f1e = await git.branch(["-r"]);
    if (!_0x5a0f1e.all.includes("origin/main")) {
      return _0x531754("❌ Branche distante introuvable.");
    }
    const _0x4c9f80 = await git.status();
    if (!_0x4c9f80.behind && !_0x4c9f80.modified.length && !_0x4c9f80.created.length && !_0x4c9f80.deleted.length) {
      return _0x531754("✅ Le bot est déjà à jour.");
    }
    await _0x531754("⏳ Téléchargement des dernières modifications...");
    await git.reset(["--hard"]);
    await git.pull("origin", "main");
    await _0x531754("✅ Mise à jour réussie. Redémarrage en cours...");
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (_0x53aac5) {
    console.error("❌ Erreur de mise à jour :", _0x53aac5);
    await _0x531754("❌ Mise à jour échouée.");
  }
});