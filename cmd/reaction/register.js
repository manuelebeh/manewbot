'use strict';

const { reactionActions, addReactionCommand } = require('./_shared');

for (const [nom_cmd, action] of Object.entries(reactionActions)) {
  addReactionCommand(nom_cmd, action);
}
