const { model, Schema, Schema: { Types: { ObjectId, Mixed } } } = require('mongoose');

const schema = new Schema({
  images: [
    {
      type: ObjectId,
      ref: 'Image'
    }
  ],
  name: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 1.00
  },
  brand: {
    type: String,
    default: ''
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  series: {
    type: String,
    default: ''
  },
  subseries: {
    type: String,
    default: ''
  },
  article: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  specifications: [
    {
      specObj: {
        type: ObjectId,
        ref: "Specification"
      },
      specValue: {
        type: Mixed,
        default: ''
      }
    }
  ],
  available: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 1
  }
})

module.exports = model('Product', schema);