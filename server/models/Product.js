const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    Category: String,
    userId: String,
    small: String,
    medium: String,
    large: String,
    extraLarge: String,
    Price: Number,
    TotalPrice: Number, // This field will be updated in the pre-save hook
    Quantity: Number,
    itemName: String,
    itemCode: String,
    imageURL: String,
    companyName: String,
    deliveryDate: { type: Date }, // Added delivery date field
    date: { type: Date, default: Date.now }
});

// Pre-save hook to calculate TotalPrice based on quantities and price
ProductSchema.pre('save', function (next) {
    // Convert sizes to numbers for calculations
    const smallQty = parseInt(this.small) || 0;
    const mediumQty = parseInt(this.medium) || 0;
    const largeQty = parseInt(this.large) || 0;
    const extraLargeQty = parseInt(this.extraLarge) || 0;

    // Calculate total quantity and total price
    const totalQuantity = smallQty + mediumQty + largeQty + extraLargeQty;
    this.TotalPrice = totalQuantity * (this.Price || 0); // Calculate TotalPrice

    // Update Quantity field if needed
    this.Quantity = totalQuantity; // You can keep this if you want to store total quantity
    next();
});

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
