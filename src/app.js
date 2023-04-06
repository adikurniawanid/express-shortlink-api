const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { errorHandler, errorLogger, failSafeHandler } = require('./api/v1/middlewares');
const {
  userRouter,
  authRouter,
  linkRouter,
  redirectRouter,
} = require('./api/v1/routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use('/', redirectRouter);
app.use('/v1/user', userRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/link', linkRouter);
app.use(errorLogger);
app.use(errorHandler);
app.use(failSafeHandler);

module.exports = app;
