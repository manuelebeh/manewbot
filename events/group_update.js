const {
  groupCache
} = require("../lib/groupeCache");
async function group_update(_0x512d2b, _0x49480e) {
  try {
    const _0x5d0e9c = await _0x49480e.groupMetadata(_0x512d2b.id);
    groupCache.set(_0x512d2b.id, _0x5d0e9c);
  } catch (_0x8c68e8) {
    console.error("Erreur lors de la mise à jour du groupe :", _0x8c68e8);
  }
}
module.exports = group_update;