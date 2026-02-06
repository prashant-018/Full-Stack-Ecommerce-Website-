const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const fixInactiveProducts = async () => {
  try {
    console.log('🔧 Fixing inactive products...\n');

    // Check current status
    console.log('📊 Current product status:');
    const activeCount = await Product.countDocuments({ isActive: true });
    const inactiveCount = await Product.countDocuments({ isActive: false });
    console.log(`   Active: ${activeCount}`);
    console.log(`   Inactive: ${inactiveCount}`);

    // Show inactive products
    console.log('\n❌ Inactive products:');
    const inactiveProducts = await Product.find({ isActive: false });
    inactiveProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.section}) - SKU: ${product.sku}`);
    });

    // Fix: Set all products to active
    console.log('\n🔧 Setting all products to active...');
    const updateResult = await Product.updateMany(
      { isActive: false },
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} products to active`);

    // Verify the fix
    console.log('\n✅ After fix:');
    const newActiveCount = await Product.countDocuments({ isActive: true });
    const newInactiveCount = await Product.countDocuments({ isActive: false });
    console.log(`   Active: ${newActiveCount}`);
    console.log(`   Inactive: ${newInactiveCount}`);

    // Test section counts after fix
    console.log('\n📊 Section distribution after fix:');
    const womenCount = await Product.countDocuments({
      section: { $regex: new RegExp('^women$', 'i') },
      isActive: true
    });
    const menCount = await Product.countDocuments({
      section: { $regex: new RegExp('^men$', 'i') },
      isActive: true
    });

    console.log(`   Active women products: ${womenCount}`);
    console.log(`   Active men products: ${menCount}`);

    console.log('\n🎉 Fix completed! The API should now return all products.');

  } catch (error) {
    console.error('❌ Fix error:', error);
  } finally {
    mongoose.connection.close();
  }
};

fixInactiveProducts();