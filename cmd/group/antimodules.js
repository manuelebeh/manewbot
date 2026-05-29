'use strict';

const { Antilink } = require('../../database/antilink');
const { Antitag } = require('../../database/antitag');
const { Antispam } = require('../../database/antispam');
const { Antibot } = require('../../database/antibot');
const { Antimention } = require('../../database/antimention');
const { registerAntimoduleConfig } = require('../../lib/antimodule-config');

[
  { nom_cmd: 'antilink', label: "L'Antilink", Model: Antilink },
  { nom_cmd: 'antitag', label: "L'Antitag", Model: Antitag },
  { nom_cmd: 'antispam', label: "L'Antispam", Model: Antispam },
  { nom_cmd: 'antibot', label: "L'Antibot", Model: Antibot },
  {
    nom_cmd: 'antimentiongc',
    label: "L'antimention",
    react: '📢',
    Model: Antimention,
  },
].forEach((spec) => registerAntimoduleConfig(spec));
