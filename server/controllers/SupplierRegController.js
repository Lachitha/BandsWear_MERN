const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.post("/AddSupplier", (req, res) => {
    Supplier.create(req.body)
        .then(Supplier => res.json(Supplier))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowSupplier/:userId", (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    Supplier.findOne({ _id: userId } )
        .then(supplier => {
            if (supplier) {
                res.json(supplier);
            } else {
                res.status(404).json({ message: "Supplier not found" });
            }
        })
        .catch(err => res.status(500).json(err));
});


module.exports = router;
