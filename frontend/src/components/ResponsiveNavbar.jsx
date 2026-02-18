import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserStatus from "./UserStatus";
import { Menu, X, Search, User, ShoppingBag, ChevronDown, Shield, UserCircle, Package, Settings, LogOut } from "lucide-react";
import { useLogout } from '../hooks/useLogout';

function FlagIndia({ className = "w-4 h-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
    >
      <rect width="900" height="200" fill="#FF9933" />
      <rect width="900" height="200" y="200" fill="#FFFFFF" />
      <rect width="900" height="200" y="400" fill="#138808" />
      <circle cx="450" cy="300" r="50" fill="none" stroke="#000080" strokeWidth="2" />
    </svg>
  );
}

const tabs = ["Women", "Men", "About", "Everworld Stories"];

const menuData = {
  Women: {
    highlights: [
      "Shop All New Arrivals",
      "The Gift Guide",
      "New Bottoms",
      "New Tops",
      "T-Shirt Bundles",
      "Under ₹8,300"
    ],
    featured: [
      "The Holiday Outfit Edit",
      "Giftable Sweaters",
      "Uniform & Capsule",
      "The Performance Chino Shop",
      "Top Rated Women's Clothing"
    ]
  },
  Men: {
    highlights: [
      "Shop All New Arrivals",
      "The Gift Guide",
      "New Bottoms",
      "New Tops",
      "T-Shirt Bundles",
      "Under ₹8,300"
    ],
    featured: [
      "The Holiday Outfit Edit",
      "Giftable Sweaters",
      "Uniform & Capsule",
      "The Performance Chino Shop",
      "Top Rated Men's Clothing"
    ]
  }
};

