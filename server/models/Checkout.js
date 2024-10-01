const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming you have a User model
	email: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	address: { type: String, required: true },
	postalCode: { type: String, required: true },
	phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("Checkout", CheckoutSchema);
