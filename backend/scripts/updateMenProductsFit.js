const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const updateMenProductsFit = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update products with fit information
    const updates = [
      { sku: 'MS94049901', fit: 'Slim' },      // Premium Cotton Oxford Shirt
      { sku: 'MJ94049902', fit: 'Slim' },      // Tailored Wool Blend Blazer
      { sku: 'MJ94049903', fit: 'Regular' },   // Classic Straight Leg Denim
      { sku: 'MS94049904', fit: 'Regular' },   // Merino Wool Crew Sweater
      { sku: 'MP94049905', fit: 'Relaxed' }    // Performance Chino Trousers
    ];

    console.log('🔄 Updating fit information for men\'s products...');

    for (const update of updates) {
      const result = await Product.updateOne(
        { sku: update.sku },
        { $set: { fit: update.fit } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${update.sku} with fit: ${update.fit}`);
      } else {
        console.log(`⚠️  No product found with SKU: ${update.sku}`);
      }
    }

    // Verify updates
    const updatedProducts = await Product.find({ section: 'men' }).select('name sku fit');
    console.log('\n📦 Updated products:');
    updatedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}): ${product.fit}`);
    });

  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

updateMenProductsFit();