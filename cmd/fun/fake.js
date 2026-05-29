'use strict';

const { registerCommand } = require('./register');

registerCommand({
  nom_cmd: "fake",
  classe: "Fun",
  react: "📝",
  desc: "Envoie un message fake comme si un autre utilisateur l'avait envoyé"
}, async (chatJid, sock, {
  ms,
  arg,
  getJid
}) => {
  if (!arg[0] || !arg.join(" ").includes("/")) {
    return sock.sendMessage(chatJid, {
      text: "❌ Usage: fake @user fake_message / bot_message"
    }, {
      quoted: ms
    });
  }
  const fakeUserJid = arg[0].replace("@", "") + "@lid";
  const resolvedFakeUser = await getJid(fakeUserJid, chatJid, sock);
  const messageParts = arg.slice(1).join(" ");
  const [fakeMessage, botMessage] = messageParts.split("/").map(part => part.trim());
  const fakeQuotedMsg = {
    key: {
      fromMe: false,
      participant: resolvedFakeUser,
      remoteJid: resolvedFakeUser
    },
    message: {
      extendedTextMessage: {
        text: fakeMessage,
        contextInfo: {
          mentionedJid: []
        }
      }
    }
  };
  await sock.sendMessage(chatJid, {
    text: botMessage
  }, {
    quoted: fakeQuotedMsg
  });
});
