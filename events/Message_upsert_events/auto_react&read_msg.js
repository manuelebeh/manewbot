const {
  WA_CONF2
} = require("../../DataBase/wa_conf");
const emojis = ["🎐", "👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "🙏", "💯", "✨", "🎈", "🤖", "👀", "🌟", "😎", "🤩", "💥", "🎶", "😄", "😆", "😉", "😊", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤔", "😳", "😱", "😨", "😰", "😥", "😭", "😓", "😪", "😴", "🙄", "🤐", "😷", "🤒", "🤕", "😵", "🤠", "😇", "🤡", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙌", "👏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🦵", "🦶", "👂", "👃", "👣", "👁", "👀", "🧠", "🦷", "🦴", "👅", "👄", "💋", "👓", "🕶", "🥽", "🥼", "🦺", "👔"];
const BLOCKED_REACT_JIDS = ["120363314687943170@g.us", "120363404635307998@g.us", "120363398500341783@g.us"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
async function autoread_msg(_0x18a114, _0x4e5b36) {
  const _0x190fb4 = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x190fb4 || _0x190fb4.autoread_msg !== "oui") {
    return;
  }
  await _0x18a114.readMessages([_0x4e5b36]);
}
async function autoreact_msg(_0x49ab35, _0x7095e7, _0x576112) {
  if (_0x576112 && BLOCKED_REACT_JIDS.includes(_0x576112)) {
    return;
  }
  const _0x1cf0c4 = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x1cf0c4 || _0x1cf0c4.autoreact_msg !== "oui") {
    return;
  }
  const _0x4a5834 = getRandomEmoji();
  await _0x49ab35.sendMessage(_0x7095e7.key.remoteJid, {
    react: {
      text: _0x4a5834,
      key: _0x7095e7.key
    }
  });
}
module.exports = {
  autoread_msg: autoread_msg,
  autoreact_msg: autoreact_msg
};