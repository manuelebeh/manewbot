'use strict';

const { registerCommand } = require('../../../lib/commands');
const { GroupSettings } = require('../../../database/events');
const { setWarn, delWarn, getLimit, setLimit } = require('../../../database/warn');
const { canModerateTarget } = require('../../../lib/parse-env-lists');
const {
  groupReply,
  resolveModerationTarget,
  getAdminJids,
  filterKickableMembers,
  moderationDeniedText,
  requireGroup,
  requireGroupAdmin,
  requireBotAdmin,
  prepareKickall,
  canRunKickall,
} = require('../../../lib/group-moderation');

module.exports = {
  registerCommand,
  GroupSettings,
  setWarn,
  delWarn,
  getLimit,
  setLimit,
  canModerateTarget,
  groupReply,
  resolveModerationTarget,
  getAdminJids,
  filterKickableMembers,
  moderationDeniedText,
  requireGroup,
  requireGroupAdmin,
  requireBotAdmin,
  prepareKickall,
  canRunKickall,
};
