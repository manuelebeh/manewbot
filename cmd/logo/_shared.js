'use strict';

const { registerCommand } = require('../../lib/commands');
const textmaker = require('../../lib/textmaker');

function addTextproCommand(commandName, url, textType) {
  registerCommand({
    nom_cmd: commandName,
    classe: "Logo",
    react: "✨",
    desc: "Effet de texte avec Ephoto360"
  }, async (jid, bot, ctx) => {
    const {
      arg,
      ms
    } = ctx;
    const text = arg.join(" ");
    if (!text) {
      return await bot.sendMessage(jid, {
        text: "Vous devez fournir un texte."
      }, {
        quoted: ms
      });
    }
    try {
      let result;
      switch (textType) {
        case 1:
          if (text.includes(";")) {
            return await bot.sendMessage(jid, {
              text: "Veuillez fournir du texte sans point-virgule (;) pour cette commande."
            }, {
              quoted: ms
            });
          }
          result = await textmaker(url, text);
          break;
        case 2:
          const parts = text.split(";");
          if (parts.length < 2) {
            return await bot.sendMessage(jid, {
              text: "Veuillez fournir exactement deux textes séparés par un point-virgule (;), par exemple : Manew;Bot."
            }, {
              quoted: ms
            });
          }
          result = await textmaker(url, text);
          break;
        default:
          throw new Error("Type " + textType + " non supporté.");
      }
      await bot.sendMessage(jid, {
        image: {
          url: result.url
        },
        caption: "```Powered by Manewbot```"
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur avec la commande " + commandName + ":", err.message || err);
      await bot.sendMessage(jid, {
        text: "Une erreur est survenue lors de la génération du logo : " + err.message
      }, {
        quoted: ms
      });
    }
  });
}

module.exports = { registerCommand, textmaker, addTextproCommand };
