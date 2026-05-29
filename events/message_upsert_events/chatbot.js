const axios = require("axios");
const {
  ChatbotConf
} = require("../../database/chatbot");
async function chatbot(chatJid, isGroup, messageText, repondre, resolvedMentions, botJid, quotedAuthorJid, senderJid) {
  try {
    if (isGroup && !resolvedMentions.includes(botJid) && quotedAuthorJid !== botJid) {
      return;
    }
    if (!messageText) {
      return;
    }
    const chatbotConfig = await ChatbotConf.findByPk("1");
    if (!chatbotConfig) {
      return;
    }
    let enabledIds = [];
    try {
      enabledIds = JSON.parse(chatbotConfig.enabled_ids || "[]");
    } catch {}
    const isWhitelisted = enabledIds.includes(chatJid);
    const channelEnabled = isGroup ? chatbotConfig.chatbot_gc === "oui" : chatbotConfig.chatbot_pm === "oui";
    if (!isWhitelisted && !channelEnabled) {
      return;
    }
    const sessionId = chatJid.split("@")[0] + "_" + senderJid.split("@")[0];
    const response = await axios.get("https://uta-f1kg.onrender.com/chatbot", {
      params: {
        user_id: sessionId,
        text: messageText
      }
    });
    if (response.data?.text) {
      return repondre(response.data.text);
    }
  } catch (err) {
    console.error("Erreur chatbot WebAI :", err.message);
  }
}
module.exports = chatbot;
