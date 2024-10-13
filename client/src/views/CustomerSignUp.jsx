import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import bgimg from '../Images/LoginBack.jpg';
import HomeNavigation from './Components/HomeNavigation';
import Footer from './Components/Footer';

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    contactNumber: '',
  });

  const navigate = useNavigate(); // Call useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Username validation to ensure only letters
    if (name === 'username') {
      if (/[^a-zA-Z\s]/.test(value)) {
        setErrors({ ...errors, username: 'Username can only contain letters and spaces' });
      } else {
        setErrors({ ...errors, username: '' });
      }
    }

    // Contact number validation
    if (name === 'contactNumber') {
      if (!/^\d{10}$/.test(value)) {
        setErrors({ ...errors, contactNumber: 'Contact number must be exactly 10 digits' });
      } else {
        setErrors({ ...errors, contactNumber: '' });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.contactNumber === '' && errors.username === '') {
      // Axios POST request to the backend
      axios.post('http://localhost:3001/createUser', formData)
        .then(response => {
          console.log('User created successfully:', response.data);
          navigate('/Login'); // Use navigate to redirect to the login page
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeNavigation />
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-[#D9D9D9] bg-opacity-70 p-8 rounded-lg mt-10 mb-20 shadow-lg w-[80rem]">
          <div className="flex h-screen">
            {/* Left Section: Background Image */}
            <div
              className="w-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgimg})` }}
            />
            {/* Right Section: User Form */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="p-8 bg-opacity-50">
                <h2 className="text-center text-black text-4xl mb-20 font-thin">CREATE YOUR ACCOUNT</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-black text-xl mb-4" htmlFor="username">Name</label>
                    <input
                      className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-2">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black text-xl mb-4" htmlFor="email">Email Address</label>
                    <input
                      className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xl mb-4" htmlFor="password">Password</label>
                    <input
                      className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xl mb-4" htmlFor="contactNumber">Contact Number</label>
                    <input
                      className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-sm mt-2">{errors.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black text-xl mb-4" htmlFor="address">Address</label>
                    <textarea
                      className="w-full p-3 rounded-xl bg-gray-200 focus:bg-gray-300 border border-transparent hover:border-black transition duration-300 ease-in-out transform hover:scale-105"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    className="w-[20rem] bg-purple-400 hover:bg-purple-700 text-black hover:text-white py-3 rounded-lg text-center font-semibold transition duration-300 ease-in-out transform hover:scale-105"
                    type="submit"
                    disabled={errors.username || errors.contactNumber} // Disable button if there's an error
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserForm;
