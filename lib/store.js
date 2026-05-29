const fs = require("fs");
const path = require("path");
const storeFilePath = path.resolve(__dirname, "store_msg.json");
const MAX_STORE_SIZE_MB = 5;
function checkAndResetStore() {
  try {
    const _0x3a6d03 = fs.statSync(storeFilePath);
    const _0x345ed6 = _0x3a6d03.size / 1048576;
    if (_0x345ed6 > MAX_STORE_SIZE_MB) {
      console.warn("Le fichier store_msg.json dépasse " + MAX_STORE_SIZE_MB + " Mo. Réinitialisation...");
      fs.writeFileSync(storeFilePath, JSON.stringify({}));
    }
  } catch (_0x148a3e) {
    console.error("Erreur lors de la vérification ou de la réinitialisation du fichier :", _0x148a3e);
  }
}
function getMessage(_0x50d7a2) {
  try {
    const _0x2ce81d = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
    return _0x2ce81d[_0x50d7a2] || null;
  } catch (_0x259abf) {
    console.error("Erreur lors de la lecture du fichier de stockage :", _0x259abf);
    return null;
  }
}
function addMessage(_0x153795, _0x1ece41) {
  try {
    const _0x45a265 = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
    _0x45a265[_0x153795] = _0x1ece41;
    fs.writeFileSync(storeFilePath, JSON.stringify(_0x45a265, null, 2));
    checkAndResetStore();
  } catch (_0x519a55) {
    console.error("Erreur lors de l’ajout du message dans le fichier de stockage :", _0x519a55);
  }
}
module.exports = {
  getMessage: getMessage,
  addMessage: addMessage
};