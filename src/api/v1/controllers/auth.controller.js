const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const { OAuth2Client } = require('google-auth-library');
const {
  comparePassword, generateJWT, hashPassword, sendEmail, verifyRefreshToken,
} = require('../helpers');
const {
  sequelize, User, UserBiodata, UserToken,
} = require('../models');
const config = require('../../../config/googleOAuth.config');
const forgotPasswordMailBody = require('../../../email/forgotPassword');

const client = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
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
        { transaction },
      );

      await UserBiodata.create({ userId: user.id, name }, { transaction });
      await transaction.commit();

      const token = await generateJWT(user.id, user.publicId, user.email);

      res.status(201).json({
        message: {
          en: 'User created successfully',
          id: 'Pengguna berhasil dibuat',
        },
        token,
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        include: { model: UserBiodata, attributes: ['name'] },
        where: { email, loginTypeId: 0 },
      });

      if (!user) {
        next({
          status: 401,
          message: {
            en: 'Invalid email or password',
            id: 'Email atau password salah',
          },
        });
      }

      const verifiedPassword = await comparePassword(password, user.password);

      if (!verifiedPassword) {
        next({
          status: 401,
          message: {
            en: 'Invalid email or password',
            id: 'Email atau password salah',
          },
        });
      }

      res.status(200).json({
        message: { en: 'Login sucessfully', id: 'Login berhasil' },
        data: {
          publicId: user.publicId,
          name: user.UserBiodatum.name,
        },
        token: await generateJWT(user.id, user.publicId, user.email),
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const tokenDetails = await verifyRefreshToken(
        req.body.refreshToken,
      );

      if (!tokenDetails) {
        next({
          status: 400,
          message: {
            en: 'Invalid refresh token',
            id: 'Token refresh tidak valid',
          },
        });
      }

      const accessToken = await generateJWT(
        tokenDetails.id,
        tokenDetails.publicId,
        tokenDetails.email,
      );

      res.status(200).json({
        message: {
          en: 'Access token created successfully',
          id: 'Akses Token berhasil dibuat',
        },
        token: accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendForgotPasswordToken(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        attributes: ['id', 'email'],
        include: { model: UserBiodata, attributes: ['name'] },
        where: { email },
      });

      if (!user) {
        next({
          status: 404,
          message: { en: 'User not found', id: 'Pengguna tidak ditemukan' },
        });
      }

      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });

      const otpHash = await hashPassword(otp);
      await UserToken.update(
        {
          forgotPasswordToken: otpHash,
          forgotPasswordTokenExpiredAt: new Date(Date.now() + 5 * 60000),
        },
        {
          where: {
            userId: user.id,
          },
        },
      );

      await sendEmail(
        'changePassword@mail.com',
        req.body.email,
        'Your Forgot Password Token',
        null,
        forgotPasswordMailBody(user.UserBiodatum.name, otp),
      );

      res.status(200).json({
        message: {
          en: 'Success send forgot password token',
          id: 'Berhasil mengirim token lupa password',
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
        include: {
          model: UserToken,
          attributes: ['forgotPasswordToken', 'forgotPasswordTokenExpiredAt'],
        },
        where: {
          email,
        },
      });

      if (!user) {
        next({
          status: 404,
          message: { en: 'User not found', id: 'Pengguna tidak ditemukan' },
        });
      }

      if (user.UserToken.forgotPasswordTokenExpiredAt < new Date()) {
        next({
          status: 422,
          message: { en: 'Token expired', id: 'Token telah kadaluarsa' },
        });
      }

      const isTokenValid = await comparePassword(
        token,
        user.UserToken.forgotPasswordToken,
      );

      if (!isTokenValid) {
        next({
          status: 422,
          message: { en: 'Token invalid', id: 'Token tidak valid' },
        });
      }

      res.status(200).json({
        message: { en: 'Token valid', id: 'Token valid' },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeForgotPassword(req, res, next) {
    try {
      const {
        email, token, newPassword, verificationPassword,
      } = req.body;
      if (newPassword !== verificationPassword) {
        next({
          status: 422,
          message: {
            en: 'New password and verification password do not match',
            id: 'Password baru dan verifikasi password tidak cocok',
          },
        });
      } else {
        const user = await User.findOne({
          attributes: ['id'],
          include: {
            model: UserToken,
            attributes: ['forgotPasswordToken', 'forgotPasswordTokenExpiredAt'],
          },
          where: { email },
        });

        if (!user) {
          next({
            status: 404,
            message: 'User not found',
          });
        }

        if (user.UserToken.forgotPasswordTokenExpiredAt < new Date()) {
          next({
            status: 422,
            message: { en: 'Token expired', id: 'Token telah kadaluarsa' },
          });
        }

        const isTokenValid = await comparePassword(
          token,
          user.UserToken.forgotPasswordToken,
        );

        if (!isTokenValid) {
          next({
            status: 422,
            message: { en: 'Token invalid', id: 'Token tidak valid' },
          });
        }

        await User.update(
          {
            password: await hashPassword(newPassword),
          },
          {
            where: {
              id: user.id,
            },
          },
        );

        await UserToken.update(
          {
            forgotPasswordToken: null,
            forgotPasswordTokenExpiredAt: null,
          },
          {
            where: {
              userId: user.id,
            },
          },
        );

        res.status(200).json({
          message: {
            en: 'Password changed successfully',
            id: 'Password berhasil diubah',
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async loginWithGoogle(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const verifyToken = await client.verifyIdToken({
        idToken: req.body.googleIdToken,
        audience: config.GOOGLE_CLIENT_IDs,
      });

      const payload = verifyToken.getPayload();

      const user = await User.findOne({
        where: {
          publicId: payload.sub,
        },
        include: {
          model: UserBiodata,
          attributes: ['name'],
        },
      });

      if (!user) {
        const newUser = await User.create(
          {
            email: payload.email,
            password: await hashPassword(payload.sub),
            // publicId: crypto.randomUUID(),
            publicId: payload.sub,
            loginTypeId: 1,
          },
          { transaction },
        );

        await UserBiodata.create(
          { userId: newUser.id, name: payload.name, avatarUrl: payload.picture },
          { transaction },
        );

        await transaction.commit();
        const token = await generateJWT(newUser.id, newUser.publicId, newUser.email);

        res.status(201).json({
          message: {
            en: 'User created successfully',
            id: 'User berhasil dibuat',
          },
          data: { publicId: newUser.publicId, name: payload.name },
          token,
        });
      }

      await UserBiodata.update(
        {
          name: payload.name,
          avatarUrl: payload.picture,
        },
        {
          where: {
            userId: user.id,
          },
        },
      );

      res.status(200).json({
        message: { en: 'Login sucessfully', id: 'Login berhasil' },
        data: {
          publicId: user.publicId,
          name: user.UserBiodatum.name,
        },
        token: await generateJWT(user.id, user.publicId, user.email),
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = AuthController;
