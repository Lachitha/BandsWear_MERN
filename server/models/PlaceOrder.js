const mongoose = require('mongoose');

// Define the Item Schema
const OrderSchema = new mongoose.Schema({
    category: {
      type: String,
      required: true,
      trim: true,
    },
    small: {
      type: Number,
      default: 0,
    },
    medium: {
      type: Number,
      default: 0,
    },
    large: {
      type: Number,
      default: 0,
    },
    extraLarge: {
      type: Number,
      default: 0,
    },
    
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    
    },
    imageURL: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true, // Set this to true if you want it to be required
      min: 1, // Optionally set a minimum value if you want to enforce at least one
    },
    
    neededDate: {
        type: Date,
        required: true,  // Ensure that the needed date is provided
    },
}, { timestamps: true });

  
  const OrderModel = mongoose.model('orders', OrderSchema);
  module.exports = OrderModel;
  
