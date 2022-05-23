const { model, Schema, Schema: { Types: { ObjectId, Decimal128 } } } = require('mongoose');

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  orderData: {
    time: {
      type: Date,
      default: Date.now()
    },
    totalCost: {
      type: Number,
      default: 0.00
    },
    itemsQuantity: {
      type: Number,
      default: 1
    }
  },
  userData: {
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
  }
})

module.exports = model('Order', schema);