"use strict";
const express = require("express");
const { LinkController } = require("../controllers");
const { authorization } = require("../middlewares");
// const { registerValidationRules } = require("../validations/user.validation");
// const { validation } = require("../middlewares");

const router = express.Router();

router.post(
  "/short",
  authorization,
  // registerValidationRules(),
  // validation,
  LinkController.short
);

module.exports = router;
