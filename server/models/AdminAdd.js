const mongoose = require('mongoose');

// Define the schema for the Item
const itemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true // Corrected this part
  },
  size: String,
  price: Number,
  itemName: String,
  itemCode: String,
  availability: {
    type: String,
    default: "Available"
  },
  imgUrl: String,
  large: Number,
  small: Number,
  extraLarge: Number,
  medium: Number,
  CompanyName: String ,
}, { timestamps: true });

// Create the Item model
const Item = mongoose.model('items', itemSchema);

module.exports = Item;
