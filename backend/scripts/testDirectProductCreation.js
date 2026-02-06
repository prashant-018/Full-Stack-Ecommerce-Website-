const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const testDirectProductCreation = async () => {
  try {
    console.log('🧪 Testing Direct Product Creation...\n');

    const productData = {
      name: 'Direct Test Product',
      description: 'This is a test product created directly',
      price: 99.99,
      originalPrice: 99.99,
      category: 'Men\'s T-Shirts',
      section: 'men',
      sizes: [{ size: 'M', stock: 10 }],
      colors: [{ name: 'Blue', hex: '#0000ff' }],
      images: [{ url: 'https://via.placeholder.com/400x500', alt: 'Test Product', isPrimary: true }],
      sku: `DIRECT-${Date.now()}`
    };

    console.log('📦 Creating product with data:', JSON.stringify(productData, null, 2));

    const product = new Product(productData);
    await product.save();

    console.log('✅ Product created successfully!');
    console.log('📦 Created product:', JSON.stringify(product.toJSON(), null, 2));

  } catch (error) {
    console.error('❌ Direct product creation failed:', error);

    if (error.name === 'ValidationError') {
      console.log('📋 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    mongoose.connection.close();
  }
};

testDirectProductCreation();