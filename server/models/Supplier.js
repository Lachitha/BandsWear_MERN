const mongoose = require ('mongoose')

const SupplierSchema = new mongoose.Schema({

        company: String,
        firstname: String,
        lastname: String,
        email: String,
        contact: Number,
        address: String,
        password:String,
})

const SupplierModel = mongoose.model("Suppliers",SupplierSchema)
module.exports = SupplierModel