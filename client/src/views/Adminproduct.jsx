import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

function AdminProduct() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);

  // Fetch products from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/showCustomer')
      .then(response => {
        setProducts(response.data);  // Store the fetched products in the state
      })
      .catch(err => console.error(err));
  }, []);

  // Filter products based on search query for both category and itemCode
  const filteredProducts = products.filter(product =>
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.itemCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle delete action
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:3001/deleteItem/${productId}`)
        .then(response => {
          alert('Item deleted successfully!');
          // Update the products state to remove the deleted item
          setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
        })
        .catch(error => {
          console.error('Error deleting item:', error);
          alert('Failed to delete item.');
        });
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />

      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Search Bar Section */}
        <div className="bg-white py-4 px-6 shadow-md">
          <div className="container mx-auto">
            <div className="flex justify-center">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search products by category or item code..."
                  className="border rounded-lg px-4 py-2 w-[30rem] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow container mx-auto p-6">
          <div className="flex flex-col items-center space-x-4 bg-[#D9D9D9] ml-52 mr-52 mt-10 rounded-xl py-10 mb-20">
            <h1 className="text-4xl font-thin text-gray-700 mb-6">Add Your Product Here</h1>

            {/* Add Item Button */}
            <div className="text-center mb-6">
              <Link to='/AdminAddItem'>
                <button className="bg-purple-700 mt-5 text-white text-xl font-thin px-6 py-2 w-40 h-14 rounded-lg hover:bg-white hover:text-black transition duration-300 ease-in-out flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Item
                </button>
              </Link>
            </div>

            <div className="w-full flex flex-col items-center space-y-6">
              {/* Map through products and display them */}
              {filteredProducts.map((product, index) => (
                <div key={index} className="bg-white p-10 rounded-xl shadow flex items-center space-x-4 mt-10 w-[50rem] transition duration-300 ease-in-out transform hover:scale-105">
                  {/* Use imageUrl from product data to display the correct image */}
                  <img src={product.imgUrl} alt="Product" className="h-40 w-auto rounded-xl mr-24" />
                  <div className="flex-grow space-y-2 text-start">
                    <p className="text-gray-600">Item Name: <span className="font-bold">{product.itemName + " - " + product.itemCode}</span></p>
                    <p className="text-gray-600">Price: <span className="font-bold">LKR {product.price}</span></p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link to={`/UpdateAdmin/${product._id}`}>
                      <button className="bg-purple-600 border text-white px-4 py-2 rounded-md hover:bg-white hover:border-black hover:text-black transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Update
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(product._id)} // Call handleDelete on click
                      className="bg-red-600 border border-red-700 px-4 py-2 rounded-md hover:bg-white hover:text-black text-white font-semibold transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminProduct;
