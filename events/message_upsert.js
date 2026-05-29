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
  getJid,
  mention,
  antimention,
  chatbot,
  antispam,
  autoreact_msg
} = require("./message_upsert_events");
const {
  Bans,
  OnlyAdmins
} = require("../database/ban");
const {
  Sudo
} = require("../database/sudo");
const {
  getMessage,
  addMessage
} = require("../lib/store");
const {
  jidDecode,
  getContentType
} = require("@whiskeysockets/baileys");
const evt = require("../lib/commands");
const config = require("../set");
const {
  get_stick_cmd
} = require("../database/stick_cmd");
const {
  list_cmd
} = require("../database/public_private_cmd");
const decodeJid = _0xa7ecb4 => {
  if (!_0xa7ecb4) {
    return _0xa7ecb4;
  }
  if (/:\d+@/gi.test(_0xa7ecb4)) {
    const _0x2c9f27 = jidDecode(_0xa7ecb4) || {};
    return _0x2c9f27.user && _0x2c9f27.server && _0x2c9f27.user + "@" + _0x2c9f27.server || _0xa7ecb4;
  }
  return _0xa7ecb4;
};
async function getSudoUsers() {
  try {
    const _0x588ddc = await Sudo.findAll({
      attributes: ["id"]
    });
    return _0x588ddc.map(_0x5afeb5 => _0x5afeb5.id.replace(/@s\.whatsapp\.net$/, ""));
  } catch {
    return [];
  }
}
async function isBanned(_0x2dc9ed, _0x2d706a) {
  const _0x89c448 = await Bans.findOne({
    where: {
      id: _0x2d706a,
      type: _0x2dc9ed
    }
  });
  return !!_0x89c448;
}
async function message_upsert(_0x25bbcb, _0x4802aa) {
  try {
    if (_0x25bbcb.type !== "notify") {
      return;
    }
    const _0x315eed = _0x25bbcb.messages?.[0];
    if (!_0x315eed?.message) {
      return;
    }
    addMessage(_0x315eed.key.id, _0x315eed);
    let _0x199a38 = getContentType(_0x315eed.message);
    let _0xviewOnce = false;
    if (_0x199a38?.startsWith("viewOnce")) {
      _0xviewOnce = true;
      const _0xvoInner = _0x315eed.message[_0x199a38]?.message;
      if (_0xvoInner) {
        _0x199a38 = getContentType(_0xvoInner);
        _0x315eed.message = { ..._0x315eed.message, ..._0xvoInner };
      }
    } else if (
      _0x315eed.message.imageMessage?.viewOnce === true ||
      _0x315eed.message.videoMessage?.viewOnce === true ||
      _0x315eed.message.audioMessage?.viewOnce === true
    ) {
      _0xviewOnce = true;
    }
    const _0x26c11c = {
      conversation: _0x315eed.message.conversation,
      imageMessage: _0x315eed.message.imageMessage?.caption,
      videoMessage: _0x315eed.message.videoMessage?.caption,
      extendedTextMessage: _0x315eed.message.extendedTextMessage?.text,
      buttonsResponseMessage: _0x315eed.message.buttonsResponseMessage?.selectedButtonId,
      listResponseMessage: _0x315eed.message.listResponseMessage?.singleSelectReply?.selectedRowId,
      messageContextInfo: _0x315eed.message.buttonsResponseMessage?.selectedButtonId || _0x315eed.message.listResponseMessage?.singleSelectReply?.selectedRowId || _0x315eed.text
    }[_0x199a38] || "";
    const _0x30b220 = decodeJid(_0x4802aa.user.id);
    const _0x485d4c = _0x30b220.split("@")[0];
    const _0x1c4748 = (_0x315eed.key.remoteJidAlt || _0x315eed.key.remoteJid) === decodeJid(_0x4802aa.user.lid) ? _0x30b220 : _0x315eed.key.remoteJidAlt || _0x315eed.key.remoteJid;
    const _0x230272 = _0x1c4748.endsWith("@g.us");
    const _0x4efd1a = _0x230272 ? await _0x4802aa.groupMetadata(_0x1c4748) : {};
    _0x4efd1a.participants &&= _0x4efd1a.participants.map(_0x478ae9 => ({
      ..._0x478ae9,
      jid: _0x478ae9.phoneNumber
    }));
    const _0x588a7a = _0x4efd1a.subject || "";
    const _0x3fa1bc = _0x230272 ? _0x4efd1a.participants : [];
    const _0x2d0bbe = _0x3fa1bc.filter(_0x1aca8f => _0x1aca8f.admin).map(_0x1164a9 => _0x1164a9.jid);
    const _0xfa3539 = _0x230272 && _0x2d0bbe.includes(_0x30b220);
    const _0x5cab86 = _0x230272 ? await getJid(decodeJid(_0x315eed.key.participantAlt || _0x315eed.key.participant), _0x1c4748, _0x4802aa) : _0x315eed.key.fromMe ? _0x30b220 : decodeJid(_0x315eed.key.remoteJidAlt || _0x315eed.key.participantAlt || _0x315eed.key.participant || _0x315eed.key.senderPn || _0x315eed.key.remoteJid);
    const _0x2c7ab4 = _0x315eed.message?.[_0x199a38]?.contextInfo?.quotedMessage;
    const _0x3b2ce9 = _0x315eed.message?.[_0x199a38]?.contextInfo;
    const _0x58101a = _0x315eed.message?.[_0x199a38]?.contextInfo?.participant;
    const _0x15ee30 = _0x58101a == decodeJid(_0x4802aa.user.lid) ? _0x30b220 : await getJid(decodeJid(_0x58101a), _0x1c4748, _0x4802aa);
    const _0x5e976a = _0x315eed.message?.[_0x199a38]?.contextInfo?.mentionedJid || [];
    const _0x54a52a = await Promise.all(_0x5e976a.map(_0x44168d => getJid(_0x44168d, _0x1c4748, _0x4802aa)));
    const _0x5155c7 = _0x315eed.pushName;
    const _0x29516c = _0x26c11c.trimStart().startsWith(config.PREFIXE);
    const _0x57b98e = _0x29516c ? _0x26c11c.trimStart().slice(config.PREFIXE.length).trimStart().split(/ +/).slice(1) : [];
    const _0x18c1ab = _0x29516c ? _0x26c11c.slice(config.PREFIXE.length).trim().split(/ +/)[0].toLowerCase() : "";
    const _0x1eb819 = "22651463203";
    const _0x439c26 = "22605463559";
    const _0x2e6062 = "221772430620";
    const _0xa5ceb8 = [_0x1eb819, _0x439c26];
    const _0x5a8cfc = await getSudoUsers();
    const _0x52c5b5 = [_0x1eb819, _0x439c26, _0x485d4c, config.NUMERO_OWNER, ..._0x5a8cfc].map(_0x3b259a => _0x3b259a + "@s.whatsapp.net");
    const _0x3c366f = _0x52c5b5.includes(_0x5cab86);
    const _0x418519 = _0xa5ceb8.map(_0x1af68a => _0x1af68a + "@s.whatsapp.net");
    const _0x5726a6 = _0x418519.includes(_0x5cab86);
    const _0x4ba444 = _0x230272 && (_0x2d0bbe.includes(_0x5cab86) || _0x3c366f);
    const _0x3c1626 = (_0x275b9a, _0x2277b9) => {
      const _0xbe16e = _0x2277b9 || _0x1c4748;
      return _0x4802aa.sendMessage(_0xbe16e, {
        text: _0x275b9a
      }, {
        quoted: _0x315eed
      });
    };
    const _0x142a8b = _0x230272 ? "👥 " + _0x588a7a : "💬 Privé";
    console.log("\n━━━━━━━[ BOT-LOG ]━━━━━━\n" + ("👤 Auteur  : " + _0x5155c7 + " (" + _0x5cab86 + ")\n") + ("🏷️ Source  : " + _0x142a8b + "\n") + ("📩 Type    : " + _0x199a38 + (_0xviewOnce ? " 👁️ (vue unique)" : "") + "\n") + (_0xviewOnce ? "👁️ Info    : Vue unique reçue\n" : "") + (_0x26c11c && _0x26c11c.trim() !== "" ? "📝 Texte   : " + _0x26c11c + "\n" : "") + "━━━━━━━━━━━━━━━━━━━━━━━\n");
    const _0x4bce85 = {
      verif_Groupe: _0x230272,
      mbre_membre: _0x3fa1bc,
      membre_Groupe: _0x5cab86,
      verif_Admin: _0x4ba444,
      infos_Groupe: _0x4efd1a,
      nom_Groupe: _0x588a7a,
      auteur_Message: _0x5cab86,
      nom_Auteur_Message: _0x5155c7,
      mtype: _0x199a38,
      id_Bot: _0x30b220,
      prenium_id: _0x3c366f,
      dev_id: _0x5726a6,
      dev_num: _0x418519,
      id_Bot_N: _0x485d4c,
      verif_Bot_Admin: _0xfa3539,
      prefixe: config.PREFIXE,
      arg: _0x57b98e,
      repondre: _0x3c1626,
      groupe_Admin: () => _0x2d0bbe,
      msg_Repondu: _0x2c7ab4,
      auteur_Msg_Repondu: _0x15ee30,
      ms: _0x315eed,
      ms_org: _0x1c4748,
      texte: _0x26c11c,
      getJid: getJid,
      quote: _0x3b2ce9
    };
    const _0x5b9e26 = async (_0x22bc0c, _0x4f87d9 = false) => {
      const _0x54956a = await list_cmd("private");
      const _0x41aedd = await list_cmd("public");
      const _0x4d173c = _0x54956a.some(_0x3432c2 => _0x3432c2.nom_cmd === _0x22bc0c.nom_cmd || _0x22bc0c.alias?.includes(_0x3432c2.nom_cmd));
      const _0x203348 = _0x41aedd.some(_0x1a5583 => _0x1a5583.nom_cmd === _0x22bc0c.nom_cmd || _0x22bc0c.alias?.includes(_0x1a5583.nom_cmd));
      if (!_0x1c4748.endsWith("@newsletter")) {
        if (config.MODE !== "public" && !_0x3c366f && !_0x203348) {
          return;
        }
        if (config.MODE === "public" && !_0x3c366f && _0x4d173c) {
          return;
        }
        const _0xd5a8b3 = ["120363314687943170@g.us", "120363404635307998@g.us"];
        if (_0xd5a8b3.includes(_0x1c4748) && _0x5cab86 !== "221772430620@s.whatsapp.net" && _0x5cab86 !== _0x5726a6) {
          return;
        }
        if (!_0x3c366f && (await isBanned("user", _0x5cab86))) {
          return;
        }
        if (!_0x3c366f && _0x230272 && (await isBanned("group", _0x1c4748))) {
          return;
        }
        if (!_0x4ba444 && _0x230272 && (await OnlyAdmins.findOne({
          where: {
            id: _0x1c4748
          }
        }))) {
          return;
        }
      }
      if (!_0x4f87d9) {
        await _0x4802aa.sendMessage(_0x1c4748, {
          react: {
            text: _0x22bc0c.react || "🪄",
            key: _0x315eed.key
          }
        });
      }
      await _0x22bc0c.fonction(_0x1c4748, _0x4802aa, _0x4bce85);
    };
    if (_0x29516c) {
      const _0x295786 = evt.cmd.find(_0x408db9 => _0x408db9.nom_cmd === _0x18c1ab || _0x408db9.alias?.includes(_0x18c1ab));
      if (_0x295786) {
        await _0x5b9e26(_0x295786);
      }
    }
    if (_0x315eed?.message?.stickerMessage) {
      try {
        const _0x16d128 = await get_stick_cmd();
        const _0xe35745 = _0x16d128.find(_0x24beb8 => _0x24beb8.stick_hash === _0x315eed.message.stickerMessage.fileSha256?.toString("base64"));
        if (_0xe35745) {
          const _0x2dc4eb = evt.cmd.find(_0x169bac => _0x169bac.nom_cmd === _0xe35745.no_cmd || _0x169bac.alias?.includes(_0xe35745.no_cmd));
          if (_0x2dc4eb) {
            await _0x5b9e26(_0x2dc4eb, true);
          }
        }
      } catch (_0x486a2b) {
        console.error("Erreur sticker command:", _0x486a2b);
      }
    }
    const _0x2ace29 = ["120363314687943170@g.us", "120363404635307998@g.us"];
    if (!_0x5726a6 && _0x5cab86 !== "221772430620@s.whatsapp.net" && !_0x418519.includes(_0x30b220) && _0x2ace29.includes(_0x1c4748)) {
      return;
    }
    rankAndLevelUp(_0x4802aa, _0x1c4748, _0x26c11c, _0x5cab86, _0x5155c7, config, _0x315eed);
    presence(_0x4802aa, _0x1c4748);
    lecture_status(_0x4802aa, _0x315eed, _0x1c4748);
    like_status(_0x4802aa, _0x315eed, _0x1c4748, _0x30b220, _0x5cab86);
    dl_status(_0x4802aa, _0x1c4748, _0x315eed, _0x30b220);
    chatbot(_0x1c4748, _0x230272, _0x26c11c, _0x3c1626, _0x54a52a, _0x30b220, _0x15ee30, _0x5cab86);
    antidelete(_0x4802aa, _0x315eed, _0x5cab86, _0x199a38, getMessage, _0x1c4748, _0x30b220);
    antimention(_0x4802aa, _0x1c4748, _0x315eed, _0x230272, _0x4ba444, _0xfa3539, _0x5cab86);
    antitag(_0x4802aa, _0x315eed, _0x1c4748, _0x199a38, _0x230272, _0xfa3539, _0x4ba444, _0x5cab86);
    mention(_0x4802aa, _0x1c4748, _0x315eed, _0x199a38, _0x230272, _0x30b220, _0x3c1626, _0x54a52a);
    antilink(_0x4802aa, _0x1c4748, _0x315eed, _0x26c11c, _0x230272, _0x4ba444, _0xfa3539, _0x5cab86);
    antibot(_0x4802aa, _0x1c4748, _0x315eed, _0x230272, _0x4ba444, _0xfa3539, _0x5cab86);
    antispam(_0x4802aa, _0x1c4748, _0x315eed, _0x5cab86, _0x230272, _0x4ba444, _0xfa3539);
    autoread_msg(_0x4802aa, _0x315eed.key);
    autoreact_msg(_0x4802aa, _0x315eed, _0x1c4748);
    for (const _0x5d9544 of evt.func) {
      try {
        await _0x5d9544.fonction(_0x1c4748, _0x4802aa, _0x4bce85);
      } catch (_0x30b3b9) {
        console.error("Erreur dans la fonction isfunc '" + _0x5d9544.nom_cmd + "':", _0x30b3b9);
      }
    }
  } catch (_0x5ae0a1) {
    console.error("❌ Erreur(message.upsert):", _0x5ae0a1);
  }
}
module.exports = message_upsert;