const axios = require("axios");
const cheerio = require("cheerio");
const cookie = require("cookie");
const ytdl = async (_0x51b8ff, _0x5428f7 = "video") => {
  try {
    const _0x3e78ec = "https://you-tube-dl-psi.vercel.app/youtube";
    const _0x1226d5 = await axios.get(_0x3e78ec, {
      params: {
        url: _0x51b8ff,
        format: _0x5428f7
      }
    });
    if (!_0x1226d5.data || !_0x1226d5.data.status) {
      return null;
    }
    return _0x1226d5.data.data;
  } catch (_0x2af0d8) {
    console.error("Erreur lors de la récupération via Vercel:", _0x2af0d8.message);
    return null;
  }
};
async function fbdl(_0x371f35) {
  try {
    const _0x471625 = {
      id: _0x371f35,
      locale: "en"
    };
    const _0x1ecd1c = await axios.post("https://getmyfb.com/process", new URLSearchParams(_0x471625), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "user-agent": "GoogleBot"
      }
    });
    const _0x42ecfb = cheerio.load(_0x1ecd1c.data);
    const _0x37738b = _0x42ecfb(".results-list-item a").first().attr("href");
    if (_0x37738b) {
      return _0x37738b;
    } else {
      return "Aucun lien de téléchargement trouvé.";
    }
  } catch (_0x5451d0) {
    return "Erreur : " + _0x5451d0.message;
  }
}
async function ttdl(_0x46f313) {
  let _0x352326 = 0;
  let _0x152524;
  while (_0x352326 < 5) {
    try {
      const _0x27448c = await axios.get("https://ssstik.io/fr", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          "user-agent": "GoogleBot"
        },
        maxRedirects: 5
      });
      const _0x22dd19 = _0x27448c.headers["set-cookie"] || [];
      const _0x7e752d = _0x22dd19.map(_0x1bcb93 => cookie.parse(_0x1bcb93)).reduce((_0x57606e, _0x4103f6) => ({
        ..._0x57606e,
        ..._0x4103f6
      }), {});
      const _0xf1ba57 = cheerio.load(_0x27448c.data);
      const _0x40570a = _0xf1ba57("#token").attr("value");
      const _0x535cea = Object.entries({
        __cfduid: _0x7e752d.__cfduid || "",
        PHPSESSID: _0x7e752d.PHPSESSID || ""
      }).map(([_0x2f8e83, _0x55dee3]) => cookie.serialize(_0x2f8e83, _0x55dee3)).join("; ");
      const {
        data: _0x274b8e
      } = await axios.post("https://ssstik.io/abc?url=dl", new URLSearchParams({
        id: _0x46f313,
        locale: "fr",
        tt: _0x40570a
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          cookie: _0x535cea,
          "User-Agent": "GoogleBot"
        }
      });
      const _0x32d08b = cheerio.load(_0x274b8e);
      const _0x226651 = _0x32d08b("a.download_link.without_watermark").attr("href") || _0x32d08b("a.slides_video").attr("href") || null;
      const _0x6243c = _0x32d08b("a.download_link.music").attr("href") || null;
      const _0x1793f3 = [];
      _0x32d08b("a.download_link.slide").each((_0x55c912, _0x1c74c8) => {
        const _0x51a2d4 = _0x32d08b(_0x1c74c8).attr("href");
        if (_0x51a2d4) {
          _0x1793f3.push(_0x51a2d4);
        }
      });
      const _0xa41f13 = {
        noWatermark: _0x226651,
        mp3: _0x6243c,
        slides: _0x1793f3
      };
      console.log(_0xa41f13);
      return _0xa41f13;
    } catch (_0x2b6e44) {
      _0x152524 = _0x2b6e44;
      _0x352326++;
      if (_0x352326 < 5) {
        await new Promise(_0x4120d2 => setTimeout(_0x4120d2, 1000));
      }
    }
  }
  throw new Error("Échec après 5 tentatives : " + _0x152524);
}
async function igdl(_0x536cc1, _0x24fa5a = 5) {
  let _0x32c8a0 = 0;
  while (_0x32c8a0 < _0x24fa5a) {
    try {
      _0x32c8a0++;
      const _0x45f59c = await axios.get("https://downloadgram.org/", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot"
        },
        maxRedirects: 5
      });
      const _0x2e4509 = _0x45f59c.headers["set-cookie"] || [];
      const _0x192169 = _0x2e4509.map(_0x18d5c1 => cookie.parse(_0x18d5c1)).reduce((_0x4c898a, _0x1fcbae) => ({
        ..._0x4c898a,
        ..._0x1fcbae
      }), {});
      const _0xe374e6 = cheerio.load(_0x45f59c.data);
      const _0x3ed699 = _0xe374e6("#token").attr("value");
      const _0x49283f = Object.entries({
        __cfduid: _0x192169.__cfduid || "",
        PHPSESSID: _0x192169.PHPSESSID || ""
      }).map(([_0x1c8dd0, _0x20545c]) => cookie.serialize(_0x1c8dd0, _0x20545c)).join("; ");
      const _0x3deddc = await axios.post("https://api.downloadgram.org/media", new URLSearchParams({
        url: _0x536cc1,
        v: "3",
        lang: "en"
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "GoogleBot",
          cookie: _0x49283f
        }
      });
      const _0x1fe4ce = cheerio.load(_0x3deddc.data);
      let _0x5ec675 = _0x1fe4ce("video source").attr("src");
      if (_0x5ec675) {
        _0x5ec675 = _0x5ec675.replace(/^\\\"|\\\"$/g, "");
        return {
          status: _0x3deddc.status,
          result: {
            video: _0x5ec675
          }
        };
      } else {
        throw new Error("Lien de vidéo introuvable.");
      }
    } catch (_0x48c048) {
      if (_0x32c8a0 >= _0x24fa5a) {
        throw _0x48c048;
      }
      await new Promise(_0x3add28 => setTimeout(_0x3add28, 2000));
    }
  }
}
async function twitterdl(_0x549c10, _0x2f88a6 = 5) {
  let _0x5aea2c = 0;
  while (_0x5aea2c < _0x2f88a6) {
    try {
      _0x5aea2c++;
      const _0x2e4b60 = await axios.get("https://twitsave.com/info?url=" + _0x549c10, {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot"
        }
      });
      const _0x1389d0 = cheerio.load(_0x2e4b60.data);
      const _0x5340dd = _0x1389d0("video").attr("src");
      if (_0x5340dd) {
        return {
          status: _0x2e4b60.status,
          result: {
            video: _0x5340dd
          }
        };
      } else {
        throw new Error("Lien vidéo introuvable.");
      }
    } catch (_0x403871) {
      if (_0x5aea2c >= _0x2f88a6) {
        throw _0x403871;
      }
      await new Promise(_0xbf8426 => setTimeout(_0xbf8426, 2000));
    }
  }
}
;
async function apkdl(_0x4ec8f8, _0x1d5b2e = 1) {
  const {
    data: _0x35cad9
  } = await axios.get("https://ws75.aptoide.com/api/7/apps/search", {
    params: {
      query: _0x4ec8f8,
      limit: _0x1d5b2e
    },
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "User-Agent": "GoogleBot"
    }
  });
  const _0x8e8668 = _0x35cad9?.datalist?.list || [];
  return _0x8e8668.map(_0x7274dd => ({
    name: _0x7274dd.name,
    icon: _0x7274dd.icon,
    size: formatSize(_0x7274dd.file?.filesize),
    dllink: _0x7274dd.file?.path,
    package: _0x7274dd.package,
    lastup: _0x7274dd.updated || "N/A"
  }));
}
function formatSize(_0x302884) {
  if (!_0x302884) {
    return "0 MB";
  }
  const _0xe09285 = _0x302884 / 1048576;
  return _0xe09285.toFixed(2) + " MB";
}
module.exports = {
  fbdl: fbdl,
  ttdl: ttdl,
  igdl: igdl,
  twitterdl: twitterdl,
  ytdl: ytdl,
  apkdl: apkdl
};