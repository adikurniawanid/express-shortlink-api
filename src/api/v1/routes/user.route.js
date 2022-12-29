"use strict";
const express = require("express");
const { UserController } = require("../controllers");
const {
  updatePasswordValidationRules,
} = require("../validations/user.validation");
const { validation, authorization } = require("../middlewares");

const router = express.Router();

router.get("/me", authorization, UserController.get);
router.put(
  "/update-password",
  authorization,
  updatePasswordValidationRules(),
  validation,
  UserController.updatePassword
);

module.exports = router;
