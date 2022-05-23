const genericCrud = require('./generic.controller');
const { Category } = require('../model');
const boom = require('boom');

module.exports = {
  ...genericCrud(Category),
  async getAll(req, res) {
    try {
      const items = await Category.find().populate('products');
      return res.status(200).send(items);

    } catch (err) {
      return res.status(400).send(boom.boomify(err));
    }
  },
}