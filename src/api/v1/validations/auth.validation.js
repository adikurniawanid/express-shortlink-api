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

const loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .bail()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password")
      .notEmpty()
      .bail()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("Password must between 8 - 21 characters"),
  ];
};

const forgotPasswordValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .bail()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
  ];
};

const verifyforgotPasswordTokenValidationRules = () => {
  return [
    body("token").notEmpty().bail().withMessage("Token is required"),
    body("email")
      .notEmpty()
      .bail()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
  ];
};

const changeForgotPasswordValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .bail()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("newPassword")
      .notEmpty()
      .bail()
      .withMessage("New password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("New password must between 8 - 21 characters"),
    body("verificationPassword")
      .notEmpty()
      .bail()
      .withMessage("Verification password is required")
      .isLength({ min: 8, max: 21 })
      .withMessage("Verification password must between 8 - 21 characters"),
    body("token").notEmpty().bail().withMessage("Token is required"),
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  verifyforgotPasswordTokenValidationRules,
  changeForgotPasswordValidationRules,
};
