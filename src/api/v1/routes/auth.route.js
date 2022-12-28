"use strict";
const express = require("express");
const { AuthController } = require("../controllers");
const { loginValidationRules } = require("../validations/auth.validation");
const { validation } = require("../middlewares");

const router = express.Router();

router.post("/login", loginValidationRules(), validation, AuthController.login);

module.exports = router;
