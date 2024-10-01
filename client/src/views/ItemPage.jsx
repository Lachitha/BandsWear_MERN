import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navigation from './Components/UserNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Footer from './Components/Footer';

const ItemDetail = () => {
  const { itemId } = useParams(); // Get itemId from URL params
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // State to manage cart items
  const [selectedSize, setSelectedSize] = useState(''); // State to track selected size
  const [quantity, setQuantity] = useState(0); // State to track quantity for the selected size
  const {userId} = useParams(); // Ensure this is fetched from context or props

  useEffect(() => {
    // Fetch item details from the server
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/showCustomerById/${itemId}`);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to fetch item details. Please try again later.');
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleAddToCart = async () => {
    if (!selectedSize || quantity === 0) {
      alert('Please select a valid size and quantity.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/AddtoCart', {
        userId: userId, // Ensure this is extracted correctly
        itemId: itemId,
        itemName: item.itemName,
        itemCode: item.itemCode,
        category: item.category,
        unitPrice: item.price,
        price: item.price * quantity, // Total price based on quantity
        size: selectedSize,
        quantity: quantity,
        imgUrl: item.imgUrl // Correct reference
      });
      
      setCart([...cart, { ...item, quantity, size: selectedSize }]);
      alert(`${item.itemName} (${selectedSize}) - Quantity: ${quantity} has been added to your cart!`);
      setQuantity(0);
      setSelectedSize('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Display the message for duplicate item
      } else {
        console.error('Error adding to cart:', err);
        setError('Failed to add item to cart. Please try again later.');
      }
    }
  };
  
  
  
  const handleIncrement = (size) => {
    const availableQuantity = item[size]; // Get available quantity for the selected size
    if (quantity < availableQuantity) {
      setQuantity(quantity + 1);
      setSelectedSize(size); // Set the selected size
    } else {
      alert(`Can't add more than ${availableQuantity} for ${size}`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
    if (quantity === 1) {
      setSelectedSize(''); // Reset size if quantity goes to 0
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>; // Display error message
  }

  if (!item) {
    return <div className="text-center">Loading...</div>; // Show loading state while fetching data
  }

  const totalPrice = item.price * quantity; // Calculate total price

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Item Image */}
          <div className="flex-shrink-0 mb-6 md:mb-0 md:w-1/4">
            <img 
              src={item.imgUrl} 
              alt={item.itemName} 
              className="w-full h-auto object-cover rounded-lg shadow-md" 
            />
          </div>

          {/* Item Details */}
          <div className="md:ml-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.itemName}</h1>
              <p className="text-purple-600 font-bold text-2xl pb-6">Price - Rs: {item.price}.00</p>

              <ul className="ml-4 list-disc text-gray-700 space-y-2 pb-6">
                {['large', 'medium', 'small', 'extraLarge'].map((size) => (
                  <li key={size} className="flex items-center justify-between">
                    <span>{size.charAt(0).toUpperCase() + size.slice(1)}: {item[size]} available</span>
                    <div className="flex items-center">
                      <button
                        onClick={handleDecrement}
                        className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ${selectedSize === size ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={selectedSize !== size || quantity === 0}
                      >
                        -
                      </button>
                      <span className="mx-2 text-xl">{selectedSize === size ? quantity : 0}</span>
                      <button
                        onClick={() => handleIncrement(size)}
                        className={`bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 ${item[size] > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={item[size] <= 0 || (selectedSize && selectedSize !== size)} // Disable if size is selected and not the current one
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Button and Total Price Inline with Image Bottom */}
            <div className="flex justify-between items-center mt-auto text-center pt-28">
            <button 
              onClick={handleAddToCart} 
              className="h-full w-[15rem] border-2 text-center border-purple-600 bg-white text-purple-600 px-4 py-2 rounded flex items-center justify-center hover:bg-purple-600 hover:text-white"
              disabled={!selectedSize || quantity === 0} // Disable if no size selected or quantity is 0
            > 
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Add To Cart
            </button>


              {/* Display Total Price */}
              {quantity > 0 && (
                <div className="text-lg font-bold text-center text-purple-600">
                  Total Price: Rs {totalPrice}.00
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ItemDetail;
