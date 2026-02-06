const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./models/Order');

async function fixOrdersComprehensive() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find all orders and check their structure
    const allOrders = await Order.find({}).lean(); // Use lean() to get raw data
    console.log(`🔍 Found ${allOrders.length} orders to analyze`);

    let fixedCount = 0;

    for (const orderData of allOrders) {
      console.log(`\n📦 Analyzing order ${orderData._id}:`);

      // Check what fields are missing or problematic
      const issues = [];

      if (!orderData.orderNumber || orderData.orderNumber === 'undefined') {
        issues.push('missing orderNumber');
      }

      if (!orderData.subtotal && orderData.subtotal !== 0) {
        issues.push('missing subtotal');
      }

      if (!orderData.customerInfo || !orderData.customerInfo.name || !orderData.customerInfo.email) {
        issues.push('missing customerInfo');
      }

      if (!orderData.items || orderData.items.length === 0) {
        issues.push('missing items');
      } else {
        orderData.items.forEach((item, index) => {
          if (!item.image) issues.push(`item ${index} missing image`);
          if (!item.color) issues.push(`item ${index} missing color`);
          if (!item.size) issues.push(`item ${index} missing size`);
          if (!item.quantity) issues.push(`item ${index} missing quantity`);
        });
      }

      if (issues.length > 0) {
        console.log(`  ❌ Issues found: ${issues.join(', ')}`);

        // Try to fix the order by updating directly in MongoDB
        const updateData = {};

        // Fix orderNumber
        if (!orderData.orderNumber || orderData.orderNumber === 'undefined') {
          updateData.orderNumber = `ORD-${String(fixedCount + 1).padStart(6, '0')}`;
        }

        // Fix status
        if (orderData.status && orderData.status.includes('Pending')) {
          updateData.status = 'pending';
          updateData.orderStatus = 'Pending';
          updateData.paymentStatus = 'Pending';
        }

        // Fix subtotal if missing
        if (!orderData.subtotal && orderData.total) {
          updateData.subtotal = orderData.total;
        }

        // Fix customerInfo if missing
        if (!orderData.customerInfo || !orderData.customerInfo.name || !orderData.customerInfo.email) {
          updateData.customerInfo = {
            name: orderData.customerInfo?.name || 'Guest Customer',
            email: orderData.customerInfo?.email || 'guest@example.com'
          };
        }

        // Fix items if they have issues
        if (orderData.items && orderData.items.length > 0) {
          const fixedItems = orderData.items.map((item, index) => ({
            ...item,
            image: item.image || '/placeholder-image.jpg',
            color: item.color || 'Default',
            size: item.size || 'M',
            quantity: item.quantity || 1
          }));
          updateData.items = fixedItems;
        }

        // Update the order directly in MongoDB
        await Order.updateOne(
          { _id: orderData._id },
          { $set: updateData },
          { runValidators: false } // Skip validation for this fix
        );

        console.log(`  ✅ Fixed order with updates:`, Object.keys(updateData));
        fixedCount++;
      } else {
        console.log(`  ✅ Order is already valid`);
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} orders`);

    // Verify the fixes by checking a few orders
    const sampleOrders = await Order.find().limit(3).select('orderNumber status total customerInfo createdAt');
    console.log('\n📋 Sample orders after fix:');
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

    console.log('\n📊 Order status distribution after fixes:');
    statusStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Comprehensive order fix completed');

  } catch (error) {
    console.error('❌ Comprehensive order fix failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run fix
if (require.main === module) {
  fixOrdersComprehensive();
}

module.exports = { fixOrdersComprehensive };