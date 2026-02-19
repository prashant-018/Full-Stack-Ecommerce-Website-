const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ Missing MongoDB connection string. Please set MONGO_URI or MONGODB_URI in your .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Product data with the provided image URLs
const baseTimestamp = Date.now();

const products = [
  {
    name: "Elegant Floral Summer Dress",
    description: "Beautiful floral print summer dress with a flowing silhouette. Perfect for casual outings and special occasions. Made from lightweight, breathable fabric that keeps you comfortable all day long. Features a flattering A-line cut and delicate floral pattern.",
    price: 2499,
    originalPrice: 3499,
    category: "Women's Dresses",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-DR-${baseTimestamp}-1`,
    images: [
      {
        url: "https://i.pinimg.com/736x/fc/7c/96/fc7c9618dc33cc993987a568692ae708.jpg",
        alt: "Elegant Floral Summer Dress",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 18 }
    ],
    colors: [
      { name: "Floral Print", hex: "#ff6b9d" },
      { name: "Pastel Blue", hex: "#a8d8ea" },
      { name: "Soft Pink", hex: "#ffc1cc" }
    ],
    material: "100% Polyester",
    fit: "Regular",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["Floral print", "A-line silhouette", "Breathable fabric"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Classic White Blouse with Ruffles",
    description: "Timeless white blouse with elegant ruffle details. Perfect for office wear or casual elegance. Features a classic collar, button-down front, and delicate ruffle accents on the sleeves. Versatile piece that pairs beautifully with skirts, pants, or jeans.",
    price: 1899,
    originalPrice: 2499,
    category: "Women's Tops",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-BL-${baseTimestamp}-2`,
    images: [
      {
        url: "https://i.pinimg.com/736x/96/ae/b6/96aeb6d58d62de238e6cc94665c4c99f.jpg",
        alt: "Classic White Blouse with Ruffles",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 12 },
      { size: "S", stock: 20 },
      { size: "M", stock: 28 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Ivory", hex: "#fffff0" },
      { name: "Cream", hex: "#fffdd0" }
    ],
    material: "100% Cotton",
    fit: "Regular",
    care: ["Machine wash warm", "Tumble dry low", "Iron if needed"],
    features: ["Ruffle details", "Button-down front", "Classic collar"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Stylish Denim Jacket",
    description: "Trendy denim jacket with a modern fit. Perfect for layering over dresses, tops, or t-shirts. Features a classic denim design with contemporary styling. Versatile piece that adds a casual-chic touch to any outfit.",
    price: 2999,
    originalPrice: 3999,
    category: "Women's Jackets",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-DJ-${baseTimestamp}-3`,
    images: [
      {
        url: "https://i.pinimg.com/736x/de/eb/b3/deebb34ade30763c56b428160ec90c6c.jpg",
        alt: "Stylish Denim Jacket",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 16 }
    ],
    colors: [
      { name: "Light Blue", hex: "#87ceeb" },
      { name: "Medium Blue", hex: "#4169e1" },
      { name: "Dark Blue", hex: "#191970" }
    ],
    material: "100% Cotton Denim",
    fit: "Regular",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["Classic denim", "Button closure", "Front pockets"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Comfortable Knit Sweater",
    description: "Cozy and stylish knit sweater perfect for cooler weather. Features a soft, comfortable fabric that feels luxurious against the skin. Versatile design that works for both casual and semi-formal occasions. Available in multiple colors to match your style.",
    price: 2199,
    originalPrice: 2999,
    category: "Women's Sweaters",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-SW-${baseTimestamp}-4`,
    images: [
      {
        url: "https://i.pinimg.com/736x/1f/15/6a/1f156a70325df5d0b8abfbfd10300d8b.jpg",
        alt: "Comfortable Knit Sweater",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 14 },
      { size: "S", stock: 22 },
      { size: "M", stock: 28 },
      { size: "L", stock: 24 },
      { size: "XL", stock: 18 },
      { size: "XXL", stock: 12 }
    ],
    colors: [
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" },
      { name: "Pink", hex: "#ffc0cb" }
    ],
    material: "80% Acrylic, 20% Wool",
    fit: "Regular",
    care: ["Machine wash cold", "Lay flat to dry", "Do not bleach"],
    features: ["Soft knit", "Comfortable fit", "Versatile style"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Elegant Midi Skirt",
    description: "Sophisticated midi skirt with a flattering A-line silhouette. Perfect for office wear or special occasions. Features a comfortable fit and elegant drape. Made from high-quality fabric that maintains its shape and looks polished all day.",
    price: 1799,
    originalPrice: 2499,
    category: "Women's Skirts",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-SK-${baseTimestamp}-5`,
    images: [
      {
        url: "https://i.pinimg.com/736x/08/04/a5/0804a5f643d4efdc310519f2dd5e90e4.jpg",
        alt: "Elegant Midi Skirt",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 10 },
      { size: "S", stock: 18 },
      { size: "M", stock: 25 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 15 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Gray", hex: "#808080" },
      { name: "Burgundy", hex: "#800020" }
    ],
    material: "Polyester Blend",
    fit: "Regular",
    care: ["Machine wash cold", "Hang dry", "Iron on low heat"],
    features: ["A-line silhouette", "Midi length", "Elastic waistband"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Slim Fit High-Waisted Jeans",
    description: "Trendy high-waisted jeans with a slim fit. Flattering design that elongates the legs and creates a modern silhouette. Made from premium denim with a comfortable stretch. Perfect for casual everyday wear or dressed up for a night out.",
    price: 2499,
    originalPrice: 3499,
    category: "Women's Jeans",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-JN-${baseTimestamp}-6`,
    images: [
      {
        url: "https://i.pinimg.com/736x/23/13/af/2313af92146c97b9d04c8cfe66295d5c.jpg",
        alt: "Slim Fit High-Waisted Jeans",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "26", stock: 12 },
      { size: "28", stock: 20 },
      { size: "30", stock: 25 },
      { size: "32", stock: 22 },
      { size: "34", stock: 18 }
    ],
    colors: [
      { name: "Dark Blue", hex: "#191970" },
      { name: "Medium Blue", hex: "#4169e1" },
      { name: "Light Blue", hex: "#87ceeb" },
      { name: "Black", hex: "#000000" }
    ],
    material: "98% Cotton, 2% Elastane",
    fit: "Slim",
    care: ["Machine wash cold", "Hang dry", "Do not bleach"],
    features: ["High-waisted", "Slim fit", "Stretch denim"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: "Casual Wide-Leg Trousers",
    description: "Comfortable and stylish wide-leg trousers perfect for both office and casual wear. Features a relaxed fit with a modern silhouette. Made from high-quality fabric that drapes beautifully and maintains its shape. Versatile piece that pairs well with blouses, t-shirts, or sweaters.",
    price: 1999,
    originalPrice: 2799,
    category: "Women's Pants",
    section: "women",
    brand: "Fashion Brand",
    sku: `FB-PT-${baseTimestamp}-7`,
    images: [
      {
        url: "https://i.pinimg.com/736x/2c/f5/ef/2cf5efbcd8473fe64c1d1ed75b08b230.jpg",
        alt: "Casual Wide-Leg Trousers",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 12 },
      { size: "S", stock: 20 },
      { size: "M", stock: 28 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 18 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Olive", hex: "#808000" }
    ],
    material: "Polyester Blend",
    fit: "Relaxed",
    care: ["Machine wash cold", "Hang dry", "Iron on medium heat"],
    features: ["Wide-leg", "High-waisted", "Comfortable fit"],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  }
];

const addWomenProductsDirect = async () => {
  try {
    console.log('🌱 Starting to add women\'s products directly to database...\n');

    // Check for existing products with same SKUs
    const existingSkus = products.map(p => p.sku);
    const existing = await Product.find({ sku: { $in: existingSkus } });
    
    if (existing.length > 0) {
      console.log('⚠️  Some products with these SKUs already exist:');
      existing.forEach(p => console.log(`  - ${p.name} (SKU: ${p.sku})`));
      console.log('\n🔄 Skipping existing products and adding new ones...\n');
    }

    // Filter out products that already exist
    const newProducts = products.filter(p => 
      !existing.some(e => e.sku === p.sku)
    );

    if (newProducts.length === 0) {
      console.log('ℹ️  All products already exist in database.');
      mongoose.connection.close();
      return;
    }

    // Insert new products directly into database
    const insertedProducts = await Product.insertMany(newProducts, { ordered: false });
    
    console.log('✅ Successfully added products to database!');
    console.log(`📊 Total products created: ${insertedProducts.length}\n`);

    // Show category breakdown
    const categoryCount = {};
    insertedProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('📋 Category breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n📦 Products added:');
    insertedProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (SKU: ${product.sku}) - ₹${product.price}`);
    });

    console.log('\n🔍 Verification:');
    console.log('1. Check your Women\'s page - products should now be visible');
    console.log('2. Products are active and ready to display');
    console.log('3. All products have section: "women" and brand: "Fashion Brand"');
    console.log('4. Prices are in ₹999-₹3999 range as requested');

  } catch (error) {
    console.error('❌ Error adding products:', error);
    
    if (error.name === 'ValidationError') {
      console.log('\n📋 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`  - ${key}: ${error.errors[key].message}`);
      });
    }

    if (error.writeErrors) {
      console.log('\n⚠️  Some products failed to insert:');
      error.writeErrors.forEach(err => {
        console.log(`  - ${err.errmsg}`);
      });
    }
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
  }
};

addWomenProductsDirect();

