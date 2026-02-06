const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./models/Order');
const Product = require('./models/Product');

async function debugOrderCreation() {
  try {
    console.log('🔍 Debugging Order Creation...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get a test product
    const product = await Product.findOne();
    if (!product) {
      throw new Error('No products found in database');
    }
    console.log(`✅ Found test product: ${product.name} (${product._id})`);

    // Create test order data
    const orderData = {
      user: null, // Guest order
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890'
      },
      items: [{
        product: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: 1,
        size: 'M',
        color: 'Default',
        image: product.images?.[0]?.url || '/placeholder.jpg'
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India',
        phone: '1234567890'
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      subtotal: product.salePrice || product.price,
      shipping: 5,
      tax: 2,
      total: (product.salePrice || product.price) + 5 + 2,
      status: 'pending',
      orderStatus: 'Pending',
      statusHistory: [{
        status: 'pending',
        updatedAt: new Date(),
        note: 'Order placed successfully'
      }]
    };

    console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));

    // Create order
    const order = new Order(orderData);
    console.log('💾 Saving order...');

    await order.save();

    console.log('✅ Order created successfully!');
    console.log(`📦 Order ID: ${order._id}`);
    console.log(`📦 Order Number: ${order.orderNumber}`);
    console.log(`👤 Customer: ${order.customerInfo.name}`);
    console.log(`💰 Total: $${order.total}`);

    // Test virtual field
    console.log(`🛍️ Total Items: ${order.totalItems}`);

    await mongoose.connection.close();
    console.log('\n✅ Debug completed successfully');

  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run debug
if (require.main === module) {
  debugOrderCreation();
}

module.exports = { debugOrderCreation };