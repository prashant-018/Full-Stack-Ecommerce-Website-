const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const mensFashionProducts = [
  {
    name: "Classic White Oxford Shirt",
    price: 79.99,
    originalPrice: 99.99,
    category: "Men's Shirts",
    section: "Men",
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
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
        alt: "Classic White Oxford Shirt",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&sat=-100",
        alt: "Classic White Oxford Shirt - Back View",
        isPrimary: false
      }
    ],
    rating: { average: 4.5, count: 128 },
    isNewArrival: false,
    description: "Premium cotton oxford shirt with classic fit. Perfect for business or casual wear.",
    brand: "StyleCraft",
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["Classic fit", "Button-down collar", "Chest pocket"],
    sku: "MEN-SHI-001"
  },
  {
    name: "Slim Fit Dark Wash Jeans",
    price: 89.99,
    originalPrice: 129.99,
    category: "Men's Jeans",
    section: "Men",
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
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
        alt: "Slim Fit Dark Wash Jeans",
        isPrimary: true
      }
    ],
    rating: { average: 4.3, count: 89 },
    isNewArrival: true,
    description: "Modern slim fit jeans with stretch denim for comfort and style.",
    brand: "DenimCo",
    material: "98% Cotton, 2% Elastane",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["Slim fit", "Stretch denim", "5-pocket design"],
    sku: "MEN-JEA-001"
  },
  {
    name: "Premium Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    category: "Men's T-Shirts",
    section: "Men",
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
      { name: "Gray", hex: "#808080" },
      { name: "Red", hex: "#ff0000" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        alt: "Premium Cotton T-Shirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.7, count: 256 },
    isNewArrival: false,
    description: "Ultra-soft premium cotton t-shirt with modern fit.",
    brand: "ComfortWear",
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
    features: ["Soft cotton", "Modern fit", "Pre-shrunk"],
    sku: "MEN-TSH-001"
  },
  {
    name: "Wool Blend Blazer",
    price: 199.99,
    originalPrice: 299.99,
    category: "Men's Jackets",
    section: "Men",
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
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        alt: "Wool Blend Blazer",
        isPrimary: true
      }
    ],
    rating: { average: 4.4, count: 67 },
    isNewArrival: true,
    description: "Sophisticated wool blend blazer perfect for business occasions.",
    brand: "Executive",
    material: "70% Wool, 30% Polyester",
    care: ["Dry clean only", "Professional pressing recommended"],
    features: ["Tailored fit", "Two-button closure", "Interior pockets"],
    sku: "MEN-JAC-001"
  },
  {
    name: "Casual Chino Pants",
    price: 59.99,
    originalPrice: 79.99,
    category: "Men's Pants",
    section: "Men",
    sizes: [
      { size: "30", stock: 12 },
      { size: "32", stock: 20 },
      { size: "34", stock: 18 },
      { size: "36", stock: 14 },
      { size: "38", stock: 8 }
    ],
    colors: [
      { name: "Khaki", hex: "#c3b091" },
      { name: "Navy", hex: "#000080" },
      { name: "Olive", hex: "#808000" },
      { name: "Black", hex: "#000000" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
        alt: "Casual Chino Pants",
        isPrimary: true
      }
    ],
    rating: { average: 4.2, count: 143 },
    isNewArrival: false,
    description: "Versatile chino pants perfect for casual and semi-formal occasions.",
    brand: "CasualFit",
    material: "97% Cotton, 3% Elastane",
    care: ["Machine wash warm", "Tumble dry medium", "Iron if needed"],
    features: ["Slim fit", "Stretch fabric", "Classic styling"],
    sku: "MEN-PAN-001"
  },
  {
    name: "Leather Dress Shoes",
    price: 149.99,
    originalPrice: 199.99,
    category: "Shoes",
    section: "Men",
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
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
        alt: "Leather Dress Shoes",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 92 },
    isNewArrival: false,
    description: "Classic leather dress shoes with premium construction.",
    brand: "FootCraft",
    material: "Genuine Leather",
    care: ["Wipe clean", "Use leather conditioner", "Store with shoe trees"],
    features: ["Genuine leather", "Cushioned insole", "Durable construction"],
    sku: "MEN-SHO-001"
  },
  {
    name: "Cashmere Crew Neck Sweater",
    price: 129.99,
    originalPrice: 179.99,
    category: "Men's Sweaters",
    section: "Men",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 6 }
    ],
    colors: [
      { name: "Charcoal", hex: "#36454f" },
      { name: "Navy", hex: "#000080" },
      { name: "Cream", hex: "#fffdd0" },
      { name: "Burgundy", hex: "#800020" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
        alt: "Cashmere Crew Neck Sweater",
        isPrimary: true
      }
    ],
    rating: { average: 4.8, count: 74 },
    isNewArrival: true,
    description: "Luxurious cashmere sweater with classic crew neck design.",
    brand: "LuxeKnit",
    material: "100% Cashmere",
    care: ["Hand wash cold", "Lay flat to dry", "Store folded"],
    features: ["Pure cashmere", "Crew neck", "Ribbed cuffs"],
    sku: "MEN-SWE-001"
  },
  {
    name: "Classic Leather Belt",
    price: 39.99,
    originalPrice: 59.99,
    category: "Accessories",
    section: "Men",
    sizes: [
      { size: "32", stock: 15 },
      { size: "34", stock: 20 },
      { size: "36", stock: 18 },
      { size: "38", stock: 12 },
      { size: "40", stock: 8 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964b00" },
      { name: "Tan", hex: "#d2b48c" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
        alt: "Classic Leather Belt",
        isPrimary: true
      }
    ],
    rating: { average: 4.3, count: 186 },
    isNewArrival: false,
    description: "Premium leather belt with classic buckle design.",
    brand: "LeatherCraft",
    material: "Genuine Leather",
    care: ["Wipe clean", "Condition regularly", "Store hanging"],
    features: ["Genuine leather", "Metal buckle", "Adjustable"],
    sku: "MEN-ACC-001"
  }
];

const seedMensFashion = async () => {
  try {
    console.log('🌱 Starting to seed men\'s fashion products...');

    // Clear existing men's products
    await Product.deleteMany({ section: "Men" });
    console.log('🗑️ Cleared existing men\'s products');

    // Insert new men's fashion products
    await Product.insertMany(mensFashionProducts);
    console.log('🛍️ Created men\'s fashion products');

    console.log('✅ Men\'s fashion database seeded successfully!');
    console.log(`📊 Total products created: ${mensFashionProducts.length}`);

    // Show category breakdown
    const categoryCount = {};
    mensFashionProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('\n📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error seeding men\'s fashion database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedMensFashion();