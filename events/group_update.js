const { groupCache, getGroupMetadata } = require('../lib/groupe_cache');

async function group_update(updates, sock) {
  const list = Array.isArray(updates) ? updates : [updates];

  for (const update of list) {
    if (!update?.id) continue;

    try {
      const cached = groupCache.getStale(update.id);
      if (cached) {
        groupCache.set(update.id, { ...cached, ...update });
        continue;
      }
      await getGroupMetadata(sock, update.id);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du groupe :', err);
    }
  }
}

module.exports = { group_update };
