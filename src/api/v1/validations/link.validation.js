const { body } = require('express-validator');
const { Link } = require('../models');

const createShortLinkValidationRules = () => [
  body('customUrl')
    .optional()
    .custom(async (customUrl) => {
      if (
        await Link.findOne({
          where: {
            customUrl,
          },
        })
      ) {
        throw new Error('Custom Url already in use');
      }
    }),
];

const updateCustomURLValidationRules = () => [
  body('customUrl')
    .notEmpty()
    .bail()
    .withMessage('Custom Url is required')
    .custom(async (customUrl) => {
      if (
        await Link.findOne({
          where: {
            customUrl,
          },
        })
      ) {
        throw new Error('Custom Url already in use');
      }
    }),
];

module.exports = {
  createShortLinkValidationRules,
  updateCustomURLValidationRules,
};
