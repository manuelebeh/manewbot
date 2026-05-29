const {
  levels,
  calculateLevel
} = require("../../database/levels");
const {
  Ranks,
  Levelup
} = require("../../database/rank");
const {
  changerPseudo,
  ajouterUtilisateur,
  getInfosUtilisateur
} = require("../../database/economie");
async function rankAndLevelUp(sock, chatJid, messageText, senderJid, pushName) {
  if (!messageText || !senderJid) {
    return;
  }
  try {
    const userId = senderJid;
    const userInfo = await getInfosUtilisateur(userId);
    if (!userInfo) {
      await ajouterUtilisateur(userId, pushName || "utilisateur");
    }
    await changerPseudo(userId, pushName || "utilisateur");
    let rankRecord = await Ranks.findOne({
      where: {
        id: userId
      }
    });
    if (!rankRecord) {
      rankRecord = await Ranks.create({
        id: userId,
        name: pushName || "utilisateur",
        level: 0,
        exp: 10,
        messages: 1
      });
    } else {
      rankRecord.name = pushName || "utilisateur";
      rankRecord.messages += 1;
      rankRecord.exp += 10;
    }
    const newLevel = calculateLevel(rankRecord.exp);
    const levelupConfig = await Levelup.findOne({
      where: {
        id: 1
      }
    });
    const levelupEnabled = levelupConfig && levelupConfig.levelup === "oui";
    if (newLevel > rankRecord.level && levelupEnabled) {
      await sock.sendMessage(chatJid, {
        text: "Félicitations @" + (userId || "").split("@")[0] + "! Vous avez atteint le niveau " + newLevel + "! 🎉",
        mentions: [userId]
      });
    }
    rankRecord.level = newLevel;
    await rankRecord.save();
  } catch (err) {
    console.error("Erreur dans rankAndLevelUp:", err);
  }
}
module.exports = { rankAndLevelUp };