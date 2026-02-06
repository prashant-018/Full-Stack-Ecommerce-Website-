const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const menClothing = [
  {
    name: "Classic Straight Fit Jeans",
    price: 89.99,
    originalPrice: 119.99,
    category: "Men's Jeans",
    section: "men",
    sizes: [
      { size: "30", stock: 15 },
      { size: "32", stock: 22 },
      { size: "34", stock: 25 },
      { size: "36", stock: 18 },
      { size: "38", stock: 12 }
    ],
    colors: [
      { name: "Dark Blue", hex: "#1e3a8a" },
      { name: "Medium Blue", hex: "#3b82f6" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
      alt: "Classic Straight Fit Jeans",
      isPrimary: true
    }],
    rating: { average: 4.5, count: 156 },
    isNewArrival: true,
    description: "Classic straight fit jeans made from premium denim. Comfortable and versatile for everyday wear.",
    brand: "DenimCo",
    material: "98% Cotton, 2% Elastane",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["Straight fit", "Classic 5-pocket design", "Pre-shrunk"],
    sku: "MEN-JEA-001"
  },
  {
    name: "Slim Fit Light Wash Jeans",
    price: 79.99,
    originalPrice: 99.99,
    category: "Men's Jeans",
    section: "men",
    sizes: [
      { size: "30", stock: 12 },
      { size: "32", stock: 20 },
      { size: "34", stock: 23 },
      { size: "36", stock: 15 },
      { size: "38", stock: 10 }
    ],
    colors: [
      { name: "Light Blue", hex: "#93c5fd" },
      { name: "Medium Blue", hex: "#3b82f6" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1506629905607-d405872c5c0d?w=600&h=800&fit=crop",
      alt: "Slim Fit Light Wash Jeans",
      isPrimary: true
    }],
    rating: { average: 4.6, count: 203 },
    isNewArrival: false,
    description: "Modern slim fit jeans with a light wash. Perfect for casual outings and weekend wear.",
    brand: "DenimCo",
    material: "99% Cotton, 1% Elastane",
    care: ["Machine wash cold", "Hang dry"],
    features: ["Slim fit", "Light wash", "Stretch comfort"],
    sku: "MEN-JEA-002"
  },
  {
    name: "Classic Oxford Button-Down Shirt",
    price: 69.99,
    originalPrice: 89.99,
    category: "Men's Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 18 },
      { size: "M", stock: 28 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Light Blue", hex: "#add8e6" },
      { name: "Navy", hex: "#000080" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&h=800&fit=crop",
      alt: "Classic Oxford Button-Down Shirt",
      isPrimary: true
    }],
    rating: { average: 4.7, count: 287 },
    isNewArrival: true,
    description: "Premium cotton oxford shirt with button-down collar. Classic design perfect for business casual.",
    brand: "StyleCraft",
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["Button-down collar", "Classic fit", "Chest pocket"],
    sku: "MEN-SHI-001"
  },
  {
    name: "Casual Flannel Shirt",
    price: 54.99,
    originalPrice: 74.99,
    category: "Men's Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 22 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 8 }
    ],
    colors: [
      { name: "Red Plaid", hex: "#dc2626" },
      { name: "Blue Plaid", hex: "#2563eb" },
      { name: "Black Plaid", hex: "#1f2937" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1520975932078-9f6827bcaad7?w=600&h=800&fit=crop",
      alt: "Casual Flannel Shirt",
      isPrimary: true
    }],
    rating: { average: 4.4, count: 142 },
    isNewArrival: false,
    description: "Soft flannel shirt perfect for casual wear. Comfortable and stylish with classic plaid patterns.",
    brand: "ComfortWear",
    material: "100% Cotton Flannel",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Soft flannel", "Button front", "Classic plaid"],
    sku: "MEN-SHI-002"
  },
  {
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    category: "Men's T-Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 35 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 20 },
      { size: "XXL", stock: 15 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Gray", hex: "#808080" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      alt: "Premium Cotton T-Shirt",
      isPrimary: true
    }],
    rating: { average: 4.8, count: 456 },
    isNewArrival: false,
    description: "Ultra-soft premium cotton t-shirt. Essential wardrobe staple with modern fit and comfort.",
    brand: "ComfortWear",
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Ultra-soft", "Modern fit", "Pre-shrunk"],
    sku: "MEN-TSH-001"
  },
  {
    name: "Classic Chino Pants",
    price: 64.99,
    originalPrice: 84.99,
    category: "Men's Pants",
    section: "men",
    sizes: [
      { size: "30", stock: 12 },
      { size: "32", stock: 20 },
      { size: "34", stock: 22 },
      { size: "36", stock: 16 },
      { size: "38", stock: 10 }
    ],
    colors: [
      { name: "Khaki", hex: "#c3b091" },
      { name: "Navy", hex: "#000080" },
      { name: "Charcoal", hex: "#36454f" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
      alt: "Classic Chino Pants",
      isPrimary: true
    }],
    rating: { average: 4.6, count: 234 },
    isNewArrival: true,
    description: "Classic chino pants in a versatile fit. Perfect for both casual and business casual occasions.",
    brand: "StyleCraft",
    material: "98% Cotton, 2% Elastane",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["Classic fit", "Versatile style", "Comfortable"],
    sku: "MEN-PAN-001"
  },
  {
    name: "Denim Jacket",
    price: 89.99,
    originalPrice: 119.99,
    category: "Men's Jackets",
    section: "men",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 8 }
    ],
    colors: [
      { name: "Medium Blue", hex: "#3b82f6" },
      { name: "Dark Blue", hex: "#1e3a8a" },
      { name: "Black", hex: "#000000" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop",
      alt: "Denim Jacket",
      isPrimary: true
    }],
    rating: { average: 4.5, count: 167 },
    isNewArrival: true,
    description: "Classic denim jacket with a timeless design. Perfect for layering in any season.",
    brand: "DenimCo",
    material: "100% Cotton Denim",
    care: ["Machine wash cold", "Hang dry"],
    features: ["Classic design", "Button front", "Multiple pockets"],
    sku: "MEN-JAC-001"
  },
  {
    name: "Cashmere V-Neck Sweater",
    price: 149.99,
    originalPrice: 199.99,
    category: "Men's Sweaters",
    section: "men",
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 6 }
    ],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Charcoal", hex: "#36454f" },
      { name: "Cream", hex: "#fffdd0" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1618354691223-ccc36f0f3831?w=600&h=800&fit=crop",
      alt: "Cashmere V-Neck Sweater",
      isPrimary: true
    }],
    rating: { average: 4.9, count: 98 },
    isNewArrival: true,
    description: "Luxurious cashmere v-neck sweater. Perfect for layering over shirts or wearing alone.",
    brand: "LuxeKnit",
    material: "100% Cashmere",
    care: ["Hand wash cold", "Lay flat to dry", "Store folded"],
    features: ["Pure cashmere", "V-neck design", "Ribbed cuffs"],
    sku: "MEN-SWE-001"
  },
  {
    name: "Cargo Shorts",
    price: 49.99,
    originalPrice: 69.99,
    category: "Men's Shorts",
    section: "men",
    sizes: [
      { size: "30", stock: 14 },
      { size: "32", stock: 18 },
      { size: "34", stock: 20 },
      { size: "36", stock: 14 },
      { size: "38", stock: 10 }
    ],
    colors: [
      { name: "Khaki", hex: "#c3b091" },
      { name: "Navy", hex: "#000080" },
      { name: "Olive", hex: "#65a30d" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=800&fit=crop",
      alt: "Cargo Shorts",
      isPrimary: true
    }],
    rating: { average: 4.3, count: 145 },
    isNewArrival: false,
    description: "Comfortable cargo shorts with multiple pockets. Perfect for casual summer wear.",
    brand: "ComfortWear",
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Multiple pockets", "Comfortable fit", "Casual style"],
    sku: "MEN-SHO-001"
  },
  {
    name: "Polo Shirt",
    price: 44.99,
    originalPrice: 59.99,
    category: "Men's Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 16 },
      { size: "M", stock: 24 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 14 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#000080" },
      { name: "Forest Green", hex: "#166534" },
      { name: "Red", hex: "#dc2626" }
    ],
    images: [{
      url: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=800&fit=crop",
      alt: "Polo Shirt",
      isPrimary: true
    }],
    rating: { average: 4.6, count: 312 },
    isNewArrival: true,
    description: "Classic polo shirt with a modern fit. Perfect for casual and smart casual occasions.",
    brand: "StyleCraft",
    material: "100% Pima Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Classic polo design", "Modern fit", "Three-button placket"],
    sku: "MEN-SHI-003"
  }
];

