const express = require('express');
const router = express.Router();
const Order = require('../models/PlaceOrder'); // Adjust as necessary

// Create a product (POST)
router.post("/CreateOrder", (req, res) => {
    Order.create(req.body)
        .then(order => res.json(order))
        .catch(err => {
            console.error("Failed to create order:", err);
            res.status(500).json({ error: 'Failed to add order', details: err });
        });
});


module.exports = router;
