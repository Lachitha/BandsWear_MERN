import React from 'react';
import Logo from '../../Images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faShoppingBasket, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';

function Navigation() {

  const { userId } = useParams(); // Destructure userId from useParams()
  
  return (
    <div>
      {/* Navigation Bar */}
      <div className='flex justify-between items-center h-auto bg-[#D9D9D9] pl-40 pr-40'>
        {/* Left side: Logo */}
        <div className='flex items-center'>
          <img src={Logo} alt="Logo" className='h-16 m-5' />
        </div>

        {/* Right side: User Icon */}
        <div className='flex items-center space-x-4 pr-6'>
          {/* Link to UserProfile with userId */}
          <Link to={`/UserProfile/${userId}`}>
            <FontAwesomeIcon icon={faUser} className='text-xl' />
          </Link>

          <Link to={`/MyCart/${userId}`}>
            <FontAwesomeIcon icon={faShoppingCart} className='text-xl' />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
