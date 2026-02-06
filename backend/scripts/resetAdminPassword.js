const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@ecommerce.com' });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('Found admin user:', adminUser.email);

    // Update password
    adminUser.password = 'admin123';
    await adminUser.save();

    console.log('✅ Admin password reset successfully!');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
resetAdminPassword();