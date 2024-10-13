import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navigation from './Components/UserNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Footer from './Components/Footer';

const ItemDetail = () => {
  const { itemId, userId } = useParams(); // Get itemId and userId from URL params
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // State to manage cart items
  const [selectedSize, setSelectedSize] = useState(''); // Track selected size
  const [quantity, setQuantity] = useState(0); // Track quantity for the selected size

  useEffect(() => {
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

    const availableQuantity = item[selectedSize]; // Get available quantity for the selected size
    if (availableQuantity === 0) {
      alert(`${item.itemName} in size ${selectedSize} is sold out.`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/AddtoCart', {
        userId: userId,
        itemId: itemId,
        itemName: item.itemName,
        itemCode: item.itemCode,
        category: item.category,
        unitPrice: item.price,
        price: item.price * quantity, // Total price based on quantity
        size: selectedSize,
        quantity: quantity,
        imgUrl: item.imgUrl,
      });

      setCart([...cart, { ...item, quantity, size: selectedSize }]);
      alert(`${item.itemName} (${selectedSize}) - Quantity: ${quantity} has been added to your cart!`);
      setQuantity(0);
      setSelectedSize('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Handle duplicate item error
      } else {
        console.error('Error adding to cart:', err);
        setError('Failed to add item to cart. Please try again later.');
      }
    }
  };

  const handleIncrement = () => {
    const availableQuantity = item[selectedSize]; // Get available quantity for the selected size
    if (quantity < availableQuantity) {
      setQuantity(quantity + 1);
    } else {
      alert(`Can't add more than ${availableQuantity} for ${selectedSize}`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(0);
      setSelectedSize(''); // Reset size if quantity is 0
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const availableQuantity = item[size]; // Get available quantity for the selected size
    setQuantity(availableQuantity > 0 ? 1 : 0); // Set quantity only if size is available
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
            <h1 className="text-3xl font-bold mb-2">{item.itemName}</h1>
            <p className="text-purple-600 font-bold text-2xl pb-6">Price - Rs: {item.price}.00</p>

            {/* Size Selection */}
            <ul className="ml-4 list-disc text-gray-700 pb-6 flex gap-20 mt-20 mb-20">
              {['large', 'medium', 'small', 'extraLarge'].map((size) => {
                const sizeAbbreviation = {
                  large: 'L',
                  medium: 'M',
                  small: 'S',
                  extraLarge: 'EX',
                }[size]; // Get size abbreviation

                const isSoldOut = item[size] === 0; // Check if size is sold out
                const isSelected = selectedSize === size;

                return (
                  <li key={size} className="flex items-center justify-between border-2 border-purple-500 rounded-md hover:bg-purple-400">

                    <button
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-300'
                      }`}
                    >
                      {sizeAbbreviation} {/* Display abbreviation */}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Show "Sold Out" Message if Selected Size is Sold Out */}
            {selectedSize && item[selectedSize] === 0 && (
              <div className="text-red-600 font-bold text-lg">
                {item.itemName} in {selectedSize} is Sold Out!
              </div>
            )}

            {/* Increment/Decrement Buttons */}
            {selectedSize && item[selectedSize] > 0 && (
              <div className="flex items-center space-x-4 mb-4 ml-4 border border-purple-500 pt-5 pb-5 pl-20 w-[26rem]">
                <div>Select Quantity</div>
                <button
                  onClick={handleDecrement}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={quantity === 0}
                >
                  -
                </button>
                <span className="text-xl">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  +
                </button>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex justify-between items-center mt-auto text-center pt-28">
              <button
                onClick={handleAddToCart}
                className="h-full w-[15rem] border-2 text-center border-purple-600 bg-white text-purple-600 px-4 py-2 rounded flex items-center justify-center hover:bg-purple-600 hover:text-white"
                disabled={!selectedSize || quantity === 0}
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
      <Footer />
    </div>
  );
};

export default ItemDetail;
