import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import jsPDF from 'jspdf';
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import the desired icon
import logo from "../Images/logo.png";

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
            <Link to={`/AdminOrderStatus`}>
              <button className="bg-purple-500 text-white px-4 ml-[40rem] py-2 rounded-md shadow hover:bg-purple-600 transition duration-300">
                Order Status
              </button>
            </Link>
            
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
                  <th className="border border-gray-300 px-6 py-3 text-left">Item Name</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Small</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Medium</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Large</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Extra Large</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Generate Report</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Place Order</th>
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
                      <td className="border border-gray-300 px-6 py-3">{item.itemName}</td>
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
                          className="bg-blue-400 text-white px-3 py-2 rounded-md shadow hover:bg-blue-500 transition duration-300"
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
                            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> {/* Add the icon here */}
                            Order
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No items found for the selected category.
                    </td>
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
