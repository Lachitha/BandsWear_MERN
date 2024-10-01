import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import Modal from "./modal"; // Import the modal
import "./CheckoutForm.css";
import Navigation from "../Navigate";

const CheckoutForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		address: "",
		postalCode: "",
		phoneNumber: "",
		saveInfo: false,
	});

	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);

	// Fetch user details on component mount
	useEffect(() => {
		axios
			.get("http://localhost:3001/api/checkout/user-details", {
				withCredentials: true,
			}) // Enable credentials for session
			.then((response) => {
				setFormData((prevState) => ({
					...prevState,
					email: response.data.email,
					firstName: response.data.firstName,
					lastName: response.data.lastName,
					address: response.data.address,
					postalCode: response.data.postalCode,
					phoneNumber: response.data.phoneNumber,
				}));
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching user details:", error);
				setLoading(false);
			});
	}, []);

	// Handle input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		// Only proceed if the user wants to save the information
		if (formData.saveInfo) {
			const dataToSend = { ...formData };

			axios
				.post("http://localhost:3001/api/checkout/save-checkout", dataToSend, {
					withCredentials: true,
				}) // Send data with session credentials
				.then((response) => {
					setModalOpen(true); // Open the modal
				})
				.catch((error) => {
					console.error("Error saving checkout details:", error);
					alert("Failed to save checkout details");
				});
		} else {
			// If the checkbox is not checked, just open the modal and redirect without saving
			setModalOpen(true);
		}
	};

	const handleModalConfirm = () => {
		setModalOpen(false);
		window.location.href = "/payment"; // Redirect to payment page
	};

	const handleModalClose = () => {
		setModalOpen(false); // Close the modal
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="header">
			<Navigation />
			<div className="checkout-form-container">
				<form className="checkout-form" onSubmit={handleSubmit}>
					<h2 className="form-title">Contact Information</h2>
					<div className="input-group">
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Email Address"
							required
							className="form-input"
							disabled
						/>
						<FaEdit className="edit-icon" />
					</div>

					<h2 className="form-title">Delivery</h2>

					<div className="input-group">
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							placeholder="First Name"
							required
							className="form-input"
						/>
						<FaEdit className="edit-icon" />
					</div>

					<div className="input-group">
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							placeholder="Last Name"
							required
							className="form-input"
						/>
						<FaEdit className="edit-icon" />
					</div>

					<div className="input-group">
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Address"
							required
							className="form-input"
						/>
						<FaEdit className="edit-icon" />
					</div>

					<div className="input-group">
						<input
							type="text"
							name="postalCode"
							value={formData.postalCode}
							onChange={handleChange}
							placeholder="Postal Code"
							required
							className="form-input"
						/>
						<FaEdit className="edit-icon" />
					</div>

					<div className="input-group">
						<input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							placeholder="Phone Number"
							required
							className="form-input"
						/>
						<FaEdit className="edit-icon" />
					</div>

					<div className="save-info-container">
						<label>
							<input
								type="checkbox"
								name="saveInfo"
								checked={formData.saveInfo}
								onChange={handleChange}
							/>
							Save this information
						</label>
					</div>

					<button type="submit" className="confirm-button">
						Confirm
					</button>
				</form>

				{/* Modal Component */}
				<Modal
					isOpen={modalOpen}
					onClose={handleModalClose}
					onConfirm={handleModalConfirm}
				/>
			</div>
		</div>
	);
};

export default CheckoutForm;
