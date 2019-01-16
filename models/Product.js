import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	inventory_count: {
		type: Number,
		required: true
	}
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
