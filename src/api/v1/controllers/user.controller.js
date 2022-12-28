"use strict";
const crypto = require("crypto");
const { sequelize, User, UserBiodata } = require("../models");
const { hashPassword, generateJWT, comparePassword } = require("../helpers");

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

  static async updatePassword(req, res, next) {
    try {
      const { oldPassword, verificationPassword, newPassword } = req.body;

      if (verificationPassword !== newPassword) {
        throw {
          status: 422,
          message: "New password and verification password do not match",
        };
      }

      const user = await User.findOne({
        attributes: ["id", "password"],
        where: {
          id: req.user.id,
        },
      });

      if (user && (await comparePassword(oldPassword, user.password))) {
        await User.update(
          {
            password: await hashPassword(newPassword),
          },
          {
            where: {
              id: user.id,
            },
          }
        );

        res.status(200).json({ message: "Password updated successfully" });
      } else {
        throw {
          status: 422,
          message: "Invalid old password",
        };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
