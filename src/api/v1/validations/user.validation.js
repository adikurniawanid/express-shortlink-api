"use strict";
const { body } = require("express-validator");

const updatePasswordValidationRules = () => {
  return [
    body("oldPassword")
      .notEmpty()
      .bail()
      .withMessage("Old password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("Old password must between 8 - 21 characters"),
    body("verificationPassword")
      .notEmpty()
      .bail()
      .withMessage("Verification password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("Verification password must between 8 - 21 characters"),
    body("newPassword")
      .notEmpty()
      .bail()
      .withMessage("New password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("New password must between 8 - 21 characters"),
  ];
};

module.exports = {
  updatePasswordValidationRules,
};
