const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Supplier = require("../models/Supplier");
const User = require("../models/User");

// Login route
router.post("/loginc", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if the email is associated with an admin
		const admin = await Admin.findOne({ email });
		if (admin) {
			if (password === admin.password) {
				// Plain-text password comparison
				req.session.userId = admin._id; // Set session user ID
				req.session.username = admin.username; // Save admin username in session
				req.session.userRole = "admin"; // Optionally store role for additional checks
				console.log(
					`Admin login successful. UserID stored in session: ${req.session.userId}`
				);
				return res.status(200).json({ message: "Admin login successful" });
			} else {
				return res.status(401).json({ message: "Invalid admin credentials" });
			}
		}

		// Check if the email is associated with a supplier
		const supplier = await Supplier.findOne({ email });
		if (supplier) {
			if (password === supplier.password) {
				// Plain-text password comparison
				req.session.userId = supplier._id; // Set session user ID
				req.session.username = supplier.username; // Save supplier username in session
				req.session.userRole = "supplier"; // Store role for additional checks
				console.log(
					`Supplier login successful. UserID stored in session: ${req.session.userId}`
				);
				return res
					.status(202)
					.json({ message: "Supplier login successful", userId: supplier._id });
			} else {
				return res
					.status(401)
					.json({ message: "Invalid supplier credentials" });
			}
		}

		// Check if the email is associated with a user
		const user = await User.findOne({ email });
		if (user) {
			if (password === user.password) {
				// Plain-text password comparison
				req.session.userId = user._id; // Set session user ID
				req.session.username = user.username; // Save username in session
				req.session.userRole = "user"; // Store role for additional checks
				console.log(
					`User login successful. UserID stored in session: ${req.session.username}`
				);
				return res
					.status(203)
					.json({
						message: "User login successful",
						userId: user._id,
						username: user.username,
					});
			} else {
				return res.status(401).json({ message: "Invalid user credentials" });
			}
		}

		// If neither admin, supplier, nor user is found
		return res.status(404).json({ message: "User not found" });
	} catch (error) {
		console.error(error); // Log the error for debugging
		return res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
