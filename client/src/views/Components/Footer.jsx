import React from 'react';

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-200 p-6">
        <div className="max-w-screen-xl mx-auto flex justify-between text-sm text-gray-600 mt-20">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800">About Us</h3>
            <p>BRANDS WEAR offers trendy, affordable fashion with a focus on quality and exceptional customer service. Discover your style with us!</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800">Customer Support</h3>
            <p>Contact No: 0707230078</p>
            <p>Email: brandswear@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;