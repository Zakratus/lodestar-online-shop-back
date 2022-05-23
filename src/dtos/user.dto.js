module.exports = class UserDto {
  email;
  id;
  isActivated;
  cart;
  wishlist;
  history;
  name;
  surname;
  phone;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.cart = model.cart;
    this.wishlist = model.wishlist;
    this.history = model.history;
    this.name = model.name;
    this.surname = model.surname;
    this.phone = model.phone;
  }
}