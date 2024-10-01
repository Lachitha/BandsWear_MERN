import React, { useState } from 'react';
import axios from 'axios';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminAddItem() {
  const [category, setCategory] = useState("Long Frocks");
  const [itemName, setItemName] = useState("");
  const [availability, setAvailability] = useState("Available");
  const [price, setPrice] = useState(""); 
  const [itemCode, setItemCode] = useState(""); 
  const [imgUrl, setImageUrl] = useState(""); // State for image URL
  const [previousCodes, setPreviousCodes] = useState(new Set());

  // Individual states for sizes
  const [small, setSmall] = useState(0);
  const [medium, setMedium] = useState(0);
  const [large, setLarge] = useState(0);
  const [extraLarge, setExtraLarge] = useState(0);

  const generateItemCode = () => {
    let code;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (previousCodes.has(code));

    setItemCode(code);
    setPreviousCodes(prev => new Set(prev).add(code));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const itemData = {
      category,
      price,
      availability,
      itemCode,
      itemName,
      imgUrl, // Include imageUrl in itemData
      small,
      medium,
      large,
      extraLarge,
    };

    try {
      const response = await axios.post('http://localhost:3001/AddItem', itemData);
      toast.success('Item added successfully!');
      console.log('Item added successfully:', response.data);
    } catch (error) {
      toast.error('There was an error adding the item.');
      console.error('There was an error adding the item:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavigation />

      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full mt-10 mb-20">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Add New Item</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">

              <div>
                <label className="block text-gray-600 mb-2" htmlFor="itemCode">Item Code</label>
                <div className="flex justify-center items-center">
                  <input 
                    type="text" 
                    id="itemCode" 
                    value={itemCode}
                    readOnly
                    className="w-[10rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-center" 
                  />
                  <button 
                    type="button"
                    className="ml-4 w-40 h-12 bg-purple-600 text-white text-xl font-thin p-2 rounded-xl hover:bg-purple-200 hover:text-black transition-colors duration-200 focus:ring-2 focus:ring-purple-600"
                    onClick={generateItemCode}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-2" htmlFor="itemName">Item Name</label>
                <input 
                  type="text" 
                  id="itemName" 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2" htmlFor="category">Category</label>
                <select 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-40 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option>Long Frocks</option>
                  <option>Short Frocks</option>
                  <option>Party Frocks</option>
                  <option>Kids Frocks</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-2 text-center">Size and Quantity</label>
                <div className="flex justify-between mb-4">
                  {/* Small Size Input */}
                  <div className="flex flex-col items-center">
                    <label className="block text-gray-600 mb-1" htmlFor="quantity-S">Small</label>
                    <input
                      type="number"
                      id="quantity-S"
                      value={small === 0 ? '' : small}
                      onChange={(e) => setSmall(parseInt(e.target.value) || 0)}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                    />
                  </div>

                  {/* Medium Size Input */}
                  <div className="flex flex-col items-center">
                    <label className="block text-gray-600 mb-1" htmlFor="quantity-M">Medium</label>
                    <input
                      type="number"
                      id="quantity-M"
                      value={medium === 0 ? '' : medium}
                      onChange={(e) => setMedium(parseInt(e.target.value) || 0)}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                    />
                  </div>

                  {/* Large Size Input */}
                  <div className="flex flex-col items-center">
                    <label className="block text-gray-600 mb-1" htmlFor="quantity-L">Large</label>
                    <input
                      type="number"
                      id="quantity-L"
                      value={large === 0 ? '' : large}
                      onChange={(e) => setLarge(parseInt(e.target.value) || 0)}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                    />
                  </div>

                  {/* Extra Large Size Input */}
                  <div className="flex flex-col items-center">
                    <label className="block text-gray-600 mb-1" htmlFor="quantity-XL">Extra Large</label>
                    <input
                      type="number"
                      id="quantity-XL"
                      value={extraLarge === 0 ? '' : extraLarge}
                      onChange={(e) => setExtraLarge(parseInt(e.target.value) || 0)}
                      className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-2" htmlFor="price">Price</label>
                <input 
                  type="text" 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2" htmlFor="imageUrl">Image URL</label>
                <input 
                  type="text" 
                  id="imageUrl" 
                  value={imgUrl}
                  onChange={(e) => setImageUrl(e.target.value)} // Handle image URL change
                  className="w-[20rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>

              <div className="text-center">
                <button 
                  type="submit"
                  className="w-64 h-12 mt-5 mb-6 bg-purple-600 text-white text-xl font-thin p-2 rounded-xl hover:bg-purple-200 hover:text-black transition-colors duration-200 focus:ring-2 focus:ring-purple-600"
                >
                  Add Item
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default AdminAddItem;
