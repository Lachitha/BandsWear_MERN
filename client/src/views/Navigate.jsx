import React from "react";
import logo from "../Images/logo.png"; // Correct import
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

const EnhancedHeader = () => {
	const [hoveredLink, setHoveredLink] = React.useState(null);
	const [username, setUsername] = React.useState(""); // State for the username
	const navigate = useNavigate(); // useNavigate hook for programmatic navigation

	React.useEffect(() => {
		const user = sessionStorage.getItem("username"); // Get username from sessionStorage
		console.log("Retrieved username:", user); // Debugging line
		if (user) {
			setUsername(user); // Set username if available
		}
	}, []);

	const handleHomeClick = () => {
		const userId = sessionStorage.getItem("userId"); // Get userId from sessionStorage
		if (userId) {
			navigate(`/userHome/${userId}`); // Navigate to userHome with userId
		} else {
			console.error("User ID not found in sessionStorage");
		}
	};

	return (
		<div style={styles.headerContainer}>
			<div style={styles.logoContainer}>
				<img src={logo} alt="Logo" style={styles.logo} />
			</div>
			<div style={styles.navContainer}>
				{["Home", "Order History", "Place Order"].map((item, index) => (
					<a
						key={index}
						href="#"
						onClick={item === "Home" ? handleHomeClick : undefined}
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
				))}
			</div>
			<div style={styles.usernameContainer}>
				{username && <span style={styles.usernameText}>{username}</span>}
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
	navContainer: {
		display: "flex",
		justifyContent: "center", // Center the navigation links
		flex: 1, // Allow the navContainer to take full width available
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
	usernameContainer: {
		marginLeft: "auto", // Push the username to the right
	},
	usernameText: {
		fontSize: "18px",
		color: "#000",
	},
};

export default EnhancedHeader;
