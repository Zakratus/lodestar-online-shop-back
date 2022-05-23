const genericCrud = require('./generic.controller');
const { Cart } = require('../model');
const { boomify } = require('boom');
const CartService = require("../service/cart.service");
const ApiError = require('../exceptions/api.error');

module.exports = {
  ...genericCrud(Cart),
  async get({ params: { id } }, res) {
    try {
      const item = await Cart.findById(id)
        .populate("products.product");

      return res.status(200).send(item);

    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  },
  async incrementProduct({ body: { cartId, productId } }, res) {
    try {
      const newCartProducts = await CartService.incrementProduct(cartId, productId);

      return res.status(200).send(newCartProducts);

    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  },
  async decrementProduct({ body: { cartId, productId } }, res) {
    try {
      const newCartProducts = await CartService.decrementProduct(cartId, productId);

      return res.status(200).send(newCartProducts);

    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  },
  async deleteProduct({ body: { cartId, productId } }, res) {
    try {
      const newCartProducts = await CartService.deleteProduct(cartId, productId);

      return res.status(200).send(newCartProducts);

    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  },
  async addProduct({ body: { cartId, productId } }, res) {
    try {
      const newCart = await CartService.addProduct(cartId, productId);

      res.status(200).send(newCart);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  },
  async deleteAllProducts({ body: { cartId } }, res) {
    try {
      const newCart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
      if (!newCart) {
        throw ApiError.BadRequest('Ошибка удаления товаров из корзины: Корзина не найдена');
      }

      res.status(200).send(newCart.products);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boomify(err));
    }
  }
}