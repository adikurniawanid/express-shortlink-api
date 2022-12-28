"use strict";
const express = require("express");
const { UserController } = require("../controllers");
const {
  registerValidationRules,
  updatePasswordValidationRules,
} = require("../validations/user.validation");
const { validation, authorization } = require("../middlewares");

const router = express.Router();

router.post(
  "/register",
  registerValidationRules(),
  validation,
  UserController.register
);

router.put(
  "/update-password",
  authorization,
  updatePasswordValidationRules(),
  validation,
  UserController.updatePassword
);

module.exports = router;
