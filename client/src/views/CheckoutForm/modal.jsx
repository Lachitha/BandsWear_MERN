import React from "react";
import "./modal.css"; // Create a CSS file for styles

const Modal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Address Saved Successfully!</h2>
				<p>Do you want to proceed to payment?</p>
				<div className="modal-buttons">
					<button className="modal-button" onClick={onConfirm}>
						Yes
					</button>
					<button className="modal-button" onClick={onClose}>
						No
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
