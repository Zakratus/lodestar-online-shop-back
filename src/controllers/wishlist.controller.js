const genericCrud = require('./generic.controller');
const { Wishlist } = require('../model');
const boom = require('boom');
const WishlistService = require('../service/wishlist.service');
const ApiError = require('../exceptions/api.error');


module.exports = {
  ...genericCrud(Wishlist),
  async getList({ params: { id } }, res) {
    try {
      const wishlist = await Wishlist.findById(id).populate("products");
      if (!wishlist) {
        throw ApiError.BadRequest('Список избанных товров не найден');
      }

      return res.status(200).send(wishlist);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  },

  async addItemToList({ body: { listId, itemId } }, res) {
    try {
      const newWishlist = await WishlistService.addItemToWishlist(listId, itemId);

      console.log("addItemToList");
      return res.status(200).send(newWishlist);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  },

  async removeItemFromWishlist({ body: { listId, itemId } }, res) {
    try {
      const newWishlist = await WishlistService.removeItemFromWishlist(listId, itemId);

      console.log("removeItemFromWishlist");
      return res.status(200).send(newWishlist);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  },

  async removeAllItemsFromWishlist({ body: { listId } }, res) {
    try {
      const newWishlist = await Wishlist.findByIdAndUpdate(listId, { products: [] }, { new: true });
      if (!newWishlist) {
        throw ApiError.BadRequest('Данный список обновить не удалось');
      }

      console.log("removeAllItemsFromWishlist");
      return res.status(200).send(newWishlist);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err));
    }
  }


}