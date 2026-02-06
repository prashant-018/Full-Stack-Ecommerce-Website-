/**
 * Test script to verify Cart API saves items to MongoDB
 * 
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Make sure backend server is running (npm run dev)
 * 3. Run: node scripts/testCartAPI.js
 * 
 * This script will:
 * - Create a test user (or use existing)
 * - Login to get auth token
 * - Add item to cart
 * - Verify item is saved in MongoDB
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Test user credentials
const testUser = {
  email: 'testcart@example.com',
  password: 'test123456',
  name: 'Test Cart User'
};

let authToken = null;
let userId = null;
let productId = null;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Register or login user
async function setupUser() {
  try {
    // Try to login first
    console.log('\n📝 Attempting to login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    if (loginResponse.data.success) {
      authToken = loginResponse.data.token;
      userId = loginResponse.data.user._id || loginResponse.data.user.id;
      console.log('✅ Login successful');
      console.log(`   User ID: ${userId}`);
      return;
    }
  } catch (error) {
    // If login fails, try to register
    if (error.response?.status === 401 || error.response?.status === 404) {
      console.log('📝 User not found, creating new user...');
      try {
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        });

        if (registerResponse.data.success) {
          authToken = registerResponse.data.token;
          userId = registerResponse.data.user._id || registerResponse.data.user.id;
          console.log('✅ User registered successfully');
          console.log(`   User ID: ${userId}`);
          return;
        }
      } catch (regError) {
        console.error('❌ Registration failed:', regError.response?.data?.message || regError.message);
        throw regError;
      }
    } else {
      throw error;
    }
  }
}

// Get a product to add to cart
async function getProduct() {
  try {
    console.log('\n📦 Fetching products...');
    const response = await axios.get(`${API_BASE_URL}/products?limit=1`);
    
    let products = [];
    if (response.data.success && response.data.data?.products) {
      products = response.data.data.products;
    } else if (response.data.products) {
      products = response.data.products;
    } else if (Array.isArray(response.data)) {
      products = response.data;
    }

    if (products.length === 0) {
      throw new Error('No products found. Please seed the database first.');
    }

    const product = products[0];
    productId = product._id || product.id;

    // Get size and color
    const size = product.sizes && product.sizes.length > 0 
      ? (product.sizes[0].size || product.sizes[0].name || product.sizes[0])
      : 'M';
    
    const color = product.colors && product.colors.length > 0
      ? (product.colors[0].name || product.colors[0])
      : 'Black';

    console.log('✅ Product found:');
    console.log(`   Product ID: ${productId}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Size: ${size}`);
    console.log(`   Color: ${color}`);

    return { productId, size, color };
  } catch (error) {
    console.error('❌ Error fetching products:', error.response?.data?.message || error.message);
    throw error;
  }
}

// Add item to cart
async function addItemToCart(productId, size, color) {
  try {
    console.log('\n🛒 Adding item to cart...');
    const response = await axios.post(
      `${API_BASE_URL}/cart/add`,
      {
        productId,
        size,
        color,
        quantity: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('✅ Item added to cart successfully!');
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to add item');
    }
  } catch (error) {
    console.error('❌ Error adding to cart:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// Verify cart in MongoDB
async function verifyCartInMongoDB() {
  try {
    console.log('\n🔍 Verifying cart in MongoDB...');
    
    // Load User model
    const User = require('../models/User');

    const user = await User.findById(userId).populate('cart.product');
    
    if (!user) {
      throw new Error('User not found in MongoDB');
    }

    console.log(`\n📊 Cart Data in MongoDB:`);
    console.log(`   User: ${user.name} (${user.email})`);
    console.log(`   Cart Items Count: ${user.cart.length}`);

    if (user.cart.length > 0) {
      console.log('\n   Cart Items:');
      user.cart.forEach((item, index) => {
        console.log(`   ${index + 1}. Product: ${item.product?.name || 'N/A'}`);
        console.log(`      Size: ${item.size}`);
        console.log(`      Color: ${item.color}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Added At: ${item.addedAt || 'N/A'}`);
        console.log(`      Cart Item ID: ${item._id}`);
        console.log('');
      });
      console.log('✅ Cart items are saved in MongoDB!');
      console.log('\n💡 You can now check MongoDB Compass:');
      console.log(`   Database: ${mongoose.connection.name}`);
      console.log(`   Collection: users`);
      console.log(`   Document ID: ${userId}`);
      console.log(`   Look for the "cart" array field`);
    } else {
      console.log('⚠️  Cart is empty');
    }

    return user.cart;
  } catch (error) {
    console.error('❌ Error verifying cart:', error.message);
    throw error;
  }
}

// Get cart via API
async function getCartViaAPI() {
  try {
    console.log('\n📥 Fetching cart via API...');
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      const cart = response.data.data;
      console.log('✅ Cart retrieved via API:');
      console.log(`   Items: ${cart.items.length}`);
      console.log(`   Subtotal: $${cart.summary.subtotal}`);
      console.log(`   Total: $${cart.summary.total}`);
      
      if (cart.items.length > 0) {
        console.log('\n   Items:');
        cart.items.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.product.name}`);
          console.log(`      Size: ${item.size}, Color: ${item.color}`);
          console.log(`      Quantity: ${item.quantity}, Price: $${item.price}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error fetching cart:', error.response?.data?.message || error.message);
  }
}

// Main test function
async function runTest() {
  try {
    console.log('🚀 Starting Cart API Test...\n');
    console.log('='.repeat(50));

    // Connect to MongoDB
    await connectDB();

    // Setup user (login or register)
    await setupUser();

    // Get a product
    const { productId, size, color } = await getProduct();

    // Add item to cart
    await addItemToCart(productId, size, color);

    // Wait a bit for MongoDB to save
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify in MongoDB
    await verifyCartInMongoDB();

    // Get cart via API
    await getCartViaAPI();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Item added to cart via API');
    console.log('   - Cart saved in MongoDB');
    console.log('   - You can verify in MongoDB Compass');
    console.log('\n💡 To view in MongoDB Compass:');
    console.log(`   1. Open MongoDB Compass`);
    console.log(`   2. Connect to: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    console.log(`   3. Navigate to: ${mongoose.connection.name} > users`);
    console.log(`   4. Find user with email: ${testUser.email}`);
    console.log(`   5. Check the "cart" array field`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the test
runTest();

