'use strict';

const { registerCommand } = require('../../lib/commands');
const { getGroupMetadata } = require('../../lib/groupe_cache');
const { GroupSettings, Events2 } = require('../../database/events');

function registerWelcomeGoodbye(cmdName) {
  const isWelcome = cmdName === 'welcome';

  registerCommand(
    {
      nom_cmd: cmdName,
      classe: 'Groupe',
      react: '👋',
      desc: isWelcome
        ? 'Configurer ou activer les messages de bienvenue'
        : "Configurer ou activer les messages d'adieu",
    },
    async (chatJid, sock, ctx) => {
      const { repondre, arg, verif_Admin, verif_Groupe, auteur_Message } = ctx;
      try {
        if (!verif_Groupe) {
          return repondre('❌ Commande utilisable uniquement dans les groupes.');
        }
        if (!verif_Admin) {
          return repondre('❌ Seuls les administrateurs peuvent utiliser cette commande.');
        }

        const subCommand = arg[0]?.toLowerCase();
        const [groupSettings] = await GroupSettings.findOrCreate({
          where: { id: chatJid },
          defaults: { id: chatJid, [cmdName]: 'non' },
        });
        const [eventsRow] = await Events2.findOrCreate({
          where: { id: chatJid },
          defaults: { id: chatJid },
        });

        const messageColumn = isWelcome ? 'welcome_msg' : 'goodbye_msg';
        const storedMessage = eventsRow[messageColumn];

        if (!arg.length) {
          return repondre(
            `🛠️ *Utilisation de la commande ${cmdName}* :\n\n1️⃣ *${cmdName} on/off* – Active ou désactive les messages de ${isWelcome ? 'bienvenue' : "d'adieu"}.\n2️⃣ *${cmdName} get* – Affiche le message ${isWelcome ? 'de bienvenue' : "d'adieu"} personnalisé.\n3️⃣ *${cmdName} Votre message...* – Définir un message personnalisé.\n4️⃣ *${cmdName} défaut* – Réinitialise le message ${isWelcome ? 'de bienvenue' : "d'adieu"}.\n\n📌 Variables disponibles :\n@user → Mention du membre\n#groupe → Nom du groupe\n#membre → Nombre de membres\n#desc → Description du groupe\n#url=lien → Utilise un média (image, vidéo)\n#pp → Utilise la photo de profil du membre\n#gpp → Utilise la photo de profil du groupe\n#audio=url → Utilise un audio`
          );
        }

        if (['on', 'off'].includes(subCommand)) {
          const mode = subCommand === 'on' ? 'oui' : 'non';
          if (groupSettings[cmdName] === mode) {
            return repondre(
              `ℹ️ Le message ${isWelcome ? 'de bienvenue' : "d'adieu"} est déjà ${subCommand === 'on' ? 'activé' : 'désactivé'}.`
            );
          }
          groupSettings[cmdName] = mode;
          await groupSettings.save();
          return repondre(
            `✅ Message ${isWelcome ? 'de bienvenue' : "d'adieu"} ${subCommand === 'on' ? 'activé' : 'désactivé'} avec succès.`
          );
        }

        if (subCommand === 'get') {
          if (!storedMessage || !storedMessage.trim()) {
            return repondre(
              `⚠️ Aucun message ${isWelcome ? 'de bienvenue' : "d'adieu"} personnalisé configuré.`
            );
          }

          const groupMeta = await getGroupMetadata(sock, chatJid);
          const groupName = groupMeta.subject || 'Groupe';
          const memberCount = groupMeta.participants.length;
          const groupDesc = groupMeta.desc || 'Aucune description';
          const userMention = '@' + auteur_Message.split('@')[0];

          let formattedMessage = storedMessage;
          const urlMatch = formattedMessage.match(/#url=(\S+)/i);
          const audioMatch = formattedMessage.match(/#audio=(\S+)/i);
          const useProfilePic = formattedMessage.includes('#pp');
          const useGroupPic = formattedMessage.includes('#gpp');

          formattedMessage = formattedMessage
            .replace(/#url=\S+/i, '')
            .replace(/#audio=\S+/i, '')
            .replace(/#pp/gi, '')
            .replace(/#gpp/gi, '')
            .replace(/@user/gi, userMention)
            .replace(/#groupe/gi, groupName)
            .replace(/#membre/gi, memberCount)
            .replace(/#desc/gi, groupDesc);

          let mediaSent = false;

          if (urlMatch) {
            const mediaUrl = urlMatch[1];
            const extension = mediaUrl.split('.').pop().toLowerCase();
            let mediaPayload = null;
            if (['mp4', 'mov', 'webm'].includes(extension)) {
              mediaPayload = {
                video: { url: mediaUrl },
                caption: formattedMessage.trim(),
                gifPlayback: true,
                mentions: [auteur_Message],
              };
            } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
              mediaPayload = {
                image: { url: mediaUrl },
                caption: formattedMessage.trim(),
                mentions: [auteur_Message],
              };
            }
            if (mediaPayload) {
              await sock.sendMessage(chatJid, mediaPayload);
              mediaSent = true;
            }
          } else if (useProfilePic) {
            try {
              const profilePic = await sock.profilePictureUrl(auteur_Message, 'image');
              await sock.sendMessage(chatJid, {
                image: { url: profilePic },
                caption: formattedMessage.trim(),
                mentions: [auteur_Message],
              });
              mediaSent = true;
            } catch {
              /* ignore missing profile picture */
            }
          } else if (useGroupPic) {
            try {
              const groupPic = await sock.profilePictureUrl(chatJid, 'image');
              await sock.sendMessage(chatJid, {
                image: { url: groupPic },
                caption: formattedMessage.trim(),
                mentions: [auteur_Message],
              });
              mediaSent = true;
            } catch {
              /* ignore missing group picture */
            }
          }

          if (audioMatch) {
            await sock.sendMessage(chatJid, {
              audio: { url: audioMatch[1] },
              mimetype: 'audio/mpeg',
            });
            mediaSent = true;
          }

          if (!mediaSent && formattedMessage.trim()) {
            await sock.sendMessage(chatJid, {
              text: formattedMessage.trim(),
              mentions: [auteur_Message],
            });
          }
          return;
        }

        if (subCommand === 'défaut' || subCommand === 'default') {
          if (!storedMessage) {
            return repondre(
              `ℹ️ Aucun message ${isWelcome ? 'de bienvenue' : "d'adieu"} n'est actuellement défini.`
            );
          }
          eventsRow[messageColumn] = null;
          await eventsRow.save();
          return repondre(
            `✅ Message ${isWelcome ? 'de bienvenue' : "d'adieu"} réinitialisé aux paramètres par défaut.`
          );
        }

        const newMessage = arg.join(' ').trim();
        if (!newMessage) {
          return repondre('❌ Le message ne peut pas être vide.');
        }
        eventsRow[messageColumn] = newMessage;
        await eventsRow.save();
        return repondre(
          `✅ Nouveau message ${isWelcome ? 'de bienvenue' : "d'adieu"} enregistré avec succès !`
        );
      } catch (err) {
        console.error(`❌ Erreur ${cmdName} :`, err);
        repondre('❌ Une erreur s\'est produite.');
      }
    }
  );
}

registerWelcomeGoodbye('welcome');
registerWelcomeGoodbye('goodbye');
