const ApiError = require('../exceptions/api.error');
const tokenService = require("../service/token.service");
const { validationResult, body } = require('express-validator');

module.exports = async function (req, res, next) {
  try {
    if (!(Object.keys(req.body.userData).includes('email'))) {
      return next();
    }

    await body("userData.email").isEmail().withMessage("Некоректный e-mail.").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка валидации. ', errors.array()));
    }

    next();

  } catch (err) {
    return next(ApiError.BadRequest());
  }
}