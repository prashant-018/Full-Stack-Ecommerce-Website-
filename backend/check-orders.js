const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./models/Order');
const User = require('./models/User');

async function checkOrders() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check orders
    const orderCount = await Order.countDocuments();
    console.log(`📦 Total orders in database: ${orderCount}`);

    if (orderCount > 0) {
      const sampleOrders = await Order.find().limit(3).select('orderNumber status total customerInfo createdAt');
      console.log('\n📋 Sample orders:');
      sampleOrders.forEach(order => {
        console.log(`- ${order.orderNumber}: ${order.status} - $${order.total} (${order.customerInfo?.name || 'Guest'})`);
      });

      // Check status distribution
      const statusStats = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      console.log('\n📊 Order status distribution:');
      statusStats.forEach(stat => {
        console.log(`- ${stat._id}: ${stat.count}`);
      });
    }

    // Check admin users
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`\n👤 Admin users in database: ${adminCount}`);

    if (adminCount > 0) {
      const adminUsers = await User.find({ role: 'admin' }).select('email name isActive');
      console.log('\n👥 Admin users:');
      adminUsers.forEach(admin => {
        console.log(`- ${admin.email} (${admin.name}) - Active: ${admin.isActive}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Database check completed');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
}

// Run check
if (require.main === module) {
  checkOrders();
}

module.exports = { checkOrders };