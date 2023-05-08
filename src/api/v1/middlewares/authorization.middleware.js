const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../../../config/jwt.config');

const { TokenExpiredError } = jwt;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      next({
        status: 403,
        message: { en: 'No token provided!', id: 'tidak ada token!' },
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    const { publicId } = decoded;
    const { email } = decoded;
    const selectedUser = await User.findOne({
      attributes: ['id'],
      where: {
        publicId,
        email,
      },
    });

    if (!selectedUser) {
      next({
        status: 401,
        message: { en: 'Unauthorized User', id: 'Pengguna tidak diizinkan' },
      });
    }

    req.user = selectedUser;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        message: {
          en: 'Unauthorized! Access Token was expired!',
          id: 'Pengguna tidak diizinkan! Token akses kadaluarsa',
        },
      });
    }

    next(error);
  }
};