const seedMenClothing = async () => {
  try {
    console.log('🌱 Starting to seed men\'s clothing products...');

    // Check if products with these SKUs already exist
    const existingSkus = await Product.find({ 
      sku: { $in: menClothing.map(p => p.sku) } 
    }).select('sku');

    if (existingSkus.length > 0) {
      console.log('⚠️  Some products already exist with these SKUs:');
      existingSkus.forEach(p => console.log(`   - ${p.sku}`));
      console.log('🔄 Skipping existing products and adding new ones...');
      
      const existingSkuSet = new Set(existingSkus.map(p => p.sku));
      const newProducts = menClothing.filter(p => !existingSkuSet.has(p.sku));
      
      if (newProducts.length === 0) {
        console.log('✅ All products already exist in database.');
        mongoose.connection.close();
        return;
      }
      
      const insertedProducts = await Product.insertMany(newProducts);
      console.log(`✅ Successfully added ${insertedProducts.length} new products!`);
    } else {
      // Insert all products if none exist
      const insertedProducts = await Product.insertMany(menClothing);
      console.log(`✅ Successfully created ${insertedProducts.length} men's clothing products!`);
    }

    // Show category breakdown
    const categoryCount = {};
    menClothing.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('\n📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    // Show product summary
    console.log('\n📦 Products added:');
    menClothing.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    console.log('\n🔍 Verification:');
    console.log('1. Check MongoDB Compass: Database "ecommerce" → Collection "products"');
    console.log('2. Filter: { "section": "men" }');
    console.log('3. Visit your website Men page to see all products');

  } catch (error) {
    console.error('❌ Error seeding men\'s clothing products:', error);
    if (error.code === 11000) {
      console.error('   Duplicate SKU found. Some products may already exist.');
    }
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed.');
  }
};

seedMenClothing();

