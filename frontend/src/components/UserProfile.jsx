import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-gray-100 rounded-full">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">Administrator</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">User</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </p>
              </div>
              {user.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <div className="mt-1 flex items-center space-x-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {user.role === 'admin' ? (
                <>
                  <a
                    href="/admin"
                    className="block w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Dashboard</span>
                    </div>
                  </a>
                  <a
                    href="/admin/products"
                    className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">Manage Products</span>
                  </a>
                  <a
                    href="/admin/orders"
                    className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">View Orders</span>
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/dashboard"
                    className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium">My Dashboard</span>
                  </a>
                  <a
                    href="/orders"
                    className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">My Orders</span>
                  </a>
                  <a
                    href="/wishlist"
                    className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">My Wishlist</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;