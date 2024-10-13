const express = require('express');
const router = express.Router();
const Accept = require('../models/AcceptOrder'); // Adjust as necessary

// Create an order (POST)
router.post("/AcceptOrders", (req, res) => {
    Accept.create(req.body)
        .then(order => res.json(order))
        .catch(err => {
            console.error("Failed to create order:", err);
            res.status(500).json({ error: 'Failed to add order', details: err });
        });
});



router.get("/showAcceptOrders", (req, res) => {
    Accept.find() // Fetch all accepted orders from the database
        .then(orders => res.json(orders))
        .catch(err => {
            console.error("Failed to fetch orders:", err);
            res.status(500).json({ error: 'Failed to fetch orders', details: err });
        });
});


router.get('/showOrdersbyuserId/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Accept.find({ userId });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;


