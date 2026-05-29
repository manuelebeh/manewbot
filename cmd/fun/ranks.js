'use strict';

const { registerCommand } = require('./register');
const { config, levels, Ranks } = require('./deps');

registerCommand({
  nom_cmd: "rank",
  classe: "Fun",
  react: "🏆",
  desc: "Affiche le rang d'un utilisateur selon ses messages envoyés et gère l'activation/désactivation globale du level up."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    getJid,
    auteur_Msg_Repondu,
    ms
  } = ctx;
  const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid" || auteur_Msg_Repondu || auteur_Message;
  const resolvedJid = await getJid(targetJid, chatJid, sock);
  let profilePic;
  try {
    profilePic = await sock.profilePictureUrl(resolvedJid, "image");
  } catch {
    profilePic = config.DEFAULT_AVATAR_URL;
  }
  const allRanks = await Ranks.findAll({
    order: [["messages", "DESC"]]
  });
  const userRank = await Ranks.findOne({
    where: {
      id: resolvedJid
    }
  });
  if (!userRank) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas encore de rang. Commencez à interagir pour en obtenir un !"
    }, {
      quoted: ms
    });
  }
  const {
    name,
    level,
    exp,
    messages
  } = userRank;
  const nextLevelExp = levels[level] ? levels[level + 1].expRequired : "Max";
  const rankPosition = allRanks.findIndex(entry => entry.id === resolvedJid) + 1;
  const totalUsers = allRanks.length;
  const rankCaption = "╭───🏆 *Classement* 🏆───╮\n┃ 🏷️ *Nom :* " + (name || "Inconnu") + "\n┃ 🥇 *Classement :* " + rankPosition + "/" + totalUsers + "\n┃ 🔰 *Niveau :* " + level + "\n┃ 🏅 *Titre :* " + (levels[level - 1]?.name || "Niveau Divin") + " \n┃ 📊 *EXP :* " + exp + "/" + (nextLevelExp || "Max") + "\n┃ ✉️ *Messages :* " + messages + "\n╰──────────────────╯";
  await sock.sendMessage(chatJid, {
    image: {
      url: profilePic
    },
    caption: rankCaption
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "toprank",
  classe: "Fun",
  react: "🥇",
  desc: "Voir les meilleurs utilisateurs"
}, async (chatJid, sock, ctx) => {
  const topUsers = await Ranks.findAll({
    order: [["messages", "DESC"]],
    limit: 10
  });
  if (topUsers.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "Aucune donnée disponible pour le moment."
    }, {
      quoted: ctx.ms
    });
  }
  let leaderboard = "🏆 *TOP 10 UTILISATEURS* 🏆\n\n";
  topUsers.forEach((user, index) => {
    const medals = ["🥇", "🥈", "🥉"];
    const medal = medals[index] || "🔹";
    leaderboard += medal + " *#" + (index + 1) + "* — " + (user.name || "Inconnu") + "\n";
    leaderboard += "   💬 Messages : " + user.messages + "\n";
    leaderboard += "   🎯 Niveau : " + user.level + " (" + (levels[user.level - 1]?.name || "Niveau Divin") + ")\n\n";
  });
  leaderboard += "✨ _Continuez à discuter pour monter dans le classement !_";
  await sock.sendMessage(chatJid, {
    text: leaderboard
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "profile",
  classe: "Fun",
  react: "👤",
  desc: "Affiche le nom, le numéro et la bio d'un utilisateur"
}, async (chatJid, sock, {
  msg_Repondu,
  ms,
  auteur_Message,
  arg,
  getJid,
  auteur_Msg_Repondu
}) => {
  const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@s.whatsapp.net" || auteur_Msg_Repondu || auteur_Message;
  const resolvedJid = await getJid(targetJid, chatJid, sock);
  let profilePic;
  try {
    profilePic = await sock.profilePictureUrl(resolvedJid, "image");
  } catch {
    profilePic = config.DEFAULT_AVATAR_URL;
  }
  const rankRecord = await Ranks.findOne({
    where: {
      id: resolvedJid
    }
  });
  const displayName = rankRecord?.name || "Inconnu";
  const phoneNumber = resolvedJid.split("@")[0];
  let bio = "Pas de bio";
  try {
    const statusList = await sock.fetchStatus(resolvedJid);
    if (statusList.length > 0 && statusList[0].status) {
      bio = typeof statusList[0].status === "string" ? statusList[0].status : statusList[0].status.status || "Pas de bio";
    }
  } catch {}
  const profileCaption = "👤 Nom: " + displayName + "\n📱 Numéro: " + phoneNumber + "\n💬 Bio: " + bio;
  await sock.sendMessage(chatJid, {
    image: {
      url: profilePic
    },
    caption: profileCaption
  }, {
    quoted: ms
  });
});
