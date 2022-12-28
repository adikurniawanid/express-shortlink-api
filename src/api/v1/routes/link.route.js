"use strict";
const express = require("express");
const { LinkController } = require("../controllers");
const { authorization } = require("../middlewares");

const router = express.Router();

router.post("/short", authorization, LinkController.short);

module.exports = router;
