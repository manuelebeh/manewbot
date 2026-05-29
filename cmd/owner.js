'use strict';

const { set_cmd, del_cmd, list_cmd } = require('../database/public_private_cmd');
const { registerCmdAclCommands } = require('../lib/cmd-acl-registry');

registerCmdAclCommands({ set_cmd, del_cmd, list_cmd });

require('./owner/messages');
require('./owner/tools');
require('./owner/system');
require('./owner/chatbot');
require('./owner/ban');
require('./owner/sudo');
require('./owner/wa-conf');
require('./owner/mention');
require('./owner/stick-cmd');
require('./owner/sessions');
require('./owner/plugins');
