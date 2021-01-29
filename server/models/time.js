"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      Time.belongsTo(User);
    }
  }
  Time.init(
    {
      time_sec: DataTypes.INTEGER,
      pomodoros: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Time",
    }
  );
  return Time;
};
