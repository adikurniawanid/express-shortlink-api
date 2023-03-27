"use strict";
const { body } = require("express-validator");
const { Link } = require("../models");

const createShortLinkValidationRules = () => {
  return [
    body("customUrl")
      .optional()
      .custom(async (customUrl) => {
        if (
          await Link.findOne({
            where: {
              customUrl,
            },
          })
        ) {
          return Promise.reject("Custom Url already in use");
        }
      }),
  ];
};

const updateCustomURLValidationRules = () => {
  return [
    body("customUrl")
      .notEmpty()
      .bail()
      .withMessage("Custom Url is required")
      .custom(async (customUrl) => {
        if (
          await Link.findOne({
            where: {
              customUrl,
            },
          })
        ) {
          return Promise.reject("Custom Url already in use");
        }
      }),
  ];
};

module.exports = {
  createShortLinkValidationRules,
  updateCustomURLValidationRules,
};
