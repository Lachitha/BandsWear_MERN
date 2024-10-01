import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

const MonthlySales = () => {
    const [quantities, setQuantities] = useState([]); 
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchMonthlyQuantity = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/calcMonthlyQuantity/${userId}`);
                setQuantities(response.data); 
            } catch (err) {
                setError(err.response ? err.response.data.error : 'An error occurred');
            }
        };

        fetchMonthlyQuantity();
    }, [userId]);

    const generatePDF = () => {
      const doc = new jsPDF();
      const margin = 14; // Left margin
      let offsetY = 22; // Starting Y position
  
      doc.setFontSize(20);
      doc.text('Monthly Sales Quantity', margin, offsetY);
      offsetY += 10; // Spacing after title
  
      quantities.forEach((item) => {
          const { itemCode, small, medium, large, extraLarge } = item;
  
          // Set the title for the item code
          doc.setFontSize(16);
          doc.text(`Item Code: ${itemCode}`, margin, offsetY);
          offsetY += 10; // Spacing after item code
  
          // Set the sizes
          doc.setFontSize(12);
          doc.text(`Small: ${small || 0}`, margin, offsetY);
          offsetY += 8; // Spacing after small size
          doc.text(`Medium: ${medium || 0}`, margin, offsetY);
          offsetY += 8; // Spacing after medium size
          doc.text(`Large: ${large || 0}`, margin, offsetY);
          offsetY += 8; // Spacing after large size
          doc.text(`Extra Large: ${extraLarge || 0}`, margin, offsetY);
          offsetY += 10; // Extra spacing between different items
  
          // Check if the offset exceeds the page height (e.g., 270)
          if (offsetY >= 270) {
              doc.addPage(); // Create a new page if it exceeds
              offsetY = 20; // Reset Y offset for the new page
          }
      });
  
      doc.save('monthly_sales_quantity.pdf');
  };
  

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Monthly Sales Quantity</h1>
            <ul className="mb-4">
                {quantities.map(({ itemCode, small, medium, large, extraLarge }) => (
                    <li key={itemCode} className="mb-3 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
                        <h3 className="text-xl font-semibold">Item Code: {itemCode}</h3>
                        <ul>
                            <li>Small: {small || 0}</li>
                            <li>Medium: {medium || 0}</li>
                            <li>Large: {large || 0}</li>
                            <li>Extra Large: {extraLarge || 0}</li>
                        </ul>
                    </li>
                ))}
            </ul>
            <button 
                onClick={generatePDF}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
                Generate PDF
            </button>
        </div>
    );
};

export default MonthlySales;
