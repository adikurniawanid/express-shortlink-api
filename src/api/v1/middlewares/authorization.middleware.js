"use strict";
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../../../config/jwt.config");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw {
        status: 401,
        message: { en: "Unauthorized User", id: "Pengguna tidak diizinkan" },
      };
    } else {
      const decoded = jwt.verify(
        req.headers.authorization,
        config.JWT_SECRET_KEY
      );
      const publicId = decoded.publicId;
      const email = decoded.email;
      const selectedUser = await User.findOne({
        attributes: ["id"],
        where: {
          publicId,
          email,
        },
      });
      if (selectedUser) {
        req.user = selectedUser;
        next();
      } else {
        throw {
          status: 401,
          message: { en: "Unauthorized User", id: "Pengguna tidak diizinkan" },
        };
      }
    }
  } catch (error) {
    next(error);
  }
};
