const genericCrud = require('./generic.controller');
const { User } = require('../model');
const userService = require('../service/user.service');
const { validationResult, body } = require('express-validator');
const ApiError = require('../exceptions/api.error');


module.exports = {
  ...genericCrud(User),
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации. ', errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      const time = 30 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', userData.refreshToken, { maxAge: time, httpOnly: true });
      return res.status(200).send(userData);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      console.log('login');
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      const time = 30 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', userData.refreshToken, {
        domain: '',
        maxAge: time,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false
      });

      return res.status(200).send(userData);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).send(token);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async activate({ params }, res, next) {
    try {
      const activationLink = params.link;
      await userService.activate(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}/registration/activated`);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async refresh({ cookies: { refreshToken } }, res, next) {
    try {
      const userData = await userService.refresh(refreshToken);
      console.log('refresh');

      const time = 30 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', userData.refreshToken, { maxAge: time, httpOnly: true });

      return res.status(200).send(userData);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async delete({ body: { email } }, res, next) {
    try {
      const response = await userService.delete(email);
      return res.status(200).send(response);

    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).send(users);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { email, userData } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации.', errors.array()));
      }

      if (!Object.keys(userData).length) {
        return res.status(400).ApiError.BadRequest('Ошибка обновления данных пользователя: Поля пустые');
      }

      const updatedUser = await userService.updateUserData(email, userData);
      res.status(200).send(updatedUser);
    } catch (err) {
      console.log(err);
      next(err)
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { email } = req.body;

    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}