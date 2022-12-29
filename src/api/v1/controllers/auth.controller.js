"use strict";
const crypto = require("crypto");
const { comparePassword, generateJWT, hashPassword } = require("../helpers");
const sendEmailHelper = require("../helpers/sendEmail.helper");
const { sequelize, User, UserBiodata } = require("../models");
const otpGenerator = require("otp-generator");

class AuthController {
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

  static async sendForgotPasswordToken(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw {
          status: 404,
          message: "User not found",
        };
      }

      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });

      const otpHash = await hashPassword(otp);
      await User.update(
        {
          forgotPasswordToken: otpHash,
          forgotPasswordTokenExpiredAt: new Date(Date.now() + 5 * 60000),
        },
        {
          where: {
            email,
          },
        }
      );

      const html = `<pre>
Token: ${otp}
Email ini otomatis dibuat pada ${new Date()}
          </pre>`;

      await sendEmailHelper(
        "changePassword@mail.com",
        req.body.email,
        "Your Forgot Password Token",
        null,
        html
      );

      res.status(200).json({
        message: "Success send forgot password token",
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyForgotPasswordToken(req, res, next) {
    try {
      const { email, token } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw {
          status: 404,
          message: "User not found",
        };
      }

      if (user.forgotPasswordTokenExpiredAt < new Date()) {
        throw {
          status: 422,
          message: "Token expired",
        };
      }

      const isTokenValid = await comparePassword(
        token,
        user.forgotPasswordToken
      );

      if (isTokenValid) {
        res.status(200).json({
          message: "Token valid",
        });
      } else {
        throw {
          status: 422,
          message: "Token invalid",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async changeForgotPassword(req, res, next) {
    try {
      const { email, token, newPassword, verificationPassword } = req.body;
      if (newPassword !== verificationPassword) {
        throw {
          status: 422,
          message: "New password and verification password do not match",
        };
      } else {
        const user = await User.findOne({
          attributes: [
            "id",
            "forgotPasswordToken",
            "forgotPasswordTokenExpiredAt",
          ],
          where: { email },
        });

        if (!user) {
          throw {
            status: 404,
            message: "User not found",
          };
        } else {
          if (user.forgotPasswordTokenExpiredAt < new Date()) {
            throw {
              status: 422,
              message: "Token expired",
            };
          } else {
            const isTokenValid = await comparePassword(
              token,
              user.forgotPasswordToken
            );

            if (isTokenValid) {
              await User.update(
                {
                  password: await hashPassword(newPassword),
                  forgotPasswordToken: null,
                  forgotPasswordTokenExpiredAt: null,
                },
                {
                  where: {
                    id: user.id,
                  },
                }
              );

              res.status(200).json({
                message: "Password changed successfully",
              });
            } else {
              throw {
                status: 422,
                message: "Token invalid",
              };
            }
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
