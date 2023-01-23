"use strict";
const express = require("express");
const { LinkController } = require("../controllers");
const { authorization } = require("../middlewares");
const {
  updateCustomURLValidationRules,
  createShortLinkValidationRules,
} = require("../validations/link.validation");
const { validation } = require("../middlewares");
const router = express.Router();

router.get("/", authorization, LinkController.list);
router.post(
  "/short",
  authorization,
  createShortLinkValidationRules(),
  validation,
  LinkController.short
);
router.delete("/", authorization, LinkController.delete);
router.put(
  "/",
  authorization,
  updateCustomURLValidationRules(),
  validation,
  LinkController.update
);

module.exports = router;
