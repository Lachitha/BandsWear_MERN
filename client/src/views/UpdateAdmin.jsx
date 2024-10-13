import React, { useState, useEffect } from 'react';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import dressImage from '../Images/dressImage.jpeg'; // Correct path for the dress image
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateAdmin() {
  const { itemId } = useParams(); // Extract itemId from URL
  const [itemData, setItemData] = useState({
    itemName: '',
    category: '',
    price: 0,
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    imgUrl: '', // Add imgUrl to the state
  });

  // Fetch item data by ID when the component mounts
  useEffect(() => {
    axios.get(`http://localhost:3001/showCustomerById/${itemId}`)
      .then(response => {
        setItemData(response.data);
      })
      .catch(error => console.error('Error fetching item data:', error));
  }, [itemId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value,
    });
  };

  // Function to handle updating the item
  const handleUpdate = () => {
    axios.put(`http://localhost:3001/updateItem/${itemId}`, itemData) // Update item
      .then(response => {
        alert('Item updated successfully!'); // Show success message
      })
      .catch(error => {
        console.error('Error updating item:', error);
        alert('Failed to update item.'); // Show error message
      });
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <div>Item Code: {itemData.itemCode}</div>
          <h1 className="text-2xl font-bold text-center mb-6">Update Item</h1>
          <div className="flex">
            <div className="mr-8">
              <img className="w-40 h-60 object-cover rounded-md" src={itemData.imgUrl || dressImage} alt="Product" /> {/* Use the uploaded image URL */}
            </div>
            <div className="flex-1">
              {/* Item Name (Read-only) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={itemData.itemName}
                  readOnly
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none cursor-not-allowed"
                />
              </div>
              {/* Category (Read-only) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={itemData.category}
                  readOnly
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none cursor-not-allowed"
                />
              </div>
              {/* Price (Editable) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={itemData.price}
                  onChange={handleInputChange}
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              {/* Image URL (Read-only) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Image URL</label>
                <input
                  type="text"
                  name="imgUrl"
                  value={itemData.imgUrl}
                  readOnly
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none cursor-not-allowed"
                />
              </div>
              {/* Sizes */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Sizes</label>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Small</label>
                    <input
                      type="number"
                      name="small"
                      value={itemData.small}
                      onChange={handleInputChange}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Medium</label>
                    <input
                      type="number"
                      name="medium"
                      value={itemData.medium}
                      onChange={handleInputChange}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Large</label>
                    <input
                      type="number"
                      name="large"
                      value={itemData.large}
                      onChange={handleInputChange}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Extra Large</label>
                    <input
                      type="number"
                      name="extraLarge"
                      value={itemData.extraLarge}
                      onChange={handleInputChange}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
              {/* Update Button */}
              <div className="text-center mt-4">
                <button
                  className="w-64 h-12 mt-5 mb-6 bg-purple-600 text-white text-xl font-thin p-2 rounded-xl hover:bg-purple-200 hover:text-black transition-colors duration-200 focus:ring-2 focus:ring-purple-600"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UpdateAdmin;
