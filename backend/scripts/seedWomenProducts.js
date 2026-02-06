const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const womenProducts = [
  {
    name: "Elegant Silk Blouse",
    price: 2899,
    originalPrice: 2899,
    category: "Women's Tops",
    section: "women",
    sizes: [
      { size: "XS", stock: 12 },
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 15 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Red", hex: "#cc0000" },
      { name: "Green", hex: "#006600" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/78/bd/6c/78bd6c80d01c0c9143d9827ed5dec6fe.jpg",
        alt: "Elegant Silk Blouse",
        isPrimary: true
      }
    ],
    rating: { average: 4.7, count: 89 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Luxurious silk blouse featuring a sophisticated design perfect for professional settings. The flowing fabric and elegant cut make it ideal for both office wear and evening occasions.",
    brand: "ElegantWear",
    material: "100% Pure Silk",
    care: ["Hand wash cold", "Do not bleach", "Hang to dry", "Iron on low heat"],
    features: ["Pure silk fabric", "Professional fit", "Versatile styling", "Wrinkle resistant"],
    sku: "WOM-TOP-SLK-001",
    tags: ["professional", "silk", "elegant", "office wear"],
    seoTitle: "Elegant Silk Blouse - Professional Women's Top",
    seoDescription: "Premium silk blouse for professional women. Available in multiple colors and sizes."
  },
  {
    name: "Classic Pencil Skirt",
    price: 1899,
    originalPrice: 1899,
    category: "Women's Skirts",
    section: "women",
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 22 },
      { size: "M", stock: 28 },
      { size: "L", stock: 24 },
      { size: "XL", stock: 18 },
      { size: "XXL", stock: 12 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Red", hex: "#cc0000" },
      { name: "Green", hex: "#006600" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/1e/30/48/1e3048eecaacc27008b101c267dbaf6a.jpg",
        alt: "Classic Pencil Skirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.5, count: 156 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Timeless pencil skirt crafted from premium fabric with a flattering high-waisted design. Perfect for creating sophisticated professional looks that transition seamlessly from day to night.",
    brand: "ClassicStyle",
    material: "65% Polyester, 32% Viscose, 3% Elastane",
    care: ["Machine wash cold", "Tumble dry low", "Iron medium heat", "Do not bleach"],
    features: ["High-waisted design", "Stretch fabric", "Back slit", "Professional fit"],
    sku: "WOM-SKI-PEN-002",
    tags: ["professional", "pencil skirt", "classic", "office wear"],
    seoTitle: "Classic Pencil Skirt - Professional Women's Wear",
    seoDescription: "High-quality pencil skirt for professional women. Comfortable stretch fabric in multiple colors."
  },
  {
    name: "Sophisticated Blazer Jacket",
    price: 4299,
    originalPrice: 4299,
    category: "Women's Jackets",
    section: "women",
    sizes: [
      { size: "XS", stock: 10 },
      { size: "S", stock: 16 },
      { size: "M", stock: 22 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 14 },
      { size: "XXL", stock: 8 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Red", hex: "#cc0000" },
      { name: "Green", hex: "#006600" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/30/78/c1/3078c1d4dc0b28ede7c5a6eecfeea601.jpg",
        alt: "Sophisticated Blazer Jacket",
        isPrimary: true
      }
    ],
    rating: { average: 4.8, count: 124 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Expertly tailored blazer jacket that embodies modern professionalism. Features a structured silhouette with contemporary details, perfect for boardroom meetings and business events.",
    brand: "ExecutiveStyle",
    material: "70% Wool, 25% Polyester, 5% Elastane",
    care: ["Dry clean only", "Professional pressing recommended", "Store on hangers"],
    features: ["Tailored fit", "Structured shoulders", "Interior pockets", "Button closure"],
    sku: "WOM-JAC-BLZ-003",
    tags: ["professional", "blazer", "tailored", "business wear"],
    seoTitle: "Sophisticated Blazer Jacket - Women's Professional Wear",
    seoDescription: "Premium tailored blazer for professional women. Perfect for business meetings and formal occasions."
  },
  {
    name: "Premium Shift Dress",
    price: 3499,
    originalPrice: 3499,
    category: "Women's Dresses",
    section: "women",
    sizes: [
      { size: "XS", stock: 14 },
      { size: "S", stock: 20 },
      { size: "M", stock: 26 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 16 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Red", hex: "#cc0000" },
      { name: "Green", hex: "#006600" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/4f/1c/85/4f1c8552aa68000de781931c25c33c6c.jpg",
        alt: "Premium Shift Dress",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 203 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Elegant shift dress designed for the modern professional woman. The clean lines and sophisticated cut create a polished look suitable for any business occasion or formal event.",
    brand: "ModernElegance",
    material: "60% Cotton, 35% Polyester, 5% Spandex",
    care: ["Machine wash cold", "Hang to dry", "Iron on medium heat", "Do not bleach"],
    features: ["Shift silhouette", "Knee-length", "Side pockets", "Comfortable fit"],
    sku: "WOM-DRE-SHI-004",
    tags: ["professional", "shift dress", "elegant", "versatile"],
    seoTitle: "Premium Shift Dress - Professional Women's Dress",
    seoDescription: "Elegant shift dress for professional women. Perfect for office wear and business events."
  },
  {
    name: "Luxury Cashmere Sweater",
    price: 5999,
    originalPrice: 5999,
    category: "Women's Sweaters",
    section: "women",
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 14 },
      { size: "M", stock: 20 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 12 },
      { size: "XXL", stock: 6 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Red", hex: "#cc0000" },
      { name: "Green", hex: "#006600" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/3f/f5/6a/3ff56aac9fa555f201f27391696f9800.jpg",
        alt: "Luxury Cashmere Sweater",
        isPrimary: true
      }
    ],
    rating: { average: 4.9, count: 87 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Luxurious cashmere sweater that combines comfort with sophistication. The premium quality fabric and timeless design make it an essential piece for any professional wardrobe.",
    brand: "LuxeCashmere",
    material: "100% Pure Cashmere",
    care: ["Hand wash cold", "Lay flat to dry", "Store folded", "Use cashmere comb"],
    features: ["Pure cashmere", "Soft texture", "Classic fit", "Ribbed details"],
    sku: "WOM-SWE-CAS-005",
    tags: ["luxury", "cashmere", "professional", "premium"],
    seoTitle: "Luxury Cashmere Sweater - Premium Women's Knitwear",
    seoDescription: "Premium cashmere sweater for professional women. Luxurious comfort and timeless style."
  }
];

const seedWomenProducts = async () => {
  try {
    console.log('🌱 Starting to seed women\'s products...');

    // Insert new women's products
    const insertedProducts = await Product.insertMany(womenProducts);
    console.log('👗 Created women\'s products');

    console.log('✅ Women\'s products database seeded successfully!');
    console.log(`📊 Total products created: ${insertedProducts.length}`);

    // Show category breakdown
    const categoryCount = {};
    womenProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('\n📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n💰 Price range:');
    const prices = womenProducts.map(p => p.price);
    console.log(`  Min: ₹${Math.min(...prices)}`);
    console.log(`  Max: ₹${Math.max(...prices)}`);

    console.log('\n🔍 Verification:');
    console.log('1. Check MongoDB Compass: Database → Collection "products"');
    console.log('2. Filter: { "section": "women" }');
    console.log('3. Visit your website Women page to see products');

    // Display created products
    console.log('\n📦 Created Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.sku})`);
    });

  } catch (error) {
    console.error('❌ Error seeding women\'s products:', error);
    if (error.code === 11000) {
      console.error('💡 Duplicate SKU detected. Products may already exist.');
    }
  } finally {
    mongoose.connection.close();
  }
};

seedWomenProducts();