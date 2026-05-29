const {
  autoread_msg,
  autoreact_msg
} = require("./auto_react_read_msg");
module.exports = {
  rankAndLevelUp: require("./rank_levelup"),
  lecture_status: require("./lecture_status"),
  like_status: require("./like_status"),
  presence: require("./presence"),
  dl_status: require("./dl_status"),
  antidelete: require("./antidelete"),
  antitag: require("./antitag"),
  antilink: require("./antilink"),
  antibot: require("./antibot"),
  getJid: require("./cache_jid"),
  mention: require("./mention"),
  antimention: require("./antimention"),
  chatbot: require("./chatbot"),
  antispam: require("./antispam"),
  autoread_msg: autoread_msg,
  autoreact_msg: autoreact_msg
};