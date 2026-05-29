const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
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
async function delWarn(userId) {
  return await Warn.destroy({
    where: {
      userId: userId
    }
  });
}
async function getLimit() {
  const configRow = await WarnConfig.findOne();
  if (configRow) {
    return configRow.limit;
  } else {
    return 3;
  }
}
async function setLimit(limit) {
  const configRow = await WarnConfig.findOne();
  if (configRow) {
    configRow.limit = limit;
    await configRow.save();
  } else {
    await WarnConfig.create({
      limit: limit
    });
  }
}
async function setWarn(userId) {
  const [warnRow, created] = await Warn.findOrCreate({
    where: {
      userId: userId
    },
    defaults: {
      count: 1
    }
  });
  if (!created) {
    warnRow.count += 1;
    await warnRow.save();
  }
  return warnRow;
}
module.exports = {
  Warn,
  WarnConfig,
  delWarn: delWarn,
  setWarn: setWarn,
  getLimit: getLimit,
  setLimit: setLimit
};
