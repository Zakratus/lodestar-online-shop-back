const { Cart, Product } = require('../model');
const { ObjectId } = require('mongodb');
const ApiError = require('../exceptions/api.error');


class CartService {
  async incrementProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw ApiError.BadRequest('Корзина не найдена')
    }

    let newProducts = [...cart.products];
    newProducts.map(item => {
      if (String(item.product) === String(new ObjectId(productId))) {
        item.quantity += 1;
      }
    })

    const newCart = await Cart.findByIdAndUpdate(cartId, { products: newProducts }, { new: true })
      .populate('products.product');
    if (!newCart) {
      throw ApiError.ServerError('Товар не был добавлен в корзину');
    }

    return newCart.products;
  }

  async decrementProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw ApiError.BadRequest('Корзина не найдена')
    }

    let newProducts = [...cart.products];

    newProducts.map(item => {
      if (String(item.product) === String(new ObjectId(productId))) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    })

    const newCart = await Cart.findByIdAndUpdate(cartId, { products: newProducts }, { new: true })
      .populate('products.product');
    if (!newCart) {
      throw ApiError.ServerError('Товар не был добавлен в корзину');
    }

    return newCart.products;
  }

  async addProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw ApiError.BadRequest('Корзина не найдена');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.BadRequest('Товар не найден');
    }

    let newProducts = [...cart.products];
    if (newProducts.length) {
      let isProductExsist = false;

      newProducts.map(item => {
        if (String(item.product) === String(new ObjectId(productId))) {
          isProductExsist = true;
          item.quantity += 1;
        }
      })

      if (!isProductExsist) {
        newProducts.push({ product: new ObjectId(productId), quantity: 1 });
      }
    } else {
      newProducts.push({ product: new ObjectId(productId), quantity: 1 });
    }

    const newCart = await Cart.findByIdAndUpdate(cartId, { products: newProducts }, { new: true })
      .populate('products.product');
    if (!newCart) {
      throw ApiError.ServerError('Товар не был добавлен в корзину');
    }

    return newCart.products;
  }

  async deleteProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw ApiError.BadRequest('Корзина не найдена');
    }

    let newCartProducts = [...cart.products];

    newCartProducts = newCartProducts.filter(item => {
      return !(String(item.product) === String(new ObjectId(productId)));
    })
    console.log(newCartProducts);

    const newCart = await Cart.findByIdAndUpdate(cartId, { products: newCartProducts }, { new: true })
      .populate('products.product');
    if (!newCart) {
      throw ApiError.ServerError('Товар не был удален из корзины');
    }

    return newCart.products;
  }
}

module.exports = new CartService;
