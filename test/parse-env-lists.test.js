'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  parseCommaList,
  entriesToJids,
  getOwnerJid,
  getSudoOnlyJids,
  getPrivilegedJids,
  canModerateTarget,
  isRestrictedGroup,
  canUseRestrictedGroup,
  shouldRunHandlersInRestrictedGroup,
} = require('../lib/parse-env-lists');

describe('parse-env-lists', () => {
  it('parseCommaList trims and drops empty entries', () => {
    assert.deepEqual(parseCommaList(' a , ,b , c '), ['a', 'b', 'c']);
    assert.deepEqual(parseCommaList(''), []);
    assert.deepEqual(parseCommaList(null), []);
  });

  it('entriesToJids converts numbers to WhatsApp JIDs', () => {
    assert.deepEqual(entriesToJids('33612345678, 33700000000'), [
      '33612345678@s.whatsapp.net',
      '33700000000@s.whatsapp.net',
    ]);
    assert.deepEqual(entriesToJids('120363012345678901@g.us'), [
      '120363012345678901@g.us',
    ]);
  });

  it('getOwnerJid returns empty when owner unset', () => {
    assert.equal(getOwnerJid({ NUMERO_OWNER: '' }), '');
    assert.equal(
      getOwnerJid({ NUMERO_OWNER: '33612345678' }),
      '33612345678@s.whatsapp.net'
    );
  });

  it('getSudoOnlyJids maps sudo rows', () => {
    assert.deepEqual(getSudoOnlyJids(['33611111111', '33622222222']), [
      '33611111111@s.whatsapp.net',
      '33622222222@s.whatsapp.net',
    ]);
  });

  it('getPrivilegedJids includes owner, bot and sudo', () => {
    const jids = getPrivilegedJids(
      { NUMERO_OWNER: '33600000000' },
      '33699999999@s.whatsapp.net',
      ['33611111111']
    );
    assert.ok(jids.includes('33600000000@s.whatsapp.net'));
    assert.ok(jids.includes('33699999999@s.whatsapp.net'));
    assert.ok(jids.includes('33611111111@s.whatsapp.net'));
  });

  it('canModerateTarget protects owner and sudo', () => {
    const owner = '33600000000@s.whatsapp.net';
    const sudo = '33611111111@s.whatsapp.net';
    assert.equal(canModerateTarget(false, owner, owner, [sudo]), false);
    assert.equal(canModerateTarget(true, owner, owner, [sudo]), false);
    assert.equal(canModerateTarget(false, sudo, owner, [sudo]), false);
    assert.equal(canModerateTarget(true, sudo, owner, [sudo]), true);
    assert.equal(canModerateTarget(false, '33622222222@s.whatsapp.net', owner, [sudo]), true);
  });

  it('restricted group helpers honor allowlist', () => {
    const config = {
      RESTRICTED_GROUPS: '120363012345678901@g.us',
      RESTRICTED_GROUP_ALLOWLIST: '33612345678',
    };
    const group = '120363012345678901@g.us';
    const allowed = '33612345678@s.whatsapp.net';
    const blocked = '33699999999@s.whatsapp.net';

    assert.equal(isRestrictedGroup(group, config), true);
    assert.equal(canUseRestrictedGroup(allowed, false, config), true);
    assert.equal(canUseRestrictedGroup(blocked, false, config), false);
    assert.equal(canUseRestrictedGroup(blocked, true, config), true);
    assert.equal(
      shouldRunHandlersInRestrictedGroup(group, blocked, false, config),
      false
    );
    assert.equal(
      shouldRunHandlersInRestrictedGroup(group, allowed, false, config),
      true
    );
  });
});
