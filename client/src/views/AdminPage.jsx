import React from 'react';
import AdminNavigation from './Components/AdminNavigation';
import bgimg from '../Images/bgimg.jpg';
import Footer from './Components/Footer';

function Adminpage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavigation />
      <div
        className="flex-grow flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: 'calc(100vh - 5rem)', // adjust based on AdminNavigation height
        }}
      >
        {/* Black transparent overlay */}
        <div
          className="absolute inset-0 bg-black opacity-50"
          style={{ zIndex: 1 }}
          role="img"
          aria-label="Background image overlay"
        ></div>

        {/* Content */}
        <div className="relative text-center mt-12 px-6 z-10">
          <h1 className="text-4xl font-extralight text-white mb-4">
            Welcome to BRANDS WEAR Admin Panel
          </h1>
          <p className="text-xl text-white">
            Effortlessly Manage Inventory, Suppliers, and Orders for Seamless Operations
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Adminpage;
