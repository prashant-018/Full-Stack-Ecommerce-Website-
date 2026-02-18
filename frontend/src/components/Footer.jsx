import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const footerSections = [
    {
      title: 'Account',
      links: ['Log In', 'Sign Up', 'Redeem a Gift Card']
    },
    {
      title: 'Company',
      links: ['About', 'Environmental Initiatives', 'Factories', 'DEI', 'Careers', 'International', 'Accessibility']
    },
    {
      title: 'Get Help',
      links: ['Help Center', 'Return Policy', 'Shipping Info', 'Bulk Orders']
    },
    {
      title: 'Connect',
      links: ['Facebook', 'Instagram', 'Twitter', 'Affiliates', 'Our Stores']
    }
  ];

  return (
    <footer className="bg-gray-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-4 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="border-b border-gray-300 pb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-medium text-gray-800">{section.title}</h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${expandedSection === section.title ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {expandedSection === section.title && (
                <ul className="mt-4 space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Email Signup - Mobile */}
          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Stay Connected</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
              />
              <button className="bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
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

          {/* Email Signup Section - Desktop */}
          <div>
            <h3 className="text-sm font-normal text-gray-800 mb-4">Stay Connected</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
              />
              <button className="bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-gray-300 pt-4 sm:pt-6">
          <div className="flex flex-wrap justify-start gap-x-4 sm:gap-x-6 gap-y-2 text-xs text-gray-400 mb-4">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors hidden sm:inline">Do Not Sell or Share My Personal Information</a>
            <a href="#" className="hover:text-gray-600 transition-colors hidden md:inline">CA Supply Chain Transparency</a>
            <a href="#" className="hover:text-gray-600 transition-colors hidden lg:inline">Vendor Code of Conduct</a>
            <a href="#" className="hover:text-gray-600 transition-colors hidden lg:inline">Sitemap Pages</a>
            <a href="#" className="hover:text-gray-600 transition-colors hidden lg:inline">Sitemap Products</a>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-400">© 2024 Everlane. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;