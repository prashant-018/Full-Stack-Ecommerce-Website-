const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

/**
 * Test admin login functionality
 */
const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing admin login...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({
      email: 'admin@gmail.com'
    }).select('+password'); // Include password for testing

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔐 Role: ${adminUser.role}`);
    console.log(`🟢 Active: ${adminUser.isActive}`);

    // Test password comparison
    const testPassword = 'prashant123';
    const isPasswordValid = await adminUser.comparePassword(testPassword);

    if (isPasswordValid) {
      console.log('✅ Password verification successful');
      console.log('🎉 Admin login test PASSED');
    } else {
      console.log('❌ Password verification failed');
      console.log('💥 Admin login test FAILED');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
testAdminLogin()
  .then(() => {
    console.log('🏁 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test error:', error.message);
    process.exit(1);
  });