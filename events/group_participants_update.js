const {
  GroupSettings,
  Events2
} = require("../database/events");
const {
  jidDecode
} = require("@whiskeysockets/baileys");
const {
  getJid
} = require("./message_upsert_events");
const {
  groupCache
} = require("../lib/groupe_cache");
const config = require("../set");
const {
  getDevJids
} = require("../lib/parse-env-lists");
const parseID = jid => {
  if (!jid) {
    return jid;
  }
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {};
    return decoded.user && decoded.server && decoded.user + "@" + decoded.server || jid;
  }
  return jid;
};
async function envoyerWelcomeGoodbye(groupId, memberJid, messageType, eventSettings, sock) {
  const groupMetadata = await sock.groupMetadata(groupId);
  const groupName = groupMetadata.subject || "Groupe";
  const memberCount = groupMetadata.participants.length;
  const description = groupMetadata.desc || "Aucune description";
  const mentionUser = "@" + memberJid.split("@")[0];
  const template = {
    welcome: eventSettings.welcome_msg || "🎉Bienvenue @user\n👥Groupe: #groupe\n🔆Membres: #membre\n📃Description: " + description + " #pp",
    goodbye: eventSettings.goodbye_msg || "👋Au revoir @user #pp"
  }[messageType];
  const audioMatch = template.match(/#audio=(\S+)/i);
  const urlMatch = template.match(/#url=(\S+)/i);
  const includeProfilePic = template.includes("#pp");
  const includeGroupPic = template.includes("#gpp");
  let messageText = template.replace(/#audio=\S+/i, "").replace(/#url=\S+/i, "").replace(/#pp/gi, "").replace(/#gpp/gi, "").replace(/@user/gi, mentionUser).replace(/#groupe/gi, groupName).replace(/#membre/gi, memberCount).replace(/#desc/gi, description);
  const mentions = [memberJid];
  const contextInfo = {
    mentionedJid: mentions
  };
  let mediaType = null;
  let mediaUrl = null;
  if (urlMatch) {
    mediaUrl = urlMatch[1];
    const extension = mediaUrl.split(".").pop().toLowerCase();
    if (["mp4", "mov", "webm"].includes(extension)) {
      mediaType = "video";
    } else if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
      mediaType = "image";
    } else {
      mediaType = "document";
    }
  } else if (includeProfilePic) {
    try {
      mediaUrl = await sock.profilePictureUrl(memberJid, "image");
    } catch {
      mediaUrl = "https://files.catbox.moe/82g8ey.jpg";
    }
    mediaType = "image";
  } else if (includeGroupPic) {
    try {
      mediaUrl = await sock.profilePictureUrl(groupId, "image");
    } catch {
      mediaUrl = "https://files.catbox.moe/82g8ey.jpg";
    }
    mediaType = "image";
  }
  if (mediaUrl && mediaType) {
    const mediaMessage = {
      [mediaType]: {
        url: mediaUrl
      },
      caption: messageText.trim() || undefined,
      mentions: mentions,
      contextInfo: contextInfo
    };
    if (mediaType === "video") {
      mediaMessage.video.gifPlayback = true;
    }
    await sock.sendMessage(groupId, mediaMessage);
  } else if (messageText.trim()) {
    await sock.sendMessage(groupId, {
      text: messageText.trim(),
      mentions: mentions,
      contextInfo: contextInfo
    });
  }
  if (audioMatch) {
    const audioUrl = audioMatch[1];
    await sock.sendMessage(groupId, {
      audio: {
        url: audioUrl
      },
      mimetype: "audio/mpeg"
    });
  }
}
async function group_participants_update(participantUpdate, sock) {
  try {
    const groupMetadata = await sock.groupMetadata(participantUpdate.id);
    groupCache.set(participantUpdate.id, groupMetadata);
    const groupMeta = groupMetadata;
    const groupSettings = await GroupSettings.findOne({
      where: {
        id: participantUpdate.id
      }
    });
    const eventSettings = await Events2.findOne({
      where: {
        id: participantUpdate.id
      }
    });
    if (!groupSettings) {
      return;
    }
    const {
      welcome: welcome,
      goodbye: goodbye,
      antipromote: antipromote,
      antidemote: antidemote
    } = groupSettings;
    const promoteAlert = eventSettings?.promoteAlert || "non";
    const demoteAlert = eventSettings?.demoteAlert || "non";
    for (const participant of participantUpdate.participants) {
      const memberJid = participant.phoneNumber || participant;
      const authorJid = participantUpdate.author;
      const authorMention = authorJid ? "@" + authorJid.split("@")[0] : "quelqu’un";
      const memberMention = "@" + memberJid.split("@")[0];
      const mentionJids = authorJid ? [memberJid, authorJid] : [memberJid];
      const contextInfo = {
        mentionedJid: mentionJids
      };
      if (participantUpdate.action == "add" && welcome == "oui") {
        if (eventSettings) {
          await envoyerWelcomeGoodbye(participantUpdate.id, memberJid, "welcome", eventSettings, sock);
        }
      }
      if (participantUpdate.action == "remove" && goodbye == "oui") {
        if (eventSettings) {
          await envoyerWelcomeGoodbye(participantUpdate.id, memberJid, "goodbye", eventSettings, sock);
        }
      }
      if (participantUpdate.action == "promote" || participantUpdate.action == "demote") {
        const authorJidResolved = await getJid(participantUpdate.author, participantUpdate.id, sock);
        const ownerJid = await getJid(groupMeta.owner, participantUpdate.id, sock);
        const botJid = await getJid(parseID(sock.user.id), participantUpdate.id, sock);
        const targetJid = await getJid(memberJid, participantUpdate.id, sock);
        const ownerConfigJid = config.NUMERO_OWNER
          ? await getJid(config.NUMERO_OWNER + "@s.whatsapp.net", participantUpdate.id, sock)
          : null;
        const devJidsResolved = (
          await Promise.all(
            getDevJids(config).map((jid) => getJid(jid, participantUpdate.id, sock))
          )
        ).filter(Boolean);
        const isPrivilegedAuthor = [ownerJid, botJid, ownerConfigJid, targetJid, ...devJidsResolved].includes(authorJidResolved);
        if (participantUpdate.action == "promote") {
          if (antipromote == "oui" && isPrivilegedAuthor) {
            continue;
          }
          if (antipromote == "oui") {
            await sock.groupParticipantsUpdate(participantUpdate.id, [memberJid], "demote");
            await sock.sendMessage(participantUpdate.id, {
              text: "🚫 *Promotion refusée !*\n" + authorMention + " n’a pas le droit de promouvoir " + memberMention + ".",
              mentions: mentionJids,
              contextInfo: contextInfo
            });
          } else if (promoteAlert == "oui") {
            let profilePicUrl = "https://files.catbox.moe/82g8ey.jpg";
            try {
              profilePicUrl = await sock.profilePictureUrl(memberJid, "image");
            } catch {}
            await sock.sendMessage(participantUpdate.id, {
              image: {
                url: profilePicUrl
              },
              caption: "🆙 " + memberMention + " a été promu par " + authorMention + ".",
              mentions: mentionJids,
              contextInfo: contextInfo
            });
          }
        }
        if (participantUpdate.action == "demote") {
          if (antidemote == "oui" && isPrivilegedAuthor) {
            continue;
          }
          if (antidemote == "oui") {
            await sock.groupParticipantsUpdate(participantUpdate.id, [memberJid], "promote");
            await sock.sendMessage(participantUpdate.id, {
              text: "🚫 *Rétrogradation refusée !*\n" + authorMention + " ne peut pas rétrograder " + memberMention + ".",
              mentions: mentionJids,
              contextInfo: contextInfo
            });
          } else if (demoteAlert == "oui") {
            let profilePicUrl = "https://files.catbox.moe/82g8ey.jpg";
            try {
              profilePicUrl = await sock.profilePictureUrl(memberJid, "image");
            } catch {}
            await sock.sendMessage(participantUpdate.id, {
              image: {
                url: profilePicUrl
              },
              caption: "⬇️ " + memberMention + " a été rétrogradé par " + authorMention + ".",
              mentions: mentionJids,
              contextInfo: contextInfo
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ Erreur group_participants_update :", err);
  }
}
module.exports = group_participants_update;
