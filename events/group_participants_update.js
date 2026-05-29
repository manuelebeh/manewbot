'use strict';

const { GroupSettings, Events2 } = require('../database/events');
const { Sudo } = require('../database/sudo');
const { groupCache } = require('../lib/groupe_cache');
const { envoyerWelcomeGoodbye } = require('./group_participants/welcome-goodbye-send');
const { handlePromoteDemote } = require('./group_participants/promote-demote');

async function getSudoUserIds() {
  try {
    const records = await Sudo.findAll({ attributes: ['id'] });
    return records.map((record) => record.id.replace(/@s\.whatsapp\.net$/, ''));
  } catch {
    return [];
  }
}

async function group_participants_update(participantUpdate, sock) {
  try {
    const groupMetadata = await sock.groupMetadata(participantUpdate.id);
    groupCache.set(participantUpdate.id, groupMetadata);
    const groupMeta = groupMetadata;
    const groupSettings = await GroupSettings.findOne({
      where: { id: participantUpdate.id },
    });
    const eventSettings = await Events2.findOne({
      where: { id: participantUpdate.id },
    });
    if (!groupSettings) return;

    const {
      welcome,
      goodbye,
      antipromote,
      antidemote,
    } = groupSettings;
    const promoteAlert = eventSettings?.promoteAlert || 'non';
    const demoteAlert = eventSettings?.demoteAlert || 'non';

    for (const participant of participantUpdate.participants) {
      const memberJid = participant.phoneNumber || participant;
      const authorJid = participantUpdate.author;
      const authorMention = authorJid ? '@' + authorJid.split('@')[0] : 'quelqu’un';
      const memberMention = '@' + memberJid.split('@')[0];
      const mentionJids = authorJid ? [memberJid, authorJid] : [memberJid];
      const contextInfo = { mentionedJid: mentionJids };

      if (participantUpdate.action === 'add' && welcome === 'oui' && eventSettings) {
        await envoyerWelcomeGoodbye(
          participantUpdate.id,
          memberJid,
          'welcome',
          eventSettings,
          sock
        );
      }
      if (participantUpdate.action === 'remove' && goodbye === 'oui' && eventSettings) {
        await envoyerWelcomeGoodbye(
          participantUpdate.id,
          memberJid,
          'goodbye',
          eventSettings,
          sock
        );
      }
      if (
        participantUpdate.action === 'promote' ||
        participantUpdate.action === 'demote'
      ) {
        await handlePromoteDemote({
          sock,
          participantUpdate,
          groupMeta,
          memberJid,
          authorJid,
          authorMention,
          memberMention,
          mentionJids,
          contextInfo,
          antipromote,
          antidemote,
          promoteAlert,
          demoteAlert,
          getSudoUserIds,
        });
      }
    }
  } catch (err) {
    console.error('❌ Erreur group_participants_update :', err);
  }
}

module.exports = { group_participants_update };