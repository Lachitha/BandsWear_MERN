const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Checkout = require("../models/Checkout");
const Card = require("../models/Card");
const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const multer = require("multer");
// Register a new user
router.post("/register", async (req, res) => {
	const {
		email,
		password,
		firstName,
		lastName,
		address,
		postalCode,
		phoneNumber,
	} = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create a new user document
		const newUser = new User({
			email,
			password, // Plain password will be hashed by the pre-save middleware (Assuming you have hashing logic in the User model)
			firstName,
			lastName,
			address,
			postalCode,
			phoneNumber,
		});

		// Save the user
		const savedUser = await newUser.save();

		// Return success message with userId
		res
			.status(200)
			.json({ message: "Registration successful", userId: savedUser._id });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
});

// Login a user
// router.post("/login", async (req, res) => {
// 	const { email, password } = req.body;

// 	try {
// 		// Find user by email
// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// Compare the entered password with the stored hashed password
// 		const isMatch = await user.comparePassword(password); // Assuming comparePassword function exists in your model
// 		if (!isMatch) {
// 			return res.status(401).json({ message: "Invalid credentials" });
// 		}

// 		// Store the userId in the session
// 		req.session.userId = user._id;

// 		// Return the user data (optional)
// 		res.status(200).json({
// 			message: "Login successful",
// 			userId: user._id,
// 			user: {
// 				email: user.email,
// 				firstName: user.firstName,
// 				lastName: user.lastName,
// 			},
// 		});
// 	} catch (err) {
// 		console.error("Login error:", err); // Log the error for debugging
// 		res.status(500).json({ message: "Server error", error: err.message });
// 	}
// });

// Route to fetch user details by userId
router.get("/user-details/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		// Find user by their MongoDB _id
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			userId: user._id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			address: user.address,
			postalCode: user.postalCode,
			phoneNumber: user.phoneNumber,
		});
	} catch (err) {
		res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
});

// Route to auto-fill user details from session userId
router.get("/user-details", async (req, res) => {
	try {
		const userId = req.session.userId; // Assuming the session contains userId
		console.log("Session:", req.session.userId);
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await User.findById(userId).select(
			"email firstName lastName address postalCode phoneNumber"
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Send only the email to auto-fill the form
		res.json({
			email: user.email,
			address: user.address,
		});
	} catch (err) {
		res.status(500).json({
			message: "Error retrieving user details",
			error: err.message,
		});
	}
});

// Route to save checkout details in the Checkout collection
router.post("/save-checkout", async (req, res) => {
	try {
		const userId = req.session.userId; // Assuming userId is stored in session

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { email, firstName, lastName, address, postalCode, phoneNumber } =
			req.body;

		// Check if a checkout already exists for this user
		const existingCheckout = await Checkout.findOne({ userId });

		if (existingCheckout) {
			// Update existing checkout without changing the email
			existingCheckout.email = email;
			existingCheckout.firstName = firstName;
			existingCheckout.lastName = lastName;
			existingCheckout.address = address;
			existingCheckout.postalCode = postalCode;
			existingCheckout.phoneNumber = phoneNumber;

			const updatedCheckout = await existingCheckout.save();

			return res.json({
				message: "Checkout updated successfully",
				checkout: updatedCheckout,
			});
		} else {
			// Create a new checkout document with the fixed email
			const newCheckout = new Checkout({
				userId,
				email, // Use existing email
				firstName,
				lastName,
				address,
				postalCode,
				phoneNumber,
			});

			// Save the checkout details in the database
			const savedCheckout = await newCheckout.save();

			return res.json({
				message: "Checkout saved successfully",
				checkout: savedCheckout,
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Error saving checkout details",
			error: err.message,
		});
	}
});

router.get("/get-saved-cards", async (req, res) => {
	const userId = req.session.userId;
	console.log("Session User ID:", userId); // Log the session user ID
	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const cards = await Card.find({ userId });
		console.log("Fetched Cards:", cards); // Log the fetched cards
		return res.status(200).json(cards);
	} catch (error) {
		console.error("Error fetching saved cards:", error);
		return res.status(500).json({ message: "Server error" });
	}
});

// Save card
router.post("/save-card", async (req, res) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	const newCard = new Card({ ...req.body, userId });
	try {
		await newCard.save();
		return res.status(201).json(newCard);
	} catch (error) {
		console.error("Error saving card:", error);
		return res.status(500).json({ message: "Server error" });
	}
});

