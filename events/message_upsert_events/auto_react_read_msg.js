const {
  WA_CONF2
} = require("../../database/wa_conf");
const emojis = ["🎐", "👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "🙏", "💯", "✨", "🎈", "🤖", "👀", "🌟", "😎", "🤩", "💥", "🎶", "😄", "😆", "😉", "😊", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤔", "😳", "😱", "😨", "😰", "😥", "😭", "😓", "😪", "😴", "🙄", "🤐", "😷", "🤒", "🤕", "😵", "🤠", "😇", "🤡", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙌", "👏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🦵", "🦶", "👂", "👃", "👣", "👁", "👀", "🧠", "🦷", "🦴", "👅", "👄", "💋", "👓", "🕶", "🥽", "🥼", "🦺", "👔"];
const BLOCKED_REACT_JIDS = ["120363314687943170@g.us", "120363404635307998@g.us", "120363398500341783@g.us"];
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
  if (chatJid && BLOCKED_REACT_JIDS.includes(chatJid)) {
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
