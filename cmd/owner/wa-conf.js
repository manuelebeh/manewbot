'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner, ownerReply } = require('../../lib/require-owner');
const config = require('../../set');
const {
  resolveCommandReactEnabled,
  getCommandReactEnvOverride,
  formatFeatureState,
} = require('../../lib/env-toggle');
const { WA_CONF, WA_CONF2 } = require('../../database/wa_conf');
const { Levelup } = require('../../database/rank');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

function registerWaConf2Toggle({ nom_cmd, react, desc, column, usageHint, statusSuffix = '' }) {
  registerCommand({ nom_cmd, classe: 'Owner', react, desc }, async (chatJid, sock, ctx) => {
    const { repondre, ms, arg } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

    const record = await WA_CONF2.findOne({ where: { id: '1' } });

    if (!arg[0]) {
      const enabled = record && record[column] === 'oui';
      return ownerReply(
        sock,
        chatJid,
        ms,
        `Etat actuel de ${nom_cmd} : ${enabled ? 'activé' : 'désactivé'}${statusSuffix}\nUsage : ${usageHint}`
      );
    }

    const toggle = arg[0].toLowerCase();
    if (toggle !== 'on' && toggle !== 'off') {
      return repondre(`Merci d'utiliser : ${nom_cmd} on ou ${nom_cmd} off`);
    }

    const mode = toggle === 'on' ? 'oui' : 'non';

    if (!record) {
      await WA_CONF2.create({ id: '1', [column]: mode });
      return ownerReply(sock, chatJid, ms, `${nom_cmd} est maintenant ${toggle === 'on' ? 'activé' : 'désactivé'}.`);
    }

    if ((toggle === 'on' && record[column] === 'oui') || (toggle === 'off' && record[column] === 'non')) {
      return ownerReply(
        sock,
        chatJid,
        ms,
        `${nom_cmd} est déjà ${toggle === 'on' ? 'activé' : 'désactivé'}.`
      );
    }

    record[column] = mode;
    await record.save();
    return ownerReply(sock, chatJid, ms, `${nom_cmd} est maintenant ${toggle === 'on' ? 'activé' : 'désactivé'}.`);
  });
}

registerWaConf2Toggle({
  nom_cmd: 'anticall',
  react: '📵',
  desc: 'Active ou désactive le blocage automatique des appels.',
  column: 'anticall',
  usageHint: 'anticall on/off',
});

registerWaConf2Toggle({
  nom_cmd: 'lecture_msg',
  react: '📖',
  desc: 'Active ou désactive la lecture automatique des messages.',
  column: 'autoread_msg',
  usageHint: 'lecture_msg on/off',
});

registerWaConf2Toggle({
  nom_cmd: 'react_msg',
  react: '🤖',
  desc: 'Active ou désactive la réaction automatique aux messages.',
  column: 'autoreact_msg',
  usageHint: 'react_msg on/off',
  statusSuffix:
    ' (réaction aléatoire sur *tous* les messages)\n\nRéaction à l\'exécution des commandes : ' +
    formatFeatureState(resolveCommandReactEnabled(config), getCommandReactEnvOverride(config)) +
    ' — réglage .env COMMAND_REACT',
});

registerCommand(
  {
    nom_cmd: 'levelup',
    classe: 'Owner',
    react: '⚙️',
    desc: 'Activer ou désactiver le message de level up',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms, arg } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) {
      return;
    }
    try {
      if (!arg[0]) {
        return repondre("Veuillez préciser 'on' ou 'off'.");
      }
      const toggle = arg[0].toLowerCase();
      if (toggle !== 'on' && toggle !== 'off') {
        return repondre("Argument invalide, utilisez 'on' ou 'off'.");
      }
      const mode = toggle === 'on' ? 'oui' : 'non';
      let record = await Levelup.findOne({ where: { id: 1 } });
      if (!record) {
        record = await Levelup.create({ id: 1, levelup: mode });
      } else {
        record.levelup = mode;
        await record.save();
      }
      return ownerReply(
        sock,
        chatJid,
        ms,
        `Le message de level up est maintenant ${mode === 'oui' ? 'activé' : 'désactivé'}.`
      );
    } catch (err) {
      console.error('Erreur commande levelup :', err);
      return repondre('Une erreur est survenue.');
    }
  }
);

registerCommand(
  {
    nom_cmd: 'antidelete',
    classe: 'Owner',
    react: '🔗',
    desc: "Configure ou désactive l'Antidelete",
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg } = ctx;
    try {
      if (!requireOwner(ctx, () => repondre('🔒 Cette commande est réservée aux utilisateurs sudo.'))) {
        return;
      }

      const value = arg[0]?.toLowerCase();
      const modeArg = arg[1]?.toLowerCase();
      const options = {
        1: 'pm',
        2: 'gc',
        3: 'status',
        4: 'all',
        5: 'pm/gc',
        6: 'pm/status',
        7: 'gc/status',
      };

      const [row] = await WA_CONF.findOrCreate({
        where: { id: '1' },
        defaults: { id: '1', antidelete: 'non' },
      });

      if (value === 'off') {
        if (row.antidelete === 'non') {
          return repondre("❌ L'antidelete est déjà désactivé.");
        }
        row.antidelete = 'non';
        await row.save();
        return repondre('✅ Antidelete désactivé avec succès.');
      }

      if (['pv', 'org'].includes(value)) {
        return repondre('❌ Usage invalide.\nUtilisez : antidelete <numéro> [pv|org]\nExemple : antidelete 3 org');
      }

      const amount = parseInt(value, 10);
      if (!options[amount]) {
        return repondre(
          "📌 *Utilisation de la commande antidelete :*\n\n🔹 antidelete off : Désactiver l'antidelete\n\n🔹 antidelete 1 : Activer sur les messages privés (pm)\n🔹 antidelete 2 : Activer sur les messages de groupe (gc)\n🔹 antidelete 3 : Activer sur les statuts (status)\n🔹 antidelete 4 : Activer sur tous les types (all)\n🔹 antidelete 5 : Activer sur pm + gc\n🔹 antidelete 6 : Activer sur pm + status\n🔹 antidelete 7 : Activer sur gc + status\n\n➕ Vous pouvez ajouter `pv` ou `org` après le numéro pour choisir où renvoyer le message supprimé.\n   Exemple : `antidelete 3 org`\n\n✳️ Par défaut, si rien n’est précisé, c’est `pv` (inbox) qui est utilisé."
        );
      }

      if (modeArg && !['pv', 'org'].includes(modeArg)) {
        return repondre("❌ Mode invalide. Utilisez soit 'pv' soit 'org' après le numéro.");
      }

      let configValue = options[amount] + '-' + (modeArg || 'pv');
      if (row.antidelete === configValue) {
        return repondre("⚠️ L'antidelete est déjà configuré sur '" + configValue + "'.");
      }

      row.antidelete = configValue;
      await row.save();
      return repondre('✅ Antidelete configuré sur : *' + configValue + '*');
    } catch (err) {
      console.error('Erreur antidelete :', err);
      repondre("❌ Une erreur s'est produite lors de la configuration de l'antidelete.");
    }
  }
);
