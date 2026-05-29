'use strict';

const { registerCommand } = require('../register');
const { axios, config, translate, Sticker, StickerTypes } = require('../deps');
registerCommand({
  nom_cmd: "meteo",
  classe: "Search",
  react: "🌦️",
  desc: "Affiche la météo d'une ville."
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const city = arg.join(" ");
  if (!city) {
    return bot.sendMessage(jid, {
      text: "❗ Veuillez fournir un nom de ville."
    }, {
      quoted: ms
    });
  }
  if (!config.OPENWEATHER_API_KEY) {
    return bot.sendMessage(jid, {
      text: "❗ Météo non configurée (OPENWEATHER_API_KEY)."
    }, {
      quoted: ms
    });
  }
  try {
    const weatherBase = (config.OPENWEATHER_API_BASE || 'https://api.openweathermap.org/data/2.5').replace(/\/$/, '');
    const weatherUrl = weatherBase + "/weather?q=" + encodeURIComponent(city) + "&units=metric&appid=" + config.OPENWEATHER_API_KEY;
    const response = await axios.get(weatherUrl);
    const data = response.data;
    const cityName = data.name;
    const country = data.sys.country;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const rain1h = data.rain ? data.rain["1h"] || 0 : 0;
    const cloudiness = data.clouds.all;
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    const formatTime = date => {
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");
      return hours + ":" + minutes + ":" + seconds;
    };
    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);
    const message = "🌍 *Météo à " + cityName + ", " + country + "*  \n\n🌡️ *Température :* " + temp + "°C  \n🌡️ *Ressenti :* " + feelsLike + "°C  \n📉 *Température min :* " + tempMin + "°C  \n📈 *Température max :* " + tempMax + "°C  \n📝 *Description :* " + (description.charAt(0).toUpperCase() + description.slice(1)) + "  \n💧 *Humidité :* " + humidity + "%  \n💨 *Vent :* " + windSpeed + " m/s  \n🌧️ *Précipitations (1h) :* " + rain1h + " mm  \n☁️ *Nébulosité :* " + cloudiness + "%  \n🌄 *Lever du soleil (GMT) :* " + sunriseTime + "  \n🌅 *Coucher du soleil (GMT) :* " + sunsetTime;
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des données météo :", err.message);
    await bot.sendMessage(jid, {
      text: "❗ Impossible de trouver cette ville. Vérifiez l'orthographe et réessayez !"
    }, {
      quoted: ms
    });
  }
});
