'use strict';

const { registerCommand } = require('./commands');

const OWNER_DENIED = "❌ Vous n'avez pas la permission d'exécuter cette commande.";

function registerCmdAclCommands({ set_cmd, del_cmd, list_cmd }) {
  const specs = [
    {
      type: 'public',
      setCmd: 'setpublic_cmd',
      delCmd: 'delpublic_cmd',
      listCmd: 'listpublic_cmd',
      setReact: '✅',
      delReact: '🗑️',
      listReact: '📜',
      setDesc:
        'Ajoute une commande publique utilisable par tout le monde quand le bot est en mode privé',
      delDesc: 'Supprime une commande des commandes publiques.',
      listDesc:
        'Liste les commandes publiques utilisablent quand le bot est en mode privé',
      setUsage: 'setpublic_cmd nom_cmd',
      delUsage: 'delpublic_cmd nom_cmd',
      setSuccess: (name) => `✅ Commande publique '${name}' enregistrée.`,
      listTitle: '📖 *Commandes publiques enregistrées :*',
      listEmpty: '❌ Aucune commande publique enregistrée.',
    },
    {
      type: 'private',
      setCmd: 'setprivate_cmd',
      delCmd: 'delprivate_cmd',
      listCmd: 'listprivate_cmd',
      setReact: '🔒',
      delReact: '🗑️',
      listReact: '📃',
      setDesc:
        'Ajoute une commande privée utilisable par les utilisateurs sudos quand le bot est en mode public',
      delDesc: 'Supprime une commande des commandes privée',
      listDesc:
        'Liste les commandes privées utilisablent par les utilisateurs sudos quand le bot est en mode public',
      setUsage: 'setprivate_cmd nom_cmd',
      delUsage: 'delprivate_cmd nom_cmd',
      setSuccess: (name) => `🔐 Commande privée '${name}' enregistrée.`,
      listTitle: '🔒 *Commandes privées enregistrées :*',
      listEmpty: '❌ Aucune commande privée enregistrée.',
    },
  ];

  for (const spec of specs) {
    registerCommand(
      {
        nom_cmd: spec.setCmd,
        classe: 'Owner',
        react: spec.setReact,
        desc: spec.setDesc,
      },
      async (chatJid, sock, ctx) => {
        const { arg, repondre, isOwner } = ctx;
        if (!isOwner) {
          return repondre(OWNER_DENIED);
        }
        const value = arg[0];
        if (!value) {
          return repondre(`❌ Utilisation: ${spec.setUsage}`);
        }
        try {
          await set_cmd(value, spec.type);
          repondre(spec.setSuccess(value));
        } catch {
          repondre("❌ Erreur lors de l'enregistrement.");
        }
      }
    );

    registerCommand(
      {
        nom_cmd: spec.delCmd,
        classe: 'Owner',
        react: spec.delReact,
        desc: spec.delDesc,
      },
      async (chatJid, sock, ctx) => {
        const { arg, repondre, isOwner } = ctx;
        if (!isOwner) {
          return repondre(OWNER_DENIED);
        }
        const value = arg[0];
        if (!value) {
          return repondre(`❌ Utilisation: ${spec.delUsage}`);
        }
        try {
          const deleted = await del_cmd(value, spec.type);
          repondre(
            deleted
              ? `✅ Commande '${value}' supprimée.`
              : `❌ Commande '${value}' introuvable.`
          );
        } catch {
          repondre('❌ Erreur lors de la suppression.');
        }
      }
    );

    registerCommand(
      {
        nom_cmd: spec.listCmd,
        classe: 'Owner',
        react: spec.listReact,
        desc: spec.listDesc,
      },
      async (chatJid, sock, ctx) => {
        const { repondre, isOwner } = ctx;
        if (!isOwner) {
          return repondre(OWNER_DENIED);
        }
        const entries = await list_cmd(spec.type);
        if (!entries.length) {
          return repondre(spec.listEmpty);
        }
        const text = entries
          .map((entry, index) => `🔹 *${index + 1}.* ${entry.nom_cmd}`)
          .join('\n');
        repondre(`${spec.listTitle}\n\n${text}`);
      }
    );
  }
}

module.exports = { registerCmdAclCommands };
