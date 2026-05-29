const fs = require("fs");
const path = require("path");
const storeFilePath = path.resolve(__dirname, "store_msg.json");
const MAX_STORE_SIZE_MB = 5;
function checkAndResetStore() {
  try {
    const stats = fs.statSync(storeFilePath);
    const sizeMb = stats.size / 1048576;
    if (sizeMb > MAX_STORE_SIZE_MB) {
      console.warn("Le fichier store_msg.json dépasse " + MAX_STORE_SIZE_MB + " Mo. Réinitialisation...");
      fs.writeFileSync(storeFilePath, JSON.stringify({}));
    }
  } catch (err) {
    console.error("Erreur lors de la vérification ou de la réinitialisation du fichier :", err);
  }
}
function getMessage(messageId) {
  try {
    const store = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
    return store[messageId] || null;
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier de stockage :", err);
    return null;
  }
}
function addMessage(messageId, messageData) {
  try {
    const store = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
    store[messageId] = messageData;
    fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2));
    checkAndResetStore();
  } catch (err) {
    console.error("Erreur lors de l’ajout du message dans le fichier de stockage :", err);
  }
}
module.exports = {
  getMessage: getMessage,
  addMessage: addMessage
};
