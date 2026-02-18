import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getDashboardStats } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    confirmedRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDashboardStats();

      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - function is stable

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // Only depend on navigate, not fetchDashboardStats

  const StatCard = ({ title, value, icon: Icon, color, subtitle, isLoading }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-24"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {subtitle && !isLoading && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Format currency in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Products"
          value={loading ? '...' : stats.totalProducts.toLocaleString('en-IN')}
          icon={Package}
          color="bg-blue-500"
          isLoading={loading}
        />
        <StatCard
          title="Total Orders"
          value={loading ? '...' : stats.totalOrders.toLocaleString('en-IN')}
          icon={ShoppingCart}
          color="bg-green-500"
          subtitle={!loading && `${stats.pendingOrders} pending, ${stats.deliveredOrders} delivered`}
          isLoading={loading}
        />
        <StatCard
          title="Total Users"
          value={loading ? '...' : stats.totalUsers.toLocaleString('en-IN')}
          icon={Users}
          color="bg-purple-500"
          isLoading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? '...' : formatINR(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-orange-500"
          subtitle={!loading && `Confirmed: ${formatINR(stats.confirmedRevenue)}`}
          isLoading={loading}
        />
      </div>

      {/* Revenue Breakdown */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xs text-gray-500">All orders</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatINR(stats.totalRevenue)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed Revenue</p>
                  <p className="text-xs text-gray-500">Delivered orders only</p>
                </div>
                <p className="text-xl font-bold text-green-600">{formatINR(stats.confirmedRevenue)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
                  <p className="text-xs text-gray-500">Orders in progress</p>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  {formatINR(stats.totalRevenue - stats.confirmedRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pending Orders</p>
                    <p className="text-xs text-gray-500">Awaiting processing</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivered Orders</p>
                    <p className="text-xs text-gray-500">Successfully completed</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">In Progress</p>
                    <p className="text-xs text-gray-500">Processing + Shipped</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders - stats.pendingOrders - stats.deliveredOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/add-product')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Package className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <ShoppingCart className="w-8 h-8 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-600">View and process orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left sm:col-span-2 lg:col-span-1"
          >
            <Users className="w-8 h-8 text-purple-500 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">User Management</p>
              <p className="text-sm text-gray-600">Manage customer accounts</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;