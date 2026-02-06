const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const menProducts = [
  {
    name: "Cashmere Crew Neck Sweater",
    price: 149.99,
    originalPrice: 149.99,
    category: "Men's Sweaters",
    section: "men",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 8 }
    ],
    colors: [
      { name: "Charcoal", hex: "#36454f" },
      { name: "Navy", hex: "#000080" },
      { name: "Cream", hex: "#fffdd0" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop&crop=center",
        alt: "Cashmere Crew Neck Sweater",
        isPrimary: true
      }
    ],
    rating: { average: 4.8, count: 74 },
    isNewArrival: true,
    description: "Luxurious cashmere sweater with classic crew neck design. Perfect for layering or wearing alone.",
    brand: "LuxeKnit",
    material: "100% Cashmere",
    care: ["Hand wash cold", "Lay flat to dry", "Store folded"],
    features: ["Pure cashmere", "Crew neck", "Ribbed cuffs"],
    sku: "MEN-SWE-NEW-001"
  },
  {
    name: "Classic White Oxford Shirt",
    price: 82.99,
    originalPrice: 82.99,
    category: "Men's Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 8 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Light Blue", hex: "#add8e6" },
      { name: "Navy", hex: "#000080" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&crop=center",
        alt: "Classic White Oxford Shirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.5, count: 128 },
    isNewArrival: false,
    description: "Premium cotton oxford shirt with classic fit. Perfect for business or casual wear.",
    brand: "StyleCraft",
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["Classic fit", "Button-down collar", "Chest pocket"],
    sku: "MEN-SHI-NEW-001"
  },
  {
    name: "Premium Cotton T-Shirt",
    price: 29.00,
    originalPrice: 29.00,
    category: "Men's T-Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 18 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Gray", hex: "#808080" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
        alt: "Premium Cotton T-Shirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.7, count: 256 },
    isNewArrival: false,
    description: "Ultra-soft premium cotton t-shirt with modern fit. Essential wardrobe staple.",
    brand: "ComfortWear",
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Soft cotton", "Modern fit", "Pre-shrunk"],
    sku: "MEN-TSH-NEW-001"
  },
  {
    name: "Wool Blend Blazer",
    price: 249.99,
    originalPrice: 249.99,
    category: "Men's Jackets",
    section: "men",
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 5 }
    ],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Charcoal", hex: "#36454f" },
      { name: "Black", hex: "#000000" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center",
        alt: "Wool Blend Blazer",
        isPrimary: true
      }
    ],
    rating: { average: 4.4, count: 67 },
    isNewArrival: true,
    description: "Sophisticated wool blend blazer perfect for business occasions and formal events.",
    brand: "Executive",
    material: "70% Wool, 30% Polyester",
    care: ["Dry clean only", "Professional pressing recommended"],
    features: ["Tailored fit", "Two-button closure", "Interior pockets"],
    sku: "MEN-JAC-NEW-001"
  },
  {
    name: "Slim Fit Dark Wash Jeans",
    price: 107.99,
    originalPrice: 107.99,
    category: "Men's Jeans",
    section: "men",
    sizes: [
      { size: "30", stock: 10 },
      { size: "32", stock: 18 },
      { size: "34", stock: 22 },
      { size: "36", stock: 15 },
      { size: "38", stock: 8 }
    ],
    colors: [
      { name: "Dark Blue", hex: "#1e3a8a" },
      { name: "Black", hex: "#000000" },
      { name: "Medium Blue", hex: "#3b82f6" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop&crop=center",
        alt: "Slim Fit Dark Wash Jeans",
        isPrimary: true
      }
    ],
    rating: { average: 4.3, count: 89 },
    isNewArrival: true,
    description: "Modern slim fit jeans with stretch denim for comfort and style. Perfect everyday wear.",
    brand: "DenimCo",
    material: "98% Cotton, 2% Elastane",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["Slim fit", "Stretch denim", "5-pocket design"],
    sku: "MEN-JEA-NEW-001"
  },
  {
    name: "Leather Dress Shoes",
    price: 165.99,
    originalPrice: 165.99,
    category: "Shoes",
    section: "men",
    sizes: [
      { size: "7", stock: 8 },
      { size: "8", stock: 12 },
      { size: "9", stock: 15 },
      { size: "10", stock: 18 },
      { size: "11", stock: 12 },
      { size: "12", stock: 8 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964b00" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
        alt: "Leather Dress Shoes",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 92 },
    isNewArrival: false,
    description: "Classic leather dress shoes with premium construction. Perfect for formal occasions.",
    brand: "FootCraft",
    material: "Genuine Leather",
    care: ["Wipe clean", "Use leather conditioner", "Store with shoe trees"],
    features: ["Genuine leather", "Cushioned insole", "Durable construction"],
    sku: "MEN-SHO-NEW-001"
  }
];

const seedMenProducts = async () => {
  try {
    console.log('🌱 Starting to seed men\'s products...');

    // Insert new men's products (without clearing existing ones)
    const insertedProducts = await Product.insertMany(menProducts);
    console.log('🛍️ Created men\'s products');

    console.log('✅ Men\'s products database seeded successfully!');
    console.log(`📊 Total products created: ${insertedProducts.length}`);

    // Show category breakdown
    const categoryCount = {};
    menProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('\n📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n🔍 Verification:');
    console.log('1. Check MongoDB Compass: Database "ecommerce" → Collection "products"');
    console.log('2. Filter: { "section": "men" }');
    console.log('3. Visit your website Men page to see products');

  } catch (error) {
    console.error('❌ Error seeding men\'s products:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedMenProducts();