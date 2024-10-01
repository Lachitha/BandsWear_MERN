import React from 'react';
import Navigation from './Components/Navigation'; // Ensure you have this component
import Footer from './Components/Footer'; // Ensure you have this component
import sampleImage from '../Images/sample-image1.jpeg'; // Replace with the actual image path
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function OrderNotification() {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle accepting the order
  const handleAcceptOrder = () => {
    navigate('/AcceptAdminOrder'); // Navigate to the AcceptAdminOrder page
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Order Items</h2>
          
          {/* Order Details */}
          <div className="flex mb-6">
            <img className="w-32 h-32 rounded-md object-cover mr-4" src={sampleImage} alt="Ordered Item" />
            <div className="flex-1">
              <div className="text-lg font-semibold mb-2">Category: Party frocks</div>
              <div className="text-sm mb-2">Quantity: 30</div>
              <div className="text-sm mb-2">Size: S</div>
              <div className="text-sm mb-2">Date Needed: 2024.08.25</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around mt-6">
            <button 
              className="bg-purple-500 text-white px-4 py-2 rounded-md"
              onClick={handleAcceptOrder} // Set the click handler
            >
              Accept Order
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Reject Order</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderNotification;
