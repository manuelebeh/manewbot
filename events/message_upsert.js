const {
  rankAndLevelUp,
  lecture_status,
  like_status,
  presence,
  dl_status,
  antidelete,
  antitag,
  antilink,
  antibot,
  autoread_msg,
  mention,
  antimention,
  chatbot,
  antispam,
  autoreact_msg,
} = require('./message_upsert_events');
const { OnlyAdmins } = require('../database/ban');
const { getMessage, addMessage } = require('../lib/store');
const evt = require('../lib/commands');
const config = require('../set');
const { shouldRunHandlersInRestrictedGroup } = require('../lib/parse-env-lists');
const { resolveCommandReactEnabled } = require('../lib/env-toggle');
const { runCommand: executeCommand } = require('../lib/run-command');
const { get_stick_cmd } = require('../database/stick_cmd');
const { list_cmd } = require('../database/public_private_cmd');
const { isBanned } = require('../lib/message-upsert/helpers');
const { buildMessageUpsertContext } = require('../lib/message-upsert/build-context');

async function message_upsert(upsert, sock) {
  try {
    if (upsert.type !== 'notify') return;
    const msg = upsert.messages?.[0];
    if (!msg?.message) return;

    addMessage(msg.key.id, msg);

    const ctx = await buildMessageUpsertContext(msg, sock);
    const {
      contentType,
      chatJid,
      botJid,
      isGroup,
      isOwner,
      isStaff,
      isAdmin,
      senderJid,
      repondre,
      resolvedMentions,
      commandName,
      isCommand,
      owerlap,
    } = ctx;

    const runCommand = (cmd, skipReact = false) =>
      executeCommand({
        cmd,
        skipReact,
        config,
        chatJid,
        senderJid,
        isGroup,
        isOwner,
        isStaff,
        isAdmin,
        sock,
        msg,
        owerlap,
        listCmd: list_cmd,
        isBanned,
        onlyAdminsFindOne: (groupJid) =>
          OnlyAdmins.findOne({ where: { id: groupJid } }),
        resolveCommandReactEnabled,
      });

    if (isCommand) {
      const matchedCmd = evt.cmd.find(
        (entry) =>
          entry.nom_cmd === commandName || entry.alias?.includes(commandName)
      );
      if (matchedCmd) await runCommand(matchedCmd);
    }

    if (msg?.message?.stickerMessage) {
      try {
        const stickCmds = await get_stick_cmd();
        const stickMatch = stickCmds.find(
          (entry) =>
            entry.stick_hash ===
            msg.message.stickerMessage.fileSha256?.toString('base64')
        );
        if (stickMatch) {
          const stickCmd = evt.cmd.find(
            (entry) =>
              entry.nom_cmd === stickMatch.no_cmd ||
              entry.alias?.includes(stickMatch.no_cmd)
          );
          if (stickCmd) await runCommand(stickCmd, true);
        }
      } catch (err) {
        console.error('Erreur sticker command:', err);
      }
    }

    if (!shouldRunHandlersInRestrictedGroup(chatJid, senderJid, isStaff, config)) {
      return;
    }

    rankAndLevelUp(sock, chatJid, ctx.messageText, senderJid, msg.pushName, config, msg);
    presence(sock, chatJid);
    lecture_status(sock, msg, chatJid);
    like_status(sock, msg, chatJid, botJid, senderJid);
    dl_status(sock, chatJid, msg, botJid);
    chatbot(
      chatJid,
      isGroup,
      ctx.messageText,
      repondre,
      resolvedMentions,
      botJid,
      owerlap.auteur_Msg_Repondu,
      senderJid
    );
    antidelete(sock, msg, senderJid, contentType, getMessage, chatJid, botJid);
    antimention(sock, chatJid, msg, isGroup, isAdmin, ctx.owerlap.verif_Bot_Admin, senderJid);
    antitag(sock, msg, chatJid, contentType, isGroup, ctx.owerlap.verif_Bot_Admin, isAdmin, senderJid);
    mention(sock, chatJid, msg, contentType, isGroup, botJid, repondre, resolvedMentions);
    antilink(sock, chatJid, msg, ctx.messageText, isGroup, isAdmin, ctx.owerlap.verif_Bot_Admin, senderJid);
    antibot(sock, chatJid, msg, isGroup, isAdmin, ctx.owerlap.verif_Bot_Admin, senderJid);
    antispam(sock, chatJid, msg, senderJid, isGroup, isAdmin, ctx.owerlap.verif_Bot_Admin);
    autoread_msg(sock, msg.key);
    autoreact_msg(sock, msg, chatJid);
  } catch (err) {
    console.error('❌ Erreur(message.upsert):', err);
  }
}

module.exports = { message_upsert };