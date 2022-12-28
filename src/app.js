"use strict";
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const { errorHandler } = require("./api/v1/middlewares");
const { userRouter, authRouter } = require("./api/v1/routes");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.use("/v1/user", userRouter);
app.use("/v1/auth", authRouter);
app.use(errorHandler);

module.exports = app;
