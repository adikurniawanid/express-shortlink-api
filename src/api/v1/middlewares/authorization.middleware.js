"use strict";
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../../../config/jwt.config");

const { TokenExpiredError } = jwt;

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw {
        status: 403,
        message: { en: "No token provided!", id: "tidak ada token!" },
      };
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

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
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        message: {
          en: "Unauthorized! Access Token was expired!",
          id: "Pengguna tidak diizinkan! Token akses kadaluarsa",
        },
      });
    }

    next(error);
  }
};
