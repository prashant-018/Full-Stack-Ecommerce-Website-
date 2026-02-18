import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowRight, Home } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');

      console.log('📦 Fetching order details:', { orderId, hasToken: !!token });

      if (!token) {
        console.error('❌ No auth token found');
        setError('Please log in to view your order');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5002/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      console.log('📦 Order fetch response:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('📦 Order data:', data);

      if (response.ok && data.success) {
        console.log('✅ Order loaded successfully');
        setOrder(data.order);
      } else {
        console.error('❌ Order fetch failed:', data.message);
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">

          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-20 h-20 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-green-50 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="p-6 lg:p-8">

            {/* Order ID & Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-bold text-gray-900">#{order._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-lg font-bold text-green-600">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className="text-green-600 font-medium capitalize">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  {order.shippingAddress ? (
                    <div className="text-gray-900">
                      <p className="font-semibold">{order.shippingAddress.fullName}</p>
                      <p className="text-sm">{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-sm">{order.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-sm">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="text-sm">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Address not available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900">{getEstimatedDelivery()}</p>
                  <p className="text-sm text-gray-600 mt-1">Your order will be delivered within 5 business days</p>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Ordered Items</h3>
              </div>

              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <img
                          src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                          {item.product?.name || 'Product'}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No items found</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View My Orders
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            📧 A confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
