'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  getAdminJids,
  getKickallAllowed,
  canRunKickall,
  filterKickableMembers,
  moderationDeniedText,
} = require('../lib/group-moderation');

const participants = [
  { jid: '33611111111@s.whatsapp.net', admin: 'superadmin' },
  { jid: '33622222222@s.whatsapp.net', admin: true },
  { jid: '33633333333@s.whatsapp.net', admin: null },
  { jid: '33644444444@s.whatsapp.net', admin: null },
];

const ownerJid = '33600000000@s.whatsapp.net';
const sudoJids = ['33699999999@s.whatsapp.net'];

describe('group-moderation', () => {
  it('getAdminJids returns admin member jids', () => {
    assert.deepEqual(getAdminJids(participants), [
      '33611111111@s.whatsapp.net',
      '33622222222@s.whatsapp.net',
    ]);
  });

  it('getKickallAllowed includes superadmin, bot and owner', () => {
    const allowed = getKickallAllowed(participants, '33655555555@s.whatsapp.net', ownerJid);
    assert.ok(allowed.includes('33611111111@s.whatsapp.net'));
    assert.ok(allowed.includes('33655555555@s.whatsapp.net'));
    assert.ok(allowed.includes(ownerJid));
  });

  it('canRunKickall allows owner even when not in allowed list', () => {
    assert.equal(canRunKickall('33633333333@s.whatsapp.net', ['33611111111@s.whatsapp.net'], true), true);
    assert.equal(canRunKickall('33633333333@s.whatsapp.net', ['33611111111@s.whatsapp.net'], false), false);
  });

  it('filterKickableMembers excludes admins, owner and sudo', () => {
    const withPrivileged = [
      ...participants,
      { jid: ownerJid, admin: null },
      { jid: sudoJids[0], admin: null },
    ];
    const kickable = filterKickableMembers(withPrivileged, false, ownerJid, sudoJids);
    assert.deepEqual(kickable, ['33633333333@s.whatsapp.net', '33644444444@s.whatsapp.net']);
  });

  it('filterKickableMembers supports country prefix filter', () => {
    const kickable = filterKickableMembers(participants, true, ownerJid, sudoJids, '336333');
    assert.deepEqual(kickable, ['33633333333@s.whatsapp.net']);
  });

  it('moderationDeniedText describes owner vs sudo protection', () => {
    assert.match(
      moderationDeniedText(false, ownerJid, ownerJid, "d'exclure"),
      /propriétaire/
    );
    assert.match(
      moderationDeniedText(false, sudoJids[0], ownerJid, "d'avertir"),
      /sudo/
    );
  });
});
