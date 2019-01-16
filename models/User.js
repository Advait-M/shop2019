import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    type: Object,
    required: true,
    cart_items: {
      type: Array,
      required: true
    },
    cart_total: {
      type: Number,
      required: true
    }
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
