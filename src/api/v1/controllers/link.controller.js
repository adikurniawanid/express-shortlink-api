const ShortUniqueId = require('short-unique-id');
const { Op } = require('sequelize');
const { Link } = require('../models');
// const { validateUrl } = require('../helpers');

class LinkController {
  static async redirect(req, res, next) {
    try {
      const link = await Link.findOne({
        where: {
          [Op.or]: [
            { shortUrl: req.params.shortUrlParam },
            { customUrl: req.params.shortUrlParam },
          ],
        },
      });

      if (!link) {
        return next({
          status: 404,
          message: {
            en: 'Shortlink Not Found',
            id: 'Shortlink tidak ditemukan',
          },
        });
      }

      await Link.increment('clicks', {
        by: 1,
        where: {
          id: link.id,
        },
      });

      res.redirect(link.originalUrl);
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const link = await Link.findOne({
        attributes: [
          'title',
          'shortUrl',
          'customUrl',
          'originalUrl',
          'clicks',
          'createdAt',
          'updatedAt',
        ],
        where: {
          userId: req.user.id,
          shortUrl: req.params.shortUrl,
        },
      });

      if (!link) {
        next({
          status: 404,
          message: {
            en: 'Link Not Found',
            id: 'Link tidak ditemukan',
          },
        });
      }

      res.status(200).json({
        message: {
          en: 'Link retrieved successfully',
          id: 'Link berhasil diambil',
        },
        data: link,
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const links = await Link.findAll({
        attributes: [
          'title',
          'shortUrl',
          'customUrl',
          'originalUrl',
          'isFavorite',
          'clicks',
          'createdAt',
          'updatedAt',
        ],
        where: {
          userId: req.user.id,
        },
        order: [['isFavorite', 'DESC'], ['updatedAt', 'DESC']],
      });

      if (links.length > 0) {
        res.status(200).json({
          message: {
            en: 'Links retrieved successfully',
            id: 'Link berhasil diambil',
          },
          data: links,
        });
      } else {
        next({
          status: 404,
          message: {
            en: 'Link List Not Found',
            id: 'Daftar Link tidak ditemukan',
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async short(req, res, next) {
    try {
      const { title, originalUrl, customUrl } = req.body;

      // turn off validate originalUrl
      // if (!validateUrl(originalUrl)) {
      //   next({
      //     status: 422,
      //     message: {
      //       en: 'Invalid original Url',
      //       id: 'original Url tidak valid',
      //     },
      //   });
      // }

      const shortUrl = new ShortUniqueId({ length: 6 });
      const shortlink = await Link.create({
        title,
        originalUrl,
        customUrl,
        shortUrl: shortUrl(),
        userId: req.user.id,
      });

      res.status(201).json({
        message: {
          en: 'Shortlink created successfully',
          id: 'Shortlink berhasil dibuat',
        },
        data: {
          originalUrl: shortlink.originalUrl,
          shortUrl: shortlink.shortUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const link = await Link.findOne({
        where: {
          shortUrl: req.params.shortUrl,
          userId: req.user.id,
        },
      });

      if (!link) {
        next({
          status: 404,
          message: {
            en: 'Shortlink Not Found',
            id: 'Shortlink tidak ditemukan',
          },
        });
      }

      await Link.destroy({
        where: {
          shortUrl: req.params.shortUrl,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        message: {
          en: 'Shortlink deleted successfully',
          id: 'Shortlink berhasil dihapus',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { shortUrl, title, customUrl } = req.body;

      const link = await Link.findOne({
        where: {
          shortUrl,
          userId: req.user.id,
        },
      });

      if (!link) {
        next({
          status: 404,
          message: {
            en: 'Shortlink Not Found',
            id: 'Shortlink tidak ditemukan',
          },
        });
      }

      await Link.update(
        {
          customUrl,
          title,
        },
        {
          where: {
            id: link.id,
          },
        },
      );

      res.status(200).json({
        message: {
          en: 'Custom URL updated successfully',
          id: 'Custom URL berhasil diupdate',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async favorite(req, res, next) {
    try {
      const link = await Link.findOne({
        where: {
          shortUrl: req.params.shortUrl,
          userId: req.user.id,
        },
      });

      if (!link) {
        next({
          status: 404,
          message: {
            en: 'Shortlink Not Found',
            id: 'Shortlink tidak ditemukan',
          },
        });
      }

      await Link.update(
        {
          isFavorite: !link.isFavorite,
        },
        {
          where: {
            id: link.id,
          },
        },
      );

      res.status(200).json(
        !link.isFavorite
          ? {
            message: {
              en: 'Success Favorite Shortlink',
              id: 'Berhasil Favorit Shortlink',
            },
          }
          : {
            message: {
              en: 'Success Unfavorite Shortlink',
              id: 'Berhasil Batal Favorit Shortlink',
            },
          },
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LinkController;
