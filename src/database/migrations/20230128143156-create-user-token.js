"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserTokens", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        unique: true,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      forgotPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      forgotPasswordTokenExpiredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserTokens");
  },
};
