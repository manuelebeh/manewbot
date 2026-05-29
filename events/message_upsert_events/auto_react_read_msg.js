const {
  WA_CONF2
} = require("../../database/wa_conf");
const appConfig = require("../../set");
const {
  getBlockedAutoreactGroups
} = require("../../lib/parse-env-lists");
const emojis = ["🎐", "👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "🙏", "💯", "✨", "🎈", "🤖", "👀", "🌟", "😎", "🤩", "💥", "🎶", "😄", "😆", "😉", "😊", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤔", "😳", "😱", "😨", "😰", "😥", "😭", "😓", "😪", "😴", "🙄", "🤐", "😷", "🤒", "🤕", "😵", "🤠", "😇", "🤡", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙌", "👏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🦵", "🦶", "👂", "👃", "👣", "👁", "👀", "🧠", "🦷", "🦴", "👅", "👄", "💋", "👓", "🕶", "🥽", "🥼", "🦺", "👔"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
async function autoread_msg(sock, messageKey) {
  const dbConfig = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!dbConfig || dbConfig.autoread_msg !== "oui") {
    return;
  }
  await sock.readMessages([messageKey]);
}
async function autoreact_msg(sock, msg, chatJid) {
  if (chatJid && getBlockedAutoreactGroups(appConfig).includes(chatJid)) {
    return;
  }
  const dbConfig = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!dbConfig || dbConfig.autoreact_msg !== "oui") {
    return;
  }
  const emoji = getRandomEmoji();
  await sock.sendMessage(msg.key.remoteJid, {
    react: {
      text: emoji,
      key: msg.key
    }
  });
}
module.exports = {
  autoread_msg: autoread_msg,
  autoreact_msg: autoreact_msg
};
