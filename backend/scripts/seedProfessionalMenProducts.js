const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const professionalMenProducts = [
  {
    name: "Executive Formal Shirt",
    price: 2499,
    originalPrice: 2499,
    category: "Men's Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 28 },
      { size: "L", stock: 32 },
      { size: "XL", stock: 24 },
      { size: "XXL", stock: 16 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8b4513" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/b7/87/52/b78752045623b77dfd2468756e9cff6f.jpg",
        alt: "Executive Formal Shirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 142 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Premium executive formal shirt crafted from high-quality cotton blend. Features a modern slim fit design with precise tailoring that ensures a sharp, professional appearance for business meetings and formal occasions.",
    brand: "ExecutiveLine",
    material: "65% Cotton, 35% Polyester Blend",
    care: ["Machine wash cold", "Tumble dry low", "Iron on medium heat", "Do not bleach"],
    features: ["Slim fit", "Wrinkle resistant", "Moisture wicking", "Professional collar"],
    sku: "MEN-SHI-EXE-006",
    tags: ["professional", "formal", "executive", "business wear"],
    seoTitle: "Executive Formal Shirt - Premium Men's Business Wear",
    seoDescription: "High-quality formal shirt for professional men. Perfect for business meetings and formal events."
  },
  {
    name: "Premium Denim Jeans",
    price: 3299,
    originalPrice: 3299,
    category: "Men's Jeans",
    section: "men",
    sizes: [
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 22 },
      { size: "XXL", stock: 14 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8b4513" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/474x/0b/d7/df/0bd7dfc40f76c311b32985a7e5401e75.jpg",
        alt: "Premium Denim Jeans",
        isPrimary: true
      }
    ],
    rating: { average: 4.4, count: 198 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Contemporary premium denim jeans designed for the modern man. Features superior quality denim with a comfortable regular fit that transitions seamlessly from casual to smart-casual occasions.",
    brand: "DenimCraft",
    material: "98% Cotton Denim, 2% Elastane",
    care: ["Machine wash cold", "Turn inside out", "Hang dry", "Iron if needed"],
    features: ["Regular fit", "Stretch denim", "Reinforced stitching", "Classic 5-pocket design"],
    sku: "MEN-JEA-PRE-007",
    tags: ["denim", "casual", "premium", "comfortable"],
    seoTitle: "Premium Denim Jeans - Quality Men's Casual Wear",
    seoDescription: "High-quality denim jeans for men. Comfortable fit with premium materials and construction."
  },
  {
    name: "Luxury Wool Blazer",
    price: 7999,
    originalPrice: 7999,
    category: "Men's Jackets",
    section: "men",
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 16 },
      { size: "XXL", stock: 10 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8b4513" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/da/4d/c6/da4dc61dbfc96bc6e835c6151ce37f92.jpg",
        alt: "Luxury Wool Blazer",
        isPrimary: true
      }
    ],
    rating: { average: 4.8, count: 87 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Sophisticated luxury wool blazer that epitomizes elegance and refinement. Expertly tailored with premium wool blend fabric, this blazer is perfect for formal business events, presentations, and special occasions.",
    brand: "LuxuryTailors",
    material: "80% Wool, 15% Polyester, 5% Elastane",
    care: ["Dry clean only", "Professional pressing", "Store on hangers", "Avoid direct sunlight"],
    features: ["Slim fit", "Notched lapels", "Interior pockets", "Button closure"],
    sku: "MEN-JAC-LUX-008",
    tags: ["luxury", "formal", "wool", "business"],
    seoTitle: "Luxury Wool Blazer - Premium Men's Formal Jacket",
    seoDescription: "Premium wool blazer for sophisticated men. Perfect for business and formal occasions."
  },
  {
    name: "Classic Cotton T-Shirt",
    price: 1299,
    originalPrice: 1299,
    category: "Men's T-Shirts",
    section: "men",
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 35 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 20 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8b4513" }
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/74/b8/2e/74b82e0c7909503ade85be2593db160b.jpg",
        alt: "Classic Cotton T-Shirt",
        isPrimary: true
      }
    ],
    rating: { average: 4.5, count: 324 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Essential classic cotton t-shirt made from premium quality cotton for ultimate comfort and durability. Features a relaxed fit design that's perfect for casual wear, layering, or as a wardrobe staple.",
    brand: "ComfortEssentials",
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach", "Iron on low heat"],
    features: ["Relaxed fit", "Pre-shrunk cotton", "Reinforced seams", "Tagless comfort"],
    sku: "MEN-TSH-CLA-009",
    tags: ["casual", "cotton", "comfortable", "essential"],
    seoTitle: "Classic Cotton T-Shirt - Premium Men's Casual Wear",
    seoDescription: "High-quality cotton t-shirt for men. Comfortable, durable, and perfect for everyday wear."
  },
  {
    name: "Modern Chino Pants",
    price: 2799,
    originalPrice: 2799,
    category: "Men's Pants",
    section: "men",
    sizes: [
      { size: "S", stock: 22 },
      { size: "M", stock: 30 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 26 },
      { size: "XXL", stock: 18 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8b4513" }
    ],
    images: [
      {
        url: "https://img.fantaskycdn.com/bd55b714d914f587f2c88828e19fca28_2056x.jpeg",
        alt: "Modern Chino Pants",
        isPrimary: true
      }
    ],
    rating: { average: 4.7, count: 156 },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    description: "Versatile modern chino pants crafted from premium cotton blend fabric. Features a contemporary slim fit that bridges the gap between casual and formal wear, making them perfect for various occasions.",
    brand: "ModernFit",
    material: "97% Cotton, 3% Elastane Blend",
    care: ["Machine wash cold", "Hang dry recommended", "Iron on medium heat", "Do not bleach"],
    features: ["Slim fit", "Stretch fabric", "Side pockets", "Belt loops"],
    sku: "MEN-PAN-CHI-010",
    tags: ["chino", "versatile", "smart-casual", "modern"],
    seoTitle: "Modern Chino Pants - Versatile Men's Trousers",
    seoDescription: "Premium chino pants for men. Perfect blend of comfort and style for smart-casual wear."
  }
];

