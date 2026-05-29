'use strict';

const { registerCommand } = require('../register');
const { axios, config, translate, Sticker, StickerTypes } = require('../deps');
registerCommand({
  nom_cmd: "lyrics",
  classe: "Search",
  react: "🎵",
  desc: "Cherche les paroles d'une chanson"
}, async (jid, bot, {
  arg,
  ms,
  repondre
}) => {
  const query = arg.join(" ");
  if (!query) {
    return repondre("❌ Veuillez fournir un nom de chanson.");
  }
  try {
    const lyricsBase = (config.LYRICS_API_BASE || '').replace(/\/+$/, '');
    if (!lyricsBase) {
      return repondre('❗ Paroles non configurées (LYRICS_API_BASE).');
    }
    const apiUrl = lyricsBase + "/search/lyrics?query=" + encodeURIComponent(query);
    const {
      data
    } = await axios.get(apiUrl);
    if (!data.status || !data.data?.lyrics) {
      return repondre("❌ Paroles introuvables pour cette chanson.");
    }
    const {
      title,
      artists,
      album,
      duration,
      lyrics
    } = data.data;
    const message = "╭──〔 *🎵 Manewbot-LYRICS* 〕──⬣\n⬡ 🎧 *Titre* : " + title + "\n⬡ 👤 *Artiste* : " + artists + "\n⬡ 💿 *Album* : " + (album || "N/A") + "\n⬡ ⏱️ *Durée* : " + (duration || "N/A") + "\n╰───────────────────⬣\n\n🎼 *Paroles :*\n\n" + lyrics;
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur API Lyrics :", err.message);
    repondre("❌ Une erreur s'est produite lors de la récupération des paroles.");
  }
});
