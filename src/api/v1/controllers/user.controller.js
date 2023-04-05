"use strict";
const { User, UserBiodata } = require("../models");
const { hashPassword, comparePassword } = require("../helpers");

class UserController {
  static async get(req, res, next) {
    try {
      const user = await User.findOne({
        include: {
          model: UserBiodata,
          attributes: ["name"],
        },
        where: {
          id: req.user.id,
        },
      });

      const result = {
        publicId: user.publicId,
        email: user.email,
        name: user.UserBiodatum.name,
      };

      if (!user) {
        throw {
          status: 404,
          message: { en: "User not found", id: "User tidak ditemukan" },
        };
      }

      res.status(200).json({
        message: {
          en: "User retrieved successfully",
          id: "User berhasil diambil",
        },
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

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

      if (!user && !(await comparePassword(oldPassword, user.password))) {
        throw {
          status: 422,
          message: { en: "Invalid old password", id: "Password lama salah" },
        };
      }

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
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
