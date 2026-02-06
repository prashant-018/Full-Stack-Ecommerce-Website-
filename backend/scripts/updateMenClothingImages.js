const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Product-specific images mapping - using distinct, clothing-appropriate images
const productImageMap = {
  // Jeans - different styles and washes
  "Classic Straight Fit Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
  "Slim Fit Light Wash Jeans": "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop",
  "Slim Fit Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
  "Slim Fit Dark Wash Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
  
  // Shirts - different types
  "Classic Oxford Button-Down Shirt": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
  "Casual Flannel Shirt": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  "Polo Shirt": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop",
  
  // T-Shirts
  "Premium Cotton T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
  
  // Pants
  "Classic Chino Pants": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
  
  // Jackets
  "Denim Jacket": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop",
  "Wool Blend Blazer": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  
  // Sweaters
  "Cashmere V-Neck Sweater": "https://images.unsplash.com/photo-1618354691223-ccc36f0f3831?w=600&h=800&fit=crop",
  "Cashmere Crew Neck Sweater": "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=800&fit=crop",
  
  // Shorts
  "Cargo Shorts": "https://images.unsplash.com/photo-1506629905607-d405872c5c0d?w=600&h=800&fit=crop"
};

const updateProductImages = async () => {
  try {
    console.log('🖼️  Starting to update product images...');

    const products = await Product.find({ section: 'men' });
    console.log(`📦 Found ${products.length} men's products to update`);

    let updatedCount = 0;

    for (const product of products) {
      const imageUrl = productImageMap[product.name];
      
      if (imageUrl) {
        // Update the product's primary image
        if (product.images && product.images.length > 0) {
          product.images[0].url = imageUrl;
          product.images[0].isPrimary = true;
        } else {
          product.images = [{
            url: imageUrl,
            alt: product.name,
            isPrimary: true
          }];
        }

        await product.save();
        updatedCount++;
        console.log(`✅ Updated image for: ${product.name}`);
      } else {
        console.log(`⚠️  No image mapping found for: ${product.name}`);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} product images!`);

  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    mongoose.connection.close();
    console.log('👋 Database connection closed.');
  }
};

updateProductImages();

