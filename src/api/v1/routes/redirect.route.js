"use strict";
const express = require("express");
const { LinkController } = require("../controllers");

const router = express.Router();

router.get("/:shortUrlParam", LinkController.redirect);

module.exports = router;
