import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    if (userRole !== 'admin' || !authToken) {
      // Clear any invalid tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Add Product',
      path: '/admin/add-product',
      icon: Plus
    },
    {
      name: 'Manage Products',
      path: '/admin/products',
      icon: Package
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content area - Takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar - Fixed height */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;