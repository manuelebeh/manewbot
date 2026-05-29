const axios = require("axios");
const {
  ChatbotConf
} = require("../../DataBase/chatbot");
async function chatbot(_0x334135, _0x12f80d, _0x2fc483, _0x3af225, _0x258f02, _0x39cba1, _0x910f3e, _0xf36c3a) {
  try {
    if (_0x12f80d && !_0x258f02.includes(_0x39cba1) && _0x910f3e !== _0x39cba1) {
      return;
    }
    if (!_0x2fc483) {
      return;
    }
    const _0x10ee1a = await ChatbotConf.findByPk("1");
    if (!_0x10ee1a) {
      return;
    }
    let _0x31dcd1 = [];
    try {
      _0x31dcd1 = JSON.parse(_0x10ee1a.enabled_ids || "[]");
    } catch {}
    const _0x2901b7 = _0x31dcd1.includes(_0x334135);
    const _0x2535ba = _0x12f80d ? _0x10ee1a.chatbot_gc === "oui" : _0x10ee1a.chatbot_pm === "oui";
    if (!_0x2901b7 && !_0x2535ba) {
      return;
    }
    const _0x2b18fd = _0x334135.split("@")[0] + "_" + _0xf36c3a.split("@")[0];
    const _0x2d30ac = await axios.get("https://uta-f1kg.onrender.com/chatbot", {
      params: {
        user_id: _0x2b18fd,
        text: _0x2fc483
      }
    });
    if (_0x2d30ac.data?.text) {
      return _0x3af225(_0x2d30ac.data.text);
    }
  } catch (_0x37de48) {
    console.error("Erreur chatbot WebAI :", _0x37de48.message);
  }
}
module.exports = chatbot;