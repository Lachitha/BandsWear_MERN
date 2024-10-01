import React from 'react'; 
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import sampleImage1 from '../Images/sample-image1.jpeg'; // Replace with the actual image path
import sampleImage2 from '../Images/sample-image2.png'; // Replace with the actual image path
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Initialize toast notifications


function AdminBuyItem() {

  // Function to handle buying an item
  const handleBuyItem = (itemName) => {
    // Simulating a purchase request
    try {
      // Here you would make an API call to process the purchase
      // e.g., axios.post('/api/buy', { item: itemName });

      // Simulate success response
      toast.success(`${itemName} purchased successfully!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      // Handle any error that occurs
      toast.error(`Failed to purchase ${itemName}. Please try again.`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      
      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="max-w-5xl w-full">
          
          {/* Product Card 1 */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex mb-6">
            <img className="w-32 h-32 rounded-md object-cover mr-4" src={sampleImage1} alt="Short frock" />
            <div className="flex-1">
              <div className="text-lg font-semibold mb-2">Category: Short Frock</div>
              <div className="text-sm mb-2">Size: S</div>
              <div className="text-sm mb-2">Price: LKR.4500.00</div>
              <div className="text-sm mb-4">Quantity: 10</div>
              <button 
                onClick={() => handleBuyItem('Short Frock')} 
                className="bg-purple-500 text-white px-4 py-2 rounded-md">
                Buy Now
              </button>
            </div>   
          </div>

          {/* Product Card 2 */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex mb-6">
            <img className="w-32 h-32 rounded-md object-cover mr-4" src={sampleImage2} alt="Long Frock" />
            <div className="flex-1">
              <div className="text-lg font-semibold mb-2">Category: Long Frock</div>
              <div className="text-sm mb-2">Size: L</div>
              <div className="text-sm mb-2">Price: LKR.6200.00</div>
              <div className="text-sm mb-4">Quantity: 20</div>
              <button 
                onClick={() => handleBuyItem('Long Frock')} 
                className="bg-purple-500 text-white px-4 py-2 rounded-md">
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminBuyItem;
