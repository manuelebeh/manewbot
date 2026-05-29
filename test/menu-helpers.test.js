'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  formatUptime,
  groupCommandsByClass,
  buildStatusHeader,
} = require('../lib/menu-helpers');

describe('menu-helpers', () => {
  it('formatUptime builds human-readable parts', () => {
    assert.equal(formatUptime(90), '1M 30S');
    assert.equal(formatUptime(0), '0S');
    assert.match(formatUptime(90061), /1J/);
  });

  it('groupCommandsByClass sorts categories and commands', () => {
    const list = [
      { nom_cmd: 'b', classe: 'Zebra' },
      { nom_cmd: 'a', classe: 'Alpha' },
      { nom_cmd: '2', classe: 'Alpha' },
    ];
    const { keys, options } = groupCommandsByClass(list);
    assert.deepEqual(keys, ['Alpha', 'Zebra']);
    assert.deepEqual(
      options.Alpha.map((e) => e.nom_cmd),
      ['2', 'a']
    );
  });

  it('buildStatusHeader includes bot metadata', () => {
    const header = buildStatusHeader(
      { NOM_BOT: 'Bot', PREFIXE: '.', NOM_OWNER: 'Owner' },
      { version: '9.9.9' },
      42
    );
    assert.match(header, /Bot/);
    assert.match(header, /42/);
    assert.match(header, /9\.9\.9/);
  });
});
