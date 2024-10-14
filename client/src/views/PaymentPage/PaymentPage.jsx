import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCcVisa,
	faCcMastercard,
	faCcPaypal,
} from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./PaymentPage.css"; // CSS styles
import shoppingBag from "../img/bag.jpg";
import Navigation from "../Navigate";

// Constants for payment methods
const PAYMENT_METHODS = {
	BANK_CARD: "Bank Card",
	PAYPAL: "PayPal",
	CASH_ON_DELIVERY: "Cash on Delivery",
};

const CARD_TYPES = {
	VISA: "Visa",
	MASTERCARD: "MasterCard",
};

const PaymentPage = () => {
	const [paymentMethod, setPaymentMethod] = useState("");
	const [cardType, setCardType] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handlePaymentChange = (e) => {
		const selectedMethod = e.target.value;
		setPaymentMethod(selectedMethod);
		setCardType(""); // Reset card type when switching payment methods
		setErrorMessage(""); // Reset error message
	};

	const handleCardTypeChange = (e) => {
		setCardType(e.target.value);
		setErrorMessage(""); // Reset error message
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");

		if (!paymentMethod) {
			setErrorMessage("Please select a payment method.");
			return;
		}

		if (paymentMethod === PAYMENT_METHODS.BANK_CARD) {
			if (cardType === CARD_TYPES.VISA || cardType === CARD_TYPES.MASTERCARD) {
				window.location.href = "http://localhost:5173/cardDetails";
			} else {
				setErrorMessage("Please select a card type (Visa/MasterCard).");
			}
		} else if (paymentMethod === PAYMENT_METHODS.PAYPAL) {
			window.location.href = "https://www.paypal.com/signin";
		} else if (paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY) {
			const result = await Swal.fire({
				title: "Order Successful!",
				text: "Your order has been placed successfully. The payment will be collected upon delivery.",
				icon: "success",
				confirmButtonText: "OK",
				background: "#f9f9f9",
				color: "#333",
				confirmButtonColor: "#3085d6",
				showClass: {
					popup: "animate__animated animate__fadeInDown",
				},
				hideClass: {
					popup: "animate__animated animate__fadeOutUp",
				},
			});
			if (result.isConfirmed) {
				window.location.href = "http://localhost:5173/order";
			}
		} else {
			setErrorMessage("Please select a valid payment method.");
		}
	};

	return (
		<div className="header">
			<Navigation />
			<div className="payment-container-custom">
				<div className="payment-page-custom">
					<form onSubmit={handleSubmit} className="payment-form-custom">
						<h2 className="form-title-custom">Payment</h2>

						{errorMessage && (
							<div className="error-message-custom">{errorMessage}</div>
						)}

						<div className="payment-content-custom">
							<div className="payment-methods-custom">
								<label className="payment-option-custom">
									<input
										type="radio"
										value={PAYMENT_METHODS.BANK_CARD}
										checked={paymentMethod === PAYMENT_METHODS.BANK_CARD}
										onChange={handlePaymentChange}
									/>
									{PAYMENT_METHODS.BANK_CARD}
								</label>

								{paymentMethod === PAYMENT_METHODS.BANK_CARD && (
									<div className="card-options-custom">
										<label className="payment-option-custom">
											<input
												type="radio"
												value={CARD_TYPES.VISA}
												checked={cardType === CARD_TYPES.VISA}
												onChange={handleCardTypeChange}
											/>
											<FontAwesomeIcon
												icon={faCcVisa}
												className="payment-icon-custom"
											/>{" "}
											{CARD_TYPES.VISA}
										</label>

										<label className="payment-option-custom">
											<input
												type="radio"
												value={CARD_TYPES.MASTERCARD}
												checked={cardType === CARD_TYPES.MASTERCARD}
												onChange={handleCardTypeChange}
											/>
											<FontAwesomeIcon
												icon={faCcMastercard}
												className="payment-icon-custom"
											/>{" "}
											{CARD_TYPES.MASTERCARD}
										</label>
									</div>
								)}

								<label className="payment-option-custom">
									<input
										type="radio"
										value={PAYMENT_METHODS.PAYPAL}
										checked={paymentMethod === PAYMENT_METHODS.PAYPAL}
										onChange={handlePaymentChange}
									/>
									<FontAwesomeIcon
										icon={faCcPaypal}
										className="payment-icon-custom"
									/>{" "}
									{PAYMENT_METHODS.PAYPAL}
								</label>

								<label className="payment-option-custom">
									<input
										type="radio"
										value={PAYMENT_METHODS.CASH_ON_DELIVERY}
										checked={paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY}
										onChange={handlePaymentChange}
									/>
									{PAYMENT_METHODS.CASH_ON_DELIVERY}
								</label>
							</div>

							<div className="image-container-custom">
								<img
									src={shoppingBag}
									alt="Shopping Bag"
									className="payment-image-custom"
								/>
							</div>
						</div>

						<button type="submit" className="confirm-button-custom">
							Confirm
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
