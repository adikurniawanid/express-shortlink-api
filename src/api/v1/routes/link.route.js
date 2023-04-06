const express = require('express');
const { LinkController } = require('../controllers');
const { authorization, validation } = require('../middlewares');
const {
  updateCustomURLValidationRules,
  createShortLinkValidationRules,
} = require('../validations/link.validation');

const router = express.Router();

router.get('/:shortUrl', authorization, LinkController.get);
router.get('/', authorization, LinkController.list);
router.post(
  '/short',
  authorization,
  createShortLinkValidationRules(),
  validation,
  LinkController.short,
);
router.delete('/:shortUrl', authorization, LinkController.delete);
router.put(
  '/',
  authorization,
  updateCustomURLValidationRules(),
  validation,
  LinkController.update,
);

module.exports = router;
