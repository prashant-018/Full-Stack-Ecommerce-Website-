import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Package, Heart, MapPin, Settings, LayoutDashboard, ChevronRight, Mail, Shield, LogOut, Edit } from 'lucide-react';

const AccountDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden w-full">
        {/* Profile Header */}
        <div className="bg-white px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user?.email || 'user@example.com'}</span>
              </div>
              <button className="text-sm text-blue-600 font-medium mt-1">User</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-base text-gray-900">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <p className="text-base text-gray-900 break-all">{user?.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                  {isAdmin && isAdmin() ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-base font-medium text-blue-600">My Dashboard</span>
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-base font-medium text-gray-700">My Orders</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-base font-medium text-gray-700">My Wishlist</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            <div className="w-1/4 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md sticky top-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                      {getInitials(user?.name)}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
                    <p className="text-sm text-gray-600 mb-2 truncate w-full text-center">{user?.email || 'user@example.com'}</p>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Customer</span>
                  </div>
                </div>
                <nav className="p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button key={item.id} onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                          }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  })}
                </nav>
                <div className="p-4 border-t">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium text-sm">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{user?.name || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium truncate">{user?.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Package, label: 'My Orders', color: 'blue' },
                    { icon: Heart, label: 'My Wishlist', color: 'red' },
                    { icon: MapPin, label: 'My Addresses', color: 'green' },
                    { icon: Settings, label: 'Settings', color: 'purple' }
                  ].map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button key={idx} className="flex items-start gap-4 p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50">
                        <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${action.color}-600`} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
