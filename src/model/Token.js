const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  refreshToken: {
    type: String,
    required: true
  }
})

module.exports = model('Token', schema);