const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
require('dotenv').config();

async function testOrderDirect() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Find some products to test with
    const products = await Product.find().limit(2);
    console.log('📦 Found products:', products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      salePrice: p.salePrice
    })));

    if (products.length === 0) {
      console.log('❌ No products found in database. Please seed some products first.');
      process.exit(1);
    }

    // Create test order directly using the model
    const orderData = {
      user: null, // Guest order
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890'
      },
      items: products.map(product => ({
        product: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: 1,
        size: 'M',
        color: 'Default',
        image: product.images?.[0]?.url || '/placeholder-image.jpg'
      })),
      shippingAddress: {
        fullName: 'Test Customer',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India',
        phone: '1234567890'
      },
      billingAddress: {
        fullName: 'Test Customer',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India',
        phone: '1234567890'
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      subtotal: products.reduce((sum, p) => sum + (p.salePrice || p.price), 0),
      shipping: 0,
      tax: 0,
      discount: 0,
      total: products.reduce((sum, p) => sum + (p.salePrice || p.price), 0),
      status: 'pending',
      orderStatus: 'Pending',
      statusHistory: [{
        status: 'pending',
        updatedAt: new Date(),
        note: 'Order placed successfully'
      }]
    };

    console.log('🧪 Creating order with data:', JSON.stringify(orderData, null, 2));

    // Create and save order
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created successfully:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      itemsCount: order.items.length
    });

    // Clean up - delete the test order
    await Order.findByIdAndDelete(order._id);
    console.log('🧹 Test order cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.errors) {
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })));
    }
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

testOrderDirect();