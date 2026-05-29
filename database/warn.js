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
const Warn = sequelize.define("Warn", {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: "warn",
  timestamps: false
});
const WarnConfig = sequelize.define("WarnConfig", {
  limit: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    allowNull: false
  }
}, {
  tableName: "warn_config",
  timestamps: false
});
(async () => {
  await Warn.sync();
  await WarnConfig.sync();
})();
async function delWarn(_0xad99f3) {
  return await Warn.destroy({
    where: {
      userId: _0xad99f3
    }
  });
}
async function getLimit() {
  const _0x42d41b = await WarnConfig.findOne();
  if (_0x42d41b) {
    return _0x42d41b.limit;
  } else {
    return 3;
  }
}
async function setLimit(_0x373377) {
  const _0x614ba9 = await WarnConfig.findOne();
  if (_0x614ba9) {
    _0x614ba9.limit = _0x373377;
    await _0x614ba9.save();
  } else {
    await WarnConfig.create({
      limit: _0x373377
    });
  }
}
async function setWarn(_0x30d8fa) {
  const [_0x1acd8c, _0x4b3c0b] = await Warn.findOrCreate({
    where: {
      userId: _0x30d8fa
    },
    defaults: {
      count: 1
    }
  });
  if (!_0x4b3c0b) {
    _0x1acd8c.count += 1;
    await _0x1acd8c.save();
  }
  return _0x1acd8c;
}
module.exports = {
  delWarn: delWarn,
  setWarn: setWarn,
  getLimit: getLimit,
  setLimit: setLimit
};