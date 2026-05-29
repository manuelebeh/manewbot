const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../lib/cache_jid.json");
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}
function readCache() {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
function writeCache(cache) {
  fs.writeFileSync(filePath, JSON.stringify(cache, null, 2));
}
async function getJid(participantId, groupJid, sock, retryCount = 0) {
  try {
    if (!participantId || typeof participantId !== "string") {
      return null;
    }
    if (participantId.endsWith("@s.whatsapp.net")) {
      return participantId;
    }
    const cache = readCache();
    if (cache[participantId]) {
      return cache[participantId];
    }
    if (!groupJid || !groupJid.endsWith("@g.us")) {
      return null;
    }
    const groupMeta = await sock.groupMetadata(groupJid);
    if (!groupMeta || !Array.isArray(groupMeta.participants)) {
      return null;
    }
    const participant = groupMeta.participants.find(p => p.id == participantId);
    if (!participant) {
      return null;
    }
    const resolvedJid = participant.jid || participant.phoneNumber;
    cache[participantId] = resolvedJid;
    writeCache(cache);
    return resolvedJid;
  } catch (err) {
    if (retryCount < 2) {
      return getJid(participantId, groupJid, sock, retryCount + 1);
    }
    console.error("❌ Erreur dans getJid après 3 tentatives:", err.message);
    return null;
  }
}
module.exports = { getJid };
