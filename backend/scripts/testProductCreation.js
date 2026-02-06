const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const testProductData = {
  name: "Test Product",
  price: 29.99,
  originalPrice: 39.99,
  category: "Men's T-Shirts",
  section: "men",
  sku: "TEST-001",
  description: "This is a test product",
  brand: "TestBrand",
  material: "100% Cotton",
  images: [
    { url: "https://example.com/image1.jpg", alt: "Test Product" }
  ],
  sizes: [
    { size: "S", stock: 10 },
    { size: "M", stock: 15 }
  ],
  colors: [
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" }
  ],
  features: ["Comfortable", "Durable"],
  care: ["Machine wash cold", "Tumble dry low"],
  isNewArrival: true,
  isFeatured: false
};

const testProductCreation = async () => {
  try {
    console.log('🧪 Testing product creation...');

    // Remove test product if it exists
    await Product.deleteOne({ sku: "TEST-001" });

    // Test product creation
    const product = new Product(testProductData);
    await product.save();

    console.log('✅ Product created successfully:', product._id);
    console.log('📦 Product details:', {
      name: product.name,
      price: product.price,
      sku: product.sku,
      section: product.section,
      category: product.category,
      imagesCount: product.images.length,
      sizesCount: product.sizes.length,
      colorsCount: product.colors.length
    });

    // Clean up
    await Product.deleteOne({ _id: product._id });
    console.log('🧹 Test product cleaned up');

  } catch (error) {
    console.error('❌ Product creation test failed:', error);

    if (error.name === 'ValidationError') {
      console.error('📋 Validation errors:');
      Object.values(error.errors).forEach(err => {
        console.error(`  - ${err.message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
connectDB().then(() => {
  testProductCreation();
});