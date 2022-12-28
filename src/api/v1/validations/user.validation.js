"use strict";
const { body } = require("express-validator");
const { User } = require("../models");

const registerValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .bail()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .custom(async (email) => {
        if (
          await User.findOne({
            where: {
              email,
            },
          })
        ) {
          return Promise.reject("Email already in use");
        }
      }),
    body("password")
      .notEmpty()
      .bail()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("Password must between 8 - 21 characters"),
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ max: 255 })
      .withMessage("name must be less than 255 characters"),
  ];
};

module.exports = {
  registerValidationRules,
};
