"use strict";
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      message: {
        en: "Validation failed, entered data is incorrect.",
        id: "Validasi gagal, data yang dimasukkan salah.",
      },
      errors: errors.array(),
    });
    return;
  }
  return next();
};
