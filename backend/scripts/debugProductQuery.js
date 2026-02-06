const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const debugProductQuery = async () => {
  try {
    console.log('🔍 Debugging product query logic...\n');

    // Simulate the exact query from the API
    const section = 'women';
    const filter = { isActive: true };

    // This is the exact logic from the fixed API
    if (section && section.trim()) {
      const sectionValue = section.trim().toLowerCase();
      console.log('🔍 Filtering by section:', sectionValue);

      // Handle both exact match and case-insensitive regex
      filter.$or = [
        { section: sectionValue },
        { section: { $regex: new RegExp(`^${sectionValue}$`, 'i') } }
      ];
    }

    console.log('🔍 MongoDB filter:', JSON.stringify(filter, null, 2));

    // Execute the query
    const products = await Product.find(filter).lean();
    console.log(`✅ Found products: ${products.length}`);

    if (products.length > 0) {
      console.log('\n📦 Sample products:');
      products.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Section: "${product.section}"`);
        console.log(`   Active: ${product.isActive}`);
        console.log(`   Category: ${product.category}`);
        console.log('');
      });
    }

    // Test different section values
    console.log('\n🧪 Testing different section values...');
    const testSections = ['women', 'Women', 'WOMEN', 'men', 'Men', 'MEN'];

    for (const testSection of testSections) {
      const testFilter = { isActive: true };
      const sectionValue = testSection.trim().toLowerCase();
      testFilter.$or = [
        { section: sectionValue },
        { section: { $regex: new RegExp(`^${sectionValue}$`, 'i') } }
      ];

      const count = await Product.countDocuments(testFilter);
      console.log(`   "${testSection}" -> ${count} products`);
    }

    // Check if there are any inactive products
    console.log('\n🔍 Checking product status...');
    const activeCount = await Product.countDocuments({ isActive: true });
    const inactiveCount = await Product.countDocuments({ isActive: false });
    const totalCount = await Product.countDocuments({});

    console.log(`   Active products: ${activeCount}`);
    console.log(`   Inactive products: ${inactiveCount}`);
    console.log(`   Total products: ${totalCount}`);

    // Check women products specifically
    console.log('\n👗 Women products analysis...');
    const womenActive = await Product.find({
      section: { $regex: new RegExp('^women$', 'i') },
      isActive: true
    });
    const womenInactive = await Product.find({
      section: { $regex: new RegExp('^women$', 'i') },
      isActive: false
    });

    console.log(`   Active women products: ${womenActive.length}`);
    console.log(`   Inactive women products: ${womenInactive.length}`);

    if (womenActive.length > 0) {
      console.log('\n   Active women products:');
      womenActive.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.section}, active: ${product.isActive})`);
      });
    }

  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugProductQuery();