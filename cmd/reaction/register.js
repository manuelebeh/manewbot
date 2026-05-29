'use strict';

const { reactionActions, addReactionCommand } = require('./deps');

for (const [nom_cmd, action] of Object.entries(reactionActions)) {
  addReactionCommand(nom_cmd, action);
}
