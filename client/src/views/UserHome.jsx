import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Navigation from './Components/UserNavigation';
import Footer from './Components/Footer';

const UserHome = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { userId } = useParams();

  useEffect(() => {
    axios.get('http://localhost:3001/showCustomer')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navigation />
      
      {/* Main content area */}
      <div className="container mx-auto p-6 flex-grow pb-16">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 p-6 pb-10">Available Frock Items</h1>

        {/* Search and Category Dropdown */}
        <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by item name or code..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-2/3 p-2 border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full md:w-1/3 p-2 border border-purple-800 rounded-lg focus:outline-none focus:border-purple-800"
          >
            <option value="All">All Categories</option>
            <option value="Long Frocks">Long Frocks</option>
            <option value="Short Frocks">Short Frocks</option>
            <option value="Party Frocks">Party Frocks</option>
            <option value="Kids Frocks">Kids Frocks</option>
          </select>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Link to={`/ItemPage/${item._id}/${userId}`} key={item._id}>
              <div className="border border-purple-800 bg-white p-5 rounded-lg shadow-md hover:shadow-purple-900 transition-all duration-100 flex flex-col h-full">

                {/* Image for the item */}
                <div className="flex justify-center mb-4">
                  <img
                    src={item.imgUrl}
                    alt={item.itemName}
                    className="w-full h-auto object-cover rounded-t-lg sm:w-48 sm:h-72 md:w-64 md:h-96"
                  />
                </div>

                <h2 className="text-xl font-semibold text-purple-800 mb-2 pt-4">{item.itemName} - {item.itemCode}</h2>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-purple-800 font-bold text-xl p-4">LKR: {item.price}.00</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserHome;
