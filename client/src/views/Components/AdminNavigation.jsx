import React from 'react';
import Logo from '../../Images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div>
      {/* Navigation Bar */}
      <div className='flex justify-between items-center h-auto bg-[#D9D9D9] pl-40 pr-40'>
        {/* Left side: Logo */}
       <div className='flex items-center'>
          <img src={Logo} alt="Logo" className='h-16 m-5' />
        </div>

        {/* Center: Navigation Buttons */}
        <div className='flex items-center space-x-2 text-sm'>
          <Link to='/Adminproduct'>
            <button className='transition duration-300 ease-in-out transform hover:scale-105'>Product category</button>
          </Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to='/Inventory'>
            <button className='transition duration-300 ease-in-out transform hover:scale-105'>Inventory</button>
          </Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to='/AdminBuyItem'>
            <button className='transition duration-300 ease-in-out transform hover:scale-105'>Supplier Products</button>
          </Link>
        </div>
        
        {/* Right side: User Icon */}
        <div className='flex items-center space-x-4 pr-6'>
          <Link to='/'>
          <FontAwesomeIcon icon={faUser} className='text-2xl' />
          </Link>
          <span>Welcome Admin</span>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
