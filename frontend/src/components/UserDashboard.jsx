import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Package, Heart, MapPin, CreditCard, Settings } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track your orders and view order history',
      href: '/orders',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Heart,
      title: 'Wishlist',
      description: 'Items you want to buy later',
      href: '/wishlist',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage your delivery addresses',
      href: '/addresses',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      href: '/payment-methods',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      href: '/settings',
      color: 'bg-gray-50 text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Manage your account and track your orders</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Order #12345 shipped</p>
                <p className="text-gray-600 text-sm">Your order is on the way</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Item added to wishlist</p>
                <p className="text-gray-600 text-sm">Classic White Sneakers</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;