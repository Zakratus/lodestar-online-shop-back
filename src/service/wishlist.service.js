const ApiError = require('../exceptions/api.error');
const { Wishlist, Product } = require('../model');
const { ObjectId } = require('mongodb');

class WishlistService {
  async addItemToWishlist(listId, itemId) {
    const product = await Product.findById(itemId);
    if (!product) {
      throw ApiError.BadRequest("Товар не найден.")
    }

    const wishlist = await Wishlist.findById(listId).populate("products");
    if (!wishlist) {
      throw ApiError.BadRequest("Список избранных не найден.")
    }

    let newProductsArray = [...wishlist.products];
    if (newProductsArray.find(product => String(product._id) === String(itemId))) {
      return wishlist;
    }

    newProductsArray = [...newProductsArray, new ObjectId(itemId)];
    const newWishlist = await Wishlist
      .findByIdAndUpdate(listId, { products: newProductsArray }, { new: true })
      .populate('products');
    if (!newWishlist) {
      throw ApiError.ServerError('Не удалось обновить список избанного.')
    }

    return newWishlist;
  }

  async removeItemFromWishlist(listId, itemId) {
    const product = await Product.findById(itemId);
    if (!product) {
      throw ApiError.BadRequest("Товар не найден.")
    }

    const wishlist = await Wishlist.findById(listId).populate('products');
    if (!wishlist) {
      throw ApiError.BadRequest("Список избранных не найден.")
    }

    let newProductsArray = [...wishlist.products];

    if (!newProductsArray.find(product => String(product._id) === String(itemId))) {
      return wishlist
    }

    newProductsArray = newProductsArray.filter(product => String(product._id) !== String(itemId));
    const newWishlist = await Wishlist
      .findByIdAndUpdate(listId, { products: newProductsArray }, { new: true })
      .populate('products');
    if (!newWishlist) {
      throw ApiError.ServerError('Не удалось обновить список избанного.')
    }

    return newWishlist;
  }
}

module.exports = new WishlistService();