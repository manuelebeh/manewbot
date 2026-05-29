'use strict';

const { registerCommand } = require('./register');
const { config, git, formatDateGMTFr } = require('./deps');

registerCommand({
  nom_cmd: "checkupdate",
  classe: "Système",
  react: "🔍",
  desc: "Vérifie les mises à jour disponibles du bot."
}, async (jid, bot, {
  repondre,
  isOwner,
  ms
}) => {
  try {
    if (!isOwner) {
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
  isOwner,
  ms
}) => {
  try {
    if (!isOwner) {
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
    const dirty =
      status.modified.length > 0 ||
      status.created.length > 0 ||
      status.deleted.length > 0 ||
      status.not_added.length > 0;
    if (dirty) {
      await git.stash(["push", "-u", "-m", "manewbot-pre-update"]);
      await repondre(
        "📦 Modifications locales mises de côté (git stash). Utilisez `git stash pop` sur le serveur si besoin."
      );
    }
    await repondre("⏳ Téléchargement des dernières modifications...");
    await git.pull("origin", "main", ["--ff-only"]);
    await repondre("✅ Mise à jour réussie. Redémarrage en cours...");
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error("❌ Erreur de mise à jour :", err);
    await repondre("❌ Mise à jour échouée.");
  }
});
