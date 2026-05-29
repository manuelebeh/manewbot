'use strict';

const {
  registerCommand,
  cmd,
  fs,
  path,
  os,
  axios,
  config,
  translate,
  prefixe,
  WA_CONF,
  TempMail,
  JavaScriptObfuscator,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
} = require('./_shared');

registerCommand({
  nom_cmd: "obfuscate",
  classe: "Outils",
  react: "📥",
  desc: "Obfusque du code JavaScript",
  alias: ["obf"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    ms
  } = ctx;
  if (!arg || arg.length === 0) {
    return repondre("Veuillez fournir le code JavaScript à obfusquer.");
  }
  const text = arg.join(" ");
  try {
    repondre("🔄obfucation en cours...");
    const value = JavaScriptObfuscator.obfuscate(text, {
      compact: true,
      controlFlowFlattening: true
    }).getObfuscatedCode();
    const text2 = path.join(__dirname, "obfuscate.js");
    fs.writeFileSync(text2, value);
    await sock.sendMessage(chatJid, {
      document: {
        url: text2
      },
      mimetype: "application/javascript",
      fileName: "obfuscate.js"
    }, {
      quoted: ms
    });
    fs.unlinkSync(text2);
  } catch (err) {
    console.error(err);
    repondre("Une erreur est survenue lors de l'obfuscation du code.");
  }
});
registerCommand({
  nom_cmd: "gitclone",
  classe: "Outils",
  react: "📥",
  desc: "clone un repo Git",
  alias: ["gcl"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    ms
  } = ctx;
  if (!arg || arg.length < 1) {
    return repondre("Veuillez fournir l'URL du dépôt Git à cloner.");
  }
  const value = arg[0];
  const value2 = value + ".git";
  const pluginName = arg[1] ? arg[1] : path.basename(value2, ".git");
  if (/[/\\]|\.\./.test(pluginName)) {
    return repondre("Nom de dossier invalide.");
  }
  const value3 = pluginName + ".zip";
  const value4 = /^(https?:\/\/|git@)([\w.@:\/-]+)(\.git)(\/?)$/;
  if (!value4.test(value2)) {
    return repondre("URL de dépôt Git invalide.");
  }
  try {
    repondre("🔄Clonage du dépôt en cours...");
    const cloneProcess = spawn("git", ["clone", value2, pluginName], {
      cwd: process.cwd()
    });
    let stderr = "";
    cloneProcess.stderr.on("data", chunk => {
      stderr += chunk.toString();
    });
    cloneProcess.on("close", code => {
      if (code !== 0) {
        return repondre("Erreur lors du clonage du dépôt : " + (stderr.trim() || "code " + code));
      }
      try {
        const value5 = new AdmZip();
        value5.addLocalFolder(pluginName);
        value5.writeZip(value3);
        const fileData = {
          document: fs.readFileSync(value3),
          mimetype: "application/zip",
          fileName: pluginName + ".zip"
        };
        sock.sendMessage(chatJid, fileData, {
          quoted: ms
        });
        fs.rmSync(pluginName, {
          recursive: true,
          force: true
        });
        fs.unlinkSync(value3);
      } catch (err) {
        repondre("Erreur lors de la compression en zip : " + err.message);
      }
    });
  } catch (tmp4) {
    console.error(tmp4);
    repondre("Une erreur est survenue lors du clonage du dépôt.");
  }
});