export default function ResponsiveNavbar({ onCartClick, cartItemCount = 0 }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const handleLogout = useLogout();

  const toggleMobileSubmenu = (menu) => {
    setExpandedMobileMenu(expandedMobileMenu === menu ? null : menu);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white">
      {/* Top Banner */}
      <div className="w-full bg-black text-white text-[11px] sm:text-[12px]">
        <div className="relative max-w-7xl mx-auto px-4 py-1.5">
          <div className="text-center tracking-wide">
            <span className="hidden sm:inline">Get early access on launches & offers. </span>
            <span className="underline cursor-pointer">Sign Up For Texts</span>
            <span className="mx-1">›</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1 absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-gray-200">
            <FlagIndia className="w-4 h-4" />
            <span>INR</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-800" />
              ) : (
                <Menu className="w-5 h-5 text-gray-800" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[13px] text-gray-800">
              {tabs.map((t) => {
                const isActive = (t === "About" && location.pathname === "/about") ||
                  (t === "Everworld Stories" && location.pathname === "/everworld-stories") ||
                  (t === "Men" && location.pathname === "/men") ||
                  (t === "Women" && location.pathname === "/women");

                let linkPath = "/";
                if (t === "About") linkPath = "/about";
                else if (t === "Everworld Stories") linkPath = "/everworld-stories";
                else if (t === "Men") linkPath = "/men";
                else if (t === "Women") linkPath = "/women";

                return (
                  <Link
                    key={t}
                    to={linkPath}
                    onMouseEnter={() => {
                      if (menuData[t]) {
                        setActiveMenu(t);
                        setIsMenuOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setActiveMenu(null);
                        setIsMenuOpen(false);
                      }, 100);
                    }}
                    className={
                      "relative pb-4 hover:text-black transition text-gray-700 " +
                      (isActive ? "text-black" : "")
                    }
                  >
                    {t}
                    {isActive && (
                      <span className="pointer-events-none absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gray-800" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logo - Centered */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                to="/"
                className="tracking-[0.3em] sm:tracking-[0.45em] text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              >
                EVERLANE
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-gray-800">
              <button
                aria-label="Search"
                className="hover:text-black p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:block">
                  <UserStatus />
                </div>
              ) : (
                <Link
                  to="/login"
                  aria-label="Account"
                  className="hover:text-black p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              )}

              <button
                aria-label="Cart"
                className="hover:text-black relative p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={onCartClick}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Smooth with backdrop blur */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer - Clean Premium Design */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[340px] sm:w-[380px] bg-white z-50 
          transform transition-transform duration-300 ease-out md:hidden
          shadow-2xl overflow-hidden flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-6 space-y-6">

            {/* Navigation Links */}
            <nav className="space-y-1">
              {tabs.map((t) => {
                let linkPath = "/";
                if (t === "About") linkPath = "/about";
                else if (t === "Everworld Stories") linkPath = "/everworld-stories";
                else if (t === "Men") linkPath = "/men";
                else if (t === "Women") linkPath = "/women";

                const hasSubmenu = menuData[t];

                return (
                  <div key={t} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <Link
                        to={linkPath}
                        onClick={() => !hasSubmenu && setIsMobileMenuOpen(false)}
                        className="flex-1 py-3.5 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        {t}
                      </Link>
                      {hasSubmenu && (
                        <button
                          onClick={() => toggleMobileSubmenu(t)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label={`Toggle ${t} submenu`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedMobileMenu === t ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Submenu */}
                    {hasSubmenu && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMobileMenu === t ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="pl-4 pb-4 space-y-4">
                          <div>
                            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                              Highlights
                            </h4>
                            <ul className="space-y-2">
                              {menuData[t].highlights.map((item, index) => (
                                <li key={index}>
                                  <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 block py-1 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                              Featured
                            </h4>
                            <ul className="space-y-2">
                              {menuData[t].featured.map((item, index) => (
                                <li key={index}>
                                  <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 block py-1 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Profile Section */}
            {isAuthenticated && user ? (
              <div className="pt-6 border-t border-gray-100">
                {/* Profile Card */}
                <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md flex-shrink-0">
                      {user.name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      {isAdmin() && (
                        <span className="inline-block mt-1 text-[11px] text-orange-600 font-medium">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    {isAdmin() && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = '/admin';
                        }}
                        className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = '/profile';
                      }}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <UserCircle className="w-4 h-4 mr-3 text-gray-500" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = '/my-orders';
                      }}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Package className="w-4 h-4 mr-3 text-gray-500" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = '/settings';
                      }}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sign In</p>
                      <p className="text-xs text-gray-500">Access your account</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                </Link>
              </div>
            )}

            {/* Additional Links */}
            <div className="pt-6 border-t border-gray-100 space-y-2">
              <a
                href="#"
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Help & Support</span>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Store Locator</span>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </a>
            </div>

            {/* Currency Selector */}
            <div className="pt-6 border-t border-gray-100">
              <button className="flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full">
                <FlagIndia className="w-5 h-5" />
                <span>India (INR ₹)</span>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-none focus:outline-none focus:border-black bg-white"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-gray-500 hover:text-black text-sm font-medium px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap"
              >
                Cancel
              </button>
            </div>

            {/* Popular Categories - Hidden on mobile */}
            <div className="mt-6 hidden sm:block">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Women's Sweaters", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop" },
                  { name: "Women's Bottom", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop" },
                  { name: "Women's Boots", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop" },
                  { name: "Men's Best Sellers", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" }
                ].map((category, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                      <img
                        src={category.img}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-black underline">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Dropdown Menu */}
      {isMenuOpen && activeMenu && menuData[activeMenu] && (
        <div
          className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => {
            setActiveMenu(null);
            setIsMenuOpen(false);
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Highlights Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  HIGHLIGHTS
                </h3>
                <ul className="space-y-3">
                  {menuData[activeMenu].highlights.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-black transition-colors block py-1"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Shops Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  FEATURED SHOPS
                </h3>
                <ul className="space-y-3">
                  {menuData[activeMenu].featured.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-black transition-colors block py-1"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Images Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-teal-600 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop"
                      alt="The Holiday Outfit Edit"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                      <div className="text-white">
                        <h4 className="font-semibold text-base lg:text-lg mb-1">The Holiday</h4>
                        <p className="text-xs lg:text-sm mb-2">Outfit Edit</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-amber-100 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop"
                      alt="Giftable Sweaters"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                      <div className="text-white">
                        <h4 className="font-semibold text-base lg:text-lg mb-1">Giftable</h4>
                        <p className="text-xs lg:text-sm">Sweaters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
