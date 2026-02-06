const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./models/Order');

async function fixOrders() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find orders with problematic status
    const problematicOrders = await Order.find({
      $or: [
        { status: { $regex: /pending.*cod/i } },
        { status: 'Pending (COD)' },
        { orderNumber: { $exists: false } },
        { orderNumber: null },
        { orderNumber: undefined }
      ]
    });

    console.log(`🔧 Found ${problematicOrders.length} orders that need fixing`);

    let fixedCount = 0;

    for (const order of problematicOrders) {
      console.log(`\n📦 Fixing order ${order._id}:`);
      console.log(`  - Current status: "${order.status}"`);
      console.log(`  - Current orderNumber: "${order.orderNumber}"`);

      // Fix status
      if (order.status && order.status.toLowerCase().includes('pending')) {
        order.status = 'pending';
        console.log(`  ✅ Fixed status to: "pending"`);
      }

      // Fix orderNumber if missing
      if (!order.orderNumber) {
        const count = await Order.countDocuments();
        order.orderNumber = `ORD-${String(count + fixedCount + 1).padStart(6, '0')}`;
        console.log(`  ✅ Generated orderNumber: "${order.orderNumber}"`);
      }

      // Fix paymentStatus if needed
      if (order.paymentStatus && order.paymentStatus.toLowerCase().includes('pending')) {
        order.paymentStatus = 'Pending';
        console.log(`  ✅ Fixed paymentStatus to: "Pending"`);
      }

      // Fix orderStatus if needed
      if (!order.orderStatus || order.orderStatus.toLowerCase().includes('pending')) {
        order.orderStatus = 'Pending';
        console.log(`  ✅ Fixed orderStatus to: "Pending"`);
      }

      await order.save();
      fixedCount++;
      console.log(`  ✅ Order saved successfully`);
    }

    console.log(`\n🎉 Fixed ${fixedCount} orders`);

    // Verify the fixes
    console.log('\n📊 Checking order status distribution after fixes:');
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    statusStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count}`);
    });

    // Show sample fixed orders
    const sampleOrders = await Order.find().limit(3).select('orderNumber status total customerInfo createdAt');
    console.log('\n📋 Sample orders after fix:');
    sampleOrders.forEach(order => {
      console.log(`- ${order.orderNumber}: ${order.status} - $${order.total} (${order.customerInfo?.name || 'Guest'})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Order fix completed');

  } catch (error) {
    console.error('❌ Order fix failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run fix
if (require.main === module) {
  fixOrders();
}

module.exports = { fixOrders };