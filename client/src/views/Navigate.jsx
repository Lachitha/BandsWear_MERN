import React from "react";
import logo from "../Images/logo.png"; // Correct import

const EnhancedHeader = () => {
	const [hoveredLink, setHoveredLink] = React.useState(null);

	return (
		<div style={styles.headerContainer}>
			<div style={styles.logoContainer}>
				<img
					src={logo} // Use imported logo here
					alt="Logo"
					style={styles.logo}
				/>
			</div>
			<div style={styles.navContainer}>
				{["Delivery Details", "Order History", "Place Order"].map(
					(item, index) => (
						<a
							href="http://localhost:5173/order"
							key={index}
							style={{
								...styles.navLink,
								color:
									hoveredLink === index
										? styles.navLinkHover.color
										: styles.navLink.color,
							}}
							onMouseEnter={() => setHoveredLink(index)}
							onMouseLeave={() => setHoveredLink(null)}>
							{item}
						</a>
					)
				)}
			</div>
		</div>
	);
};

const styles = {
	headerContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: "10px 20px",
		borderBottom: "1px solid #ccc",
	},
	logoContainer: {
		display: "flex",
		alignItems: "center",
	},
	logo: {
		width: "180px",
		height: "50px",
	},
	brandName: {
		fontSize: "24px",
		fontWeight: "bold",
		marginLeft: "10px",
		color: "#4B0082",
	},
	navContainer: {
		display: "flex",
	},
	navLink: {
		marginLeft: "20px",
		textDecoration: "none",
		fontSize: "18px",
		color: "#000",
		fontWeight: "normal",
		transition: "color 0.3s ease",
	},
	navLinkHover: {
		color: "#4B0082",
	},
};

export default EnhancedHeader;
