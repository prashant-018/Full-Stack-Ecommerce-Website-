const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('name email role isActive createdAt');

    console.log('\n📋 Users in database:');
    console.log('='.repeat(50));

    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No name'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ' + '-'.repeat(30));
      });
    }

  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
listUsers();