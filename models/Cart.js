import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  cart_items: {
    type: Array,
    required: true
  },
  cart_total_cost: {
    type: Number,
    required: true
  }
})

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;