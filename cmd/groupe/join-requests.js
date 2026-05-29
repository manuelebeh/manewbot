'use strict';

const { registerCommand } = require('../../lib/commands');

async function gererDemandesIndividuellement(chatJid, action, sock, ctx) {
  const {
    verif_Admin: verif_Admin,
    isSudo: isSudo,
    verif_Bot_Admin: verif_Bot_Admin,
    verif_Groupe: verif_Groupe,
    ms: ms,
  } = ctx;

  if (!verif_Groupe) {
    return sock.sendMessage(
      chatJid,
      { text: '❌ Commande réservée aux groupes uniquement.' },
      { quoted: ms }
    );
  }
  if (!verif_Admin && !isSudo) {
    return sock.sendMessage(
      chatJid,
      { text: '❌ Vous n\'avez pas les permissions pour utiliser cette commande.' },
      { quoted: ms }
    );
  }
  if (!verif_Bot_Admin) {
    return sock.sendMessage(
      chatJid,
      { text: '❌ Je dois être administrateur pour effectuer cette action.' },
      { quoted: ms }
    );
  }

  try {
    const pending = await sock.groupRequestParticipantsList(chatJid);
    if (!pending || pending.length === 0) {
      return sock.sendMessage(
        chatJid,
        { text: 'ℹ️ Aucune demande en attente.' },
        { quoted: ms }
      );
    }

    const jids = pending.map((entry) => entry.jid);
    let processed = 0;

    for (const jid of jids) {
      try {
        await sock.groupRequestParticipantsUpdate(chatJid, [jid], action);
        processed++;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`❌ Erreur ${action} pour ${jid} :`, err.message);
      }
    }

    const icon = action === 'approve' ? '✅' : '❌';
    const label = action === 'approve' ? 'acceptée(s)' : 'rejetée(s)';
    sock.sendMessage(
      chatJid,
      { text: `${icon} ${processed} demande(s) ${label}.`, quoted: ms }
    );
  } catch (err) {
    console.error('❌ Erreur générale :', err);
    sock.sendMessage(chatJid, { text: '❌ Une erreur est survenue.', quoted: ms });
  }
}

registerCommand(
  {
    nom_cmd: 'join',
    classe: 'Groupe',
    react: '😶‍🌫',
    desc: "Permet de rejoindre un groupe via un lien d'invitation",
  },
  async (chatJid, sock, ctx) => {
    const { isOwner, arg, ms } = ctx;
    if (!isOwner) {
      return sock.sendMessage(
        chatJid,
        { text: 'Seul le propriétaire du bot peut rejoindre un groupe.' },
        { quoted: ms }
      );
    }
    if (!arg) {
      return sock.sendMessage(
        chatJid,
        { text: "Veuillez fournir le lien d'invitation du groupe." },
        { quoted: ms }
      );
    }
    const text = arg.join('');
    const inviteCode = text.split('/')[3];
    await sock.groupAcceptInvite(inviteCode);
    await sock.sendMessage(
      chatJid,
      { text: 'Vous avez rejoint le groupe avec succès.' },
      { quoted: ms }
    );
  }
);

registerCommand(
  {
    nom_cmd: 'acceptall',
    classe: 'Groupe',
    react: '✅',
    desc: 'Accepte toutes les demandes une par une.',
  },
  async (chatJid, sock, ctx) => {
    await gererDemandesIndividuellement(chatJid, 'approve', sock, ctx);
  }
);

registerCommand(
  {
    nom_cmd: 'rejectall',
    classe: 'Groupe',
    react: '❌',
    desc: 'Rejette toutes les demandes une par une.',
  },
  async (chatJid, sock, ctx) => {
    await gererDemandesIndividuellement(chatJid, 'reject', sock, ctx);
  }
);
