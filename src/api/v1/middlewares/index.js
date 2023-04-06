const errorHandler = require('./errorHandler.middleware');
const validation = require('./validation.middleware');
const authorization = require('./authorization.middleware');
const errorLogger = require('./errorLogger.middleware');
const failSafeHandler = require('./failSafeHandler.middleware');

module.exports = {
  errorHandler,
  validation,
  authorization,
  errorLogger,
  failSafeHandler,
};
