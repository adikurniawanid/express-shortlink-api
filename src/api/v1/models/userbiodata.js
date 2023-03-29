"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBiodata extends Model {
    static associate(models) {
      UserBiodata.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserBiodata.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserBiodata",
      tableName: "UserBiodatas",
    }
  );
  return UserBiodata;
};
