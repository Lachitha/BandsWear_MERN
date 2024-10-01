import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import jsPDF from 'jspdf';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import deliveryIcon from "../Images/delivery-icon.png"; 
import logo from "../Images/logo.png"; // Import your logo image

function Inventory() {
  const navigate = useNavigate(); 

  const [inventoryData, setInventoryData] = useState([]);
  const [selectedReportCategory, setSelectedReportCategory] = useState('All Categories'); 

  useEffect(() => {
    // Fetch inventory data from the API
    axios.get('http://localhost:3001/showCustomer')
      .then(response => {
        setInventoryData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter inventory based on selected category
  const filteredInventory = selectedReportCategory === 'All Categories' 
    ? inventoryData 
    : inventoryData.filter(item => item.category === selectedReportCategory);

  const handlePlaceOrder = (itemName) => {
    navigate('/AdminPlaceOrder', { state: { itemName } });
  };

  const handleDeleteItem = (itemId) => {
    axios.delete(`http://localhost:3001/deleteItem/${itemId}`)
      .then(response => {
        // Update state to remove the deleted item
        setInventoryData(inventoryData.filter(item => item._id !== itemId));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleGenerateReport = (item) => {
    const doc = new jsPDF();

    // Set overall styling
    doc.setFillColor(255, 255, 255); // Background color
    doc.rect(0, 0, 210, 297, 'F'); // Fill the whole page

    // Add a border to the tag
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277); // Border for the clothing tag

    // Add the logo
    doc.addImage(logo, 'PNG', 150, 20, 40, 40); // Adjust position and size as needed

    // Add item details
    doc.setFontSize(22);
    doc.setFont("Helvetica", "bold");
    doc.text('Premium Clothing Tag', 15, 30); // Title

    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal");
    doc.text(`Item Name: ${item.itemName}`, 15, 50);
    doc.text(`Item Code: ${item.itemCode}`, 15, 70);
    doc.text(`Price: LKR ${item.price}`, 15, 90); // Updated price display
    doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`, 15, 110);

    // Add barcode (visual representation)
    doc.setFontSize(18);
    doc.text("| | | | | | | | | |", 15, 235); // Simple barcode placeholder

    // Save the PDF
    doc.save(`${item.itemName}_Report.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavigation />
      
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-7xl bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">All Categories</h2>
            
            <div className="flex space-x-4">
              <select
                value={selectedReportCategory}
                onChange={(e) => setSelectedReportCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-purple-300"
              >
                <option value="All Categories">All Categories</option>
                <option value="Long Frocks">Long Frocks</option>
                <option value="Short Frocks">Short Frocks</option>
                <option value="Party Frocks">Party Frocks</option>
                <option value="Kids Frocks">Kids Frocks</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border border-gray-300 px-6 py-3 text-left">Image</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Category</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Price</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Item Name</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Status</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Small</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Medium</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Large</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Extra Large</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Generate Report</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Place Order</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredInventory) && filteredInventory.length > 0 ? (
                  filteredInventory.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-6 py-3">
                        <img src={item.imgUrl} alt={item.itemName} className="w-16 h-16 object-cover rounded-md" />
                      </td>
                      <td className="border border-gray-300 px-6 py-3">{item.category}</td>
                      <td className="border border-gray-300 px-6 py-3">LKR {item.price}</td> {/* Updated price display */}
                      <td className="border border-gray-300 px-6 py-3">{item.itemName}</td>
                      <td className="border border-gray-300 px-6 py-3">{item.availability}</td>
                      <td className="border border-gray-300 px-6 py-3">
                        {item.small} {item.small < 10 && <span className="text-red-500 ml-2">Low</span>}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {item.medium} {item.medium < 10 && <span className="text-red-500 ml-2">Low</span>}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {item.large} {item.large < 10 && <span className="text-red-500 ml-2">Low</span>}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {item.extraLarge} {item.extraLarge < 10 && <span className="text-red-500 ml-2">Low</span>}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        <button
                          className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition duration-300"
                          onClick={() => handleGenerateReport(item)}
                        >
                          Generate Report
                        </button>
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        <Link to={`/AdminPlaceOrder/${item._id}`}>
                          <button
                            className="flex items-center bg-gray-300 text-black px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-300"
                            onClick={() => handlePlaceOrder(item.itemName)}
                          >
                            <img src={deliveryIcon} alt="Order Icon" className="w-5 h-5 mr-2" />
                            Order
                          </button>
                        </Link>
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition duration-300"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-4">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Inventory;
