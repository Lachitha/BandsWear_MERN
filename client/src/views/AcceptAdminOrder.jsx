import React, { useState, useEffect } from 'react';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

function AcceptAdminOrder() {
  const { orderId, userId } = useParams(); // Extract userId in one go

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    category: 'Frocks',
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    price: '',
    neededDate: '',
    imageURL: '',
    userId: '', // Initially set to empty string
  });

  const [previousCodes, setPreviousCodes] = useState(new Set());

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/showOrdersById/${orderId}`);
        const orderData = response.data;
        setFormData({
          itemCode: orderData.itemCode,
          itemName: orderData.itemName,
          category: orderData.category,
          small: orderData.small,
          medium: orderData.medium,
          large: orderData.large,
          extraLarge: orderData.extraLarge,
          price: orderData.price,
          neededDate: orderData.neededDate || '',
          imageURL: '',
          userId: userId, // Set userId from URL parameters
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details.');
      }
    };
    

    fetchOrder();
  }, [orderId, userId]); // Add userId as a dependency

  const generateItemCode = () => {
    let code;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (previousCodes.has(code));

    setFormData(prev => ({ ...prev, itemCode: code }));
    setPreviousCodes(prev => new Set(prev).add(code));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeChange = (e, size) => {
    setFormData({
      ...formData,
      [size]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.price) {
      toast.error('Please fill all required fields.');
      return;
    }
    try {
      const submissionData = { ...formData };
      await axios.post('http://localhost:3001/AcceptOrders', submissionData);
      toast.success('Order accepted successfully!');
      setFormData({
        itemCode: '',
        itemName: '',
        category: 'Frocks',
        small: 0,
        medium: 0,
        large: 0,
        extraLarge: 0,
        price: '',
        neededDate: '',
        imageURL: '',
        userId: userId, // Retain the userId when resetting form data
      });
  
      // Delete the order by itemCode after submission
      await axios.delete(`http://localhost:3001/deleteByItemCode/${formData.itemCode}`);
      toast.success('Item deleted successfully!');
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
                required // Still keep this required if needed
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Long Frocks">Long Frocks</option>
                <option value="Short Frocks">Short Frocks</option>
                <option value="Party Frocks">Party Frocks</option>
                <option value="Kids Frocks">Kids Frocks</option>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter price"
                required // Still keep this required if needed
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
            <div className="mb-4">
              <button
                type="submit"
                className="bg-purple-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                Accept Order
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

export default AcceptAdminOrder;
