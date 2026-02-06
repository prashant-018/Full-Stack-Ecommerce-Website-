import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { convertAndFormatPrice, formatINRPrice, convertUSDToINR } from '../utils/currency';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
      return;
    }

    // Fetch dashboard stats (mock data for now)
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        // Use mock data if not authenticated
        setStats({
          totalProducts: 156,
          totalOrders: 1,
          totalUsers: 89,
          totalRevenue: convertUSDToINR(45670),
          recentOrders: [
            { id: '#ORD-001', customer: 'John Doe', amount: 129.99, status: 'Completed', date: '2024-02-01' },
            { id: '#ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'Processing', date: '2024-02-01' },
            { id: '#ORD-003', customer: 'Mike Johnson', amount: 199.99, status: 'Shipped', date: '2024-01-31' },
            { id: '#ORD-004', customer: 'Sarah Wilson', amount: 75.00, status: 'Pending', date: '2024-01-31' },
          ],
          topProducts: [
            { name: 'Classic White Shirt', sales: 45, revenue: convertUSDToINR(2250) },
            { name: 'Denim Jeans', sales: 38, revenue: convertUSDToINR(3040) },
            { name: 'Cotton T-Shirt', sales: 32, revenue: convertUSDToINR(960) },
            { name: 'Wool Sweater', sales: 28, revenue: convertUSDToINR(2240) },
          ]
        });
        return;
      }

      // Fetch real order statistics
      const orderStatsResponse = await fetch('http://localhost:5002/api/orders/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      let orderStats = null;
      if (orderStatsResponse.ok) {
        const orderData = await orderStatsResponse.json();
        if (orderData.success) {
          orderStats = orderData.data;
        }
      }

      // Fetch products count
      const productsResponse = await fetch('http://localhost:5002/api/products?limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      let totalProducts = 156; // Default
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData.success) {
          totalProducts = productsData.data.pagination?.totalProducts || 156;
        }
      }

      // Set stats with real data or fallback to mock data
      setStats({
        totalProducts,
        totalOrders: orderStats?.totalOrders || 1,
        totalUsers: 89, // Keep mock for now
        totalRevenue: orderStats?.totalRevenue ? convertUSDToINR(orderStats.totalRevenue) : convertUSDToINR(45670),
        recentOrders: orderStats?.recentOrders?.map(order => ({
          id: order.orderNumber,
          customer: order.customerInfo.name,
          amount: order.total,
          status: order.status,
          date: new Date(order.createdAt).toISOString().split('T')[0]
        })) || [
            { id: '#ORD-001', customer: 'John Doe', amount: 129.99, status: 'delivered', date: '2024-02-01' },
            { id: '#ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'processing', date: '2024-02-01' },
            { id: '#ORD-003', customer: 'Mike Johnson', amount: 199.99, status: 'shipped', date: '2024-01-31' },
            { id: '#ORD-004', customer: 'Sarah Wilson', amount: 75.00, status: 'pending', date: '2024-01-31' },
          ],
        topProducts: [
          { name: 'Classic White Shirt', sales: 45, revenue: convertUSDToINR(2250) },
          { name: 'Denim Jeans', sales: 38, revenue: convertUSDToINR(3040) },
          { name: 'Cotton T-Shirt', sales: 32, revenue: convertUSDToINR(960) },
          { name: 'Wool Sweater', sales: 28, revenue: convertUSDToINR(2240) },
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use mock data on error
      setStats({
        totalProducts: 156,
        totalOrders: 1,
        totalUsers: 89,
        totalRevenue: convertUSDToINR(45670),
        recentOrders: [
          { id: '#ORD-001', customer: 'John Doe', amount: 129.99, status: 'delivered', date: '2024-02-01' },
          { id: '#ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'processing', date: '2024-02-01' },
          { id: '#ORD-003', customer: 'Mike Johnson', amount: 199.99, status: 'shipped', date: '2024-01-31' },
          { id: '#ORD-004', customer: 'Sarah Wilson', amount: 75.00, status: 'pending', date: '2024-01-31' },
        ],
        topProducts: [
          { name: 'Classic White Shirt', sales: 45, revenue: convertUSDToINR(2250) },
          { name: 'Denim Jeans', sales: 38, revenue: convertUSDToINR(3040) },
          { name: 'Cotton T-Shirt', sales: 32, revenue: convertUSDToINR(960) },
          { name: 'Wool Sweater', sales: 28, revenue: convertUSDToINR(2240) },
        ]
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

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
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
          change={15}
        />
        <StatCard
          title="Revenue"
          value={formatINRPrice(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-orange-500"
          change={23}
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 text-sm text-gray-900">{convertAndFormatPrice(order.amount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button
              onClick={() => navigate('/admin/products')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.sales} sales</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">{formatINRPrice(product.revenue)}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(product.sales / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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