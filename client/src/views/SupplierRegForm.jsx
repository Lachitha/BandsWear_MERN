import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import bgimg from '../Images/background-image.png';
import HomeNavigation from './Components/HomeNavigation';
import Footer from './Components/Footer';

function SupplierRegForm() {
  const [company, setCompany] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState(''); // Added password state
  const [errors, setErrors] = useState({}); // State to store validation errors

  const navigate = useNavigate(); // Create a navigate function

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/; // Regex for letters only
    const phoneRegex = /^0\d{9}$/; // Regex to match exactly 10 digits starting with 0

    if (!company) newErrors.company = 'Company name is required.';
    if (!firstname) newErrors.firstname = 'First name is required.';
    else if (!nameRegex.test(firstname)) newErrors.firstname = 'First name must contain only letters.';
    if (!lastname) newErrors.lastname = 'Last name is required.';
    else if (!nameRegex.test(lastname)) newErrors.lastname = 'Last name must contain only letters.';
    if (!email) newErrors.email = 'Email is required.';
    if (!contact) newErrors.contact = 'Contact number is required.';
    else if (!phoneRegex.test(contact)) newErrors.contact = 'Contact number must be 10 digits and start with 0.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length !== 8) newErrors.password = 'Password must be exactly 8 characters.'; // Corrected validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    try {
      const response = await axios.post('http://localhost:3001/addSupplier', {
        company,
        firstname,
        lastname,
        email,
        contact,
        address,
        password, // Include password in the POST request
      });

      console.log('Supplier registered:', response.data);

      // Clear the form fields
      setCompany('');
      setFirstname('');
      setLastname('');
      setEmail('');
      setContact('');
      setAddress('');
      setPassword(''); // Clear password field

      // Navigate to the supplier product page after successful submission
      navigate('/');
    } catch (error) {
      console.error('Error registering supplier:', error);
    }
  };

  return (
    <div>
      <HomeNavigation />
      <div className="min-h-screen">
        <div
          className="flex justify-center bg-cover bg-center h-[80rem]"
          style={{
            backgroundImage: `url(${bgimg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-[40rem] h-[70rem] mt-20 border border-white">
            <h2 className="text-center text-black text-3xl mb-6 mt-5 font-bold">
              Welcome To Supplier Registration
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="company">
                  Supplier Company Name
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 ${
                    errors.company ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="text"
                  id="company"
                  placeholder="Enter your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="firstname">
                  First Name
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 ${
                    errors.firstname ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="text"
                  id="firstname"
                  placeholder="Enter your first name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname}</p>}
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="lastname">
                  Last Name
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 ${
                    errors.lastname ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="text"
                  id="lastname"
                  placeholder="Enter your last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname}</p>}
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="email">
                  Email
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 hover:border-black ${
                    errors.email ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 ${
                    errors.contact ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="text"
                  id="contact"
                  placeholder="Enter your contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="address">
                  Address
                </label>
                <input
                  className="w-full mb-10 p-3 rounded border transition-all duration-300 bg-gray-200 focus:bg-gray-300 hover:border-black"
                  type="text"
                  id="address"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-black text-xl mb-5" htmlFor="password">
                  Password
                </label>
                <input
                  className={`w-full p-3 rounded border transition-all duration-300 ${
                    errors.password ? 'bg-red-100' : 'bg-gray-200'
                  } focus:bg-gray-300 hover:border-black`}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              <button
                className="w-[20rem] bg-purple-500 text-black hover:bg-purple-600 hover:text-white py-3 rounded-lg text-center font-semibold transition duration-300 ease-in-out transform hover:scale-105"
                type="submit"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SupplierRegForm;
