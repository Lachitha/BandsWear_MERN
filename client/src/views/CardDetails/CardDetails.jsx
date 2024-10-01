import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import bgimg from "../img/frockbg.jpg";
import Navigation from "../Navigate";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
	const navigate = useNavigate();
	const currentYear = new Date().getFullYear() % 100;
	const futureYears = Array.from({ length: 10 }, (_, i) => currentYear + i);

	const [formData, setFormData] = useState({
		cardName: "",
		cardNumber: "",
		expMonth: "",
		expYear: "",
		cvv: "",
		savePaymentDetails: false,
	});

	const [userId, setUserId] = useState([]);
	const [savedCards, setSavedCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedCardId, setSelectedCardId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	const fetchSavedCards = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		try {
			const response = await axios.get(
				"http://localhost:3001/api/checkout/get-saved-cards",
				{
					withCredentials: true,
				}
			);
			console.log("Fetched saved cards:", response.data);
			setSavedCards(response.data);
		} catch (error) {
			console.error("Error fetching saved cards:", error);
			Swal.fire("Error", "Failed to fetch saved cards.", "error");
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		const storedUserId = sessionStorage.getItem("UserId");

		if (storedUserId) {
			setUserId(storedUserId);
			fetchSavedCards();
		}
	}, [fetchSavedCards]);

	useEffect(() => {
		if (userId) {
			fetchSavedCards();
		}
	}, [userId, fetchSavedCards]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const validateCardNumber = (number) => {
		const regex = /^\d{16}$/;
		return regex.test(number);
	};

	const validateCVV = (cvv) => {
		const regex = /^\d{3,4}$/;
		return regex.test(cvv);
	};

	const validateExpiration = (month, year) => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;
		const currentYearFull = currentDate.getFullYear() % 100;
		return (
			year > currentYearFull ||
			(year === currentYearFull && month >= currentMonth)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateCardNumber(formData.cardNumber)) {
			alert("Invalid card number. Please enter a valid 16-digit card number.");
			return;
		}
		if (!validateCVV(formData.cvv)) {
			alert("Invalid CVV. Please enter a valid CVV.");
			return;
		}
		if (
			!validateExpiration(
				parseInt(formData.expMonth),
				parseInt(formData.expYear)
			)
		) {
			alert("Card expiration date is invalid or expired.");
			return;
		}

		const paymentData = { ...formData, userId };

		try {
			if (isEditing && selectedCardId) {
				await axios.put(
					`http://localhost:3001/api/checkout/edit-card/${selectedCardId}`,
					paymentData,
					{
						withCredentials: true,
					}
				);
				Swal.fire(
					"Card Updated!",
					"Your card details have been updated.",
					"success"
				);
			} else {
				await axios.post(
					"http://localhost:3001/api/checkout/save-card",
					paymentData,
					{
						withCredentials: true,
					}
				);
				Swal.fire(
					"Card Added!",
					"Your card has been added successfully.",
					"success"
				);
			}

			// Reset form and state
			setFormData({
				cardName: "",
				cardNumber: "",
				expMonth: "",
				expYear: "",
				cvv: "",
				savePaymentDetails: false,
			});
			setIsEditing(false);
			setSelectedCardId(null);
			fetchSavedCards();
		} catch (error) {
			console.error("Error during card addition or update:", error);
			alert("Failed to process the card.");
		}
	};

	const handleEdit = (card) => {
		setFormData({
			cardName: card.cardName,
			cardNumber: card.cardNumber,
			expMonth: card.expMonth,
			expYear: card.expYear,
			cvv: card.cvv,
			savePaymentDetails: false,
		});
		setSelectedCardId(card._id);
		setIsEditing(true);
	};

	const handleDelete = async (cardId) => {
		if (window.confirm("Are you sure you want to delete this card?")) {
			try {
				await axios.delete(
					`http://localhost:3001/api/checkout/delete-card/${cardId}`,
					{
						withCredentials: true,
					}
				);
				fetchSavedCards();
			} catch (error) {
				console.error("Error deleting card:", error);
				alert("Failed to delete card.");
			}
		}
	};

	const handleProceedToPay = () => {
		if (!selectedCardId) {
			alert("Please select a card to proceed.");
			return;
		}

		const selectedCard = savedCards.find((card) => card._id === selectedCardId);

		Swal.fire({
			title: "Order Confirmation",
			text: `You are about to pay using the following card:\n\nCard Name: ${
				selectedCard.cardName
			}\nCard Number: **** **** **** ${selectedCard.cardNumber.slice(-4)}`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Confirm Payment",
			cancelButtonText: "Cancel",
		}).then(async (result) => {
			if (result.isConfirmed) {
				// Call payment API here
				Swal.fire(
					"Payment Successful!",
					"Your payment has been processed.",
					"success"
				).then(() => {
					navigate("/order"); // Redirect to /order page after confirmation
				});
			}
		});
	};

	const styles = {
		container: {
			display: "flex",
			justifyContent: "center",
			backgroundImage: `url(${bgimg})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			alignItems: "flex-start",
			height: "100vh",
			padding: "20px",
			backgroundColor: "#f9f9f9",
		},
		innerContainer: {
			display: "flex",
			justifyContent: "space-between",
			width: "70%",
			marginTop: "10%",
			justifyContent: "center",
		},
		paymentForm: {
			padding: "40px",
			borderRadius: "12px",
			boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
			color: "#333",
			width: "45%",
			boxShadow: "0 8px 16px rgba(0, 0, 0, 1)",
			background: "rgba(255, 255, 255, 0.8)",
			border: "2px solid #7A5DCC",
		},
		cardListContainer: {
			padding: "20px",
			marginLeft: "1%",
			borderRadius: "12px",
			boxShadow: "0 8px 16px rgba(0, 0, 0, 1)",
			width: "50%",
			maxHeight: "400px",
			overflowY: "auto",
			background: "rgba(255, 255, 255, 0.8)",
			border: "2px solid #7A5DCC",
		},
		input: {
			width: "100%",
			padding: "10px",
			marginBottom: "10px",
			borderRadius: "4px",
			border: "1px solid #ccc",
			boxSizing: "border-box",
		},
		dropdownContainer: {
			display: "flex",
			justifyContent: "space-between",
			marginBottom: "10px",
		},
		dropdown: {
			flex: 1,
			marginRight: "10px",
		},
		button: {
			backgroundColor: "#9370DB",
			color: "white",
			border: "none",
			padding: "10px 15px",
			borderRadius: "4px",
			cursor: "pointer",
			margin: "5px", // Add margin for spacing between buttons
			transition: "background-color 0.3s ease",
		},
		cardItem: {
			display: "flex",
			flexDirection: "column", // Change to column for better alignment
			padding: "10px",
			borderRadius: "4px",
			cursor: "pointer",
			transition: "background-color 0.2s ease",
			marginBottom: "10px",
			border: "1px solid #ddd", // Add border for better separation
		},
		cardItemHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "5px",
		},
		cardItemDetails: {
			fontSize: "0.9em",
			marginBottom: "5px",
		},
		editButton: {
			backgroundColor: "orange",
		},
		deleteButton: {
			backgroundColor: "red",
		},
		header: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			backgroundColor: "#fff",
			zIndex: 1000,
		},
	};

	return (
		<div style={styles.header}>
			<Navigation />
			<div style={styles.container}>
				<div style={styles.innerContainer}>
					<div style={styles.paymentForm}>
						<h2>Payment Form</h2>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								name="cardName"
								placeholder="Card Name"
								value={formData.cardName}
								onChange={handleChange}
								style={styles.input}
								required
							/>
							<input
								type="text"
								name="cardNumber"
								placeholder="Card Number"
								value={formData.cardNumber}
								onChange={handleChange}
								style={styles.input}
								maxLength="16"
								required
							/>
							<div style={styles.dropdownContainer}>
								<select
									name="expMonth"
									value={formData.expMonth}
									onChange={handleChange}
									style={{ ...styles.input, ...styles.dropdown }}
									required>
									<option value="">Month</option>
									{Array.from({ length: 12 }, (_, i) => (
										<option key={i} value={i + 1}>
											{i + 1}
										</option>
									))}
								</select>
								<select
									name="expYear"
									value={formData.expYear}
									onChange={handleChange}
									style={{ ...styles.input, ...styles.dropdown }}
									required>
									<option value="">Year</option>
									{futureYears.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</div>
							<input
								type="text"
								name="cvv"
								placeholder="CVV"
								value={formData.cvv}
								onChange={handleChange}
								style={styles.input}
								maxLength="4"
								required
							/>
							{/* <label>
							<input
								type="checkbox"
								name="savePaymentDetails"
								checked={formData.savePaymentDetails}
								onChange={handleChange}
							/>
							Save this card for future payments
						</label> */}
							<button type="submit" style={styles.button}>
								{isEditing ? "Update Card" : "Save Card"}
							</button>
						</form>
					</div>
					<div style={styles.cardListContainer}>
						<h2>Saved Cards</h2>
						{loading ? (
							<p>Loading...</p>
						) : (
							<ul style={{ listStyle: "none", padding: 0 }}>
								{savedCards.map((card) => (
									<li
										key={card._id}
										style={{
											...styles.cardItem,
											...(selectedCardId === card._id
												? { backgroundColor: "#f0f0f0" }
												: {}),
										}}
										onClick={() => setSelectedCardId(card._id)} // Set selected card on click
									>
										<div style={styles.cardItemHeader}>
											<strong>{card.cardName}</strong>
											<div>
												<button
													onClick={(e) => {
														e.stopPropagation(); // Prevent triggering the parent onClick
														handleEdit(card);
													}}
													style={{ ...styles.button, ...styles.editButton }}>
													Edit
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation(); // Prevent triggering the parent onClick
														handleDelete(card._id);
													}}
													style={{ ...styles.button, ...styles.deleteButton }}>
													Delete
												</button>
											</div>
										</div>
										<div style={styles.cardItemDetails}>
											<strong>Card Number:</strong> **** **** ****{" "}
											{card.cardNumber.slice(-4)}
											<br />
											<strong>Expiry:</strong> {card.expMonth}/{card.expYear}
										</div>
									</li>
								))}
							</ul>
						)}
						<button onClick={handleProceedToPay} style={styles.button}>
							Proceed to Pay
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentForm;
