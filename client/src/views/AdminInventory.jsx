import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import deliveryIcon from "../Images/delivery-icon.png"; // Replace with actual path if needed

function AdminInventory() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [selectedReportCategory, setSelectedReportCategory] = useState('All Categories'); // State for the dropdown

  // Sample inventory data
  const inventoryData = [
    { id: 1, name: 'Long Frocks', currentQuantity: 100, maxQuantity: 100 },
    { id: 2, name: 'Short Frocks', currentQuantity: 60, maxQuantity: 100 },
    { id: 3, name: 'Party Frocks', currentQuantity: 30, maxQuantity: 100 },
    { id: 4, name: 'Kids Frocks', currentQuantity: 10, maxQuantity: 100 },
  ];

  // Event handler for placing an order
  const handlePlaceOrder = (itemName) => {
    // Navigate to the AdminPlaceOrder page and pass the item name as state
    navigate('/AdminPlaceOrder', { state: { itemName } });
  };

  // Event handler for opening the update modal
  const handleOpenUpdateModal = (item) => {
    setSelectedItem(item);
    setCurrentQuantity(item.currentQuantity);
    setMaxQuantity(item.maxQuantity);
    setModalOpen(true);
  };

  // Event handler for updating quantities
  const handleUpdateQuantity = () => {
    // Update logic can be added here (e.g., API call to update the item in the database)
    console.log('Updated item:', selectedItem.name, {
      currentQuantity,
      maxQuantity,
    });
    // Close modal after updating
    setModalOpen(false);
  };

  // Event handler for generating reports
  const handleGenerateReport = () => {
    console.log(`Generating report for: ${selectedReportCategory}`);
    // Logic for generating the report can be added here
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      
      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="max-w-5xl w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Categories</h2>
            
            {/* Dropdown for report selection */}
            <select
              value={selectedReportCategory}
              onChange={(e) => setSelectedReportCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mr-2"
            >
              <option value="Long Frocks">All Category</option>
              <option value="Long Frocks">Long Frocks</option>
              <option value="Short Frocks">Short Frocks</option>
              <option value="Party Frocks">Party Frocks</option>
              <option value="Kids Frocks">Kids Frocks</option>
            </select>

            <button 
              className="bg-gray-300 px-4 py-2 rounded-md text-black"
              onClick={handleGenerateReport} // Add click handler for generating report
            >
              Generate Report
            </button>
          </div>
          
          {/* Inventory Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Current Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Max Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantity Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Place Order</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map(item => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.currentQuantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.maxQuantity}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={item.currentQuantity < 20 ? "bg-red-500 text-white px-2 py-1 rounded-md" : "bg-green-500 text-white px-2 py-1 rounded-md"}>
                      {item.currentQuantity < 20 ? 'Low' : 'Fine'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="flex items-center bg-gray-300 px-3 py-2 rounded-md"
                      onClick={() => handlePlaceOrder(item.name)}
                    >
                      <img src={deliveryIcon} alt="Order Icon" className="w-5 h-5 mr-2" />
                      Place Order
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="flex items-center bg-purple-300 px-3 py-2 rounded-md"
                      onClick={() => handleOpenUpdateModal(item)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update {selectedItem.name}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Current Quantity:</label>
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Quantity:</label>
              <input
                type="number"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
                className="w-[4rem] h-[2rem] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleUpdateQuantity}
              >
                Update
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminInventory;
