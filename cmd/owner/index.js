'use strict';

const { set_cmd, del_cmd, list_cmd } = require('../../database/public_private_cmd');
const { registerCmdAclCommands } = require('../../lib/cmd-acl-registry');

registerCmdAclCommands({ set_cmd, del_cmd, list_cmd });

require('./messages');
require('./tools');
require('./system');
require('./chatbot');
require('./ban');
require('./sudo');
require('./wa-conf');
require('./mention');
require('./stick-cmd');
require('./sessions');
