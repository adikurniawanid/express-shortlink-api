"use strict";
const express = require("express");
const { AuthController } = require("../controllers");
const {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  verifyforgotPasswordTokenValidationRules,
  changeForgotPasswordValidationRules,
  loginWithGoogleValidationRules,
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
  "/login-with-google",
  loginWithGoogleValidationRules(),
  validation,
  AuthController.loginWithGoogle
);
router.post(
  "/forgot-password",
  forgotPasswordValidationRules(),
  validation,
  AuthController.sendForgotPasswordToken
);

router.post(
  "/forgot-password/verify-token",
  verifyforgotPasswordTokenValidationRules(),
  validation,
  AuthController.verifyForgotPasswordToken
);

router.post(
  "/forgot-password/change-password",
  changeForgotPasswordValidationRules(),
  validation,
  AuthController.changeForgotPassword
);

module.exports = router;
