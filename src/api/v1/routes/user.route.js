const express = require("express");
const { UserController } = require("../controllers");
const { registerValidationRules } = require("../validations/user.validation");
const { validation } = require("../middlewares");

const router = express.Router();

router.post(
  "/register",
  registerValidationRules(),
  validation,
  UserController.register
);

module.exports = router;