// Delete card
router.delete("/delete-card/:id", async (req, res) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	try {
		await Card.findByIdAndDelete(req.params.id);
		return res.status(204).send();
	} catch (error) {
		console.error("Error deleting card:", error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.put("/edit-card/:id", async (req, res) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	try {
		const { cardName, cardNumber, expMonth, expYear, cvv } = req.body;

		// Find the card by its ID and check if it belongs to the logged-in user
		const card = await Card.findOne({ _id: req.params.id, userId });
		if (!card) {
			return res
				.status(404)
				.json({ message: "Card not found or unauthorized" });
		}

		// Update card details
		card.cardName = cardName || card.cardName;
		card.cardNumber = cardNumber || card.cardNumber;
		card.expMonth = expMonth || card.expMonth;
		card.expYear = expYear || card.expYear;
		card.cvv = cvv || card.cvv;

		// Save the updated card
		await card.save();

		return res.status(200).json({ message: "Card updated successfully", card });
	} catch (error) {
		console.error("Error updating card:", error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.get("/orders", async (req, res) => {
	try {
		const userId = req.session.userId; // Assuming the userId is stored in session

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find orders associated with the user and populate products with product details
		const orders = await Order.find({ userId })
			.populate({
				path: "products.productId", // Populate the productId field in the products array
				select: "itemName price imgUrl", // Select only the necessary fields
			})
			.populate("userId", "username email"); // Optionally populate user details

		if (!orders || orders.length === 0) {
			return res.status(404).json({ message: "No orders found" });
		}

		// Send the orders back to the client
		return res.json(orders);
	} catch (err) {
		return res.status(500).json({
			message: "Error retrieving orders",
			error: err.message,
		});
	}
});

router.post("/order", async (req, res) => {
	const { userId, products, totalPrice } = req.body;

	// Validate the basic fields
	if (!userId || !products || products.length === 0 || !totalPrice) {
		return res
			.status(400)
			.json({ message: "User ID, products, and total price are required." });
	}

	// Validate totalPrice
	if (typeof totalPrice !== "number" || totalPrice <= 0) {
		return res
			.status(400)
			.json({ message: "Total price must be a positive number." });
	}

	try {
		// Create a new order
		const newOrder = new Order({
			userId,
			products,
			totalPrice,
		});
		console.log("New Order:", newOrder);
		// Save the order to the database
		await newOrder.save();

		return res
			.status(201)
			.json({ message: "Order created successfully!", order: newOrder });
	} catch (error) {
		console.error("Error creating order:", error);
		return res
			.status(500)
			.json({ message: "Failed to create order", error: error.message });
	}
});

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "brandswear001@gmail.com",
		pass: "excurnnsfcamygkp",
	},
});

router.post("/sendEmail", async (req, res) => {
	const { email, orderId, totalPrice, products } = req.body;

	// Validate required fields
	if (!email || !orderId || !totalPrice || !products || products.length === 0) {
		return res.status(400).json({ message: "Missing required fields." });
	}

	// Generate the product list HTML for the email body
	const productList = products
		.map(
			(product) =>
				`<li>${product.itemName} - ${product.quantity} x Rs ${
					product.unitPrice
				} = Rs ${product.quantity * product.unitPrice}</li>`
		)
		.join("");

	// Mail options
	const mailOptions = {
		from: "brandswear001@gmail.com", // Use environment variable for sender email
		to: email, // Send to the user's email
		subject: `Order Confirmation - Order ID: ${orderId}`,
		html: `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Order Confirmation</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						background-color: #f4f4f4;
						color: #333;
						margin: 0;
						padding: 0;
					}
					.container {
						width: 80%;
						margin: auto;
						padding: 20px;
						background: white;
						border-radius: 8px;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
					}
					h1 {
						color: #4CAF50;
					}
					p {
						line-height: 1.5;
					}
					.product-list {
						list-style-type: none;
						padding: 0;
					}
					.product-list li {
						background: #f9f9f9;
						margin: 5px 0;
						padding: 10px;
						border-radius: 4px;
						box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
					}
					.total-price {
						font-weight: bold;
						color: #4CAF50;
					}
					.footer {
						margin-top: 20px;
						font-size: 0.9em;
						color: #777;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Order Confirmation: ${orderId}</h1>
					<p>Thank you for your purchase! Here are your order details:</p>
					<ul class="product-list">${productList}</ul>
					<p class="total-price">Total Price: Rs ${totalPrice}</p>
					<p>If you have any questions, feel free to contact us!</p>
					<div class="footer">
						<p>Best regards,<br>BRANDS WEAR (PVT)LTD</p>
					</div>
				</div>
			</body>
			</html>
		`,
	};

	try {
		// Send email
		await transporter.sendMail(mailOptions);
		res.status(200).send("Email sent");
	} catch (error) {
		console.error("Error sending email:", error);
		res
			.status(500)
			.json({ message: "Failed to send email", error: error.message });
	}
});

module.exports = router;
