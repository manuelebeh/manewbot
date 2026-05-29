const cheerio = require("cheerio");
const fetch = (..._0x3bf77f) => import("node-fetch").then(({
  default: _0x203e01
}) => _0x203e01(..._0x3bf77f));
const FormData = require("form-data");
const cookie = require("cookie");
const textmaker = async (_0x2b3806, _0x54c3e2, _0x597be8 = "") => {
  _0x54c3e2 = _0x54c3e2.split(";");
  const _0x9c8a94 = await fetch(_0x2b3806, {
    method: "GET",
    headers: {
      "User-Agent": "GoogleBot"
    }
  });
  const _0xc253dc = await _0x9c8a94.text();
  const _0x3fccb3 = _0x9c8a94.headers.get("set-cookie").split(",").map(cookie.parse).reduce((_0xb8cdc2, _0x5bd6d9) => ({
    ..._0xb8cdc2,
    ..._0x5bd6d9
  }), {});
  const _0x586836 = Object.entries({
    __cfduid: _0x3fccb3.__cfduid,
    PHPSESSID: _0x3fccb3.PHPSESSID
  }).map(([_0x279712, _0x22b0fa]) => cookie.serialize(_0x279712, _0x22b0fa)).join("; ");
  const _0x8d050 = cheerio.load(_0xc253dc);
  const _0x130795 = _0x8d050("input[name=\"token\"]").attr("value");
  const _0x5299e3 = _0x8d050("input[name=\"build_server\"]").attr("value");
  const _0x1a9006 = _0x8d050("input[name=\"build_server_id\"]").attr("value");
  const _0x5bccb9 = _0x8d050("input[name^='radio0[radio]']").map((_0x36da43, _0x68b572) => _0x8d050(_0x68b572).val()).get();
  if (_0x5bccb9.length > 0 && !_0x597be8) {
    const _0x57a440 = Math.floor(Math.random() * _0x5bccb9.length);
    _0x597be8 = _0x5bccb9[_0x57a440];
    console.log("Option radio sélectionnée aléatoirement : " + _0x597be8);
  }
  const _0x5f5456 = new FormData();
  _0x54c3e2.forEach(_0x45c9b7 => _0x5f5456.append("text[]", _0x45c9b7.trim()));
  _0x5f5456.append("submit", "Go");
  if (_0x597be8) {
    _0x5f5456.append("radio0[radio]", _0x597be8);
  }
  _0x5f5456.append("token", _0x130795);
  _0x5f5456.append("build_server", _0x5299e3);
  _0x5f5456.append("build_server_id", _0x1a9006);
  const _0x3c5257 = await fetch(_0x2b3806, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: _0x586836,
      ..._0x5f5456.getHeaders()
    },
    body: _0x5f5456.getBuffer()
  });
  const _0x312526 = await _0x3c5257.text();
  const _0x45ade0 = cheerio.load(_0x312526);
  const _0x21fee9 = _0x2b3806.includes("en.ephoto360.com") ? _0x45ade0("input[name=\"form_value_input\"]").attr("value") : _0x45ade0("#form_value").first().text();
  if (!_0x21fee9) {
    return {
      status: false
    };
  }
  const _0x1f1065 = JSON.parse(_0x21fee9);
  const _0x5802d3 = new FormData();
  _0x5802d3.append("id", _0x1f1065.id);
  _0x1f1065.text.forEach(_0x44ebdb => _0x5802d3.append("text[]", _0x44ebdb));
  _0x5802d3.append("token", _0x1f1065.token);
  _0x5802d3.append("build_server", _0x1f1065.build_server);
  _0x5802d3.append("build_server_id", _0x1f1065.build_server_id);
  if (_0x1f1065.radio0) {
    _0x5802d3.append("radio0[radio]", _0x1f1065.radio0.radio);
  }
  const _0x1e857f = await fetch(_0x2b3806.split("/").slice(0, 3).join("/") + "/effect/create-image", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: _0x586836,
      ..._0x5802d3.getHeaders()
    },
    body: _0x5802d3.getBuffer()
  });
  const _0x3056c8 = await _0x1e857f.json();
  if (!_0x3056c8.image) {
    throw new Error("textmaker: Erreur lors de la génération de l'image");
  }
  return {
    status: _0x3056c8.success,
    url: "" + _0x5299e3 + _0x3056c8.image
  };
};
module.exports = textmaker;