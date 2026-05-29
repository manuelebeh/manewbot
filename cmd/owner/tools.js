'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../../set');
const { registerCommand } = require('../../lib/commands');
const { requireOwner, ownerReply } = require('../../lib/require-owner');

const OWNER_DENIED = "❌ Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'tgs',
    classe: 'Owner',
    react: '🔍',
    desc: 'Importe des stickers Telegram sur WhatsApp',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg, ms } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, null, OWNER_DENIED))) return;

    if (!arg[0]) {
      return repondre('Merci de fournir un lien de stickers Telegram valide.');
    }

    const packName = arg[0].split('/addstickers/')[1];
    if (!packName) {
      return repondre('❌ Lien incorrect.');
    }

    const token = config.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return repondre(
        '❗ Telegram non configuré — définissez TELEGRAM_BOT_TOKEN dans .env (puis redémarrez le bot).'
      );
    }
    const apiBase = 'https://api.telegram.org/bot' + token;

    try {
      const { data: pack } = await axios.get(apiBase + '/getStickerSet?name=' + packName);
      const stickers = pack.result.stickers;
      if (!stickers || stickers.length === 0) {
        return repondre('Aucun sticker trouvé dans cet ensemble.');
      }

      repondre(
        '✅ Nom du pack: ' +
          pack.result.name +
          '\nType : ' +
          (pack.result.is_animated ? 'animés' : 'statiques') +
          '\nTotal : ' +
          stickers.length +
          ' stickers\n'
      );

      for (const stickerInfo of stickers) {
        const fileRes = await axios.get(apiBase + '/getFile?file_id=' + stickerInfo.file_id);
        const filePath = fileRes.data?.result?.file_path;
        if (!filePath) continue;
        const fileUrl =
          'https://api.telegram.org/file/bot' + token + '/' + filePath;
        const fileData = await axios({
          method: 'get',
          url: fileUrl,
          responseType: 'arraybuffer',
        });
        const sticker = new Sticker(fileData.data, {
          pack: config.STICKER_PACK_NAME,
          author: config.STICKER_AUTHOR_NAME,
          type: StickerTypes.FULL,
          quality: 10,
        });
        await sock.sendMessage(chatJid, { sticker: await sticker.toBuffer() }, { quoted: ms });
      }

      repondre('✅ Tous les stickers ont été envoyés.');
    } catch (err) {
      console.error(err);
      repondre("❌ Une erreur s'est produite lors du téléchargement des stickers.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'fetch_sc',
    classe: 'Owner',
    react: '💻',
    desc: 'Extrait les données d\'une page web, y compris HTML, CSS, JavaScript et médias',
  },
  async (chatJid, sock, ctx) => {
    const { arg, ms } = ctx;
    const url = arg[0];

    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, "Vous n'avez pas le droit d'exécuter cette commande."))) {
      return;
    }
    if (!url) {
      return ownerReply(
        sock,
        chatJid,
        ms,
        'Veuillez fournir un lien valide. Le bot extraira le HTML, CSS, JavaScript, et les médias de la page web.'
      );
    }
    if (!/^https?:\/\//i.test(url)) {
      return ownerReply(
        sock,
        chatJid,
        ms,
        'Veuillez fournir une URL valide commençant par http:// ou https://'
      );
    }

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const media = [];
      $('img[src], video[src], audio[src]').each((_i, el) => {
        const src = $(el).attr('src');
        if (src) media.push(src);
      });

      const stylesheets = [];
      $('link[rel="stylesheet"]').each((_i, el) => {
        const href = $(el).attr('href');
        if (href) stylesheets.push(href);
      });

      const scripts = [];
      $('script[src]').each((_i, el) => {
        const src = $(el).attr('src');
        if (src) scripts.push(src);
      });

      await ownerReply(sock, chatJid, ms, '**Contenu HTML**:\n\n' + html);

      if (stylesheets.length > 0) {
        for (const href of stylesheets) {
          const cssRes = await axios.get(new URL(href, url));
          await ownerReply(sock, chatJid, ms, '**Contenu du fichier CSS**:\n\n' + cssRes.data);
        }
      } else {
        await ownerReply(sock, chatJid, ms, 'Aucun fichier CSS externe trouvé.');
      }

      if (scripts.length > 0) {
        for (const src of scripts) {
          const jsRes = await axios.get(new URL(src, url));
          await ownerReply(sock, chatJid, ms, '**Contenu du fichier JavaScript**:\n\n' + jsRes.data);
        }
      } else {
        await ownerReply(sock, chatJid, ms, 'Aucun fichier JavaScript externe trouvé.');
      }

      if (media.length > 0) {
        await ownerReply(sock, chatJid, ms, '**Fichiers médias trouvés**:\n' + media.join('\n'));
      } else {
        await ownerReply(sock, chatJid, ms, 'Aucun fichier média (images, vidéos, audios) trouvé.');
      }
    } catch (err) {
      console.error(err);
      return ownerReply(
        sock,
        chatJid,
        ms,
        "Une erreur est survenue lors de l'extraction du contenu de la page web."
      );
    }
  }
);
