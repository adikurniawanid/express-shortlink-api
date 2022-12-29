"use strict";
const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers");

class UserController {
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
