const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const verifyMenProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Fetch all men's products
    const menProducts = await Product.find({ section: 'men' }).sort({ createdAt: -1 });

    console.log(`\n📦 Found ${menProducts.length} men's products:\n`);

    menProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Price: ₹${product.price} (Original: ₹${product.originalPrice})`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Section: ${product.section}`);
      console.log(`   Material: ${product.material}`);
      console.log(`   Fit: ${product.fit}`);
      console.log(`   Rating: ${product.rating.average}/5 (${product.rating.count} reviews)`);
      console.log(`   Sizes: ${product.sizes.map(s => `${s.size}(${s.stock})`).join(', ')}`);
      console.log(`   Colors: ${product.colors.map(c => c.name).join(', ')}`);
      console.log(`   Featured: ${product.isFeatured ? '✅' : '❌'}`);
      console.log(`   Active: ${product.isActive ? '✅' : '❌'}`);
      console.log(`   Image: ${product.images[0]?.url}`);
      console.log('   ---');
    });

    // Summary statistics
    const totalStock = menProducts.reduce((total, product) => {
      return total + product.sizes.reduce((productTotal, size) => productTotal + size.stock, 0);
    }, 0);

    const avgPrice = menProducts.reduce((sum, product) => sum + product.price, 0) / menProducts.length;
    const avgRating = menProducts.reduce((sum, product) => sum + product.rating.average, 0) / menProducts.length;

    console.log('\n📊 Statistics:');
    console.log(`- Total products: ${menProducts.length}`);
    console.log(`- Total stock units: ${totalStock}`);
    console.log(`- Average price: ₹${Math.round(avgPrice)}`);
    console.log(`- Average rating: ${avgRating.toFixed(1)}/5`);
    console.log(`- Featured products: ${menProducts.filter(p => p.isFeatured).length}`);
    console.log(`- New arrivals: ${menProducts.filter(p => p.isNewArrival).length}`);

  } catch (error) {
    console.error('❌ Error verifying products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

verifyMenProducts();