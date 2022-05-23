const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
        required: true
      }
    }
  ],
})

module.exports = model("Cart", schema);