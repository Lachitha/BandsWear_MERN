import React, { useState } from 'react';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useParams } from 'react-router-dom';

function AcceptAdminOrder() {
  const { userId } = useParams(); // Extract userId from URL params

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    Category: 'Frocks',
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    Price: '',
    imageURL: '' // Field for image URL
  });

  const [previousCodes, setPreviousCodes] = useState(new Set());

  // Function to generate a random item code
  const generateItemCode = () => {
    let code;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (previousCodes.has(code));

    setFormData(prev => ({ ...prev, itemCode: code }));
    setPreviousCodes(prev => new Set(prev).add(code));
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle size input changes
  const handleSizeChange = (e, size) => {
    setFormData({
      ...formData,
      [size]: Number(e.target.value), // Ensure size values are numbers
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = { ...formData, userId }; // Include userId in submission
      const response = await axios.post('http://localhost:3001/AddProduct', submissionData);
      toast.success('Order accepted successfully!'); 
      setFormData({
        itemCode: '',
        itemName: '',
        Category: 'Frocks',
        small: 0,
        medium: 0,
        large: 0,
        extraLarge: 0,
        Price: '',
        imageURL: '' // Reset the imageURL as well
      });
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order.'); 
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white pl-52 pr-52 pb-10 shadow-lg rounded-md w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-6">Accept New Order</h2>

          <form onSubmit={handleSubmit}>
            {/* Item Code */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCode">
                Item Code
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button 
                  type="button"
                  className="ml-2 bg-purple-600 text-white rounded p-2"
                  onClick={generateItemCode}
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Item Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter item name"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Category">
                Category
              </label>
              <select 
                name="Category" 
                value={formData.Category} 
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Frocks">Frocks</option>
                <option value="Shirts">Shirts</option>
                <option value="Pants">Pants</option>
                {/* Add more categories as needed */}
              </select>
            </div>

            {/* Size and Quantity Inputs */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Sizes and Quantities</label>
              <div className="grid grid-cols-2 gap-4">
                {['small', 'medium', 'large', 'extraLarge'].map((size) => (
                  <div key={size} className="flex items-center">
                    <label className="w-1/4 capitalize">{size}</label>
                    <input
                      type="number"
                      name={size}
                      value={formData[size]}
                      onChange={(e) => handleSizeChange(e, size)}
                      className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                      placeholder={`Qty for ${size}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Price">
                Price
              </label>
              <input
                type="number" // Ensure valid pricing input
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter price"
                min="0" // Ensures price cannot be negative
              />
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageURL">
                Image URL
              </label>
              <input
                type="text"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter image URL"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <ToastContainer /> 
    </div>
  );
}

export default AcceptAdminOrder;
