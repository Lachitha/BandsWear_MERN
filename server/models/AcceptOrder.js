const mongoose = require('mongoose');

// Define the schema for accepting orders
const acceptOrderSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true // Required validation
  },
  itemName: {
    type: String,
    required: true // Required validation
  },
  category: {
    type: String,
    required: true // Required validation
  },
  small: {
    type: Number,
    default: 0 // Default value
  },
  medium: {
    type: Number,
    default: 0 // Default value
  },
  large: {
    type: Number,
    default: 0 // Default value
  },
  extraLarge: {
    type: Number,
    default: 0 // Default value
  },
  price: {
    type: Number,
    required: true // Required validation
  },
  imageURL: {
    type: String, // Optional image URL
  },
  userId: {
    type: String, // Optional image URL
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model for accepting orders
const AcceptOrder = mongoose.model('AcceptOrder', acceptOrderSchema);

module.exports = AcceptOrder;
