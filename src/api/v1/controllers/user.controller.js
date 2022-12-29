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
          message: {
            en: "New password and verification password do not match",
            id: "Password baru dan verifikasi password tidak cocok",
          },
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

        res.status(200).json({
          message: {
            en: "Password updated successfully",
            id: "Password berhasil diperbarui",
          },
        });
      } else {
        throw {
          status: 422,
          message: { en: "Invalid old password", id: "Password lama salah" },
        };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
