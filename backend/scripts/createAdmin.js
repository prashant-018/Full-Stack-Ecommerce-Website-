const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    console.log('ID:', adminUser._id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdminUser();