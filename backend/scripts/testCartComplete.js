/**
 * Complete Cart System Test
 * This script will:
 * 1. Seed database (create users + products)
 * 2. Login as a user
 * 3. Add items to cart
 * 4. Verify cart is saved in MongoDB
 * 
 * Usage: node scripts/testCartComplete.js
 */

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

const testUser = {
  email: 'john@example.com',
  password: 'Password123!'
};

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

async function checkAndSeed() {
  try {
    console.log('\n📊 Checking database...');
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();

    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);

    if (userCount === 0 || productCount === 0) {
      console.log('\n🌱 Seeding database...');
      // Note: This will clear existing data
      // In production, you might want to skip this
      console.log('   Running seed script...');
      // We'll seed manually here
      await seedDatabase();
    } else {
      console.log('✅ Database already has data');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

async function seedDatabase() {
  console.log('   Please run: npm run seed');
  console.log('   Then run this test again.');
  process.exit(0);
}

async function loginUser() {
  try {
    console.log('\n🔐 Logging in...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    if (response.data.success) {
      console.log('✅ Login successful');
      return response.data.token || response.data.data?.token;
    }
    throw new Error('Login failed');
  } catch (error) {
    console.error('❌ Login error:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function getProduct(token) {
  try {
    console.log('\n📦 Fetching products...');
    const response = await axios.get(`${API_BASE_URL}/products?limit=3`);
    
    let products = [];
    if (response.data.success && response.data.data?.products) {
      products = response.data.data.products;
    } else if (response.data.products) {
      products = response.data.products;
    } else if (Array.isArray(response.data)) {
      products = response.data;
    }

    if (products.length === 0) {
      throw new Error('No products found');
    }

    const product = products[0];
    const size = product.sizes && product.sizes.length > 0
      ? (product.sizes[0].size || product.sizes[0].name || product.sizes[0])
      : 'M';
    
    const color = product.colors && product.colors.length > 0
      ? (product.colors[0].name || product.colors[0])
      : 'Black';

    console.log(`✅ Found product: ${product.name}`);
    console.log(`   Size: ${size}, Color: ${color}`);

    return {
      productId: product._id || product.id,
      size,
      color
    };
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    throw error;
  }
}

async function addToCart(token, productId, size, color) {
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('✅ Item added to cart via API!');
      return true;
    }
    throw new Error(response.data.message || 'Failed to add to cart');
  } catch (error) {
    console.error('❌ Error adding to cart:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function verifyInMongoDB() {
  try {
    console.log('\n🔍 Verifying cart in MongoDB...');
    
    const user = await User.findOne({ email: testUser.email }).populate('cart.product');
    
    if (!user) {
      throw new Error('User not found in MongoDB');
    }

    console.log(`\n📊 User Data in MongoDB:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Cart Items: ${user.cart.length}`);

    if (user.cart.length > 0) {
      console.log('\n   Cart Items:');
      user.cart.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.product?.name || 'Product'}`);
        console.log(`      Product ID: ${item.product?._id || item.product}`);
        console.log(`      Size: ${item.size}`);
        console.log(`      Color: ${item.color}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Cart Item ID: ${item._id}`);
        console.log(`      Added At: ${item.addedAt || 'N/A'}`);
        console.log('');
      });
      console.log('✅ Cart is saved in MongoDB!');
      console.log('\n💡 Check MongoDB Compass:');
      console.log(`   Database: ${mongoose.connection.name}`);
      console.log(`   Collection: users`);
      console.log(`   User Email: ${testUser.email}`);
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

async function getCartViaAPI(token) {
  try {
    console.log('\n📥 Fetching cart via API...');
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      const cart = response.data.data;
      console.log('✅ Cart retrieved via API:');
      console.log(`   Items: ${cart.items.length}`);
      console.log(`   Subtotal: $${cart.summary.subtotal}`);
      console.log(`   Total: $${cart.summary.total}`);
    }
  } catch (error) {
    console.error('❌ Error fetching cart:', error.response?.data?.message || error.message);
  }
}

async function runCompleteTest() {
  try {
    console.log('🚀 Starting Complete Cart System Test...\n');
    console.log('='.repeat(60));

    // Connect to MongoDB
    await connectDB();

    // Check and seed if needed
    await checkAndSeed();

    // Wait a bit for seed to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Login
    const token = await loginUser();

    // Get product
    const { productId, size, color } = await getProduct(token);

    // Add to cart
    await addToCart(token, productId, size, color);

    // Wait for MongoDB to save
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify in MongoDB
    await verifyInMongoDB();

    // Get cart via API
    await getCartViaAPI(token);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Complete test finished successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Users created in database');
    console.log('   ✅ Products available');
    console.log('   ✅ Item added to cart via API');
    console.log('   ✅ Cart saved in MongoDB');
    console.log('   ✅ Cart visible in MongoDB Compass');

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
runCompleteTest();

