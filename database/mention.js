const {
  Sequelize,
  DataTypes
} = require("sequelize");
const config = require("../set");
const db = config.DATABASE;
let sequelize;
if (!db) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.db",
    logging: false
  });
} else {
  sequelize = new Sequelize(db, {
    dialect: "postgres",
    ssl: true,
    protocol: "postgres",
    dialectOptions: {
      native: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
}
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
(async () => {
  await Mention.sync();
  const _0x16208e = sequelize.getQueryInterface();
  const _0x46f71b = await _0x16208e.describeTable("mention");
  if (!_0x46f71b.type) {
    await _0x16208e.addColumn("mention", "type", {
      type: DataTypes.STRING,
      defaultValue: "texte"
    });
  }
})();
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
  const _0x462a0b = await Mention.findOne({
    where: {
      id: 1
    }
  });
  if (_0x462a0b) {
    _0x462a0b.mode = "non";
    await _0x462a0b.save();
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
  setMention: setMention,
  delMention: delMention,
  getMention: getMention
};