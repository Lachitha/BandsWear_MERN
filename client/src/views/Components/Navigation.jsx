import React from 'react';
import Logo from '../../Images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';

function Navigation() {
  const { userId } = useParams(); // Fix typo here
  return (
    <div>
      {/* Navigation Bar */}
      <div className='flex justify-between items-center h-auto bg-[#D9D9D9] pl-40 pr-40'>
        {/* Left side: Logo */}
        <div className='flex items-center'>
          <img src={Logo} alt="Logo" className='h-16 m-5' />
        </div>

        {/* Center: Navigation Buttons */}
        <div className='flex items-center space-x-2 text-xl font-thin'>
          <Link to={`/SupplierProduct/${userId}`}><button>Home</button></Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to='/OrderNotification'><button>Order Items</button></Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to={`/GenerateReport/${userId}`}><button>Sales Report</button></Link> {/* Use template literal */}
        </div>
        
        {/* Right side: User Icon */}
        <div className='flex items-center space-x-4 pr-6'>
          <FontAwesomeIcon icon={faUser} />
          <span>Hey, Supplier</span>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
