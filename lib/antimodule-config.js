'use strict';

const { registerCommand } = require('./commands');

function registerAntimoduleConfig({ nom_cmd, label, react = '🔗', Model }) {
  registerCommand(
    {
      nom_cmd,
      classe: 'Groupe',
      react,
      desc: `Active ou configure ${label} pour les groupes`,
    },
    async (chatJid, sock, ctx) => {
      const { repondre, arg, verif_Groupe, verif_Admin } = ctx;
      try {
        if (!verif_Groupe) {
          return repondre('Cette commande ne fonctionne que dans les groupes');
        }
        if (!verif_Admin) {
          return repondre('Seuls les administrateurs peuvent utiliser cette commande');
        }

        const value = arg[0]?.toLowerCase();
        const toggleValues = ['on', 'off'];
        const actionValues = ['supp', 'warn', 'kick'];

        const [row] = await Model.findOrCreate({
          where: { id: chatJid },
          defaults: { id: chatJid, mode: 'non', type: 'supp' },
        });

        if (toggleValues.includes(value)) {
          const mode = value === 'on' ? 'oui' : 'non';
          if (row.mode === mode) {
            return repondre(`${label} est déjà ${value}`);
          }
          row.mode = mode;
          await row.save();
          return repondre(
            `${label} ${value === 'on' ? 'activé' : 'désactivé'} avec succès !`
          );
        }

        if (actionValues.includes(value)) {
          if (row.mode !== 'oui') {
            return repondre(
              `Veuillez activer ${nom_cmd} d'abord en utilisant \`${nom_cmd} on\``
            );
          }
          if (row.type === value) {
            return repondre(`L'action ${nom_cmd} est déjà définie sur ${value}`);
          }
          row.type = value;
          await row.save();
          return repondre(`L'Action de ${nom_cmd} définie sur ${value} avec succès !`);
        }

        return repondre(
          `Utilisation :\n${nom_cmd} on/off: Activer ou désactiver ${nom_cmd}\n${nom_cmd} supp/warn/kick: Configurer l'action ${nom_cmd}`
        );
      } catch (err) {
        console.error(`Erreur lors de la configuration de ${nom_cmd} :`, err);
        repondre("Une erreur s'est produite lors de l'exécution de la commande.");
      }
    }
  );
}

module.exports = { registerAntimoduleConfig };
