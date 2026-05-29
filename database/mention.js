const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Mention = sequelize.define("Mention", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1
  },
  mode: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  url: {
    type: DataTypes.TEXT,
    defaultValue: "url"
  },
  text: {
    type: DataTypes.TEXT,
    defaultValue: "text"
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "texte"
  }
}, {
  tableName: "mention",
  timestamps: false
});
async function setMention({
  url = "url",
  text = "text",
  mode = "non",
  type = "texte"
}) {
  await Mention.upsert({
    id: 1,
    url: url,
    text: text,
    mode: mode,
    type: type
  });
}
async function delMention() {
  const row = await Mention.findOne({
    where: {
      id: 1
    }
  });
  if (row) {
    row.mode = "non";
    await row.save();
  }
}
async function getMention() {
  return await Mention.findOne({
    where: {
      id: 1
    }
  });
}
module.exports = {
  Mention,
  setMention: setMention,
  delMention: delMention,
  getMention: getMention
};
