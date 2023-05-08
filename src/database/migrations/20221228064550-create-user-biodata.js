/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserBiodatas', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatarUrl: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('UserBiodatas');
  },
};
