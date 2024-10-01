import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Navigation from "../Navigate";
import backgroudimg from "/Users/lachitha/Desktop/Brands-Wear/client/src/views/img/frockbg.jpg";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(
					"http://localhost:3001/api/checkout/orders",
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}

				const data = await response.json();
				setOrders(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const generatePDF = (order) => {
		const doc = new jsPDF();

		// Add Store name at the top with custom style
		doc.setFontSize(30);
		doc.setTextColor("#6c63ff");
		doc.setFont("Helvetica", "bold");
		doc.text("BRANDS WEAR", 105, 20, { align: "center" });

		const title = `Invoice for Order ID: ${order._id}`;
		const date = new Date(order.orderDate).toLocaleString();

		// Add title and date
		doc.setFontSize(22);
		doc.setTextColor("#000000");
		doc.setFont("Helvetica", "bold");
		doc.text(title, 14, 40); // Positioned below the store name
		doc.setFontSize(12);
		doc.setFont("Helvetica", "normal");
		doc.text(`Order Date: ${date}`, 14, 50);
		doc.text(`Total Price: Rs ${order.totalPrice}`, 14, 60);
		doc.setDrawColor(0);
		doc.line(14, 63, 196, 63); // Draw a line

		// Prepare data for the table
		const tableData = order.products.map((product) => [
			product.itemName,
			product.quantity,
			`Rs ${product.unitPrice}`,
			`Rs ${product.quantity * product.unitPrice}`,
		]);

		// Define table columns
		const tableColumns = [
			"Product Name",
			"Quantity",
			"Price per Unit",
			"Total Price",
		];

		// Create the table
		doc.autoTable({
			head: [tableColumns],
			body: tableData,
			startY: 70,
			margin: { horizontal: 14 },
			theme: "striped",
			headStyles: {
				fillColor: "#6c63ff", // Store's theme color
				textColor: "#fff",
				fontSize: 12,
			},
			styles: {
				fontSize: 11,
				cellPadding: 5,
				overflow: "linebreak",
				lineHeight: 1.5,
			},
			footStyles: {
				fillColor: "#f0f0f0",
				fontSize: 12,
			},
			foot: [
				[
					{
						content: "Subtotal",
						colSpan: 3,
						styles: {
							halign: "left",
							fontStyle: "bold",
							textColor: "#000000",
						},
					},

					{
						content: `Rs ${order.products.reduce(
							(total, product) => total + product.quantity * product.unitPrice,
							0
						)}`,
						styles: {
							halign: "right",
							fontStyle: "bold",
							textColor: "#000000",
						},
					},
				],
				[
					{
						content: "Total",
						colSpan: 3,
						styles: {
							halign: "left",
							fontStyle: "bold",
							textColor: "#000000",
						},
					},
					{
						content: `Rs ${order.totalPrice}`,
						styles: {
							halign: "right",
							fontStyle: "bold",
							textColor: "#000000",
						},
					},
				],
			],
		});

		// Optional: Add footer notes
		doc.setFontSize(10);
		doc.setFont("Helvetica", "normal");
		doc.text(
			"Thank you for your order!",
			14,
			doc.autoTable.previous.finalY + 10
		);
		doc.text(
			"If you have any questions, feel free to contact us at brandswear@gmail.com.",
			14,
			doc.autoTable.previous.finalY + 15
		);

		// Save the PDF
		doc.save(`invoice_${order._id}.pdf`);
	};

	if (loading) {
		return <div>Loading orders...</div>;
	}

	if (error) {
		return <div style={{ color: "red" }}>Failed to load orders: {error}</div>;
	}

	return (
		<div
			style={{
				fontFamily: "Arial, sans-serif",
				padding: "50px",
				maxWidth: "1000px",
				margin: "0 auto",
				marginTop: "90px", // Added to prevent content from being hidden behind the fixed header
			}}>
			<header
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					backgroundColor: "#fff",
					zIndex: 1000,

					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Optional shadow for better visibility
				}}>
				<Navigation /> {/* Add the Navigation component here */}
			</header>
			<h1
				style={{
					marginTop: "35px",
					marginBottom: "40px",
					textAlign: "center",
					color: "#4a4a4a",
					fontSize: "28px", // Increased font size
					fontWeight: "bold", // Make it bold
					textTransform: "uppercase", // Transform text to uppercase
					// backgroundColor: "#f0f0f0", // Add background color for the title
					padding: "10px", // Padding for aesthetics
					borderRadius: "10px", // Rounded corners for the background
					// boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Shadow for the title
				}}>
				Your Orders
			</h1>
			{orders.length === 0 ? (
				<p style={{ color: "#999", textAlign: "center" }}>No orders found.</p>
			) : (
				<div
					style={{
						height: "550px",
						overflowY: "auto",
						border: "2px solid #ddd",
						borderRadius: "10px",
						boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
						padding: "20px",
						marginBottom: "10px",
						background: "pgimg",
					}}>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
						{orders.map((order) => (
							<div
								key={order._id}
								style={{
									marginBottom: "20px",
									border: "1px solid #ddd",
									borderRadius: "10px",
									padding: "20px",
									boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
									backgroundColor: "#fff",
									width: "calc(100% - 10px)", // Adjust width as needed
								}}>
								<h5
									style={{
										margin: "0 0 10px 0",
										color: "#333",
										fontSize: "18px",
									}}>
									Order ID: {order._id}
								</h5>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
									{order.products.map((product) => (
										<div
											key={product._id}
											style={{
												border: "1px solid #ddd",
												borderRadius: "10px",
												width: "calc(25% - 10px)",
												padding: "5px",
												boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
												textAlign: "center",
											}}>
											<img
												src={product.imgUrl}
												alt={product.itemName}
												style={{
													width: "100%",
													height: "auto",
													borderRadius: "10px",
													marginBottom: "5px",
												}}
											/>
											<h6
												style={{
													margin: "5px 0",
													color: "#333",
													fontSize: "14px",
												}}>
												{product.itemName}
											</h6>
											<p
												style={{
													margin: "2px 0",
													color: "#555",
													fontSize: "12px",
												}}>
												Quantity: {product.quantity}
											</p>
											<p
												style={{
													margin: "2px 0",
													fontWeight: "bold",
													color: "#000",
													fontSize: "12px",
												}}>
												Price per unit: Rs {product.unitPrice}
											</p>
										</div>
									))}
								</div>
								<p
									style={{
										margin: "5px 0",
										fontWeight: "bold",
										color: "#000",
									}}>
									Total Price: Rs {order.totalPrice}
								</p>
								<div style={{ textAlign: "right" }}>
									<button
										style={{
											padding: "10px 15px",
											backgroundColor: "#6c63ff",
											color: "#fff",
											border: "none",
											borderRadius: "5px",
											cursor: "pointer",
											transition: "background-color 0.3s",
										}}
										onMouseEnter={(e) =>
											(e.target.style.backgroundColor = "#5a52d2")
										}
										onMouseLeave={(e) =>
											(e.target.style.backgroundColor = "#6c63ff")
										}>
										Payment Confirmation
									</button>
									<br />
									<button
										style={{
											marginTop: "10px",
											padding: "10px 15px",
											backgroundColor: "#999",
											color: "#fff",
											border: "none",
											borderRadius: "5px",
											cursor: "pointer",
											transition: "background-color 0.3s",
										}}
										onMouseEnter={(e) =>
											(e.target.style.backgroundColor = "#888")
										}
										onMouseLeave={(e) =>
											(e.target.style.backgroundColor = "#999")
										}
										onClick={() => generatePDF(order)} // Call PDF generation on click
									>
										Download Invoice
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Orders;
