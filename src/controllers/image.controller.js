const genericCrud = require('./generic.controller');
const { Image } = require('../model');

module.exports = {
  ...genericCrud(Image)
}