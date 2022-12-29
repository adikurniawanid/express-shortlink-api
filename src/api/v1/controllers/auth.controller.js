"use strict";
const crypto = require("crypto");
const { comparePassword, generateJWT, hashPassword } = require("../helpers");
const sendEmailHelper = require("../helpers/sendEmail.helper");
const { sequelize, User, UserBiodata } = require("../models");
const otpGenerator = require("otp-generator");
const config = require("../../../config/googleOAuth.config");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET
);

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

      res.status(201).json({
        message: {
          en: "User created successfully",
          id: "Pengguna berhasil dibuat",
        },
        data: { token },
      });
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
            message: { en: "Login sucessfully", id: "Login berhasil" },
            data: {
              token: await generateJWT(user.publicId, user.email),
            },
          });
        } else {
          throw {
            status: 401,
            message: {
              en: "Invalid email or password",
              id: "Email atau password salah",
            },
          };
        }
      } else {
        throw {
          status: 401,
          message: {
            en: "Invalid email or password",
            id: "Email atau password salah",
          },
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
          message: { en: "User not found", id: "Pengguna tidak ditemukan" },
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
        message: {
          en: "Success send forgot password token",
          id: "Berhasil mengirim token lupa password",
        },
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
          message: { en: "User not found", id: "Pengguna tidak ditemukan" },
        };
      }

      if (user.forgotPasswordTokenExpiredAt < new Date()) {
        throw {
          status: 422,
          message: { en: "Token expired", id: "Token telah kadaluarsa" },
        };
      }

      const isTokenValid = await comparePassword(
        token,
        user.forgotPasswordToken
      );

      if (isTokenValid) {
        res.status(200).json({
          message: { en: "Token valid", id: "Token valid" },
        });
      } else {
        throw {
          status: 422,
          message: { en: "Token invalid", id: "Token tidak valid" },
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
          message: {
            en: "New password and verification password do not match",
            id: "Password baru dan verifikasi password tidak cocok",
          },
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
              message: { en: "Token expired", id: "Token telah kadaluarsa" },
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
                message: {
                  en: "Password changed successfully",
                  id: "Password berhasil diubah",
                },
              });
            } else {
              throw {
                status: 422,
                message: { en: "Token invalid", id: "Token tidak valid" },
              };
            }
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async loginWithGoogle(req, res, next) {
    try {
      const token = await client.verifyIdToken({
        idToken: req.body.googleIdToken,
        audience: config.GOOGLE_CLIENT_IDs,
      });

      const payload = token.getPayload();

      const user = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      if (user) {
        res.status(200).json({
          message: { en: "Login sucessfully", id: "Login berhasil" },
          data: {
            token: await generateJWT(user.publicId, user.email),
          },
        });
      } else {
        const transaction = await sequelize.transaction();

        try {
          const user = await User.create(
            {
              email: payload.email,
              password: await hashPassword(payload.email),
              publicId: crypto.randomUUID(),
            },
            { transaction }
          );

          await UserBiodata.create(
            { userId: user.id, name: payload.name },
            { transaction }
          );
          await transaction.commit();

          const token = await generateJWT(user.publicId, user.email);

          res.status(201).json({
            message: {
              en: "User created successfully",
              id: "User berhasil dibuat",
            },
            data: { token },
          });
        } catch (error) {
          await transaction.rollback();
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;