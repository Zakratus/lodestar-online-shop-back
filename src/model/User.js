const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false,
    required: true
  },
  activationLink: {
    type: String,
  },
  cart: {
    type: ObjectId,
    ref: "Cart"
  },
  wishlist: {
    type: ObjectId,
    ref: "Wishlist"
  },
  history: [
    {
      type: ObjectId,
      ref: "Order"
    }
  ],
  name: {
    type: String,
    default: ''
  },
  surname: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: "+38"
  },
})

module.exports = model('User', schema);