import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserStatus from "./UserStatus";

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m1.1-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
      />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
      />
    </svg>
  );
}

function IconBag({ className = "w-4 h-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5h10.5l.75 12.75a1.5 1.5 0 01-1.5 1.5H7.5a1.5 1.5 0 01-1.5-1.5L6.75 7.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5V6a3.75 3.75 0 117.5 0v1.5"
      />
    </svg>
  );
}

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
      <g fill="#000080">
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1="450"
            y1="250"
            x2="450"
            y2="260"
            transform={`rotate(${i * 15} 450 300)`}
            stroke="#000080"
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}

const tabs = ["Women", "Men", "About", "Everworld Stories"];
const categories = [
  "Holiday Gifting",
  "New Arrivals",
  "Best-Sellers",
  "Clothing",
  "Tops & Sweaters",
  "Pants & Jeans",
  "Outerwear",
  "Shoes & Bags",
  "Sale",
];

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
      "Top Rated Men's Clothing"
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

export default function Navbar({ onCartClick, cartItemCount = 0 }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return (
    <header className="w-full sticky top-0 z-40 bg-white">
      <div className="w-full bg-black text-white text-[11px] sm:text-[12px]">
        <div className="relative max-w-7xl mx-auto px-4 py-1.5">
          <div className="text-center tracking-wide">
            Get early access on launches & offers. <span className="underline">Sign Up For Texts</span>
            <span className="mx-1">›</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1 absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-gray-200">
            <FlagIndia className="w-4 h-4" />
            <span>INR</span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <nav className="hidden md:flex items-center space-x-8 text-[13px] text-gray-800">
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

            <div className="flex-1 flex justify-center md:justify-center">
              <Link to="/" className="tracking-[0.45em] text-xl sm:text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                EVERLANE
              </Link>
            </div>

            <div className="flex items-center space-x-5 text-gray-800">
              <button
                aria-label="Search"
                className="hover:text-black"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <IconSearch />
              </button>

              {/* Show UserStatus if authenticated, otherwise show login link */}
              {isAuthenticated ? (
                <UserStatus />
              ) : (
                <Link to="/login" aria-label="Account" className="hover:text-black">
                  <IconUser />
                </Link>
              )}

              <button
                aria-label="Cart"
                className="hover:text-black relative"
                onClick={onCartClick}
              >
                <IconBag />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-none focus:outline-none focus:border-black bg-white"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-gray-500 hover:text-black text-sm font-medium px-4 py-3"
              >
                Cancel
              </button>
            </div>

            {/* Popular Categories */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center"
                      alt="Women's Sweaters"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-black underline">Women's Sweaters</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop&crop=center"
                      alt="Women's Bottom"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-black underline">Women's Bottom</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center"
                      alt="Women's Boots"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-black underline">Women's Boots</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center"
                      alt="Men's Best Sellers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-black underline">Men's Best Sellers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 text-[13px] text-gray-700 whitespace-nowrap overflow-x-auto py-3">
            {categories.map((c) => (
              <button
                key={c}
                className={
                  "px-2 hover:text-black transition " +
                  (c === "Sale" ? "text-red-500" : "")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && activeMenu && menuData[activeMenu] && (
        <div
          className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
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
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"
                      alt="The Holiday Outfit Edit"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                      <div className="text-white">
                        <h4 className="font-semibold text-lg mb-1">The Holiday</h4>
                        <p className="text-sm mb-2">Outfit Edit</p>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-amber-100 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center"
                      alt="Giftable Sweaters"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                      <div className="text-white">
                        <h4 className="font-semibold text-lg mb-1">Giftable</h4>
                        <p className="text-sm">Sweaters</p>
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

