const {
  groupCache
} = require("../lib/groupe_cache");
async function group_update(groupUpdate, sock) {
  try {
    const metadata = await sock.groupMetadata(groupUpdate.id);
    groupCache.set(groupUpdate.id, metadata);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du groupe :", err);
  }
}
module.exports = { group_update };