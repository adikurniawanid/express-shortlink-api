"use strict";
const { comparePassword, generateJWT } = require("../helpers");
const { User } = require("../models");

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        const isPasswordValid = await comparePassword(password, user.password);

        if (isPasswordValid) {
          res.status(200).json({
            message: "Login sucessfully",
            data: {
              token: await generateJWT(user.publicId, user.email),
            },
          });
        } else {
          throw {
            status: 401,
            message: "Invalid email or password",
          };
        }
      } else {
        throw {
          status: 401,
          message: "Invalid email or password",
        };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
