const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

/**
 * Seed default admin user
 * This script creates a default admin user if it doesn't already exist
 */
const seedAdminUser = async () => {
  try {
    console.log('🔍 Checking for existing admin user...');

    // Admin user credentials
    const adminCredentials = {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'prashant123',
      role: 'admin'
    };

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: adminCredentials.email
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🔐 Role: ${existingAdmin.role}`);
      return existingAdmin;
    }

    // Create new admin user
    console.log('🚀 Creating default admin user...');

    const adminUser = new User({
      name: adminCredentials.name,
      email: adminCredentials.email,
      password: adminCredentials.password, // Will be hashed by pre-save middleware
      role: adminCredentials.role,
      isActive: true
    });

    // Save admin user (password will be automatically hashed)
    const savedAdmin = await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${savedAdmin.email}`);
    console.log(`👤 Name: ${savedAdmin.name}`);
    console.log(`🔐 Role: ${savedAdmin.role}`);
    console.log(`🆔 ID: ${savedAdmin._id}`);

    return savedAdmin;

  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    throw error;
  }
};

/**
 * Connect to MongoDB and seed admin user
 */
const connectAndSeed = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Seed admin user
    await seedAdminUser();

  } catch (error) {
    console.error('❌ Database connection or seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script if called directly
if (require.main === module) {
  connectAndSeed()
    .then(() => {
      console.log('🎉 Admin seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin seeding failed:', error.message);
      process.exit(1);
    });
}

// Export for use in other files
module.exports = {
  seedAdminUser,
  connectAndSeed
};