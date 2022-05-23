const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  }
})

module.exports = model('Image', schema);