"use strict";
const express = require("express");
const { AuthController } = require("../controllers");
const {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  verifyforgotPasswordTokenValidationRules,
  changeForgotPasswordValidationRules,
} = require("../validations/auth.validation");
const { validation } = require("../middlewares");

const router = express.Router();
router.post(
  "/register",
  registerValidationRules(),
  validation,
  AuthController.register
);

router.post("/login", loginValidationRules(), validation, AuthController.login);
router.post(
  "/forgot-password",
  forgotPasswordValidationRules(),
  validation,
  AuthController.sendForgotPasswordToken
);

router.post(
  "/verify-forgot-password-token",
  verifyforgotPasswordTokenValidationRules(),
  validation,
  AuthController.verifyForgotPasswordToken
);

router.post(
  "/change-forgot-password",
  changeForgotPasswordValidationRules(),
  validation,
  AuthController.changeForgotPassword
);

module.exports = router;