const seedProfessionalMenProducts = async () => {
  try {
    console.log('🌱 Starting to seed professional men\'s products...');

    // Insert new men's products
    const insertedProducts = await Product.insertMany(professionalMenProducts);
    console.log('👔 Created professional men\'s products');

    console.log('✅ Professional men\'s products database seeded successfully!');
    console.log(`📊 Total products created: ${insertedProducts.length}`);

    // Show category breakdown
    const categoryCount = {};
    professionalMenProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('\n📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n💰 Price range:');
    const prices = professionalMenProducts.map(p => p.price);
    console.log(`  Min: ₹${Math.min(...prices)}`);
    console.log(`  Max: ₹${Math.max(...prices)}`);

    console.log('\n🔍 Verification:');
    console.log('1. Check MongoDB Compass: Database → Collection "products"');
    console.log('2. Filter: { "section": "men" }');
    console.log('3. Visit your website Men page to see products');

    // Display created products
    console.log('\n📦 Created Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.sku})`);
    });

    console.log('\n🎯 Product Features:');
    console.log('✅ All products are Active & Featured');
    console.log('✅ All sizes available: S, M, L, XL, XXL');
    console.log('✅ All colors available: Black, White, Navy, Grey, Olive, Brown');
    console.log('✅ Professional materials & care instructions included');
    console.log('✅ Ratings 4+ with realistic review counts');

  } catch (error) {
    console.error('❌ Error seeding professional men\'s products:', error);
    if (error.code === 11000) {
      console.error('💡 Duplicate SKU detected. Products may already exist.');
    }
  } finally {
    mongoose.connection.close();
  }
};

seedProfessionalMenProducts();