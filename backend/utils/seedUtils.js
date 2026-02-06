const User = require('../models/User');

/**
 * Seed default admin user (for server startup)
 * This function can be called when the server starts
 */
const initializeAdminUser = async () => {
  try {
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

    return savedAdmin;

  } catch (error) {
    console.error('❌ Error initializing admin user:', error.message);
    // Don't throw error to prevent server startup failure
    return null;
  }
};

/**
 * Verify admin user exists and is valid
 */
const verifyAdminUser = async () => {
  try {
    const admin = await User.findOne({
      email: 'admin@gmail.com',
      role: 'admin',
      isActive: true
    });

    if (admin) {
      console.log('✅ Admin user verified');
      return true;
    } else {
      console.log('⚠️  Admin user not found or inactive');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying admin user:', error.message);
    return false;
  }
};

module.exports = {
  initializeAdminUser,
  verifyAdminUser
};