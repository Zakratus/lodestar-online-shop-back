const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    default: '',
    required: true
  },
  urlName: {
    type: String,
    default: "",
    required: true
  },
  sign: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    defalut: ''
  }
})

module.exports = model('Specification', schema);