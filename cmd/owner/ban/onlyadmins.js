'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'onlyadmins',
    react: '🛡️',
    desc: 'Activer ou désactiver le mode only-admins dans un groupe',
    classe: 'Owner',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg, verif_Groupe, ms } = ctx;
    try {
      if (!verif_Groupe) {
        return repondre('❌ Cette commande ne fonctionne que dans un groupe.');
      }
      if (
        !requireOwner(ctx, () =>
          ownerReply(sock, chatJid, ms, "⛔ Vous n'avez pas l'autorisation d'exécuter cette commande.")
        )
      ) {
        return;
      }

      const action = arg[0]?.toLowerCase();
      if (!['add', 'del'].includes(action)) {
        return repondre(
          '❓ Utilisation : `onlyadmins add` pour activer, `onlyadmins del` pour désactiver.'
        );
      }

      const record = await OnlyAdmins.findOne({ where: { id: chatJid } });
      if (action === 'add') {
        if (record) {
          return repondre('⚠️ Le mode only-admin est **déjà activé** pour ce groupe.');
        }
        await OnlyAdmins.create({ id: chatJid });
        return repondre('✅ Mode only-admin **activé** pour ce groupe.');
      }

      if (!record) {
        return repondre("⚠️ Ce groupe **n'était pas en mode only-admin**.");
      }
      await OnlyAdmins.destroy({ where: { id: chatJid } });
      return repondre('❌ Mode only-admin **désactivé** pour ce groupe.');
    } catch (err) {
      console.error('Erreur onlyadmins:', err);
      return repondre("❌ Une erreur s'est produite. Veuillez réessayer.");
    }
  }
);
