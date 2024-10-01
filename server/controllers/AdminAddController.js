const express = require('express');
const router = express.Router();
const Item = require('../models/AdminAdd');

// Route to add an item
router.post("/AddItem", (req, res) => {
  Item.create(req.body)
    .then(item => res.json(item))
    .catch(err => res.status(500).json(err));
});

// Route to show all products (items)
router.get("/showCustomer", (req, res) => {
  Item.find()  // Fetch all items from the database
    .then(items => res.json(items))
    .catch(err => res.status(500).json(err));
});

// Route to show a product by ID
router.get("/showCustomerById/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  Item.findById(itemId)  // Fetch item by ID from the database
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    })
    .catch(err => res.status(500).json(err));
});
//Update Admin Items
router.put("/updateItem/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  Item.findByIdAndUpdate(itemId, req.body, { new: true })  // Update item and return the new version
    .then(updatedItem => {
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(updatedItem);
    })
    .catch(err => res.status(500).json(err));
});

// Route to delete an item
router.delete("/deleteItem/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  Item.findByIdAndDelete(itemId)  // Find item by ID and delete it
    .then(deletedItem => {
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    })
    .catch(err => res.status(500).json(err));
});


// Checkout route
router.post('/checkout', async (req, res) => {
  const { cartItems } = req.body;

  try {
    for (const cartItem of cartItems) {
      // Find the item in the item database
      const item = await Item.findById(cartItem.itemId);

      // Deduct the quantity for the correct size
      if (cartItem.size === 'large') {
        item.large -= cartItem.quantity;
      } else if (cartItem.size === 'small') {
        item.small -= cartItem.quantity;
      } else if (cartItem.size === 'medium') {
        item.medium -= cartItem.quantity;
      } else if (cartItem.size === 'extraLarge') {
        item.extraLarge -= cartItem.quantity;
      }

      // Save the updated item to the database
      await item.save();
    }

    res.status(200).json({ message: 'Checkout successful!' });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Checkout failed, please try again.' });
  }
});

module.exports = router;

