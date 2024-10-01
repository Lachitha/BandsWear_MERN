const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	products: [
		{
			productId: { type: String, required: true },
			itemName: { type: String, required: true },
			category: { type: String, required: true },
			price: { type: Number, required: true },
			quantity: { type: Number, required: true },
			imgUrl: { type: String },
			unitPrice: { type: Number, required: true },
		},
	],
	totalPrice: { type: Number, required: true },
	orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("OrderSchema", OrderSchema);

module.exports = Order;
