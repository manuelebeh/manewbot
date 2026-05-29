const axios = require("axios");
const config = require("../../set");
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
    const apiBase = (config.CHATBOT_API_BASE || "").replace(/\/$/, "");
    if (!apiBase) {
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
    const response = await axios.get(apiBase, {
      params: {
        user_id: sessionId,
        text: messageText
      },
      timeout: 30000
    });
    if (response.data?.text) {
      return repondre(response.data.text);
    }
  } catch (err) {
    console.error("Erreur chatbot :", err.message);
  }
}
module.exports = { chatbot };