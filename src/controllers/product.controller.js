const genericCrud = require('./generic.controller');
const { Product } = require('../model');
const boom = require('boom');
const ProductService = require('../service/product.service');


module.exports = {
  ...genericCrud(Product),
  async get({ params: { article } }, res) {
    try {
      const fixedArticle = article.split("_").join("/");
      const item = await Product.findOne({ article: fixedArticle }).populate("specifications.specObj");
      console.log("get");

      return res.status(200).send(item);
    } catch (err) {
      return res.status(400).send(boom.boomify(err));
    }
  },
  async getAll(req, res) {
    try {
      const items = await Product.find().populate("specifications.specObj");

      return res.status(200).send(items);
    } catch (err) {
      return res.status(400).send(boom.boomify(err));
    }
  },
  async getAllByCategory({ params: { category } }, res) {
    try {
      const products = await Product.find({ category })
        .populate("specifications.specObj");
      console.log('getAllByCategory');

      return res.status(200).send(products);
    } catch (err) {
      return res.status(400).send(boom.boomify(err));
    }
  },
  async getAllBySearch({ query }, res) {
    try {
      const products = await ProductService.getSearchedProducts(query);
      console.log('getAllBySearch');

      return res.status(200).send(products);
    } catch (err) {
      return res.status(400).send(boom.boomify(err));
    }
  },

  async getFilteredProducts({ query }, res) {
    try {
      const mongooseQueries = await ProductService.getMongooseQueries(query);
      const products = await ProductService.getfilteredProducts(mongooseQueries);

      return res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(400).send(boom.boomify(err))
    }
  }
}