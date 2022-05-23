const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  products: [
    {
      type: ObjectId,
      ref: "Product",
    },
  ],
})

module.exports = model('Wishlist', schema);