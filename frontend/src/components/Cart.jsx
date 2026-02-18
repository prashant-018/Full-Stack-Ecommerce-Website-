import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCartItemQuantity, removeCartItem } from '../services/api';
import { convertAndFormatPrice } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';

const Cart = ({ isOpen, onClose, items = [], setItems, onCartUpdate }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const cartItems = items;
  const token = localStorage.getItem('authToken');

  const [recommendedItems] = useState([
    {
      id: 3,
      name: "The Good Merino Wool Beanie",
      size: "One Size",
      color: "Chambray Blue",
      price: 35,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=120&fit=crop&crop=center"
    }
  ]);

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(item);
      return;
    }

    try {
      if (token && item._id) {
        // Update in MongoDB
        await updateCartItemQuantity(item._id, newQuantity);
        // Reload cart from DB
        if (onCartUpdate) {
          await onCartUpdate();
        }
      } else {
        // Update local storage
        const updatedItems = cartItems.map(cartItem =>
          cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
        setItems(updatedItems);
        localStorage.setItem('localCart', JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const removeItem = async (item) => {
    try {
      if (token && item._id) {
        // Remove from MongoDB (prefer unique key {productId, size, color})
        await removeCartItem({
          itemId: item._id,
          productId: item.id,
          size: item.size,
          color: item.color,
        });

        // Optimistically update UI immediately (fallback even if onCartUpdate is slow)
        const updatedItems = cartItems.filter((cartItem) =>
          !(cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color)
        );
        setItems(updatedItems);

        // Reload cart from DB to ensure totals/stock sync
        if (onCartUpdate) await onCartUpdate();
      } else {
        // Remove from local storage
        const updatedItems = cartItems.filter(cartItem =>
          !(cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color)
        );
        setItems(updatedItems);
        localStorage.setItem('localCart', JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to remove item. Please try again.';
      alert(message);
    }
  };

  const addRecommendedItem = (item) => {
    setItems([...cartItems, { ...item, quantity: 1, salePrice: item.price }]);
  };

  const subtotal = cartItems.reduce((total, item) =>
    total + ((item.salePrice || item.price || 0) * item.quantity), 0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-black">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item._id || `${item.id}-${item.size}-${item.color}`} className="flex space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-black leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size} | {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        className="text-gray-400 hover:text-black ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          {item.price && item.price > item.salePrice && (
                            <span className="text-sm line-through text-gray-400">{convertAndFormatPrice(item.price)}</span>
                          )}
                          <span className="text-sm font-medium text-black">{convertAndFormatPrice(item.salePrice || item.price || 0)}</span>
                        </div>
                        {item.discount && (
                          <span className="text-xs text-red-500 font-medium">{item.discount}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                        >
                          <span className="text-sm">−</span>
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                        >
                          <span className="text-sm">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Before You Go Section */}
            {recommendedItems.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-black mb-4">Before You Go</h3>

                {recommendedItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 mb-4">
                    <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-black mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.size} | {item.color}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">{convertAndFormatPrice(item.price || 0)}</span>
                        <button
                          onClick={() => addRecommendedItem(item)}
                          className="bg-black text-white px-4 py-1 text-xs font-medium hover:bg-gray-800 transition-colors"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dots indicator */}
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-black">
                Subtotal ({cartItems.length} items)
              </span>
              <span className="text-lg font-medium text-black">{convertAndFormatPrice(subtotal)}</span>
            </div>

            <button
              onClick={() => {
                console.log('🛒 Checkout button clicked');
                console.log('🔐 Auth status:', { isAuthenticated, hasToken: !!token });

                onClose();

                // Check if user is logged in
                if (!isAuthenticated) {
                  console.log('❌ User not authenticated, redirecting to login');
                  navigate('/login', {
                    state: {
                      from: '/checkout',
                      cartItems: cartItems,
                      subtotal: subtotal
                    }
                  });
                  return;
                }

                console.log('✅ User authenticated, proceeding to checkout');
                navigate('/checkout', {
                  state: {
                    cartItems: cartItems,
                    subtotal: subtotal
                  }
                });
              }}
              className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors mb-3"
            >
              CONTINUE TO CHECKOUT
            </button>

            <p className="text-center text-xs text-gray-500">
              Psst, get it now before it sells out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;