const express = require('express');
const router = express.Router();
const Order = require('../models/PlaceOrder'); // Adjust as necessary

// Create an order (POST)
router.post("/CreateOrder", (req, res) => {
    Order.create(req.body)
        .then(order => res.json(order))
        .catch(err => {
            console.error("Failed to create order:", err);
            res.status(500).json({ error: 'Failed to add order', details: err });
        });
});

// Get all orders (GET)
router.get("/showOrders", (req, res) => {
    Order.find()  // Fetch all items from the database
      .then(Order => res.json(Order))
      .catch(err => res.status(500).json(err));
  });

  router.get("/showOrdersById/:orderId", (req, res) => {
    const { orderId } = req.params;
  
    // Use findById to find the order by its ID
    Order.findById(orderId) // Pass the orderId directly
      .then(order => {
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
      })
      .catch(err => res.status(500).json({ error: 'Server error' }));
  });
  
 // Delete order by itemCode (DELETE)
router.delete("/deleteByItemCode/:itemCode", (req, res) => {
  const { itemCode } = req.params;

  Order.deleteOne({ itemCode: itemCode })  // Delete order matching the itemCode
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    })
    .catch(err => {
      console.error("Failed to delete order:", err);
      res.status(500).json({ error: 'Failed to delete order', details: err });
    });
});
  
  

module.exports = router;
