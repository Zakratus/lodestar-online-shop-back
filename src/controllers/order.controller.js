const genericCrud = require('./generic.controller');
const { Order } = require('../model');
const boom = require('boom');
const OrderService = require('../service/order.service');
const MailService = require("../service/mail.service");

module.exports = {
  ...genericCrud(Order),
  async getAllByUser({ params: { userId } }, res) {
    try {
      const orders = await OrderService.getAllOrdersByUser(userId);

      return res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  },
  async createOrder({ body: { userId, products, orderData, userData } }, res) {
    try {
      const order = await OrderService.createOrder(userId, products, orderData, userData);
      const updatedUser = await OrderService.addOrderToUserHistory(userId, order._id);

      await MailService.sendOrderMail(products, orderData, userData);

      return res.status(200).send(updatedUser);

    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  },
  async deleteOrder({ body: { userId, orderId } }, res) {

  }
}