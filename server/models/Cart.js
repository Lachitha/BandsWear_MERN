const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: String,        // User ID as a string
    itemId: String,        // Item ID as a string
    itemName: String,      // Name of the item
    itemCode: String,      // Code of the item
    category: String,      // Category of the item
    unitPrice: Number,
    price: Number,         // Total price
    size: String,          // Size of the item
    quantity: Number,      // Quantity of the item
    imgUrl: String,
    createdAt: {
        type: Date,
        default: Date.now   // Automatically set to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now    // Automatically set to current date
    }
});

// Middleware to update `updatedAt` before saving
CartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;
