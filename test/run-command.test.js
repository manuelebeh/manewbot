'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  commandMatchesList,
  shouldAllowCommand,
  runCommand,
} = require('../lib/run-command');

const baseCmd = { nom_cmd: 'ping', alias: ['pong'], react: '⚡' };
const groupJid = '120363012345678901@g.us';
const userJid = '33612345678@s.whatsapp.net';
const baseConfig = {
  MODE: 'private',
  RESTRICTED_GROUPS: '',
  RESTRICTED_GROUP_ALLOWLIST: '',
};

function makeDeps(overrides = {}) {
  return {
    listCmd: async () => [],
    isBanned: async () => false,
    onlyAdminsFindOne: async () => null,
    ...overrides,
  };
}

describe('run-command ACL', () => {
  it('commandMatchesList matches name and alias', () => {
    assert.equal(commandMatchesList(baseCmd, [{ nom_cmd: 'ping' }]), true);
    assert.equal(commandMatchesList(baseCmd, [{ nom_cmd: 'pong' }]), true);
    assert.equal(commandMatchesList(baseCmd, [{ nom_cmd: 'other' }]), false);
  });

  it('allows newsletter chats without other checks', async () => {
    const allowed = await shouldAllowCommand({
      cmd: baseCmd,
      config: baseConfig,
      chatJid: '1234567890@newsletter',
      senderJid: userJid,
      isGroup: false,
      isStaff: false,
      isAdmin: false,
      ...makeDeps({
        isBanned: async () => true,
        onlyAdminsFindOne: async () => ({ id: groupJid }),
      }),
    });
    assert.equal(allowed, true);
  });

  it('blocks non-staff in private mode unless command is public', async () => {
    const blocked = await shouldAllowCommand({
      cmd: baseCmd,
      config: baseConfig,
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      ...makeDeps(),
    });
    assert.equal(blocked, false);

    const allowed = await shouldAllowCommand({
      cmd: baseCmd,
      config: baseConfig,
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      ...makeDeps({
        listCmd: async (type) => (type === 'public' ? [{ nom_cmd: 'ping' }] : []),
      }),
    });
    assert.equal(allowed, true);
  });

  it('blocks private-listed commands in public mode for non-staff', async () => {
    const allowed = await shouldAllowCommand({
      cmd: baseCmd,
      config: { ...baseConfig, MODE: 'public' },
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      ...makeDeps({
        listCmd: async (type) => (type === 'private' ? [{ nom_cmd: 'ping' }] : []),
      }),
    });
    assert.equal(allowed, false);
  });

  it('blocks banned users and only-admins groups', async () => {
    const banned = await shouldAllowCommand({
      cmd: baseCmd,
      config: { ...baseConfig, MODE: 'public' },
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      ...makeDeps({
        isBanned: async (type) => type === 'user',
      }),
    });
    assert.equal(banned, false);

    const onlyAdmins = await shouldAllowCommand({
      cmd: baseCmd,
      config: { ...baseConfig, MODE: 'public' },
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      ...makeDeps({
        onlyAdminsFindOne: async () => ({ id: groupJid }),
      }),
    });
    assert.equal(onlyAdmins, false);
  });

  it('runCommand invokes handler only when ACL passes', async () => {
    let called = false;
    const cmd = {
      ...baseCmd,
      fonction: async () => {
        called = true;
      },
    };

    await runCommand({
      cmd,
      config: baseConfig,
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: false,
      sock: { sendMessage: async () => {} },
      msg: { key: { id: '1' } },
      owerlap: {},
      resolveCommandReactEnabled: () => false,
      ...makeDeps(),
    });
    assert.equal(called, false);

    await runCommand({
      cmd,
      config: { ...baseConfig, MODE: 'public' },
      chatJid: groupJid,
      senderJid: userJid,
      isGroup: true,
      isStaff: false,
      isAdmin: true,
      sock: { sendMessage: async () => {} },
      msg: { key: { id: '1' } },
      owerlap: {},
      resolveCommandReactEnabled: () => false,
      ...makeDeps(),
    });
    assert.equal(called, true);
  });
});
