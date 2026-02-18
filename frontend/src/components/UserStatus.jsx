import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, Package, LogOut, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useLogout';

const UserStatus = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const handleLogout = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get first name for display
  const getDisplayName = (name) => {
    if (!name) return 'Account';
    const firstName = name.split(' ')[0];
    return firstName.length > 12 ? firstName.slice(0, 12) + '...' : firstName;
  };

  const onLogout = () => {
    setIsDropdownOpen(false);
    handleLogout();
  };

  const handleNavigation = (href) => {
    setIsDropdownOpen(false);
    window.location.href = href;
  };

  const menuItems = [
    {
      icon: UserCircle,
      label: 'My Profile',
      href: '/profile',
      show: true
    },
    {
      icon: Package,
      label: 'My Orders',
      href: '/my-orders',
      show: true
    },
    {
      icon: Settings,
      label: 'Account Settings',
      href: '/settings',
      show: true
    }
  ];

  // Add admin-specific items if user is admin
  if (isAdmin()) {
    menuItems.unshift({
      icon: Shield,
      label: 'Admin Dashboard',
      href: '/admin',
      show: true,
      isAdmin: true
    });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ring-2 ring-white">
          {getInitials(user.name)}
        </div>

        {/* Name - Hidden on mobile */}
        <span className="hidden md:inline-block font-medium">
          {getDisplayName(user.name)}
        </span>

        {/* Chevron - Hidden on mobile */}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''
          }`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsDropdownOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform transition-all duration-200 ease-out">
            {/* User Info Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                {/* Larger Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-lg ring-4 ring-white">
                  {getInitials(user.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                  {/* Subtle admin indicator */}
                  {isAdmin() && (
                    <div className="flex items-center mt-1">
                      <Shield className="w-3 h-3 text-amber-600 mr-1" />
                      <span className="text-xs text-amber-700 font-medium">Administrator</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.filter(item => item.show).map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 ${item.isAdmin ? 'bg-amber-50/50 border-b border-amber-100' : ''
                      }`}
                  >
                    <IconComponent className={`w-5 h-5 mr-4 ${item.isAdmin ? 'text-amber-600' : 'text-gray-400'
                      }`} />
                    <span className={`font-medium ${item.isAdmin ? 'text-amber-800' : 'text-gray-900'
                      }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Sign Out */}
            <div className="py-2">
              <button
                onClick={onLogout}
                className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 group"
              >
                <LogOut className="w-5 h-5 mr-4 text-gray-400 group-hover:text-red-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatus;