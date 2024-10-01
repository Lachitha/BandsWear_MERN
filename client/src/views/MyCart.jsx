import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "./Components/UserNavigation";
import Footer from "./Components/Footer";

const ShowCart = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const [error, setError] = useState("");
	const [quantity, setQuantity] = useState({});
	const [originalQuantity, setOriginalQuantity] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);
	const [quantityEdited, setQuantityEdited] = useState({});

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3001/ShowCart/${userId}`
				);
				setCartItems(response.data);

				const initialQuantity = response.data.reduce((acc, item) => {
					acc[item._id] = item.quantity;
					return acc;
				}, {});
				setQuantity(initialQuantity);
				setOriginalQuantity(initialQuantity);
				setTotalPrice(calculateTotalPrice(response.data, initialQuantity));
				setQuantityEdited(
					response.data.reduce((acc, item) => {
						acc[item._id] = false;
						return acc;
					}, {})
				);
			} catch (err) {
				console.error("Error fetching cart items:", err);
				setError("No Items In Cart");
			}
		};

		fetchCartItems();
	}, [userId]);

	const calculateTotalPrice = (items, quantities) => {
		return items
			.reduce((total, item) => {
				return total + item.unitPrice * (quantities[item._id] || item.quantity);
			}, 0)
			.toFixed(2);
	};

	const handleIncrement = (id) => {
		setQuantity((prev) => {
			const newQuantity = prev[id] + 1;
			const updatedQuantity = { ...prev, [id]: newQuantity };
			setTotalPrice(calculateTotalPrice(cartItems, updatedQuantity));
			setQuantityEdited((prevEdited) => ({
				...prevEdited,
				[id]: newQuantity !== originalQuantity[id],
			}));
			return updatedQuantity;
		});
	};

	const handleDecrement = (id) => {
		setQuantity((prev) => {
			const newQuantity = Math.max(prev[id] - 1, 1);
			const updatedQuantity = { ...prev, [id]: newQuantity };
			setTotalPrice(calculateTotalPrice(cartItems, updatedQuantity));
			setQuantityEdited((prevEdited) => ({
				...prevEdited,
				[id]: newQuantity !== originalQuantity[id],
			}));
			return updatedQuantity;
		});
	};

	const handleUpdate = async (id) => {
		const updatedItem = cartItems.find((item) => item._id === id);
		const updatedQuantity = quantity[id];

		try {
			await axios.put(`http://localhost:3001/updateCart/${id}`, {
				userId: userId,
				quantity: updatedQuantity,
				price: updatedItem.unitPrice * updatedQuantity,
			});

			alert(`${updatedItem.itemName} updated to ${updatedQuantity}`);
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === id ? { ...item, quantity: updatedQuantity } : item
				)
			);
			setOriginalQuantity((prev) => ({ ...prev, [id]: updatedQuantity }));
			setQuantityEdited((prev) => ({ ...prev, [id]: false }));
			setTotalPrice(
				calculateTotalPrice(cartItems, { ...quantity, [id]: updatedQuantity })
			);
		} catch (err) {
			console.error("Error updating cart item:", err);
			setError("Failed to update item. Please try again.");
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:3001/deleteCartItem/${id}`, {
				data: { userId: userId },
			});
			setCartItems((prev) => prev.filter((item) => item._id !== id));
			setTotalPrice(
				calculateTotalPrice(
					cartItems.filter((item) => item._id !== id),
					quantity
				)
			);
			alert("Item deleted successfully.");
		} catch (err) {
			console.error("Error deleting cart item:", err);
			setError("Failed to delete item. Please try again.");
		}
	};

	const handleCheckout = async () => {
		try {
			const orderDetails = cartItems.map((item) => ({
				productId: item._id,
				itemName: item.itemName,
				category: item.category,
				price: item.unitPrice * quantity[item._id],
				quantity: quantity[item._id],
				imgUrl: item.imgUrl,
				unitPrice: item.unitPrice,
			}));

			// Log complete order details
			console.log(
				"Complete Order Details:",
				JSON.stringify(orderDetails, null, 2)
			);

			// Validate each order detail for itemCode
			// for (const product of orderDetails) {
			// 	if (!product.itemCode) {
			// 		console.error("Invalid product detected:", product);
			// 		return alert("All products must have a valid item code.");
			// 	}
			// }

			const totalPrice = parseFloat(calculateTotalPrice(cartItems, quantity));
			console.log(
				"Calculated Total Price:",
				totalPrice,
				"Type:",
				typeof totalPrice
			); // Log type

			const response = await axios.post(
				"http://localhost:3001/api/checkout/order",
				{ userId, products: orderDetails, totalPrice }
			);

			if (response.status === 201) {
				alert("Order created successfully!");
				navigate("/checkout");

				await Promise.all(
					cartItems.map((item) =>
						axios.delete(`http://localhost:3001/deleteCartItem/${item._id}`, {
							data: { userId },
						})
					)
				);
				setCartItems([]);
				setTotalPrice(0);
			}
		} catch (error) {
			console.error("Checkout failed:", error);
			alert("Checkout failed, please try again.");
		}
	};

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div>
			<Navigation />
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold text-purple-700 mb-6">Your Cart</h1>
				{cartItems.length === 0 ? (
					<p>No items in your cart.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{cartItems.map((item) => (
							<div
								key={item._id}
								className="border rounded-lg shadow-lg p-4 bg-white flex flex-col justify-between border-purple-700">
								{/* Product Image */}
								<div className="flex justify-center items-center">
									<img
										src={item.imgUrl}
										alt={item.itemName}
										className="w-full h-auto object-cover rounded-t-lg sm:w-48 sm:h-72 md:w-64 md:h-96"
									/>
								</div>

								{/* Product Details */}
								<div className="flex-1">
									<h2 className="font-semibold text-purple-800 text-xl p-4">
										{item.itemName} - {item.itemCode}
									</h2>
									<p className="text-xl text-purple-500 p-3 font-semibold">
										<strong className="text-black font-thin">
											Total Price:{" "}
										</strong>{" "}
										Rs:{item.unitPrice * item.quantity}.00
									</p>
									<p className="text-xl text-black-500 p-3">
										<strong className="text-lg">Size:</strong> {item.size}
									</p>
									<p className="text-2xl text-gray-600 mt-2">
										<strong className="text-sm">Quantity:</strong>{" "}
										{quantity[item._id]}
									</p>
								</div>

								{/* Quantity Controls */}
								<div className="mt-4 flex justify-between items-center">
									<button
										onClick={() => handleDecrement(item._id)}
										className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
										disabled={quantity[item._id] <= 1}>
										-
									</button>
									<span className="text-purple-800 font-semibold">
										{quantity[item._id]}
									</span>
									<button
										onClick={() => handleIncrement(item._id)}
										className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600">
										+
									</button>

									{/* Update button */}
									<button
										onClick={() => handleUpdate(item._id)}
										className={`ml-2 px-3 py-1 rounded-md ${
											quantityEdited[item._id]
												? "bg-blue-500 hover:bg-blue-600 text-white"
												: "bg-gray-300 text-gray-600 cursor-not-allowed"
										}`}
										disabled={!quantityEdited[item._id]}>
										Update
									</button>

									<button
										onClick={() => handleDelete(item._id)}
										className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Total Price */}
				<div className="mt-4">
					<h2 className="text-2xl font-bold text-purple-800">
						Total Amount: <strong>Rs: {totalPrice}</strong>
					</h2>
				</div>

				{/* Checkout Button */}
				<div className="mt-4">
					<button
						onClick={handleCheckout}
						className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
						Proceed to Checkout
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ShowCart;
