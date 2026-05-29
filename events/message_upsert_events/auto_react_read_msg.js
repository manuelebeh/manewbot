const {
  WA_CONF2
} = require("../../database/wa_conf");
const config = require("../../set");
const {
  getBlockedAutoreactGroups
} = require("../../lib/parse-env-lists");
const emojis = ["🎐", "👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "🙏", "💯", "✨", "🎈", "🤖", "👀", "🌟", "😎", "🤩", "💥", "🎶", "😄", "😆", "😉", "😊", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤔", "😳", "😱", "😨", "😰", "😥", "😭", "😓", "😪", "😴", "🙄", "🤐", "😷", "🤒", "🤕", "😵", "🤠", "😇", "🤡", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙌", "👏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🦵", "🦶", "👂", "👃", "👣", "👁", "👀", "🧠", "🦷", "🦴", "👅", "👄", "💋", "👓", "🕶", "🥽", "🥼", "🦺", "👔"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
async function autoread_msg(sock, messageKey) {
  const config = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!config || config.autoread_msg !== "oui") {
    return;
  }
  await sock.readMessages([messageKey]);
}
async function autoreact_msg(sock, msg, chatJid) {
  if (chatJid && getBlockedAutoreactGroups(config).includes(chatJid)) {
    return;
  }
  const config = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!config || config.autoreact_msg !== "oui") {
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
