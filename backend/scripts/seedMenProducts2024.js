const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Generate unique SKU
const generateSKU = (category, index) => {
  const timestamp = Date.now().toString().slice(-6);
  const categoryCode = category.replace(/[^A-Z]/g, '').substring(0, 3);
  return `${categoryCode}${timestamp}${index.toString().padStart(2, '0')}`;
};

const menProducts = [
  {
    name: "Premium Cotton Oxford Shirt",
    price: 2499,
    originalPrice: 3499,
    category: "Men's Shirts",
    section: "men",
    description: "Crafted from premium 100% cotton oxford fabric, this classic shirt features a refined collar, button-down design, and impeccable tailoring. Perfect for both professional and casual settings, offering exceptional comfort and timeless style.",
    brand: "EverLane",
    material: "100% Premium Cotton Oxford",
    fit: "Slim",
    care: [
      "Machine wash cold with like colors",
      "Tumble dry low heat",
      "Iron on medium heat if needed",
      "Do not bleach",
      "Professional dry cleaning recommended"
    ],
    features: [
      "Premium cotton oxford weave",
      "Button-down collar",
      "Single chest pocket",
      "Curved hem for versatile styling",
      "Pre-shrunk fabric"
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/b7/87/52/b78752045623b77dfd2468756e9cff6f.jpg",
        alt: "Premium Cotton Oxford Shirt - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 20 },
      { size: "XXL", stock: 15 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2951" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Brown", hex: "#8B4513" }
    ],
    rating: {
      average: 4.6,
      count: 127
    },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    tags: ["premium", "cotton", "oxford", "professional", "casual"]
  },
  {
    name: "Tailored Wool Blend Blazer",
    price: 8999,
    originalPrice: 12999,
    category: "Men's Jackets",
    section: "men",
    description: "Expertly tailored wool blend blazer featuring a modern slim fit, notched lapels, and premium construction. This versatile piece transitions seamlessly from boardroom to evening events, embodying sophisticated style and comfort.",
    brand: "EverLane",
    material: "65% Wool, 35% Polyester Blend",
    fit: "Slim",
    care: [
      "Professional dry clean only",
      "Steam to remove wrinkles",
      "Store on padded hangers",
      "Avoid direct sunlight for extended periods",
      "Brush gently with garment brush"
    ],
    features: [
      "Premium wool blend construction",
      "Fully lined interior",
      "Notched lapels",
      "Two-button closure",
      "Interior and exterior pockets",
      "Working buttonholes on sleeves"
    ],
    images: [
      {
        url: "https://i.pinimg.com/474x/0b/d7/df/0bd7dfc40f76c311b32985a7e5401e75.jpg",
        alt: "Tailored Wool Blend Blazer - Professional Look",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 18 },
      { size: "XXL", stock: 12 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2951" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Brown", hex: "#8B4513" }
    ],
    rating: {
      average: 4.8,
      count: 89
    },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    tags: ["wool", "blazer", "formal", "professional", "tailored"]
  },
  {
    name: "Classic Straight Leg Denim",
    price: 3999,
    originalPrice: 5499,
    category: "Men's Jeans",
    section: "men",
    description: "Premium denim crafted from sustainable cotton with a classic straight leg cut. Features reinforced stitching, comfortable mid-rise waist, and timeless five-pocket styling. The perfect balance of durability and contemporary style.",
    brand: "EverLane",
    material: "100% Organic Cotton Denim",
    fit: "Regular",
    care: [
      "Machine wash cold inside out",
      "Wash with similar colors",
      "Tumble dry low or hang dry",
      "Iron inside out if needed",
      "Avoid bleach and fabric softeners"
    ],
    features: [
      "100% organic cotton denim",
      "Classic five-pocket design",
      "Reinforced stress points",
      "YKK zipper closure",
      "Leather patch branding",
      "Pre-washed for comfort"
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/da/4d/c6/da4dc61dbfc96bc6e835c6151ce37f92.jpg",
        alt: "Classic Straight Leg Denim - Timeless Style",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 22 },
      { size: "M", stock: 28 },
      { size: "L", stock: 32 },
      { size: "XL", stock: 24 },
      { size: "XXL", stock: 18 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2951" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Brown", hex: "#8B4513" }
    ],
    rating: {
      average: 4.5,
      count: 203
    },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    tags: ["denim", "jeans", "organic", "sustainable", "classic"]
  },
  {
    name: "Merino Wool Crew Sweater",
    price: 4999,
    originalPrice: 6999,
    category: "Men's Sweaters",
    section: "men",
    description: "Luxuriously soft merino wool crew neck sweater with a refined fit and exceptional warmth. Features ribbed cuffs and hem, seamless construction, and natural temperature regulation properties. An essential piece for sophisticated layering.",
    brand: "EverLane",
    material: "100% Merino Wool",
    fit: "Regular",
    care: [
      "Hand wash in cold water with wool detergent",
      "Lay flat to dry away from direct heat",
      "Do not wring or twist",
      "Store folded to prevent stretching",
      "Professional cleaning recommended"
    ],
    features: [
      "100% premium merino wool",
      "Crew neck design",
      "Ribbed cuffs and hem",
      "Seamless shoulder construction",
      "Natural odor resistance",
      "Temperature regulating properties"
    ],
    images: [
      {
        url: "https://i.pinimg.com/736x/74/b8/2e/74b82e0c7909503ade85be2593db160b.jpg",
        alt: "Merino Wool Crew Sweater - Premium Comfort",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 22 },
      { size: "XXL", stock: 16 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2951" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Brown", hex: "#8B4513" }
    ],
    rating: {
      average: 4.7,
      count: 156
    },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    tags: ["merino", "wool", "sweater", "luxury", "temperature-regulating"]
  },
  {
    name: "Performance Chino Trousers",
    price: 3499,
    originalPrice: 4999,
    category: "Men's Pants",
    section: "men",
    description: "Modern chino trousers crafted from performance cotton blend fabric with stretch technology. Features a tailored fit, wrinkle-resistant finish, and versatile styling that transitions from office to weekend with effortless sophistication.",
    brand: "EverLane",
    material: "Cotton Blend with Stretch Technology",
    fit: "Relaxed",
    care: [
      "Machine wash warm with like colors",
      "Tumble dry medium heat",
      "Iron on medium heat if needed",
      "Do not bleach",
      "Wrinkle-resistant finish"
    ],
    features: [
      "Performance cotton blend",
      "4-way stretch technology",
      "Wrinkle-resistant finish",
      "Tailored fit through hip and thigh",
      "Classic chino styling",
      "Reinforced pocket construction"
    ],
    images: [
      {
        url: "https://img.fantaskycdn.com/bd55b714d914f587f2c88828e19fca28_2056x.jpeg",
        alt: "Performance Chino Trousers - Versatile Style",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 26 },
      { size: "M", stock: 32 },
      { size: "L", stock: 28 },
      { size: "XL", stock: 20 },
      { size: "XXL", stock: 14 }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2951" },
      { name: "Grey", hex: "#808080" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Brown", hex: "#8B4513" }
    ],
    rating: {
      average: 4.4,
      count: 178
    },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    tags: ["chino", "performance", "stretch", "versatile", "wrinkle-resistant"]
  }
];

const seedMenProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Generate unique SKUs for each product
    const productsWithSKU = menProducts.map((product, index) => ({
      ...product,
      sku: generateSKU(product.category, index + 1)
    }));

    // Clear existing men's products (optional - remove if you want to keep existing)
    console.log('🧹 Clearing existing men\'s products...');
    await Product.deleteMany({ section: 'men' });

    // Insert new products
    console.log('📦 Inserting 5 professional men\'s products...');
    const insertedProducts = await Product.insertMany(productsWithSKU);

    console.log('✅ Successfully inserted products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (SKU: ${product.sku}) - ₹${product.price}`);
    });

    console.log('\n📊 Summary:');
    console.log(`- Total products inserted: ${insertedProducts.length}`);
    console.log(`- Category: Men's Fashion`);
    console.log(`- Section: men`);
    console.log(`- All products are active and featured`);
    console.log(`- Price range: ₹2,499 - ₹8,999`);
    console.log(`- All sizes available: S, M, L, XL, XXL`);
    console.log(`- All colors available: Black, White, Navy, Grey, Olive, Brown`);

    // Verify insertion
    const totalMenProducts = await Product.countDocuments({ section: 'men' });
    console.log(`\n✅ Verification: ${totalMenProducts} men's products in database`);

  } catch (error) {
    console.error('❌ Error seeding men\'s products:', error);

    if (error.code === 11000) {
      console.error('💡 Duplicate key error - SKU already exists. Try running the script again.');
    }

    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
if (require.main === module) {
  seedMenProducts();
}

module.exports = { seedMenProducts, menProducts };