const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed database...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ecommerce.com',
      password: 'Admin123!',
      role: 'admin'
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create test users
    const testUsers = [
      {
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'Password123!',
        role: 'user'
      }
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('👥 Created test users');

    // Create categories
    const categories = [
      {
        name: "Men's Clothing",
        slug: "mens-clothing",
        description: "Stylish clothing and accessories for men",
        image: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          alt: "Men's clothing"
        }
      },
      {
        name: "Women's Clothing",
        slug: "womens-clothing",
        description: "Fashion-forward clothing and accessories for women",
        image: {
          url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
          alt: "Women's clothing"
        }
      },
      {
        name: "Shoes",
        slug: "shoes",
        description: "Comfortable and stylish footwear for all occasions",
        image: {
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
          alt: "Shoes collection"
        }
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Complete your look with our accessories collection",
        image: {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
          alt: "Accessories"
        }
      }
    ];

    const savedCategories = {};
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
      savedCategories[categoryData.name] = category._id;
    }
    console.log('📂 Created categories');

    // Create comprehensive product catalog
    const products = [
      // Men's Clothing
      {
        name: "Premium Cotton T-Shirt",
        description: "Ultra-soft premium cotton t-shirt with a modern fit. Perfect for everyday wear with superior comfort and durability.",
        price: 29.99,
        originalPrice: 29.99,
        category: "Men's T-Shirts",
        section: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
          alt: "Premium cotton t-shirt",
          isPrimary: true
        }],
        colors: [
          { name: "White", hex: "#ffffff" },
          { name: "Black", hex: "#000000" },
          { name: "Navy", hex: "#1e3a8a" },
          { name: "Gray", hex: "#6b7280" }
        ],
        sizes: [
          { size: "S", stock: 25 },
          { size: "M", stock: 30 },
          { size: "L", stock: 28 },
          { size: "XL", stock: 20 },
          { size: "XXL", stock: 15 }
        ],
        material: "100% Premium Cotton",
        care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
        features: ["Soft cotton", "Modern fit", "Durable construction"],
        sku: "MEN-TSHIRT-001",
        isNew: true,
        isFeatured: true
      },
      {
        name: "Slim Fit Jeans",
        description: "Classic slim fit jeans made from premium denim with stretch for comfort and style.",
        // Discounted product: originalPrice = full price, price = discounted price
        originalPrice: 89.99,
        price: 69.99,
        category: "Men's Jeans",
        subcategory: "Jeans",
        gender: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
          alt: "Slim fit jeans",
          isPrimary: true
        }],
        colors: [
          { name: "Dark Blue", hex: "#1e3a8a" },
          { name: "Light Blue", hex: "#3b82f6" },
          { name: "Black", hex: "#000000" }
        ],
        sizes: [
          { size: "30", stock: 12 },
          { size: "32", stock: 18 },
          { size: "34", stock: 20 },
          { size: "36", stock: 15 },
          { size: "38", stock: 10 }
        ],
        material: "98% Cotton, 2% Elastane",
        care: ["Machine wash cold", "Hang dry", "Iron if needed"],
        features: ["Slim fit", "Stretch denim", "Classic 5-pocket design"],
        sku: "MEN-JEANS-001",
        isFeatured: true
      },
      {
        name: "Wool Blend Blazer",
        description: "Sophisticated wool blend blazer perfect for business or formal occasions. Tailored fit with premium construction.",
        price: 249.99,
        originalPrice: 249.99,
        category: "Men's Jackets",
        subcategory: "Blazers",
        gender: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
          alt: "Wool blend blazer",
          isPrimary: true
        }],
        colors: [
          { name: "Navy", hex: "#1e3a8a" },
          { name: "Charcoal", hex: "#374151" },
          { name: "Black", hex: "#000000" }
        ],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 }
        ],
        material: "70% Wool, 30% Polyester",
        care: ["Dry clean only", "Professional pressing recommended"],
        features: ["Tailored fit", "Premium wool blend", "Professional styling"],
        sku: "MEN-BLAZER-001",
        isNew: true
      },

      // Women's Clothing
      {
        name: "Floral Summer Dress",
        description: "Beautiful floral print summer dress with a flattering A-line silhouette. Perfect for casual outings or special occasions.",
        price: 79.99,
        originalPrice: 79.99,
        category: "Women's Dresses",
        subcategory: "Dresses",
        gender: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
          alt: "Floral summer dress",
          isPrimary: true
        }],
        colors: [
          { name: "Pink Floral", hex: "#f472b6" },
          { name: "Blue Floral", hex: "#3b82f6" },
          { name: "Yellow Floral", hex: "#fbbf24" }
        ],
        sizes: [
          { size: "XS", stock: 8 },
          { size: "S", stock: 15 },
          { size: "M", stock: 18 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 }
        ],
        material: "100% Viscose",
        care: ["Hand wash cold", "Hang dry", "Iron on low heat"],
        features: ["A-line silhouette", "Floral print", "Comfortable fit"],
        sku: "WOMEN-DRESS-001",
        isNew: true,
        isFeatured: true
      },
      {
        name: "High-Waisted Skinny Jeans",
        description: "Trendy high-waisted skinny jeans with excellent stretch and recovery. Flattering fit that hugs your curves perfectly.",
        // Discounted product: originalPrice = full price, price = discounted price
        originalPrice: 69.99,
        price: 49.99,
        category: "Women's Jeans",
        subcategory: "Jeans",
        gender: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
          alt: "High-waisted skinny jeans",
          isPrimary: true
        }],
        colors: [
          { name: "Dark Wash", hex: "#1e3a8a" },
          { name: "Medium Wash", hex: "#3b82f6" },
          { name: "Black", hex: "#000000" }
        ],
        sizes: [
          { size: "24", stock: 10 },
          { size: "26", stock: 15 },
          { size: "28", stock: 20 },
          { size: "30", stock: 18 },
          { size: "32", stock: 12 }
        ],
        material: "92% Cotton, 6% Polyester, 2% Elastane",
        care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
        features: ["High-waisted", "Skinny fit", "Stretch denim"],
        sku: "WOMEN-JEANS-001",
        isFeatured: true
      },

      // Shoes
      {
        name: "Classic White Sneakers",
        description: "Timeless white leather sneakers that go with everything. Comfortable cushioning and durable construction.",
        price: 119.99,
        originalPrice: 119.99,
        category: "Shoes",
        subcategory: "Sneakers",
        gender: "unisex",
        images: [{
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
          alt: "Classic white sneakers",
          isPrimary: true
        }],
        colors: [
          { name: "White", hex: "#ffffff" },
          { name: "Off-White", hex: "#f8fafc" }
        ],
        sizes: [
          { size: "7", stock: 12 },
          { size: "8", stock: 15 },
          { size: "9", stock: 18 },
          { size: "10", stock: 20 },
          { size: "11", stock: 15 },
          { size: "12", stock: 10 }
        ],
        material: "Leather upper, rubber sole",
        care: ["Wipe clean with damp cloth", "Air dry", "Use leather conditioner"],
        features: ["Leather construction", "Comfortable cushioning", "Versatile style"],
        sku: "SHOES-SNEAKER-001",
        isNew: true,
        isFeatured: true
      },

      // Accessories
      {
        name: "Leather Crossbody Bag",
        description: "Elegant leather crossbody bag perfect for daily use. Multiple compartments for organization and adjustable strap.",
        price: 159.99,
        originalPrice: 159.99,
        category: "Accessories",
        subcategory: "Bags",
        gender: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
          alt: "Leather crossbody bag",
          isPrimary: true
        }],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Brown", hex: "#92400e" },
          { name: "Tan", hex: "#d97706" }
        ],
        sizes: [
          { size: "One Size", stock: 25 }
        ],
        material: "Genuine Leather",
        care: ["Wipe with dry cloth", "Use leather conditioner", "Store in dust bag"],
        features: ["Multiple compartments", "Adjustable strap", "Genuine leather"],
        sku: "ACC-BAG-001",
        isFeatured: true
      }
    ];

    // Calculate stock for each product (fix size structure if needed)
    products.forEach(product => {
      // Fix size structure if it uses 'name' instead of 'size'
      if (product.sizes && product.sizes.length > 0) {
        product.sizes = product.sizes.map(s => {
          if (s.name && !s.size) {
            return { size: s.name, stock: s.stock };
          }
          return s;
        });
      }
      product.stock = product.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    });

    await Product.insertMany(products);
    console.log('🛍️ Created comprehensive product catalog');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Admin: admin@ecommerce.com / Admin123!');
    console.log('User 1: john@example.com / Password123!');
    console.log('User 2: jane@example.com / Password123!');
    console.log('\n📊 Database Statistics:');
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Users: ${testUsers.length + 1} (including admin)`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();