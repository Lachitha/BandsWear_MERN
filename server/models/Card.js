const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId for MongoDB references
			required: true,
			ref: "User", // Assuming you have a User model to reference
		},
		cardName: {
			type: String,
			required: true,
		},
		cardNumber: {
			type: String,
			required: true,
			unique: true,
			// Validate that cardNumber is a 16-digit number
			validate: {
				validator: function (v) {
					return /^\d{16}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid card number!`,
			},
		},
		expMonth: {
			type: Number,
			required: true,
			min: 1,
			max: 12,
		},
		expYear: {
			type: Number,
			required: true,
			min: 0,
		},
		cvv: {
			type: String,
			required: true,
			// Validate that CVV is 3 or 4 digits
			validate: {
				validator: function (v) {
					return /^\d{3,4}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid CVV!`,
			},
		},
		savePaymentDetails: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);
