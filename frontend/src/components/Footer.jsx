import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-5 gap-16 mb-8">
          {/* Account Section */}
          <div>
            <h3 className="text-sm font-normal text-gray-800 mb-4">Account</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Log In</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Sign Up</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Redeem a Gift Card</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-normal text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Environmental Initiatives</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Factories</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">DEI</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">International</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Accessibility</a></li>
            </ul>
          </div>

          {/* Get Help Section */}
          <div>
            <h3 className="text-sm font-normal text-gray-800 mb-4">Get Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Bulk Orders</a></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-normal text-gray-800 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Facebook</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Affiliates</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Our Stores</a></li>
            </ul>
          </div>

          {/* Email Signup Section */}
          <div>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
              />
              <button className="bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-1 text-xs text-gray-400 mb-2">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Do Not Sell or Share My Personal Information</a>
            <a href="#" className="hover:text-gray-600 transition-colors">CA Supply Chain Transparency</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Vendor Code of Conduct</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Sitemap Pages</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Sitemap Products</a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-gray-400">© 2023 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;