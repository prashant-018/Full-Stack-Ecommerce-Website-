import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw, Search, Filter, X, AlertTriangle, Trash2 } from 'lucide-react';
import { convertAndFormatPrice } from '../utils/currency';
import { getAdminOrders, getOrderStats, updateOrderStatus, deleteOrder } from '../services/api';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    orderId: null,
    newStatus: '',
    note: '',
    trackingNumber: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Memoized fetch functions to prevent infinite re-renders
  const fetchOrderStats = useCallback(async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      console.log('📊 Fetching order stats...');
      const response = await getOrderStats();
      console.log('📊 Order stats response:', response);

      if (response.success) {
        const { statusBreakdown } = response.data;
        const stats = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        };

        if (statusBreakdown && Array.isArray(statusBreakdown)) {
          statusBreakdown.forEach(stat => {
            if (stats.hasOwnProperty(stat._id)) {
              stats[stat._id] = stat.count;
            }
          });
        }

        setOrderStats(stats);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // Don't show error for stats, just log it
    }
  }, []);

  // Regular function that doesn't need memoization since it's not in dependencies
  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      const params = {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      console.log('📡 Fetching orders with params:', params);
      const response = await getAdminOrders(params);
      console.log('📦 Orders response:', response);

      if (response.success) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0
        });
      } else {
        setError('Failed to fetch orders: ' + response.message);
        console.error('Failed to fetch orders:', response.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);

      let errorMessage = 'Error loading orders. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load effect - runs only once on mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    if (userRole !== 'admin' || !authToken) {
      navigate('/login');
      return;
    }

    fetchOrders();
    fetchOrderStats();
  }, []); // Empty dependency array - runs only once

  // Effect for filter/search changes
  useEffect(() => {
    fetchOrders(1); // Reset to page 1 when filtering
  }, [filterStatus, searchTerm]); // Only depend on filter values

  const handleStatusUpdate = useCallback(async () => {
    if (!statusUpdate.orderId || !statusUpdate.newStatus) {
      alert('Please select a status to update');
      return;
    }

    try {
      setUpdatingStatus(true);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      console.log('🔄 Updating order status:', {
        orderId: statusUpdate.orderId,
        newStatus: statusUpdate.newStatus,
        note: statusUpdate.note,
        trackingNumber: statusUpdate.trackingNumber
      });

      const updateData = {
        status: statusUpdate.newStatus,
        note: statusUpdate.note || ''
      };

      if (statusUpdate.trackingNumber && statusUpdate.trackingNumber.trim()) {
        updateData.trackingNumber = statusUpdate.trackingNumber.trim();
      }

      const response = await updateOrderStatus(statusUpdate.orderId, updateData);
      console.log('✅ Order status update response:', response);

      if (response.success) {
        // Update the order in the list
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === statusUpdate.orderId
            ? {
              ...order,
              status: statusUpdate.newStatus,
              trackingNumber: statusUpdate.trackingNumber || order.trackingNumber
            }
            : order
        ));

        // Refresh stats
        fetchOrderStats();

        // Close modal and reset
        setShowStatusModal(false);
        setStatusUpdate({
          orderId: null,
          newStatus: '',
          note: '',
          trackingNumber: ''
        });

        alert('Order status updated successfully!');
      } else {
        console.error('❌ Failed to update order status:', response.message);
        alert('Failed to update order status: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);

      let errorMessage = 'Error updating order status. Please try again.';

      if (error.response) {
        const { status, data } = error.response;
        console.error('❌ Server error response:', { status, data });

        if (status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          navigate('/login');
          return;
        } else if (status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (status === 404) {
          errorMessage = 'Order not found.';
        } else if (status === 400) {
          errorMessage = data.message || 'Invalid request data.';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        console.error('❌ Network error:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      alert(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  }, [statusUpdate, navigate, fetchOrderStats]);

  const handleDeleteOrder = useCallback(async () => {
    if (!orderToDelete) {
      alert('No order selected for deletion');
      return;
    }

    try {
      setDeletingOrder(true);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      console.log('🗑️ Deleting order:', {
        orderId: orderToDelete._id,
        orderNumber: orderToDelete.orderNumber
      });

      const response = await deleteOrder(orderToDelete._id);
      console.log('✅ Order delete response:', response);

      if (response.success) {
        // Remove the order from the list
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete._id));

        // Refresh stats
        fetchOrderStats();

        // Close modal and reset
        setShowDeleteModal(false);
        setOrderToDelete(null);

        alert('Order deleted successfully!');
      } else {
        console.error('❌ Failed to delete order:', response.message);
        alert('Failed to delete order: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error deleting order:', error);

      let errorMessage = 'Error deleting order. Please try again.';

      if (error.response) {
        const { status, data } = error.response;
        console.error('❌ Server error response:', { status, data });

        if (status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          navigate('/login');
          return;
        } else if (status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (status === 404) {
          errorMessage = 'Order not found.';
        } else if (status === 400) {
          errorMessage = data.message || 'Cannot delete this order.';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        console.error('❌ Network error:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      alert(errorMessage);
    } finally {
      setDeletingOrder(false);
    }
  }, [orderToDelete, navigate, fetchOrderStats]);

  const openDeleteModal = (order) => {
    if (!order || !order._id) {
      console.error('❌ Invalid order data:', order);
      alert('Error: Invalid order data. Please refresh the page and try again.');
      return;
    }

    console.log('🗑️ Opening delete modal for order:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status
    });

    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const openStatusModal = (order) => {
    if (!order || !order._id) {
      console.error('❌ Invalid order data:', order);
      alert('Error: Invalid order data. Please refresh the page and try again.');
      return;
    }

    console.log('🔧 Opening status modal for order:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      currentStatus: order.status
    });

    setStatusUpdate({
      orderId: order._id,
      newStatus: order.status,
      note: '',
      trackingNumber: order.trackingNumber || ''
    });
    setShowStatusModal(true);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'processing',
      'processing': 'shipped',
      'shipped': 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = order.customer?.name || order.customerInfo?.name || '';
      const customerEmail = order.customer?.email || order.customerInfo?.email || '';

      const matchesSearch = !searchTerm ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filterStatus || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchOrders();
                fetchOrderStats();
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <p className="text-lg sm:text-xl font-bold">{orderStats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Processing</p>
              <p className="text-lg sm:text-xl font-bold">{orderStats.processing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Shipped</p>
              <p className="text-lg sm:text-xl font-bold">{orderStats.shipped}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Delivered</p>
              <p className="text-lg sm:text-xl font-bold">{orderStats.delivered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Cancelled</p>
              <p className="text-lg sm:text-xl font-bold">{orderStats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredOrders.length} of {pagination.totalOrders} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-500">Tracking: {order.trackingNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer?.name || 'Guest Customer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customer?.email || 'No email'}
                      </p>
                      {order.customer?.type && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${order.customer.type === 'registered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {order.customer.type === 'registered' ? 'Registered' : 'Guest'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {/* Product Image */}
                      {order.itemsSummary?.firstItem && (
                        <img
                          src={order.itemsSummary.firstItem.productDetails?.image || order.itemsSummary.firstItem.image || '/placeholder-image.jpg'}
                          alt={order.itemsSummary.firstItem.productDetails?.name || order.itemsSummary.firstItem.name || 'Product'}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      )}

                      {/* Items Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {order.totalItems || order.itemsSummary?.count || 0} item{(order.totalItems || order.itemsSummary?.count || 0) !== 1 ? 's' : ''}
                          </p>
                          {order.itemsSummary?.count > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                              {order.itemsSummary.count}
                            </span>
                          )}
                        </div>

                        {/* First Item Details */}
                        {order.itemsSummary?.firstItem && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-600 truncate">
                              {order.itemsSummary.firstItem.productDetails?.name || order.itemsSummary.firstItem.name || 'Unknown Product'}
                            </p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              {order.itemsSummary.firstItem.size && (
                                <span className="text-xs text-gray-500">
                                  Size: {order.itemsSummary.firstItem.size}
                                </span>
                              )}
                              {order.itemsSummary.firstItem.color && (
                                <span className="text-xs text-gray-500">
                                  Color: {order.itemsSummary.firstItem.color}
                                </span>
                              )}
                              {order.itemsSummary.firstItem.quantity && (
                                <span className="text-xs text-gray-500">
                                  Qty: {order.itemsSummary.firstItem.quantity}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Additional Items Indicator */}
                        {order.itemsSummary?.hasMultiple && (
                          <p className="text-xs text-blue-600 mt-1">
                            +{order.itemsSummary.additionalCount} more item{order.itemsSummary.additionalCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {convertAndFormatPrice(order.total)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openStatusModal(order)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        title="Update Status"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Order"
                        disabled={order.status === 'delivered'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filterStatus ? `No orders with status "${filterStatus}"` : 'No orders yet'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchOrders(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => fetchOrders(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Safety check for incomplete order data */}
              {!selectedOrder._id ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <AlertTriangle className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Incomplete Order Data</h3>
                  <p className="text-gray-600 mb-4">This order has incomplete data and cannot be displayed.</p>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Order Information</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Order Number:</span>
                          <span className="ml-2 text-gray-600">{selectedOrder.orderNumber || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status || 'pending')}`}>
                            {selectedOrder.status || 'pending'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <span className="ml-2 text-gray-600">
                            {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Payment Method:</span>
                          <span className="ml-2 text-gray-600 capitalize">{selectedOrder.paymentMethod || 'N/A'}</span>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div>
                            <span className="font-medium text-gray-700">Tracking Number:</span>
                            <span className="ml-2 text-gray-600">{selectedOrder.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="ml-2 text-gray-600">
                            {selectedOrder.customer?.name || 'Guest Customer'}
                          </span>
                          {selectedOrder.customer?.type && (
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${selectedOrder.customer.type === 'registered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {selectedOrder.customer.type === 'registered' ? 'Registered User' : 'Guest'}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Email:</span>
                          <span className="ml-2 text-gray-600">
                            {selectedOrder.customer?.email || 'No email'}
                          </span>
                        </div>
                        {(selectedOrder.customerInfo?.phone || selectedOrder.customer?.phone) && (
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <span className="ml-2 text-gray-600">
                              {selectedOrder.customerInfo?.phone || selectedOrder.customer?.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h4>
                    {selectedOrder.shippingAddress ? (
                      <div className="text-sm text-gray-600">
                        <p>{selectedOrder.shippingAddress.fullName || 'N/A'}</p>
                        <p>{selectedOrder.shippingAddress.address || 'N/A'}</p>
                        <p>
                          {selectedOrder.shippingAddress.city || 'N/A'}, {selectedOrder.shippingAddress.state || 'N/A'} {selectedOrder.shippingAddress.zipCode || 'N/A'}
                        </p>
                        <p>{selectedOrder.shippingAddress.country || 'N/A'}</p>
                        <p>Phone: {selectedOrder.shippingAddress.phone || 'N/A'}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No shipping address available
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Order Items ({selectedOrder.totalItems || selectedOrder.items?.length || 0})
                    </h4>
                    <div className="space-y-4">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <img
                              src={item.productDetails?.image || item.image || '/placeholder-image.jpg'}
                              alt={item.productDetails?.name || item.name || 'Product'}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate">
                                {item.productDetails?.name || item.name || 'Unknown Product'}
                              </h5>

                              {/* Product Category */}
                              {item.productDetails?.category && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.productDetails.category}
                                  {item.productDetails.subcategory && ` > ${item.productDetails.subcategory}`}
                                </p>
                              )}

                              {/* Product Attributes */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.size && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    Color: {item.color}
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  Qty: {item.quantity || 0}
                                </span>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {convertAndFormatPrice(item.price || 0)}
                              </p>
                              <p className="text-sm text-gray-600">
                                per item
                              </p>
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="font-semibold text-gray-900">
                                  {convertAndFormatPrice((item.price || 0) * (item.quantity || 0))}
                                </p>
                                <p className="text-xs text-gray-500">
                                  subtotal
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No items found in this order</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">{convertAndFormatPrice(selectedOrder.subtotal || 0)}</span>
                      </div>
                      {(selectedOrder.shippingCost || 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">{convertAndFormatPrice(selectedOrder.shippingCost || 0)}</span>
                        </div>
                      )}
                      {(selectedOrder.tax || 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">{convertAndFormatPrice(selectedOrder.tax || 0)}</span>
                        </div>
                      )}
                      {(selectedOrder.discount || 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-red-600">-{convertAndFormatPrice(selectedOrder.discount || 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">{convertAndFormatPrice(selectedOrder.total || 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => openStatusModal(selectedOrder)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Update Order Status</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={statusUpdate.newStatus}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, newStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {statusUpdate.newStatus === 'shipped' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={statusUpdate.trackingNumber}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter tracking number"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={statusUpdate.note}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Add a note about this status update..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusUpdate({
                    orderId: null,
                    newStatus: '',
                    note: '',
                    trackingNumber: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={updatingStatus}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus || !statusUpdate.newStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${updatingStatus || !statusUpdate.newStatus
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Order</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Order Number:</span>
                  <span className="text-gray-900">{orderToDelete.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Customer:</span>
                  <span className="text-gray-900">{orderToDelete.customer?.name || 'Guest Customer'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="text-gray-900">{convertAndFormatPrice(orderToDelete.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(orderToDelete.status)}`}>
                    {orderToDelete.status}
                  </span>
                </div>
              </div>

              {orderToDelete.status === 'delivered' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Warning: This order has been delivered. Deletion may affect customer records and reporting.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deletingOrder}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={deletingOrder}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${deletingOrder
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
              >
                {deletingOrder ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;