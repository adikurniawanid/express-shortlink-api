"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "DetailLoginTypes",
      [
        {
          id: "0",
          description: "app",
        },
        {
          id: "1",
          description: "Google",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("DetailLoginTypes", null, {});
  },
};
