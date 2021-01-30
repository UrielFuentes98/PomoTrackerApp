const { Model, Sequelize } = require("sequelize");
let dayjs = require("dayjs");

const dateFromNow = (daysFromNow = 0) => {
  return dayjs().subtract(daysFromNow, "day").format("YYYY-MM-DD");
};

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
      timestamps: false,
    }
  );

  Time.updateRecord = async function (user, time, pomodoro) {
    const numPomodoro = pomodoro == "true" ? 1 : 0;

    //Check if today record already exists for user
    const result = Time.findOne({
      where: {
        UserId: user.id,
        date: dateFromNow(),
      },
    })
      //Update today record
      .then((todayReg) => {
        const updateReg = todayReg
          .update({
            time_sec: todayReg.time_sec + parseInt(time),
            pomodoros: todayReg.pomodoros + numPomodoro,
          })
          .then(() => {
            return "Record updated.";
          })
          .catch(() => {
            return "Fail to update record.";
          });
        return updateReg;
      })
      //Record new data for today
      .catch(() => {
        const newReg = Time.create({
          time_sec: parseInt(time),
          pomodoros: numPomodoro,
          date: dateFromNow(),
          UserId: user.id,
        })
          .then(() => {
            return "Record created.";
          })
          .catch(() => {
            return "Fail to create record.";
          });
        return newReg;
      });
    return result;
  };

  return Time;
};
