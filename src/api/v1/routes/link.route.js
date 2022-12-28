"use strict";
const express = require("express");
const { LinkController } = require("../controllers");
const { authorization } = require("../middlewares");

const router = express.Router();

router.get("/", authorization, LinkController.list);
router.post("/short", authorization, LinkController.short);
router.delete("/", authorization, LinkController.delete);

module.exports = router;
