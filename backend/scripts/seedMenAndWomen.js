const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const mensProducts = [
  {
    name: "Classic White Oxford Shirt",
    price: 79.99,
    originalPrice: 99.99,
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
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
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
    sku: "MEN-SHI-001"
  },
  {
    name: "Slim Fit Dark Wash Jeans",
    price: 89.99,
    originalPrice: 129.99,
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
    name: "Cashmere Crew Neck Sweater",
    price: 129.99,
    originalPrice: 179.99,
    category: "Men's Sweaters",
    section: "men",
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
    name: "Leather Dress Shoes",
    price: 149.99,
    originalPrice: 199.99,
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
  }
];

const womensProducts = [
  {
    name: "Women's Cashmere Crew Sweater",
    price: 128.99,
    originalPrice: 179.99,
    category: "Women's Sweaters",
    section: "women",
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 15 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 6 }
    ],
    colors: [
      { name: "Cream", hex: "#fffdd0" },
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        alt: "Women's Cashmere Crew Sweater",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 142 },
    isNewArrival: true,
    description: "Luxurious cashmere crew neck sweater for women. Soft, warm, and elegant.",
    brand: "LuxeKnit",
    material: "100% Cashmere",
    care: ["Hand wash cold", "Lay flat to dry", "Store folded"],
    features: ["Pure cashmere", "Crew neck", "Ribbed cuffs"],
    sku: "WOM-SWE-001"
  },
  {
    name: "Women's Silk Blouse",
    price: 98.99,
    originalPrice: 149.99,
    category: "Women's Tops",
    section: "women",
    sizes: [
      { size: "XS", stock: 10 },
      { size: "S", stock: 18 },
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Blush", hex: "#f4a6c1" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
        alt: "Women's Silk Blouse",
        isPrimary: true
      }
    ],
    rating: { average: 4.5, count: 98 },
    isNewArrival: true,
    description: "Elegant silk blouse perfect for office or special occasions.",
    brand: "Elegance",
    material: "100% Silk",
    care: ["Dry clean only", "Iron on low heat"],
    features: ["Silk fabric", "Button front", "Classic collar"],
    sku: "WOM-TOP-001"
  },
  {
    name: "Women's Midi Wrap Dress",
    price: 118.99,
    originalPrice: 169.99,
    category: "Women's Dresses",
    section: "women",
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 15 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 6 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Forest", hex: "#228b22" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
        alt: "Women's Midi Wrap Dress",
        isPrimary: true
      }
    ],
    rating: { average: 4.7, count: 156 },
    isNewArrival: true,
    description: "Flattering midi wrap dress with elegant silhouette. Perfect for any occasion.",
    brand: "StyleFemme",
    material: "100% Viscose",
    care: ["Hand wash cold", "Hang dry", "Iron on low heat"],
    features: ["Wrap style", "Midi length", "Flattering fit"],
    sku: "WOM-DRS-001"
  },
  {
    name: "Women's High-Waisted Trousers",
    price: 88.99,
    originalPrice: 129.99,
    category: "Women's Pants",
    section: "women",
    sizes: [
      { size: "24", stock: 8 },
      { size: "26", stock: 12 },
      { size: "28", stock: 15 },
      { size: "30", stock: 18 },
      { size: "32", stock: 12 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Camel", hex: "#c19a6b" },
      { name: "Gray", hex: "#808080" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        alt: "Women's High-Waisted Trousers",
        isPrimary: true
      }
    ],
    rating: { average: 4.4, count: 112 },
    isNewArrival: false,
    description: "Stylish high-waisted trousers with excellent fit and comfort.",
    brand: "ModernFit",
    material: "92% Cotton, 6% Polyester, 2% Elastane",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["High-waisted", "Slim fit", "Stretch fabric"],
    sku: "WOM-PAN-001"
  },
  {
    name: "Women's Knit Cardigan",
    price: 108.99,
    originalPrice: 149.99,
    category: "Women's Sweaters",
    section: "women",
    sizes: [
      { size: "XS", stock: 10 },
      { size: "S", stock: 15 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: [
      { name: "Cream", hex: "#fffdd0" },
      { name: "Camel", hex: "#c19a6b" },
      { name: "Black", hex: "#000000" },
      { name: "Dusty Rose", hex: "#d4a5a5" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
        alt: "Women's Knit Cardigan",
        isPrimary: true
      }
    ],
    rating: { average: 4.5, count: 134 },
    isNewArrival: false,
    description: "Cozy knit cardigan perfect for layering. Soft and comfortable.",
    brand: "CozyWear",
    material: "80% Acrylic, 20% Wool",
    care: ["Machine wash cold", "Lay flat to dry"],
    features: ["Button front", "Long sleeves", "Comfortable fit"],
    sku: "WOM-CAR-001"
  },
  {
    name: "Women's Ankle Boots",
    price: 198.99,
    originalPrice: 279.99,
    category: "Women's Shoes",
    section: "women",
    sizes: [
      { size: "5", stock: 6 },
      { size: "6", stock: 10 },
      { size: "7", stock: 15 },
      { size: "8", stock: 18 },
      { size: "9", stock: 12 },
      { size: "10", stock: 8 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964b00" },
      { name: "Tan", hex: "#d2b48c" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
        alt: "Women's Ankle Boots",
        isPrimary: true
      }
    ],
    rating: { average: 4.6, count: 89 },
    isNewArrival: true,
    description: "Stylish ankle boots with comfortable heel. Perfect for everyday wear.",
    brand: "FootStyle",
    material: "Genuine Leather",
    care: ["Wipe clean", "Use leather conditioner", "Store with shoe trees"],
    features: ["Genuine leather", "Comfortable heel", "Durable sole"],
    sku: "WOM-SHO-001"
  },
  {
    name: "Women's Leather Handbag",
    price: 248.99,
    originalPrice: 349.99,
    category: "Women's Accessories",
    section: "women",
    sizes: [
      { size: "One Size", stock: 25 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964b00" },
      { name: "Tan", hex: "#d2b48c" },
      { name: "Navy", hex: "#000080" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
        alt: "Women's Leather Handbag",
        isPrimary: true
      }
    ],
    rating: { average: 4.8, count: 167 },
    isNewArrival: true,
    description: "Elegant leather handbag with multiple compartments. Perfect for daily use.",
    brand: "LuxuryBags",
    material: "Genuine Leather",
    care: ["Wipe with dry cloth", "Use leather conditioner", "Store in dust bag"],
    features: ["Multiple compartments", "Adjustable strap", "Genuine leather"],
    sku: "WOM-ACC-001"
  }
];

const seedProducts = async () => {
  try {
    console.log('🌱 Starting to seed products (Men & Women)...\n');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared all existing products\n');

    // Insert men's products
    await Product.insertMany(mensProducts);
    console.log(`✅ Inserted ${mensProducts.length} men's products`);

    // Insert women's products
    await Product.insertMany(womensProducts);
    console.log(`✅ Inserted ${womensProducts.length} women's products\n`);

    // Summary
    const totalProducts = mensProducts.length + womensProducts.length;
    console.log(`🎉 Successfully seeded ${totalProducts} products!`);
    console.log(`   - Men's products: ${mensProducts.length}`);
    console.log(`   - Women's products: ${womensProducts.length}\n`);

    // Verify in database
    const menCount = await Product.countDocuments({ section: "men" });
    const womenCount = await Product.countDocuments({ section: "women" });
    console.log(`📊 Verification:`);
    console.log(`   - Men's products in DB: ${menCount}`);
    console.log(`   - Women's products in DB: ${womenCount}`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
};

seedProducts();

