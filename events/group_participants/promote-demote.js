'use strict';

const config = require('../../set');
const { getJid } = require('../message_upsert_events');
const { getSudoOnlyJids } = require('../../lib/parse-env-lists');
const { decodeJid } = require('../../lib/jid');

const parseID = decodeJid;

async function handlePromoteDemote({
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
}) {
  const authorJidResolved = await getJid(
    participantUpdate.author,
    participantUpdate.id,
    sock
  );
  const ownerJid = await getJid(groupMeta.owner, participantUpdate.id, sock);
  const botJid = await getJid(parseID(sock.user.id), participantUpdate.id, sock);
  const targetJid = await getJid(memberJid, participantUpdate.id, sock);
  const ownerConfigJid = config.NUMERO_OWNER
    ? await getJid(
        config.NUMERO_OWNER + '@s.whatsapp.net',
        participantUpdate.id,
        sock
      )
    : null;
  const sudoOnlyJids = (
    await Promise.all(
      getSudoOnlyJids(await getSudoUserIds()).map((jid) =>
        getJid(jid, participantUpdate.id, sock)
      )
    )
  ).filter(Boolean);
  const isPrivilegedAuthor = [
    ownerJid,
    botJid,
    ownerConfigJid,
    targetJid,
    ...sudoOnlyJids,
  ].includes(authorJidResolved);

  if (participantUpdate.action === 'promote') {
    if (antipromote === 'oui' && isPrivilegedAuthor) return;
    if (antipromote === 'oui') {
      await sock.groupParticipantsUpdate(participantUpdate.id, [memberJid], 'demote');
      await sock.sendMessage(participantUpdate.id, {
        text:
          '🚫 *Promotion refusée !*\n' +
          authorMention +
          ' n’a pas le droit de promouvoir ' +
          memberMention +
          '.',
        mentions: mentionJids,
        contextInfo,
      });
    } else if (promoteAlert === 'oui') {
      let profilePicUrl = config.WELCOME_IMAGE_URL;
      try {
        profilePicUrl = await sock.profilePictureUrl(memberJid, 'image');
      } catch {}
      await sock.sendMessage(participantUpdate.id, {
        image: { url: profilePicUrl },
        caption: '🆙 ' + memberMention + ' a été promu par ' + authorMention + '.',
        mentions: mentionJids,
        contextInfo,
      });
    }
    return;
  }

  if (participantUpdate.action === 'demote') {
    if (antidemote === 'oui' && isPrivilegedAuthor) return;
    if (antidemote === 'oui') {
      await sock.groupParticipantsUpdate(participantUpdate.id, [memberJid], 'promote');
      await sock.sendMessage(participantUpdate.id, {
        text:
          '🚫 *Rétrogradation refusée !*\n' +
          authorMention +
          ' ne peut pas rétrograder ' +
          memberMention +
          '.',
        mentions: mentionJids,
        contextInfo,
      });
    } else if (demoteAlert === 'oui') {
      let profilePicUrl = config.WELCOME_IMAGE_URL;
      try {
        profilePicUrl = await sock.profilePictureUrl(memberJid, 'image');
      } catch {}
      await sock.sendMessage(participantUpdate.id, {
        image: { url: profilePicUrl },
        caption: '⬇️ ' + memberMention + ' a été rétrogradé par ' + authorMention + '.',
        mentions: mentionJids,
        contextInfo,
      });
    }
  }
}

module.exports = { handlePromoteDemote };
