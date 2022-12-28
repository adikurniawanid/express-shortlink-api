"use strict";
const crypto = require("crypto");
const { sequelize, User, UserBiodata } = require("../models");
const { hashPassword, generateJWT } = require("../helpers");

class UserController {
  static async register(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const { name, email, password } = req.body;

      const user = await User.create(
        {
          email,
          password: await hashPassword(password),
          publicId: crypto.randomUUID(),
        },
        { transaction }
      );

      await UserBiodata.create({ userId: user.id, name }, { transaction });
      await transaction.commit();

      const token = await generateJWT(user.publicId, user.email);

      res
        .status(201)
        .json({ message: "User created successfully", data: { token } });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = UserController;
