const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function verifyAdminUser() {
  try {
    console.log('🔍 Verifying Admin User...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' }).select('+password');

    if (!adminUser) {
      console.log('❌ Admin user not found');

      // Create admin user
      console.log('🔧 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        phone: '555-ADMIN'
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully');

    } else {
      console.log('✅ Admin user found:');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.isActive}`);
      console.log(`   Password Hash: ${adminUser.password.substring(0, 20)}...`);

      // Test password comparison
      console.log('\\n🔐 Testing password comparison...');
      const isPasswordValid = await adminUser.comparePassword('admin123');
      console.log(`   Password 'admin123' valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        console.log('🔧 Updating admin password...');
        adminUser.password = 'admin123'; // This will trigger the pre-save hash
        await adminUser.save();
        console.log('✅ Admin password updated');

        // Test again
        const updatedAdmin = await User.findOne({ email: 'admin@example.com' }).select('+password');
        const isNewPasswordValid = await updatedAdmin.comparePassword('admin123');
        console.log(`   New password 'admin123' valid: ${isNewPasswordValid}`);
      }
    }

    // Test login simulation
    console.log('\\n🧪 Simulating login process...');
    const loginTestUser = await User.findOne({ email: 'admin@example.com' }).select('+password');

    if (loginTestUser) {
      console.log('✅ User found for login');
      console.log(`   Active: ${loginTestUser.isActive}`);

      const passwordMatch = await loginTestUser.comparePassword('admin123');
      console.log(`   Password match: ${passwordMatch}`);

      if (passwordMatch && loginTestUser.isActive) {
        console.log('✅ Login simulation successful!');
      } else {
        console.log('❌ Login simulation failed');
      }
    }

    await mongoose.connection.close();
    console.log('\\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  verifyAdminUser();
}

module.exports = { verifyAdminUser };