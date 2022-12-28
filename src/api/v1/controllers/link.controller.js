("use strict");
const shortUniqueId = require("short-unique-id");
const { Link } = require("../models");

const { validateUrl } = require("../helpers");

class LinkController {
  static async short(req, res, next) {
    try {
      const { originalUrl } = req.body;

      if (validateUrl(originalUrl)) {
        const shortUrl = new shortUniqueId({ length: 6 });
        console.log("shortUrl", shortUrl);
        const shortlink = await Link.create({
          originalUrl,
          shortUrl: shortUrl(),
          userId: req.user.id,
        });

        res.status(201).json({
          message: "Shortlink created successfully",
          data: {
            originalUrl: shortlink.originalUrl,
            shortUrl: shortlink.shortUrl,
          },
        });
      } else {
        throw {
          status: 422,
          message: "Invalid original Url",
        };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LinkController;
