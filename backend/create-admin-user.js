const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function createAdminUser() {
  try {
    console.log('🔧 Creating Admin User...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);

      // Update to ensure admin role and active status
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Admin user updated');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        phone: '555-ADMIN',
        address: {
          street: '123 Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '12345',
          country: 'USA'
        }
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Password: admin123`);
    }

    // Also create a test regular user
    const existingUser = await User.findOne({ email: 'user@example.com' });

    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('user123', 12);

      const testUser = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: hashedUserPassword,
        role: 'user',
        isActive: true,
        phone: '555-USER',
        address: {
          street: '123 User Street',
          city: 'User City',
          state: 'User State',
          zipCode: '54321',
          country: 'USA'
        }
      });

      await testUser.save();
      console.log('✅ Test user created successfully');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Role: ${testUser.role}`);
      console.log(`   Password: user123`);
    }

    await mongoose.connection.close();
    console.log('\\n✅ Database connection closed');
    console.log('\\n🎯 Admin user is ready for testing!');
    console.log('   Login credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

// Run admin user creation
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };