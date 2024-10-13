import React, { useEffect, useState } from 'react'; 
import AdminNavigation from './Components/AdminNavigation';
import Footer from './Components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import axios from 'axios';

function AdminBuyItem() {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    axios.get('http://localhost:3001/showSupplierProducts')
      .then(response => {
       
        setProducts(response.data);
      })
      .catch(error => {
        toast.error("Failed to load products. Please try again later.", {
          position: "top-center",
        });
      });
  }, []);                                                                                                                                                                  


  // Function to handle buying an item
  const handleBuyItem = (product) => { 
    axios.post('http://localhost:3001/AddItem', {
      itemName: product.itemName,
      category: product.Category,
      price: product.Price,
      size: "L", // Adjust size based on user selection if applicable
      itemCode: product.itemCode,
      imgUrl: product.imageURL,
      large: product.large,
      small: product.small,
      medium: product.medium,
      extraLarge: product.extraLarge,
    })
    .then(() => {
     
      toast.success(`${product.itemName} purchased successfully!`, {
        position: "top-center",
      });
    })
    .catch(() => {
      toast.error(`Failed to purchase ${product.itemName}. Already Buy It.`, {
        position: "top-center",
      });                
    });       
  };

  // Function to handle deleting an item
  const handleDeleteItem = (productId) => {
    axios.delete(`http://localhost:3001/deleteProduct/${productId}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== productId));
        toast.success('Product deleted successfully.', {
          position: "top-center",
        });
      })
      .catch(() => {
        toast.error('Failed to delete product. Please try again.', {
          position: "top-center",
        });
      });
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      
      <div className="flex-grow container mx-auto p-6">
        <div className="flex flex-col items-center space-x-4 bg-[#D9D9D9] ml-52 mr-52 mt-10 rounded-xl py-10 mb-20">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product._id}
                className={`relative p-10 rounded-xl shadow flex items-center space-x-4 mt-10 w-[50rem] transition duration-300 ease-in-out transform 
                ${product.purchased ? 'border-2 border-red-500' : 'border-2 border-green-500'} bg-white`}
              >
                <img className="w-32 h-32 rounded-md object-cover mr-4" src={product.imageURL} alt={product.itemName} />
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-2">Name: {product.itemName}</div>
                  <div className="text-lg font-semibold mb-2">Category: {product.Category}</div>
                  <div className="text-lg font-semibold mb-2">Item code: {product.itemCode}</div>
                  <div className="text-lg font-semibold mb-2">Company Name: {product.companyName}</div>
                  <div className="text-sm mb-2">Price: LKR. {product.Price}</div>
                  <div className="text-sm mb-4">Small: {product.small}</div>
                  <div className="text-sm mb-4">Medium: {product.medium}</div>
                  <div className="text-sm mb-4">Large: {product.large}</div>
                  <div className="text-sm mb-4">Extra Large: {product.extraLarge}</div>
                  <div className="text-sm mb-4">Delivery Date: {new Date(product.deliveryDate).toLocaleDateString()}</div>
                  <button 
                    onClick={() => handleBuyItem(product)} 
                    className={`w-64 h-12 mt-5 mb-6 bg-purple-500 text-white text-xl font-thin p-2 rounded-xl hover:bg-purple-200 hover:text-black transition-colors duration-200 focus:ring-2 focus:ring-purple-600 ${product.purchased ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.purchased} // Disable if purchased
                  >
                    {product.purchased ? 'Purchased' : 'Buy Now'}
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteItem(product._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>     
              </div>
            ))
          ) : (
            <div>No products available at the moment.</div>
          )}
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default AdminBuyItem;
