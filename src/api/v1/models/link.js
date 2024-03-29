const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    static associate(models) {
      Link.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Link.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      originalUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      customUrl: {
        type: DataTypes.STRING,
        unique: true,
      },
      clicks: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Link',
    },
  );
  return Link;
};
