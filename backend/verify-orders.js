const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./models/Order');

async function verifyOrders() {
  try {
    console.log('🔍 Verifying Orders in Database...\\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get recent orders
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerInfo total status paymentMethod createdAt items');

    console.log(`\\n📊 Found ${orders.length} orders in database:`);

    if (orders.length === 0) {
      console.log('❌ No orders found in database');
    } else {
      orders.forEach((order, index) => {
        console.log(`\\n📦 Order ${index + 1}:`);
        console.log(`   Order Number: ${order.orderNumber}`);
        console.log(`   Customer: ${order.customerInfo.name}`);
        console.log(`   Email: ${order.customerInfo.email}`);
        console.log(`   Total: $${order.total}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Payment: ${order.paymentMethod}`);
        console.log(`   Items: ${order.items ? order.items.length : 0}`);
        console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`);
      });

      console.log('\\n✅ Orders are being saved correctly to MongoDB!');
      console.log('✅ Admin panel should be able to display these orders.');
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
  verifyOrders();
}

module.exports = { verifyOrders };