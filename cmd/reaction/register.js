'use strict';

const { reactions, addReactionCommand } = require('./_shared');

for (const [nom_cmd, url] of Object.entries(reactions)) {
  addReactionCommand(nom_cmd, url);
}
