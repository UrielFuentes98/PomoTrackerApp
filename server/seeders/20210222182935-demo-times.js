"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`
    );
    const usersRows = users[0];

    return queryInterface.bulkInsert("Times", [
      {
        time_sec: 50,
        pomodoros: 1,
        date: "2021-02-22",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 100,
        pomodoros: 2,
        date: "2021-02-21",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 150,
        pomodoros: 3,
        date: "2021-02-18",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 80,
        pomodoros: 2,
        date: "2021-02-22",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 170,
        pomodoros: 5,
        date: "2021-02-10",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 170,
        pomodoros: 5,
        date: "2021-02-14",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 40,
        pomodoros: 1,
        date: "2021-01-6",
        UserId: usersRows[0].id,
      },
      {
        time_sec: 60,
        pomodoros: 1,
        date: "2021-01-8",
        UserId: usersRows[0].id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Times", null, {});
  },
};
