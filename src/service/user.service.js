const { User, Cart, Order, Wishlist } = require("../model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/api.error');

class UserService {
  async registration(email, password) {
    // check whether candidat has already been created before
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    // hashing password and create activational link
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    // creating user and sending activational link to his email
    const user = await User.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v1/authentication/activate/${activationLink}`);

    // creating user cart and wishlist
    const cart = await Cart.create({ user: user._id });
    const wishlist = await Wishlist.create({ user: user._id });
    const finalUser = await User.findByIdAndUpdate(user.id, { cart: cart._id, wishlist: wishlist._id }, { new: true });

    // creating user data, generating tokens and saving them into DB
    const userDto = new UserDto(finalUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некоректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      if (!userData) console.log("userData");
      if (!tokenFromDb) console.log("tokenFromDb");
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }
  }

  // Проверочная функция на наличие доступа к определенным действиям
  async getAllUsers() {
    const users = await User.find();
    return users;
  };

  async delete(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Ошибка удаления пользователя: Пользователь не найден');
    }

    const cart = await Cart.findById(user.cart._id);
    if (!cart) {
      throw ApiError.BadRequest('Ошибка удаления карзины: Корзина не найдена');
    }

    const deletedUser = await User.findOneAndDelete({ email });
    const deletedCart = await Cart.findByIdAndDelete(user.cart);
    console.log({ deletedUser, deletedCart });

    return { deletedUser, deletedCart };
  }

  async updateUserData(email, userData) {
    const user = User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Ошибка обновления данных пользователя: Пользователь не найден');
    }

    if ("email" in userData) {
      const newActivationLink = uuid.v4();
      await User.findOneAndUpdate({ email }, { activationLink: newActivationLink, isActivated: false });
      await mailService.sendActivationMail(userData.email, `${process.env.API_URL}/api/v1/authentication/activate/${newActivationLink}`);
    }

    const updatedUser = User.findOneAndUpdate({ email }, userData, { new: true });
    if (!updatedUser) {
      throw ApiError.BadRequest("Ошибка обновления данных пользователя: Обновить не удалось");
    }

    return updatedUser;
  }

};

module.exports = new UserService();