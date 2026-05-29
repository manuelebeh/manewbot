'use strict';

const { registerCommand } = require('../../lib/commands');
const { Bans, OnlyAdmins } = require('../../database/ban');
const { requireOwner, ownerReply } = require('../../lib/require-owner');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'block',
    classe: 'Owner',
    react: '⛔',
    desc: 'Bloquer un utilisateur par son JID',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, verif_Groupe } = ctx;
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!requireOwner(ctx, () => repondre(OWNER_DENIED))) return;
    try {
      await sock.updateBlockStatus(chatJid, 'block');
      repondre('✅ Utilisateur bloqué avec succès.');
    } catch (err) {
      console.error('Erreur block:', err);
      repondre("Impossible de bloquer l'utilisateur.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'deblock',
    classe: 'Owner',
    react: '✅',
    desc: 'Débloquer un utilisateur par son JID',
  },
  async (chatJid, sock, ctx) => {
    const { verif_Groupe, repondre } = ctx;
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!requireOwner(ctx, () => repondre(OWNER_DENIED))) return;
    try {
      await sock.updateBlockStatus(chatJid, 'unblock');
      repondre('✅ Utilisateur débloqué avec succès.');
    } catch (err) {
      console.error('Erreur deblock:', err);
      repondre("Impossible de débloquer l'utilisateur.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'ban',
    classe: 'Owner',
    react: '🚫',
    desc: 'Bannir un utilisateur des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms, getJid, ownerJid } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

      const targetJid = await resolveTarget(ctx, sock, chatJid);
      if (!targetJid) {
        return repondre('Mentionnez un utilisateur valide à bannir.');
      }
      if (ownerJid && targetJid === ownerJid) {
        return ownerReply(sock, chatJid, ms, 'Vous ne pouvez pas bannir le propriétaire du bot.');
      }

      const [row] = await Bans.findOrCreate({
        where: { id: targetJid },
        defaults: { id: targetJid, type: 'user' },
      });
      if (!row._options.isNewRecord) {
        return repondre('Cet utilisateur est déjà banni !');
      }

      return ownerReply(sock, chatJid, ms, 'Utilisateur @' + targetJid.split('@')[0] + ' banni avec succès.', {
        mentions: [targetJid],
      });
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande ban :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'deban',
    classe: 'Owner',
    react: '🚫',
    desc: 'Débannir un utilisateur des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms, getJid } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

      const targetJid = await resolveTarget(ctx, sock, chatJid);
      if (!targetJid) {
        return repondre('Mentionnez un utilisateur valide à débannir.');
      }

      const deletedCount = await Bans.destroy({ where: { id: targetJid, type: 'user' } });
      if (deletedCount === 0) {
        return repondre("Cet utilisateur n'est pas banni.");
      }

      return ownerReply(
        sock,
        chatJid,
        ms,
        'Utilisateur @' + targetJid.split('@')[0] + ' débanni avec succès.',
        { mentions: [targetJid] }
      );
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande debannir :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'bangroup',
    classe: 'Owner',
    react: '🚫',
    desc: 'Bannir un groupe des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, verif_Groupe, ms } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;
      if (!verif_Groupe) {
        return repondre('Cette commande fonctionne uniquement dans les groupes.');
      }

      const [row] = await Bans.findOrCreate({
        where: { id: chatJid },
        defaults: { id: chatJid, type: 'group' },
      });
      if (!row._options.isNewRecord) {
        return repondre('Ce groupe est déjà banni !');
      }
      return repondre('Groupe banni avec succès.');
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande bangroup :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'debangroup',
    classe: 'Owner',
    react: '🚫',
    desc: 'Débannir un groupe des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, verif_Groupe, ms } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;
      if (!verif_Groupe) {
        return repondre('Cette commande fonctionne uniquement dans les groupes.');
      }

      const deletedCount = await Bans.destroy({ where: { id: chatJid, type: 'group' } });
      if (deletedCount === 0) {
        return repondre("Ce groupe n'est pas banni.");
      }
      return repondre('Groupe débanni avec succès.');
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande debangroup :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);

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

async function resolveTarget(ctx, sock, chatJid) {
  const { getJid, auteur_Msg_Repondu, arg } = ctx;
  const raw =
    auteur_Msg_Repondu || (arg[0]?.includes('@') && arg[0].replace('@', '') + '@lid');
  return getJid(raw, chatJid, sock);
}
