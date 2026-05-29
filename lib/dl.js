const axios = require("axios");
const cheerio = require("cheerio");
const cookie = require("cookie");
const ytdl = async (url, format = "video") => {
  try {
    const apiUrl = "https://you-tube-dl-psi.vercel.app/youtube";
    const response = await axios.get(apiUrl, {
      params: {
        url: url,
        format: format
      }
    });
    if (!response.data || !response.data.status) {
      return null;
    }
    return response.data.data;
  } catch (err) {
    console.error("Erreur lors de la récupération via Vercel:", err.message);
    return null;
  }
};
async function fbdl(videoId) {
  try {
    const postData = {
      id: videoId,
      locale: "en"
    };
    const response = await axios.post("https://getmyfb.com/process", new URLSearchParams(postData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "user-agent": "GoogleBot"
      }
    });
    const $ = cheerio.load(response.data);
    const downloadUrl = $(".results-list-item a").first().attr("href");
    if (downloadUrl) {
      return downloadUrl;
    } else {
      return "Aucun lien de téléchargement trouvé.";
    }
  } catch (err) {
    return "Erreur : " + err.message;
  }
}
async function ttdl(tiktokUrl) {
  let attempt = 0;
  let lastError;
  while (attempt < 5) {
    try {
      const pageResponse = await axios.get("https://ssstik.io/fr", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          "user-agent": "GoogleBot"
        },
        maxRedirects: 5
      });
      const setCookieHeaders = pageResponse.headers["set-cookie"] || [];
      const parsedCookies = setCookieHeaders.map(rawCookie => cookie.parse(rawCookie)).reduce((acc, parsed) => ({
        ...acc,
        ...parsed
      }), {});
      const $page = cheerio.load(pageResponse.data);
      const csrfToken = $page("#token").attr("value");
      const cookieHeader = Object.entries({
        __cfduid: parsedCookies.__cfduid || "",
        PHPSESSID: parsedCookies.PHPSESSID || ""
      }).map(([name, value]) => cookie.serialize(name, value)).join("; ");
      const {
        data: postHtml
      } = await axios.post("https://ssstik.io/abc?url=dl", new URLSearchParams({
        id: tiktokUrl,
        locale: "fr",
        tt: csrfToken
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          cookie: cookieHeader,
          "User-Agent": "GoogleBot"
        }
      });
      const $result = cheerio.load(postHtml);
      const noWatermark = $result("a.download_link.without_watermark").attr("href") || $result("a.slides_video").attr("href") || null;
      const mp3 = $result("a.download_link.music").attr("href") || null;
      const slides = [];
      $result("a.download_link.slide").each((_, el) => {
        const slideUrl = $result(el).attr("href");
        if (slideUrl) {
          slides.push(slideUrl);
        }
      });
      const result = {
        noWatermark: noWatermark,
        mp3: mp3,
        slides: slides
      };
      console.log(result);
      return result;
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  throw new Error("Échec après 5 tentatives : " + lastError);
}
async function igdl(instagramUrl, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const pageResponse = await axios.get("https://downloadgram.org/", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot"
        },
        maxRedirects: 5
      });
      const setCookieHeaders = pageResponse.headers["set-cookie"] || [];
      const parsedCookies = setCookieHeaders.map(rawCookie => cookie.parse(rawCookie)).reduce((acc, parsed) => ({
        ...acc,
        ...parsed
      }), {});
      const $page = cheerio.load(pageResponse.data);
      const csrfToken = $page("#token").attr("value");
      const cookieHeader = Object.entries({
        __cfduid: parsedCookies.__cfduid || "",
        PHPSESSID: parsedCookies.PHPSESSID || ""
      }).map(([name, value]) => cookie.serialize(name, value)).join("; ");
      const apiResponse = await axios.post("https://api.downloadgram.org/media", new URLSearchParams({
        url: instagramUrl,
        v: "3",
        lang: "en"
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "GoogleBot",
          cookie: cookieHeader
        }
      });
      const $result = cheerio.load(apiResponse.data);
      let videoUrl = $result("video source").attr("src");
      if (videoUrl) {
        videoUrl = videoUrl.replace(/^\\\"|\\\"$/g, "");
        return {
          status: apiResponse.status,
          result: {
            video: videoUrl
          }
        };
      } else {
        throw new Error("Lien de vidéo introuvable.");
      }
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
async function twitterdl(tweetUrl, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const response = await axios.get("https://twitsave.com/info?url=" + tweetUrl, {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot"
        }
      });
      const $ = cheerio.load(response.data);
      const videoUrl = $("video").attr("src");
      if (videoUrl) {
        return {
          status: response.status,
          result: {
            video: videoUrl
          }
        };
      } else {
        throw new Error("Lien vidéo introuvable.");
      }
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
;
async function apkdl(query, limit = 1) {
  const {
    data: searchData
  } = await axios.get("https://ws75.aptoide.com/api/7/apps/search", {
    params: {
      query: query,
      limit: limit
    },
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "User-Agent": "GoogleBot"
    }
  });
  const apps = searchData?.datalist?.list || [];
  return apps.map(app => ({
    name: app.name,
    icon: app.icon,
    size: formatSize(app.file?.filesize),
    dllink: app.file?.path,
    package: app.package,
    lastup: app.updated || "N/A"
  }));
}
function formatSize(bytes) {
  if (!bytes) {
    return "0 MB";
  }
  const sizeMb = bytes / 1048576;
  return sizeMb.toFixed(2) + " MB";
}
module.exports = {
  fbdl: fbdl,
  ttdl: ttdl,
  igdl: igdl,
  twitterdl: twitterdl,
  ytdl: ytdl,
  apkdl: apkdl
};
