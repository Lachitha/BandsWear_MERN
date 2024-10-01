import React from 'react';
import HomeNavigation from './Components/HomeNavigation';
import bgimg from '../Images/homebg.jpeg';
import Footer from './Components/Footer';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faArrowRight, faLeftRight, faShop } from '@fortawesome/free-solid-svg-icons';


function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <HomeNavigation />
      <div
        className="flex-grow flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: 'calc(100vh - 5rem)', // adjust based on HomeNavigation height
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className='relative text-center text-white space-y-6'>
          <h1 className='text-5xl font-thin mb-4'>Welcome to BRANDS WEAR</h1>
          <p className='text-xl md:text-2xl font-light'>Your Ultimate Destination for Trendy and Affordable Fashion</p>
          <button className='mt-6 px-6 py-3 text-xl  text-white font-semibold transition duration-300'>
            Shop Now
            <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
          </button>
        </div>
        {/* Supplier Button Positioned in the Right Corner */}
        <div className="absolute bottom-10 right-10 text-white p-4 rounded-lg shadow-lg flex items-center">
          <span className="mr-2">If you’re a supplier</span>
          <Link to ='/SupplierRegForm'><button className="px-4 py-2  text-white font-semibold rounded-lg shadow transition duration-300">
            Click here
          </button></Link>
        </div>
      </div>
      <Footer />
    </div>
  );
  
}

export default Home;
