const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const testProductsAPI = async () => {
  try {
    console.log('🧪 Testing Products API fixes...\n');

    // Test 1: Check if products exist in database
    console.log('1️⃣ Checking products in database...');
    const allProducts = await Product.find({});
    console.log(`   Total products: ${allProducts.length}`);

    // Test 2: Check section distribution
    console.log('\n2️⃣ Checking section distribution...');
    const sectionStats = await Product.aggregate([
      { $group: { _id: '$section', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('   Section distribution:');
    sectionStats.forEach(stat => {
      console.log(`   - ${stat._id || 'null'}: ${stat.count} products`);
    });

    // Test 3: Test case-insensitive section queries
    console.log('\n3️⃣ Testing case-insensitive section queries...');

    const womenLower = await Product.find({
      section: { $regex: new RegExp('^women$', 'i') }
    });
    console.log(`   "women" (case-insensitive): ${womenLower.length} products`);

    const menLower = await Product.find({
      section: { $regex: new RegExp('^men$', 'i') }
    });
    console.log(`   "men" (case-insensitive): ${menLower.length} products`);

    // Test 4: Test exact section matches
    console.log('\n4️⃣ Testing exact section matches...');

    const womenExact = await Product.find({ section: 'women' });
    console.log(`   section: "women": ${womenExact.length} products`);

    const menExact = await Product.find({ section: 'men' });
    console.log(`   section: "men": ${menExact.length} products`);

    // Test 5: Show sample products from each section
    console.log('\n5️⃣ Sample products by section...');

    if (womenLower.length > 0) {
      console.log('   Women products (first 3):');
      womenLower.slice(0, 3).forEach(product => {
        console.log(`   - ${product.name} (section: "${product.section}")`);
      });
    }

    if (menLower.length > 0) {
      console.log('   Men products (first 3):');
      menLower.slice(0, 3).forEach(product => {
        console.log(`   - ${product.name} (section: "${product.section}")`);
      });
    }

    // Test 6: Check for products with null/undefined sections
    console.log('\n6️⃣ Checking for products with missing sections...');
    const noSection = await Product.find({
      $or: [
        { section: null },
        { section: undefined },
        { section: '' },
        { section: { $exists: false } }
      ]
    });
    console.log(`   Products without section: ${noSection.length}`);

    if (noSection.length > 0) {
      console.log('   Products missing section:');
      noSection.slice(0, 5).forEach(product => {
        console.log(`   - ${product.name} (section: ${product.section})`);
      });
    }

    // Test 7: Simulate the API query that was failing
    console.log('\n7️⃣ Simulating API query: section=women...');
    const apiQuery = {
      isActive: true,
      $or: [
        { section: 'women' },
        { section: { $regex: new RegExp('^women$', 'i') } }
      ]
    };

    const apiResults = await Product.find(apiQuery);
    console.log(`   API simulation results: ${apiResults.length} products`);

    console.log('\n✅ Product API test completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Total products: ${allProducts.length}`);
    console.log(`   - Women products: ${womenLower.length}`);
    console.log(`   - Men products: ${menLower.length}`);
    console.log(`   - Products without section: ${noSection.length}`);

    if (womenLower.length === 0) {
      console.log('\n⚠️  WARNING: No women products found!');
      console.log('   This explains why the frontend shows 0 products.');
      console.log('   Check if products were seeded with correct section values.');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testProductsAPI();