import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
const UpdateItemForm = () => {
  const { itemId } = useParams();
  const [itemData, setItemData] = useState({
    category: "",
    price: "",
    itemName: "",
    itemCode: "",
    availability: "",
    large: 0,
    small: 0,
    extraLarge: 0,
    medium: 0,
    imgUrl: "",
  });

  // Fetch data for the item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/showCustomerById/${itemId}`);
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
        alert("Failed to fetch item data. Please try again.");
      }
    };
    fetchItem();
  }, [itemId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { ...itemData, quantity: itemData.small + itemData.medium + itemData.large + itemData.extraLarge }; // Example of calculating total quantity
    try {
      const response = await axios.post(`http://localhost:3001/CreateOrder`, orderData);
      if (response.status === 200) {
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavigation />
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full mt-10 mb-20">
      <h2 className="text-2xl font-bold text-center mb-4">Place Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={itemData.itemName}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Category:</label>
          <input
            type="text"
            name="category"
            value={itemData.category}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={itemData.price}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Item Code:</label>
          <input
            type="text"
            name="itemCode"
            value={itemData.itemCode}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Availability:</label>
          <input
            type="text"
            name="availability"
            value={itemData.availability}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            required
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Small:</label>
            <input
              type="number"
              name="small"
              value={itemData.small}
              onChange={handleInputChange}
              className="w-[10rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Medium:</label>
            <input
              type="number"
              name="medium"
              value={itemData.medium}
              onChange={handleInputChange}
              className="w-[10rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Large:</label>
            <input
              type="number"
              name="large"
              value={itemData.large}
              onChange={handleInputChange}
              className="w-[10rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Extra Large:</label>
            <input
              type="number"
              name="extraLarge"
              value={itemData.extraLarge}
              onChange={handleInputChange}
              className="w-[10rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Image URL:</label>
          <input
            type="text"
            name="imgUrl"
            value={itemData.imgUrl}
            onChange={handleInputChange}
            className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
          />
        </div>
        <button
          type="submit"
          className="w-64 h-12 mt-5 mb-6 bg-purple-600 text-white text-xl font-thin p-2 rounded-xl hover:bg-purple-200 hover:text-black transition-colors duration-200 focus:ring-2 focus:ring-purple-600"
        >
          + Place Order
        </button>
      </form>
    </div>
    <footer/>
    </div>
  </div>
  );
};

export default UpdateItemForm;
