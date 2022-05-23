const ApiError = require('../exceptions/api.error');
const { Order, User } = require('../model');
const { ObjectId } = require('mongodb');
const UserDto = require('../dtos/user.dto');

class OrderService {
  async createOrder(userId, products, orderData, userData) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден');
    }

    const productsObjectIds = products.map(item => {
      return {
        product: new ObjectId(item.product._id),
        quantity: item.quantity
      }
    });

    const order = await Order.create({
      user: new ObjectId(userId),
      products: productsObjectIds,
      orderData,
      userData,
    });
    if (!order) {
      throw ApiError.ServerError('Не удалось создать заказ');
    }

    return order;
  }

  async getAllOrdersByUser(userId) {
    const user = await User.findById(userId).populate("history");
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден');
    }

    return [...user.history];
  }


  async addOrderToUserHistory(userId, orderId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.BadRequest('Ошибка добавления заказа: Пользователь не найдет');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.BadRequest('Ошибка добавления заказа: Заказ не найден');
    }

    const newHistoryList = [...user.history, new ObjectId(orderId)];
    const newUser = await User.findByIdAndUpdate(userId, { history: newHistoryList }, { new: true }).populate('history');
    if (!newUser) {
      throw ApiError.ServerError('Ошибка добавления заказа: Не удалось обновить заказы пользователя');
    }

    const userDto = new UserDto(newUser);
    return userDto;
  }
}

module.exports = new OrderService();