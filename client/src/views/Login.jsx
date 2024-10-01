import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgimg from "../Images/LoginBack.jpg";
import HomeNavigation from "./Components/HomeNavigation";
import Footer from "./Components/Footer";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate(); // Initialize the useNavigate hook

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:3001/login",
				{
					email,
					password,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				// Navigate to the admin page on successful login
				navigate("/AdminPage"); // Adjust the path as needed
			} else if (response.status === 202) {
				// Navigate to the supplier registration form page
				navigate(`/supplierProduct/${response.data.userId}`); // Adjust the path as needed
			} else if (response.status === 203) {
				// Navigate to user home page with the user ID
				navigate(`/userHome/${response.data.userId}`);
			} else {
				console.log("Unexpected response status:", response.status);
			}
		} catch (error) {
			// Handle error response
			console.error("Login failed:", error);
			setErrorMessage("Login failed. Please check your email and password.");
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<HomeNavigation />
			<div className="flex-grow flex justify-center items-center ">
				<div className="bg-[#D9D9D9] bg-opacity-70 p-8 rounded-lg mt-10 mb-20 shadow-lg w-[80rem] ">
					<div className="flex h-screen ">
						{/* Left Section: Background Image */}
						<div
							className="w-1/2 bg-cover bg-center"
							style={{ backgroundImage: `url(${bgimg})` }}></div>

						{/* Right Section: Login Form */}
						<div className="w-1/2 flex items-center justify-center">
							<div className="p-8 bg-opacity-50">
								<h2 className="text-center text-black text-4xl mb-20 font-thin">
									GREAT TO HAVE YOU BACK
								</h2>
								<form className="space-y-4" onSubmit={handleSubmit}>
									<div>
										<label
											className="block text-black text-xl mb-4"
											htmlFor="email">
											Email Address
										</label>
										<input
											className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
											type="email"
											id="email"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div>
										<label
											className="block text-black text-xl mb-4"
											htmlFor="password">
											Password
										</label>
										<input
											className="w-full mb-5 p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
											type="password"
											id="password"
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>

									<button
										className="w-[20rem] bg-purple-400 hover:bg-purple-700 text-black hover:text-white py-3 rounded-lg text-center font-semibold transition duration-300 ease-in-out transform hover:scale-105"
										type="submit">
										Log in
									</button>
								</form>
								{errorMessage && (
									<p className="text-red-500 text-center mt-4">
										{errorMessage}
									</p>
								)}
								<div className="text-center mt-4 text-gray-700">
									<a href="#" className="underline mt-5">
										If you're not a customer? Click here
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Login;
