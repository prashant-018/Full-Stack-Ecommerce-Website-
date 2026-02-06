import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertAndFormatPrice } from '../utils/currency';
import { createOrder } from '../services/api';

const PaymentOptions = ({ total, orderData, cartItems, shippingInfo, subtotal, shipping, tax }) => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return; // Limit to MM/YY format
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return; // Limit to 4 digits
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log('🛒 Creating order with data:', {
        cartItems,
        shippingInfo,
        selectedPayment,
        total
      });

      console.log('🔍 Cart items structure:', cartItems.map(item => ({
        id: item.id,
        _id: item._id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        salePrice: item.salePrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        finalProductId: item.productId || item._id || item.id
      })));

      console.log('🔍 Shipping info:', shippingInfo);

      // Validate required fields before creating order
      const requiredShippingFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredShippingFields.filter(field => !shippingInfo[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate cart items have valid product IDs
      const invalidItems = cartItems.filter(item => !item.productId && !item._id && !item.id);
      if (invalidItems.length > 0) {
        console.error('❌ Cart items missing product IDs:', invalidItems);
        alert('Some items in your cart are missing product information. Please refresh and try again.');
        return;
      }

      // Prepare order data for API - match exact backend schema
      const orderPayload = {
        // Customer info for guest checkout (required for guest orders)
        customerInfo: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone || shippingInfo.email || '0000000000'
        },

        // Items array - convert cart items to order items format
        items: cartItems.map(item => {
          const productId = item.productId || item._id || item.id;
          if (!productId) {
            throw new Error(`Missing product ID for item: ${item.name}`);
          }

          return {
            product: productId, // Backend expects 'product' field
            name: item.name,
            price: Number(item.salePrice || item.price),
            quantity: Number(item.quantity),
            size: item.size || 'M',
            color: item.color || 'Default',
            image: item.image || item.images?.[0]?.url || '/placeholder-image.jpg'
          };
        }),

        // Shipping address - match exact schema
        shippingAddress: {
          fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country || 'India',
          phone: shippingInfo.phone || '0000000000'
        },

        // Payment details
        paymentMethod: selectedPayment.toUpperCase(), // Ensure uppercase (COD/CARD)
        paymentId: selectedPayment === 'CARD' ? `card_${Date.now()}` : null,

        // Pricing - ensure all are numbers
        subtotal: Number(subtotal || 0),
        shipping: Number(shipping || 0),
        tax: Number(tax || 0),
        discount: Number(0),
        total: Number(total)
      };

      console.log('📦 Sending order payload:', orderPayload);

      // Create order via API
      const response = await createOrder(orderPayload);

      if (response.success) {
        console.log('✅ Order created successfully:', response.data.order);

        // Show success message
        alert(`Order placed successfully! Order Number: ${response.data.order.orderNumber}`);

        // Navigate to home with success state
        navigate('/', {
          state: {
            orderSuccess: true,
            orderNumber: response.data.order.orderNumber,
            orderId: response.data.order._id
          }
        });
      } else {
        throw new Error(response.message || 'Failed to create order');
      }

    } catch (error) {
      console.error('❌ Order creation error:', error);

      let errorMessage = 'Failed to place order. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = `Validation failed: ${validationErrors.map(err => err.message || err.msg).join(', ')}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Log detailed error for debugging
      console.error('📋 Detailed error info:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Choose Payment Method</h3>

        <div className="space-y-3">
          {/* Cash on Delivery */}
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={selectedPayment === 'COD'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">₹</span>
              </div>
              <div>
                <span className="font-medium">Cash on Delivery</span>
                <p className="text-sm text-gray-500">Pay when you receive your order</p>
              </div>
            </div>
          </label>

          {/* Credit/Debit Card */}
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="CARD"
              checked={selectedPayment === 'CARD'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="flex space-x-2 mr-3">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
              </div>
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </label>

        </div>
      </div>

      {/* Payment Forms */}
      <form onSubmit={handlePaymentSubmit}>
        {selectedPayment === 'CARD' && (
          <div className="space-y-4">
            <h4 className="font-medium">Card Details</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholderName"
                required
                value={cardDetails.cardholderName}
                onChange={handleCardInputChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                required
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  required
                  value={cardDetails.expiryDate}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  required
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        )}

        {selectedPayment === 'paypal' && (
          <div className="text-center py-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">💳</div>
              <p className="text-gray-600 mb-4">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </div>
        )}

        {selectedPayment === 'applepay' && (
          <div className="text-center py-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🍎</div>
              <p className="text-gray-600 mb-4">
                Use Touch ID or Face ID to pay with Apple Pay.
              </p>
            </div>
          </div>
        )}

        {selectedPayment === 'cod' && (
          <div className="py-6">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-green-700 text-xl">🪙</div>
                <div>
                  <h4 className="font-medium text-green-900">Cash on Delivery</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Pay in cash when your order is delivered to your address.
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Note: Please keep the exact amount ready to avoid delays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Total */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total Amount:</span>
            <span>{convertAndFormatPrice(total)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 font-medium rounded transition-colors ${isProcessing
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-black text-white hover:bg-gray-800'
            }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            selectedPayment === 'cod'
              ? 'Place Order'
              : `Pay ${convertAndFormatPrice(total)}`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Payment
        </div>
        <p>Your payment information is encrypted and secure.</p>
      </div>
    </div>
  );
};

export default PaymentOptions;