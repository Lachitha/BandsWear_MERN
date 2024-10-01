const mongoose = require ('mongoose')

const ProductSchema = new mongoose.Schema({

        Category: String,
        userId: String,
        small: String,
        medium: String,
        large: String,
        extraLarge: String,
        Price: Number,
        Quantity: Number,
        itemName: String,
        itemCode: String,
        imageURL: String,
        date: { type: Date, default: Date.now }
        
})

const ProductModel = mongoose.model("products",ProductSchema)
module.exports = ProductModel

     