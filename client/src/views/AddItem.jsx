import React, { useState, useEffect } from 'react';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useParams } from 'react-router-dom';

function Supplier() {
  const { userId } = useParams(); // Extract userId from URL params

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    Category: 'Long Frocks',
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    Price: '',
    imageURL: '', // Field for image URL
    deliveryDate: '', // New field for delivery date
    companyName: '' // Field for company name
  });

  const [totalPrice, setTotalPrice] = useState(0); // New state for total price
  const [previousCodes, setPreviousCodes] = useState(new Set());

  // Fetch supplier data when the component mounts
  useEffect(() => {
    // Fetch supplier information based on userId
    axios.get(`http://localhost:3001/ShowSupplier/${userId}`)
      .then(response => {
        setFormData(prevFormData => ({
          ...prevFormData,
          companyName: response.data.company // Set companyName
        }));
      })
      .catch(error => {
        console.error("Error fetching supplier data", error);
        toast.error('Failed to fetch supplier data.');
      });
  }, [userId]);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If the price changes, recalculate the total price
    if (name === "Price") {
      calculateTotalPrice(value);
    }
  };

  // Handle size input changes (specific for sizes)
  const handleSizeChange = (e, size) => {
    const value = Number(e.target.value); // Ensure size values are numbers
    setFormData({
      ...formData,
      [size]: value,
    });

    // Recalculate total price whenever a size quantity changes
    calculateTotalPrice(formData.Price, { ...formData, [size]: value });
  };

  // Function to calculate total price based on quantities and price
  const calculateTotalPrice = (price, updatedFormData = formData) => {
    const totalQuantity = updatedFormData.small + updatedFormData.medium + updatedFormData.large + updatedFormData.extraLarge;
    const total = totalQuantity * (parseFloat(price) || 0);
    setTotalPrice(total); // Set the calculated total price
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = { ...formData, userId }; // Include userId in form submission
      const response = await axios.post('http://localhost:3001/AddProduct', submissionData);
      toast.success('Product added successfully!'); 
      setFormData({
        itemCode: '',
        itemName: '',
        Category: 'Long Frocks',
        small: 0,
        medium: 0,
        large: 0,
        extraLarge: 0,
        Price: '',
        imageURL: '',
        deliveryDate: '', // Reset the deliveryDate
        companyName: '' // Reset company name
      });
      setTotalPrice(0); // Reset total price
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product.'); 
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white pl-52 pr-52 pb-10 shadow-lg rounded-md w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-6">Add New Item</h2>

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
                <option value="Long Frocks">Long Frocks</option>
                <option value="Short Frocks">Short Frocks</option>
                <option value="Party Frocks">Party Frocks</option>
                <option value="Kids Frocks">Kids Frocks</option>
              </select>
            </div>

            {/* Delivery Date */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryDate">
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
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
                Price (per dress)
              </label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter price"
                min="0"
              />
            </div>

            {/* Total Price Display */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Total Price
              </label>
              <input
                type="text"
                value={`Rs. ${totalPrice.toFixed(2)}`}
                readOnly
                className="w-full p-2 border rounded-xl bg-gray-100"
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
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Supplier;
