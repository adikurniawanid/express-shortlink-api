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
  '/',
  authorization,
  createShortLinkValidationRules(),
  validation,
  LinkController.short,
);
router.delete('/:shortUrl', authorization, LinkController.delete);
router.patch('/:shortUrl', authorization, LinkController.favorite);
router.put(
  '/',
  authorization,
  updateCustomURLValidationRules(),
  validation,
  LinkController.update,
);

module.exports = router;
