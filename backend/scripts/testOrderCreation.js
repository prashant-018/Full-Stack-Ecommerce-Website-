const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function testOrderCreation() {
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

    // Create test order payload
    const testOrderPayload = {
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890'
      },
      items: products.map(product => ({
        product: product._id.toString(),
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
      paymentMethod: 'COD',
      subtotal: products.reduce((sum, p) => sum + (p.salePrice || p.price), 0),
      shipping: 0,
      tax: 0,
      total: products.reduce((sum, p) => sum + (p.salePrice || p.price), 0)
    };

    console.log('🧪 Test order payload:', JSON.stringify(testOrderPayload, null, 2));

    // Test the order creation logic
    const axios = require('axios');

    try {
      const response = await axios.post('http://localhost:5000/api/orders', testOrderPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Order created successfully:', response.data);
    } catch (error) {
      console.error('❌ Order creation failed:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

testOrderCreation();