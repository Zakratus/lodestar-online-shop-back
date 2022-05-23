const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  },
  products: [
    {
      type: ObjectId,
      ref: "Product"
    }
  ]
})

module.exports = model('Category', schema);