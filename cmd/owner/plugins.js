'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner, ownerReply } = require('../../lib/require-owner');

const DISABLED_MSG = '⛔ Les plugins distants sont désactivés sur cette instance.';
const DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

function registerDisabledPluginCmd(meta) {
  registerCommand(meta, async (chatJid, sock, ctx) => {
    const { repondre, ms } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, DENIED))) {
      return;
    }
    return repondre(DISABLED_MSG);
  });
}

registerDisabledPluginCmd({
  nom_cmd: 'pglist',
  classe: 'Owner',
  react: '🧩',
  desc: "Affiche la liste des plugins disponibles avec statut d'installation.",
  alias: ['pgl', 'plist'],
});

registerDisabledPluginCmd({
  nom_cmd: 'pgremove',
  classe: 'Owner',
  react: '🗑️',
  desc: 'Supprime un plugin installé par nom ou tape `remove all` pour tous.',
  alias: ['pgr'],
});

registerDisabledPluginCmd({
  nom_cmd: 'pginstall',
  classe: 'Owner',
  react: '📥',
  desc: 'Installe un plugin.',
  alias: ['pgi'],
});
