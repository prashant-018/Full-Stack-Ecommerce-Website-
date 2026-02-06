import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentOptions from './PaymentOptions';
import { convertAndFormatPrice } from '../utils/currency';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], subtotal = 0 } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-black mb-4">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200'
                }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Shipping</span>
            </div>

            <div className="w-8 h-px bg-gray-300"></div>

            <div className={`flex items-center ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200'
                }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors mt-6"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Payment Method</h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    ← Back to Shipping
                  </button>
                </div>

                <PaymentOptions
                  total={total}
                  cartItems={cartItems}
                  shippingInfo={shippingInfo}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  orderData={{
                    items: cartItems,
                    shipping: shippingInfo,
                    subtotal,
                    shipping: shipping,
                    tax,
                    total
                  }}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-black leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.size} | {item.color}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">{convertAndFormatPrice((item.salePrice || item.price || 0) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{convertAndFormatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{convertAndFormatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{convertAndFormatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{convertAndFormatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;