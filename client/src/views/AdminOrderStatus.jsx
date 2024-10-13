import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import axios from 'axios';

function AdminOrderStatus() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Fetching orders on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/showAcceptOrders')
      .then(response => {
        // Sort orders by createdAt in descending order to show the most recent first
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders); // Store sorted orders in state
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleGoToInventory = () => {
    navigate('/Inventory'); // Navigates to the Inventory page
  };

  const handleAcceptOrder = (orderId) => {
    axios.put(`http://localhost:3001/AcceptAdminOrder/${orderId}`)
      .then(response => {
        console.log("Order accepted:", response.data);
        // Refresh orders after accepting an order
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: 'Accepted' } : order
          )
        );
      })
      .catch(error => {
        console.error("Error accepting order:", error);
      });
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      <div className="flex-grow container mx-auto p-6">
        <div className="flex flex-col items-center space-x-4 bg-[#D9D9D9] ml-52 mr-52 mt-10 rounded-xl py-10 mb-20">
          <h1 className="text-4xl font-thin text-gray-700 mb-6">Supplier Order Status</h1>
          {/* Main Content */}
          <div className="flex-grow container mx-auto p-6">
            <div className="flex flex-col items-center space-x-4 bg-[#D9D9D9] ml-52 mr-52 mt-10 rounded-xl py-10 mb-20">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="relative bg-white p-10 rounded-xl shadow flex items-center space-x-4 mt-10 w-[50rem] transition duration-300 ease-in-out transform hover:scale-105">
                    <img className="w-32 h-32 rounded-md object-cover mr-4" src={order.imageURL} alt={order.itemName} />
                    <div className="flex-1">
                      <div className="text-lg font-semibold mb-2">Name: {order.itemName}</div>
                      <div className="text-lg font-semibold mb-2">Category: {order.category}</div>
                      <div className="text-lg font-semibold mb-2">Item Code: {order.itemCode}</div>
                      <div className="text-lg font-semibold mb-2">Company Name: {order.companyName}</div>
                      <div className="text-sm mb-2">Price:  {order.price}</div>
                      <div className="text-sm mb-4">Small: {order.small}</div>
                      <div className="text-sm mb-4">Medium: {order.medium}</div>
                      <div className="text-sm mb-4">Large: {order.large}</div>
                      <div className="text-sm mb-4">Extra Large: {order.extraLarge}</div>
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        className="bg-purple-600 border text-white px-4 py-2 rounded-md hover:bg-white hover:border-black hover:text-black transition duration-300 ease-in-out"
                      >
                        + Add Inventory
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No orders available.</div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminOrderStatus;
