// routes/cart.js

const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order"); // Import the Order model

// POST route to add an item to the cart
router.post("/addtoCart", async (req, res) => {
	const {
		userId,
		itemId,
		itemName,
		itemCode,
		category,
		price,
		size,
		quantity,
		unitPrice,
		imgUrl,
	} = req.body;

	try {
		// Check if the same item is already in the cart for the same size
		const existingCartItem = await Cart.findOne({ userId, itemId, size });

		if (existingCartItem) {
			return res.status(400).json({
				message: "This item is already in your cart with the selected size.",
			});
		}

		// Create a new cart item
		const newCartItem = new Cart({
			userId,
			itemId,
			itemName,
			itemCode,
			unitPrice,
			category,
			price,
			size,
			quantity,
			imgUrl,
		});

		// Save the new cart item to the database
		await newCartItem.save();

		// Return success response
		res.status(201).json({
			message: "Item added to cart successfully!",
			cartItem: newCartItem,
		});
	} catch (error) {
		console.error("Error adding item to cart:", error);
		res.status(500).json({
			message: "Failed to add item to cart. Please try again later.",
		});
	}
});

router.get("/ShowCart/:userId", async (req, res) => {
	const { userId } = req.params; // Extract userId from URL parameters

	try {
		// Fetch cart items from the database for the specified userId
		const cartItems = await Cart.find({ userId });

		// Check if the cart is empty
		if (cartItems.length === 0) {
			return res
				.status(404)
				.json({ message: "No items found in cart for this user." });
		}

		// Return the cart items
		res.status(200).json(cartItems);
	} catch (error) {
		console.error("Error fetching cart items:", error);
		res
			.status(500)
			.json({ message: "Failed to fetch cart items. Please try again later." });
	}
});

router.put("/updateCart/:id", async (req, res) => {
	const { id } = req.params;
	const { userId, quantity, price } = req.body; // Destructure userId, quantity, and price from request body

	try {
		console.log(
			`User login successful. UserID stored in session: ${req.session.userId}`
		); // Log userId
		// Find and update the cart item by its _id and ensure it belongs to the given userId
		const updatedCartItem = await Cart.findOneAndUpdate(
			{ _id: id, userId: userId }, // Ensure both _id and userId match
			{ $set: { quantity: quantity, price: price } }, // Set the new quantity and price
			{ new: true, runValidators: true } // Return the updated document and validate the changes
		);

		if (!updatedCartItem) {
			return res.status(404).json({
				message: "Cart item not found or does not belong to the user.",
			});
		}

		res.status(200).json(updatedCartItem); // Respond with the updated cart item
	} catch (error) {
		console.error("Error updating cart item:", error);
		res.status(500).json({ message: "Server error. Please try again later." });
	}
});

router.delete("/deleteCartItem/:id", async (req, res) => {
	const { id } = req.params; // The item ID to be deleted
	const { userId } = req.body; // User ID from the request body

	try {
		// Find and delete the cart item based on userId and _id
		const deletedItem = await Cart.findOneAndDelete({ _id: id, userId });

		if (!deletedItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		res.status(200).json({ message: "Cart item deleted successfully" });
	} catch (err) {
		console.error("Error deleting cart item:", err);
		res.status(500).json({ message: "Failed to delete cart item" });
	}
});

router.post("/checkout", async (req, res) => {
	const { userId, cartItemIds } = req.body;

	// Validate input
	if (!userId || !Array.isArray(cartItemIds) || cartItemIds.length === 0) {
		return res
			.status(400)
			.json({ message: "Invalid user ID or cart item IDs." });
	}

	console.log("Received checkout request:", { userId, cartItemIds });

	try {
		// Fetch cart items
		const cartItems = await Cart.find({ _id: { $in: cartItemIds }, userId });
		console.log("Fetched cart items:", cartItems);

		// Ensure cartItems is an array
		if (!Array.isArray(cartItems)) {
			console.error("Fetched cartItems is not an array.");
			return res.status(500).json({ message: "Internal server error." });
		}

		// Check if cartItems is empty
		if (cartItems.length === 0) {
			console.error("No items found to checkout.");
			return res.status(404).json({ message: "No items found to checkout." });
		}

		// Calculate total amount for the order
		const totalAmount = cartItems.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);
		console.log("Total amount calculated:", totalAmount);

		// Create a new order
		const newOrder = new Order({
			userId,
			items: cartItems.map((item) => ({
				itemId: item.itemId,
				itemName: item.itemName,
				// itemCode: item.itemCode,
				category: item.category,
				price: item.price,
				size: item.size,
				quantity: item.quantity,
				imgUrl: item.imgUrl,
				unitPrice: item.unitPrice,
			})),
			totalAmount,
		});

		console.log("New order to be saved:", newOrder);

		// Save the order to the database
		const savedOrder = await newOrder.save();
		console.log(`Order created successfully: ${savedOrder._id}`);

		// Delete cart items after successful order creation
		await Cart.deleteMany({ _id: { $in: cartItemIds }, userId });

		res.status(201).json({
			message: "Checkout successful. Order created.",
			order: savedOrder,
		});
	} catch (error) {
		console.error("Error during checkout:", error);
		res.status(500).json({
			message: "Failed to complete checkout. Please try again later.",
			error: error.message,
		});
	}
});

module.exports = router;
