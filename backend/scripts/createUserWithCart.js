/**
 * Script to create a test user and add items to cart
 * This will populate the users collection in MongoDB
 * 
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Make sure you have products in the database
 * 3. Run: node scripts/createUserWithCart.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'test123456',
  role: 'user'
};

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function createUserWithCart() {
  try {
    console.log('\n🚀 Creating user with cart items...\n');

    // Check if user already exists
    let user = await User.findOne({ email: testUser.email });
    
    if (user) {
      console.log('⚠️  User already exists, using existing user...');
      console.log(`   User ID: ${user._id}`);
    } else {
      // Create new user
      user = new User({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
      });
      
      await user.save();
      console.log('✅ User created successfully!');
      console.log(`   User ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
    }

    // Get products to add to cart
    console.log('\n📦 Fetching products...');
    const products = await Product.find({ isActive: true }).limit(3);
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Please seed products first:');
      console.log('   npm run seed');
      return;
    }

    console.log(`✅ Found ${products.length} products`);

    // Clear existing cart
    user.cart = [];
    
    // Add products to cart
    console.log('\n🛒 Adding items to cart...');
    for (const product of products) {
      // Get first available size and color
      const size = product.sizes && product.sizes.length > 0
        ? (product.sizes[0].size || product.sizes[0].name || product.sizes[0])
        : 'M';
      
      const color = product.colors && product.colors.length > 0
        ? (product.colors[0].name || product.colors[0])
        : 'Black';

      user.cart.push({
        product: product._id,
        size: size,
        color: color,
        quantity: Math.floor(Math.random() * 3) + 1 // Random quantity 1-3
      });

      console.log(`   ✅ Added: ${product.name}`);
      console.log(`      Size: ${size}, Color: ${color}`);
    }

    // Save user with cart
    await user.save();
    
    console.log('\n✅ Cart saved to MongoDB!');
    console.log(`   Total items in cart: ${user.cart.length}`);

    // Verify in MongoDB
    const savedUser = await User.findById(user._id).populate('cart.product');
    console.log('\n📊 Cart Data in MongoDB:');
    console.log(`   User: ${savedUser.name} (${savedUser.email})`);
    console.log(`   Cart Items: ${savedUser.cart.length}`);
    
    if (savedUser.cart.length > 0) {
      console.log('\n   Items:');
      savedUser.cart.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.product.name}`);
        console.log(`      Size: ${item.size}, Color: ${item.color}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Cart Item ID: ${item._id}`);
        console.log('');
      });
    }

    console.log('\n💡 Now check MongoDB Compass:');
    console.log(`   1. Go to: ${mongoose.connection.name} > users`);
    console.log(`   2. Find user with email: ${testUser.email}`);
    console.log(`   3. Check the "cart" array field`);
    console.log('\n🔑 Login credentials:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
    process.exit(0);
  }
}

// Main function
async function main() {
  await connectDB();
  await createUserWithCart();
}

main();



