'use strict';

const config = require('../../set');

async function envoyerWelcomeGoodbye(groupId, memberJid, messageType, eventSettings, sock) {
  const groupMetadata = await sock.groupMetadata(groupId);
  const groupName = groupMetadata.subject || 'Groupe';
  const memberCount = groupMetadata.participants.length;
  const description = groupMetadata.desc || 'Aucune description';
  const mentionUser = '@' + memberJid.split('@')[0];
  const template = {
    welcome:
      eventSettings.welcome_msg ||
      '🎉Bienvenue @user\n👥Groupe: #groupe\n🔆Membres: #membre\n📃Description: ' +
        description +
        ' #pp',
    goodbye: eventSettings.goodbye_msg || '👋Au revoir @user #pp',
  }[messageType];
  const audioMatch = template.match(/#audio=(\S+)/i);
  const urlMatch = template.match(/#url=(\S+)/i);
  const includeProfilePic = template.includes('#pp');
  const includeGroupPic = template.includes('#gpp');
  let messageText = template
    .replace(/#audio=\S+/i, '')
    .replace(/#url=\S+/i, '')
    .replace(/#pp/gi, '')
    .replace(/#gpp/gi, '')
    .replace(/@user/gi, mentionUser)
    .replace(/#groupe/gi, groupName)
    .replace(/#membre/gi, memberCount)
    .replace(/#desc/gi, description);
  const mentions = [memberJid];
  const contextInfo = { mentionedJid: mentions };
  let mediaType = null;
  let mediaUrl = null;
  if (urlMatch) {
    mediaUrl = urlMatch[1];
    const extension = mediaUrl.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(extension)) {
      mediaType = 'video';
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      mediaType = 'image';
    } else {
      mediaType = 'document';
    }
  } else if (includeProfilePic) {
    try {
      mediaUrl = await sock.profilePictureUrl(memberJid, 'image');
    } catch {
      mediaUrl = config.WELCOME_IMAGE_URL;
    }
    mediaType = 'image';
  } else if (includeGroupPic) {
    try {
      mediaUrl = await sock.profilePictureUrl(groupId, 'image');
    } catch {
      mediaUrl = config.WELCOME_IMAGE_URL;
    }
    mediaType = 'image';
  }
  if (mediaUrl && mediaType) {
    const mediaMessage = {
      [mediaType]: { url: mediaUrl },
      caption: messageText.trim() || undefined,
      mentions,
      contextInfo,
    };
    if (mediaType === 'video') {
      mediaMessage.video.gifPlayback = true;
    }
    await sock.sendMessage(groupId, mediaMessage);
  } else if (messageText.trim()) {
    await sock.sendMessage(groupId, {
      text: messageText.trim(),
      mentions,
      contextInfo,
    });
  }
  if (audioMatch) {
    const audioUrl = audioMatch[1];
    await sock.sendMessage(groupId, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
    });
  }
}

module.exports = { envoyerWelcomeGoodbye };
