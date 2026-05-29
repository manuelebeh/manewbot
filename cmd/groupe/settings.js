'use strict';

const { registerCommand } = require('../../lib/commands');

registerCommand({
  nom_cmd: "gcreate",
  classe: "Groupe",
  react: "✅",
  desc: "Crée un groupe avec juste toi comme membre."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    isOwner,
    ms
  } = ctx;
  if (!isOwner) {
    return sock.sendMessage(chatJid, {
      text: "❌ Seul le propriétaire du bot peut créer un groupe."
    }, {
      quoted: ms
    });
  }
  if (arg.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "⚠️ Veuillez fournir un nom pour le groupe. Exemple : *gcreate MonGroupe*"
    }, {
      quoted: ms
    });
  }
  const text = arg.join(" ");
  try {
    const value = await sock.groupCreate(text, []);
    await sock.sendMessage(value.id, {
      text: "🎉 Groupe *\"" + text + "\"* créé avec succès !"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("❌ Erreur lors de la création du groupe :", err);
    await sock.sendMessage(chatJid, {
      text: "❌ Une erreur est survenue lors de la création du groupe."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "gdesc",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer la description d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    msg_Repondu,
    arg,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    let item;
    if (msg_Repondu) {
      item = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text;
    } else if (arg) {
      item = arg.join(" ");
    } else {
      return sock.sendMessage(chatJid, {
        text: "Entrez la nouvelle description."
      }, {
        quoted: ms
      });
    }
    await sock.groupUpdateDescription(chatJid, item);
  } else {
    sock.sendMessage(chatJid, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "gname",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer le nom d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    msg_Repondu,
    arg,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    let item;
    if (msg_Repondu) {
      item = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text;
    } else if (arg) {
      item = arg.join(" ");
    } else {
      return sock.sendMessage(chatJid, {
        text: "Entrez un nouveau nom"
      }, {
        quoted: ms
      });
    }
    await sock.groupUpdateSubject(chatJid, item);
  } else {
    sock.sendMessage(chatJid, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "close",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent envoyer des messages"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "announcement");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : seuls les admins peuvent envoyer des messages."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "open",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut envoyer des messages"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "not_announcement");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : tout le monde peut envoyer des messages."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "lock",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut modifier les paramètres du groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "unlocked");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : tout le monde peut modifier les paramètres du groupe."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "unlock",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent modifier les paramètres du groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "locked");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : seuls les admins peuvent modifier les paramètres du groupe."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "leave",
  classe: "Groupe",
  react: "😐",
  desc: "Commande pour quitter un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    isOwner
  } = ctx;
  if (!isOwner) {
    return sock.sendMessage(chatJid, {
      text: "Seul le propriétaire du bot peut quitter un groupe."
    }, {
      quoted: ctx.ms
    });
  }
  await sock.sendMessage(chatJid, {
    text: "Sayonara"
  }, {
    quoted: ctx.ms
  });
  await sock.groupLeave(chatJid);
});
registerCommand({
  nom_cmd: "link",
  classe: "Groupe",
  react: "🔗",
  desc: "Permet d'obtenir le lien d'invitation d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    const inviteCode = await sock.groupInviteCode(chatJid);
    await sock.sendMessage(chatJid, {
      text: "Lien d'invitation: https://chat.whatsapp.com/" + inviteCode
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "revoke",
  classe: "Groupe",
  react: "🔗",
  desc: "Réinitialise le lien d'invitation d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    await sock.groupRevokeInvite(chatJid);
    await sock.sendMessage(chatJid, {
      text: "Le lien d'invitation a été Réinitialisé."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "ginfo",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche les informations du groupe"
}, async (chatJid, sock, ctx) => {
  const groupMeta = await sock.groupMetadata(chatJid);
  await sock.sendMessage(chatJid, {
    text: "ID: " + groupMeta.id + "\nNom: " + groupMeta.subject + "\nDescription: " + groupMeta.desc
  }, {
    quoted: ctx.ms
  });
});
