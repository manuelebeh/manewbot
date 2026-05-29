'use strict';

const { registerCommand } = require('../../lib/commands');
const { GroupSettings, Events2 } = require('../../database/events');

const commands = [
  {
    nom_cmd: 'antipromote',
    colonne: 'antipromote',
    react: '🛑',
    desc: "Active ou désactive l'antipromotion",
    table: GroupSettings,
  },
  {
    nom_cmd: 'antidemote',
    colonne: 'antidemote',
    react: '🛑',
    desc: "Active ou désactive l'antidémotion",
    table: GroupSettings,
  },
  {
    nom_cmd: 'promotealert',
    colonne: 'promoteAlert',
    react: '⚠️',
    desc: "Active ou désactive l'alerte de promotion",
    table: Events2,
  },
  {
    nom_cmd: 'demotealert',
    colonne: 'demoteAlert',
    react: '⚠️',
    desc: "Active ou désactive l'alerte de rétrogradation",
    table: Events2,
  },
];

commands.forEach(({ nom_cmd: cmdName, colonne: columnName, react: reactEmoji, desc: description, table: dbTable }) => {
  registerCommand(
    {
      nom_cmd: cmdName,
      classe: 'Groupe',
      react: reactEmoji,
      desc: description,
    },
    async (chatJid, sock, ctx) => {
      const { repondre, arg, verif_Groupe, verif_Admin } = ctx;
      try {
        if (!verif_Groupe) {
          return repondre('❌ Cette commande fonctionne uniquement dans les groupes.');
        }
        if (!verif_Admin) {
          return repondre('❌ Seuls les administrateurs peuvent utiliser cette commande.');
        }

        const subCommand = arg[0]?.toLowerCase();
        const toggleOptions = ['on', 'off'];
        const [dbRow] = await dbTable.findOrCreate({
          where: { id: chatJid },
          defaults: { id: chatJid, [columnName]: 'non' },
        });

        if (toggleOptions.includes(subCommand)) {
          const mode = subCommand === 'on' ? 'oui' : 'non';
          if (dbRow[columnName] === mode) {
            return repondre(`ℹ️ ${cmdName} est déjà ${subCommand}.`);
          }
          dbRow[columnName] = mode;
          await dbRow.save();
          return repondre(
            `✅ ${cmdName} ${subCommand === 'on' ? 'activé' : 'désactivé'} avec succès.`
          );
        }

        return repondre(`🛠️ Utilisation :\n> ${cmdName} on/off – ${description.toLowerCase()}`);
      } catch (err) {
        console.error(`Erreur lors de la configuration de ${cmdName} :`, err);
        return repondre("❌ Une erreur s'est produite lors de l'exécution de la commande.");
      }
    }
  );
});
