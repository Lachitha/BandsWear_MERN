// server, controllers connection route - handle controllers
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const conDatabase = require("./database");

// Local imports
const SUPPLIER = require("./controllers/SupplierRegController");
const ADMIN = require("./controllers/AdminController");
const PRODUCT = require("./controllers/SupplierProductController");
const ITEM = require("./controllers/AdminAddController");
const USER = require("./controllers/UserController");
const CART = require("./controllers/CartController");
const ORDER = require("./controllers/AdminOrder");
const ACCEPT = require('./controllers/SupAcceptOrder');
const CheckoutController = require("./controllers/CheckoutController");

// Middleware
const app = express();

// Enable CORS for your frontend
app.use(
	cors({
		origin: "http://localhost:5173",
		// Allow requests only from this origin
		credentials: true, // Allow credentials (cookies, session) to be sent
	})
);

app.use(express.json()); // For parsing application/json

// Session configuration
app.use(
	session({
		secret: "your-secret-key", // Replace with your own secret
		resave: false,
		saveUninitialized: false, // Set to false to avoid creating a session for unauthenticated users
		cookie: {
			secure: false, // Set secure to true if using HTTPS
			httpOnly: true, // Cookie is not accessible via JavaScript
			maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
		},
	})
);

// Routing - using API (Application Programming Interface)
app.use("/", SUPPLIER);
app.use("/", ADMIN);
app.use("/", PRODUCT);
app.use("/", ITEM);
app.use("/", USER);
app.use("/", CART);
app.use("/", ORDER);
app.use('/', ACCEPT);
app.use("/api/checkout", CheckoutController);

// Connect to the database
conDatabase()
	.then(() => {
		console.log("Database Connected...");
		const server = app
			.listen(3001, () => {
				console.log("Server Started at port 3001");
			})
			.on("error", (err) => {
				console.log("Server not started", err);
			});

		module.exports = server;
	})
	.catch((err) => console.log("Database connection error:", err));
