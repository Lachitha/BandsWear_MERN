const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.post("/AddSupplier", (req, res) => {
    Supplier.create(req.body)
        .then(Supplier => res.json(Supplier))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
