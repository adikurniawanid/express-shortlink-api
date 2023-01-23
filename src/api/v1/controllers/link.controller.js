("use strict");
const shortUniqueId = require("short-unique-id");
const { Link } = require("../models");
const { validateUrl } = require("../helpers");
const { Op } = require("sequelize");
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

      if (link) {
        await Link.increment("clicks", {
          by: 1,
          where: {
            id: link.id,
          },
        });

        return res.redirect(link.originalUrl);
      } else {
        throw {
          status: 404,
          message: {
            en: "Shortlink Not Found",
            id: "Shortlink tidak ditemukan",
          },
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const links = await Link.findAll({
        attributes: [
          "title",
          "shortUrl",
          "customUrl",
          "originalUrl",
          "clicks",
          "createdAt",
          "updatedAt",
        ],
        where: {
          userId: req.user.id,
        },
      });

      if (links.length > 0) {
        res.status(200).json({
          message: {
            en: "Links retrieved successfully",
            id: "Link berhasil diambil",
          },
          data: links,
        });
      } else {
        throw {
          status: 404,
          message: {
            en: "Link List Not Found",
            id: "Daftar Link tidak ditemukan",
          },
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async short(req, res, next) {
    try {
      const { title, originalUrl, customUrl } = req.body;

      if (validateUrl(originalUrl)) {
        const shortUrl = new shortUniqueId({ length: 6 });
        const shortlink = await Link.create({
          title,
          originalUrl,
          customUrl,
          shortUrl: shortUrl(),
          userId: req.user.id,
        });

        res.status(201).json({
          message: {
            en: "Shortlink created successfully",
            id: "Shortlink berhasil dibuat",
          },
          data: {
            originalUrl: shortlink.originalUrl,
            shortUrl: shortlink.shortUrl,
          },
        });
      } else {
        throw {
          status: 422,
          message: {
            en: "Invalid original Url",
            id: "original Url tidak valid",
          },
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { shortUrl } = req.body;

      const link = await Link.findOne({
        where: {
          shortUrl,
        },
      });

      if (link && link.userId === req.user.id) {
        await Link.destroy({
          where: {
            shortUrl,
            userId: req.user.id,
          },
        });

        res.status(200).json({
          message: {
            en: "Shortlink deleted successfully",
            id: "Shortlink berhasil dihapus",
          },
        });
      } else {
        throw {
          status: 404,
          message: {
            en: "Shortlink Not Found",
            id: "Shortlink tidak ditemukan",
          },
        };
      }
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

      if (link) {
        await Link.update(
          {
            customUrl,
            title,
          },
          {
            where: {
              id: link.id,
            },
          }
        );

        res.status(200).json({
          message: {
            en: "Custom URL created successfully",
            id: "Custom URL berhasil dibuat",
          },
        });
      } else {
        throw {
          status: 404,
          message: {
            en: "Shortlink Not Found",
            id: "Shortlink tidak ditemukan",
          },
        };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LinkController;
